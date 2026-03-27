from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path('/Users/noahgreen/NGO/noahfalaportugues.com/instagram')
BATCH = ROOT / 'batch_001'
EXPORTS = BATCH / 'exports'
REVIEW = BATCH / 'review'
for p in [EXPORTS, REVIEW]:
    p.mkdir(parents=True, exist_ok=True)

LOGO_PATH = ROOT / 'assets' / 'NFP_logo.png'

W, H = 1080, 1080
SAFE = 80
WM_PAD = 32
WM_W = int(W * 0.14)  # 14%

C_BG_TOP = (20, 72, 56)
C_BG_BOT = (243, 240, 232)
C_PANEL = (252, 250, 244)
C_BORDER = (214, 209, 198)
C_TEXT = (23, 34, 29)
C_MUTED = (84, 98, 90)
C_ACCENT = (19, 84, 63)

FONT_SANS = '/System/Library/Fonts/Supplemental/Arial.ttf'
FONT_SANS_B = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
FONT_SERIF_B = '/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf'


def f(path, size):
    return ImageFont.truetype(path, size)


def gradient_bg():
    img = Image.new('RGB', (W, H), C_BG_BOT)
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / (H - 1)
        r = int(C_BG_TOP[0] * (1 - t) + C_BG_BOT[0] * t)
        g = int(C_BG_TOP[1] * (1 - t) + C_BG_BOT[1] * t)
        b = int(C_BG_TOP[2] * (1 - t) + C_BG_BOT[2] * t)
        d.line((0, y, W, y), fill=(r, g, b))
    return img


def wrap(draw, text, font_obj, max_w):
    words = text.split()
    lines = []
    cur = ''
    for w in words:
        test = f'{cur} {w}'.strip()
        if draw.textlength(test, font=font_obj) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def add_watermark(base: Image.Image):
    logo = Image.open(LOGO_PATH).convert('RGBA')
    logo = logo.resize((WM_W, WM_W), Image.Resampling.LANCZOS)
    alpha = logo.split()[3]
    alpha = ImageEnhance.Brightness(alpha).enhance(0.92)
    logo.putalpha(alpha)

    # soft backing circle to guarantee readability on any background
    backing = Image.new('RGBA', (WM_W + 16, WM_W + 16), (252, 250, 244, 200))
    mask = Image.new('L', (WM_W + 16, WM_W + 16), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((0, 0, WM_W + 16, WM_W + 16), fill=255)

    x = W - WM_W - WM_PAD
    y = H - WM_W - WM_PAD

    base = base.convert('RGBA')
    base.paste(backing, (x - 8, y - 8), mask)
    base.alpha_composite(logo, (x, y))
    return base.convert('RGB')


def render_post(num, title, slides):
    img = gradient_bg()
    d = ImageDraw.Draw(img)

    panel = (SAFE, SAFE, W - SAFE, H - SAFE)
    d.rounded_rectangle(panel, radius=28, fill=C_PANEL, outline=C_BORDER, width=2)

    d.text((SAFE + 28, SAFE + 24), f'NOAH FALA PORTUGUÊS  |  POST {num:02d}', fill=C_ACCENT, font=f(FONT_SANS_B, 24))

    title_lines = wrap(d, title, f(FONT_SERIF_B, 58), panel[2] - panel[0] - 56)
    y = SAFE + 66
    for ln in title_lines:
        d.text((SAFE + 28, y), ln, fill=C_TEXT, font=f(FONT_SERIF_B, 58))
        y += 64

    y += 8
    slide_h = 130 if len(slides) <= 3 else 112
    gap = 14

    for i, s in enumerate(slides, start=1):
        box = (SAFE + 24, y, W - SAFE - 24, y + slide_h)
        d.rounded_rectangle(box, radius=20, fill=(245, 248, 245), outline=C_BORDER, width=2)
        d.rounded_rectangle((box[0] + 14, box[1] + 16, box[0] + 114, box[1] + 52), radius=14, fill=(227, 237, 232))
        d.text((box[0] + 28, box[1] + 22), f'Slide {i}', fill=C_ACCENT, font=f(FONT_SANS_B, 20))

        body_x = box[0] + 20
        body_y = box[1] + 60
        lines = wrap(d, s, f(FONT_SANS_B, 36), box[2] - box[0] - 36)
        if len(lines) > 2:
            lines = lines[:2]
            if not lines[-1].endswith('...'):
                lines[-1] = lines[-1][: max(0, len(lines[-1]) - 3)] + '...'
        for ln in lines:
            d.text((body_x, body_y), ln, fill=C_TEXT, font=f(FONT_SANS_B, 36))
            body_y += 42

        y += slide_h + gap

    d.text((SAFE + 28, H - SAFE - 60), 'Adult learner perspective | real Brazilian Portuguese', fill=C_MUTED, font=f(FONT_SANS, 24))

    img = add_watermark(img)
    out = EXPORTS / f'IG_Post_{num:02d}.png'
    img.save(out, 'PNG', optimize=True)
    (REVIEW / out.name).write_bytes(out.read_bytes())


POSTS = [
    (1, 'Common mistake', [
        'You\'re probably saying this wrong in Portuguese',
        '“Eu sou 30 anos” ❌',
        '“Eu tenho 30 anos” ✅',
        'In Portuguese, you “have” age — you don\'t “be” age.',
    ]),
    (2, 'Real phrase', [
        '“Fica tranquilo”',
        'Take it easy / Don\'t worry',
        'Used constantly in everyday Brazilian conversation.',
    ]),
    (3, 'Study process', [
        'How I\'m learning Portuguese as an adult',
        'repetition • real usage • structured exposure',
        'Not shortcuts. Just consistency.',
    ]),
    (4, 'BJJ', [
        '“Segura a posição”',
        'Hold the position',
        'You\'ll hear this constantly in Brazilian Jiu-Jitsu.',
    ]),
    (5, 'SRS', [
        'How I remember Portuguese vocabulary',
        'Spaced repetition',
        'Review just before you forget',
        'Brainscape reference: link in bio',
    ]),
]

for args in POSTS:
    render_post(*args)

print('Generated', len(POSTS), 'posts in', EXPORTS)
