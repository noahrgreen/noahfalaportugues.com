import type { VideoCard } from "@/types/video";

const YT_API_BASE = "https://www.googleapis.com/youtube/v3";
const YT_FALLBACK_VIDEOS: VideoCard[] = [
  {
    id: "channel-home",
    title: "Noah Fala Português on YouTube",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "",
    videoUrl: "https://www.youtube.com/@NoahFalaPortugues/videos",
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
    next: { revalidate: 21600 },
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

      if (!id || !title || !thumbnailUrl) {
        return null;
      }

      return {
        id,
        title,
        thumbnailUrl,
        publishedAt: publishedAt ?? "",
        videoUrl: `https://www.youtube.com/watch?v=${id}`,
      } satisfies VideoCard;
    })
    .filter((item): item is VideoCard => item !== null);
}

export async function getLatestVideos(): Promise<VideoCard[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return YT_FALLBACK_VIDEOS;
  }

  const channelId = await resolveChannelId(apiKey);
  if (!channelId) {
    return YT_FALLBACK_VIDEOS;
  }

  const searchUrl =
    `${YT_API_BASE}/search?part=snippet&channelId=${encodeURIComponent(channelId)}` +
    `&order=date&maxResults=8&type=video&key=${encodeURIComponent(apiKey)}`;

  try {
    const payload = await fetchJson<YtSearchResponse>(searchUrl);
    const videos = mapSearchItems(payload.items);
    return videos.length > 0 ? videos : YT_FALLBACK_VIDEOS;
  } catch {
    return YT_FALLBACK_VIDEOS;
  }
}
