import type { VideoCard } from "@/types/video";

const YT_API_BASE = "https://www.googleapis.com/youtube/v3";
const YT_FALLBACK_VIDEOS: VideoCard[] = [
  {
    id: "channel-home",
    title: "Watch Noah Fala Portugues on YouTube",
    thumbnailUrl: "https://i.ytimg.com/vi/HNtPnf8sgnM/hqdefault.jpg",
    publishedAt: new Date(0).toISOString(),
    videoUrl: "https://www.youtube.com/@NoahFalaPortugues",
  },
];

type YtSearchItem = {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
};

type YtChannelsResponse = {
  items?: Array<{ id?: string }>;
};

type YtSearchResponse = {
  items?: YtSearchItem[];
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 60 * 60 * 6 },
  });

  if (!res.ok) {
    throw new Error(`YouTube API request failed with status ${res.status}`);
  }

  return (await res.json()) as T;
}

async function resolveChannelId(apiKey: string): Promise<string | null> {
  const directId = process.env.YOUTUBE_CHANNEL_ID;
  if (directId) {
    return directId;
  }

  const handle = process.env.YOUTUBE_CHANNEL_HANDLE;
  if (!handle) {
    return null;
  }

  const normalized = handle.startsWith("@") ? handle.slice(1) : handle;
  const url = `${YT_API_BASE}/channels?part=id&forHandle=${encodeURIComponent(normalized)}&key=${encodeURIComponent(apiKey)}`;

  try {
    const payload = await fetchJson<YtChannelsResponse>(url);
    return payload.items?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

function mapSearchItems(items: YtSearchItem[] | undefined): VideoCard[] {
  if (!items) {
    return [];
  }

  return items
    .map((item) => {
      const id = item.id?.videoId;
      const title = item.snippet?.title;
      const publishedAt = item.snippet?.publishedAt;
      const thumbnailUrl =
        item.snippet?.thumbnails?.high?.url ??
        item.snippet?.thumbnails?.medium?.url ??
        item.snippet?.thumbnails?.default?.url;

      if (!id || !title || !publishedAt || !thumbnailUrl) {
        return null;
      }

      return {
        id,
        title,
        thumbnailUrl,
        publishedAt,
        videoUrl: `https://www.youtube.com/watch?v=${id}`,
      } satisfies VideoCard;
    })
    .filter((item): item is VideoCard => item !== null);
}

export async function getLatestVideos(): Promise<{
  videos: VideoCard[];
  usedFallback: boolean;
}> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return { videos: YT_FALLBACK_VIDEOS, usedFallback: true };
  }

  const channelId = await resolveChannelId(apiKey);
  if (!channelId) {
    return { videos: YT_FALLBACK_VIDEOS, usedFallback: true };
  }

  const searchUrl =
    `${YT_API_BASE}/search?part=snippet&channelId=${encodeURIComponent(channelId)}` +
    `&order=date&maxResults=8&type=video&key=${encodeURIComponent(apiKey)}`;

  try {
    const payload = await fetchJson<YtSearchResponse>(searchUrl);
    const videos = mapSearchItems(payload.items);

    if (videos.length === 0) {
      return { videos: YT_FALLBACK_VIDEOS, usedFallback: true };
    }

    return { videos, usedFallback: false };
  } catch {
    return { videos: YT_FALLBACK_VIDEOS, usedFallback: true };
  }
}
