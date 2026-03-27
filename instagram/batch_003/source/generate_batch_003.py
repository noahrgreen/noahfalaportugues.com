from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

BASE = Path('/Users/noahgreen/NGO/noahfalaportugues.com/instagram/batch_003')
SRC = BASE / 'source'
OUT = BASE / 'exports'
REVIEW = BASE / 'review'
for p in [OUT, REVIEW]:
    p.mkdir(parents=True, exist_ok=True)

RIO = SRC / 'rio_reference.jpg'
LOGO = Path('/Users/noahgreen/NGO/noahfalaportugues.com/instagram/assets/NFP_logo.png')

W = H = 1080
SAFE = 80
WM_PAD = 32
WM_W = int(W * 0.11)  # 11%

# locked palette
GREEN = (31, 77, 58)
OFFWHITE = (245, 243, 238)
OLIVE = (105, 121, 108)
DARK = (10, 18, 14)
TEXT_LIGHT = (244, 248, 245)
TEXT_DARK = (24, 34, 29)

F_HEAD = '/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf'
F_BODY = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F_BODY_REG = '/System/Library/Fonts/Supplemental/Arial.ttf'


def font(path, size):
    return ImageFont.truetype(path, size)


def wrap(draw, text, fnt, max_w):
    words = text.split()
    lines, cur = [], ''
    for w in words:
        test = f'{cur} {w}'.strip()
        if draw.textlength(test, font=fnt) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def ensure_word_limit(sentence, max_words=12):
    words = sentence.split()
    if len(words) <= max_words:
        return sentence
    return ' '.join(words[:max_words])


def rio_bg(level='cover'):
    img = Image.open(RIO).convert('RGB').resize((W, H), Image.Resampling.LANCZOS)

    if level == 'cover':
        img = ImageEnhance.Contrast(img).enhance(1.2)
        img = ImageEnhance.Color(img).enhance(0.92)
        ov = Image.new('RGBA', (W, H), (7, 16, 12, 165))
    elif level == 'interior':
        img = img.filter(ImageFilter.GaussianBlur(radius=10))
        img = ImageEnhance.Color(img).enhance(0.65)
        ov = Image.new('RGBA', (W, H), (19, 36, 29, 148))
    else:  # subtle
        img = img.filter(ImageFilter.GaussianBlur(radius=4))
        img = ImageEnhance.Color(img).enhance(0.75)
        ov = Image.new('RGBA', (W, H), (28, 44, 36, 112))

    out = img.convert('RGBA')
    out.alpha_composite(ov)
    return out.convert('RGB')


def add_layered_background(draw, mode='cover'):
    # layered gradients/shapes instead of box cards
    if mode == 'cover':
        draw.polygon([(0, 700), (1080, 470), (1080, 1080), (0, 1080)], fill=(22, 56, 43, 170))
        draw.polygon([(0, 880), (1080, 650), (1080, 1080), (0, 1080)], fill=(31, 77, 58, 145))
    else:
        draw.polygon([(0, 760), (1080, 580), (1080, 1080), (0, 1080)], fill=(230, 235, 230, 120))
        draw.polygon([(0, 930), (1080, 760), (1080, 1080), (0, 1080)], fill=(245, 243, 238, 140))


def draw_shadow_text(draw, xy, txt, fnt, fill=TEXT_LIGHT, shadow=DARK):
    x, y = xy
    for dx, dy in [(2,2), (1,1), (2,0), (0,2)]:
        draw.text((x + dx, y + dy), txt, font=fnt, fill=shadow)
    draw.text((x, y), txt, font=fnt, fill=fill)


def add_watermark(img):
    logo = Image.open(LOGO).convert('RGBA').resize((WM_W, WM_W), Image.Resampling.LANCZOS)
    alpha = logo.split()[3]
    alpha = ImageEnhance.Brightness(alpha).enhance(0.9)
    logo.putalpha(alpha)

    x = W - WM_W - WM_PAD
    y = H - WM_W - WM_PAD

    out = img.convert('RGBA')
    back = Image.new('RGBA', (WM_W + 10, WM_W + 10), (245, 243, 238, 145))
    m = Image.new('L', (WM_W + 10, WM_W + 10), 0)
    md = ImageDraw.Draw(m)
    md.ellipse((0, 0, WM_W + 10, WM_W + 10), fill=255)
    out.paste(back, (x - 5, y - 5), m)
    out.alpha_composite(logo, (x, y))
    return out.convert('RGB')


def cover_template(hook, subline, out_name, total=4):
    img = rio_bg('cover')
    d = ImageDraw.Draw(img, 'RGBA')
    add_layered_background(d, 'cover')

    d.text((SAFE, 88), 'NOAH FALA PORTUGUÊS', fill=(197, 224, 210), font=font(F_BODY, 24))
    d.rounded_rectangle((SAFE, 42, SAFE + 88, 84), radius=14, fill=(236, 241, 237, 230))
    d.text((SAFE + 24, 52), f'1/{total}', fill=GREEN, font=font(F_BODY, 22))

    y = 190
    for ln in wrap(d, hook, font(F_HEAD, 86), W - 2 * SAFE):
        draw_shadow_text(d, (SAFE, y), ln, font(F_HEAD, 86))
        y += 90

    y += 10
    for ln in wrap(d, subline, font(F_BODY, 36), W - 2 * SAFE):
        draw_shadow_text(d, (SAFE, y), ln, font(F_BODY, 36), fill=(224, 235, 228))
        y += 48

    img = add_watermark(img)
    img.save(OUT / out_name, 'PNG', optimize=True)


def content_template(slide_idx, total, idea, out_name):
    img = rio_bg('interior')
    d = ImageDraw.Draw(img, 'RGBA')
    add_layered_background(d, 'interior')

    d.rounded_rectangle((SAFE, 42, SAFE + 96, 86), radius=14, fill=(236, 241, 237, 232))
    d.text((SAFE + 24, 53), f'{slide_idx}/{total}', fill=GREEN, font=font(F_BODY, 22))

    d.text((SAFE, 138), 'NOAH FALA PORTUGUÊS', fill=(229, 235, 231), font=font(F_BODY, 22))

    sentence = ensure_word_limit(idea, 12)
    y = 330
    for ln in wrap(d, sentence, font(F_HEAD, 80), W - 2 * SAFE):
        draw_shadow_text(d, (SAFE, y), ln, font(F_HEAD, 80), fill=OFFWHITE, shadow=(8, 16, 12))
        y += 88

    img = add_watermark(img)
    img.save(OUT / out_name, 'PNG', optimize=True)


def reel_cover(hook, context, out_name):
    img = rio_bg('cover')
    d = ImageDraw.Draw(img, 'RGBA')
    add_layered_background(d, 'cover')

    d.text((SAFE, 88), 'NOAH FALA PORTUGUÊS', fill=(197, 224, 210), font=font(F_BODY, 24))
    d.rounded_rectangle((SAFE, 42, SAFE + 78, 84), radius=14, fill=(236, 241, 237, 232))
    d.text((SAFE + 16, 52), 'REEL', fill=GREEN, font=font(F_BODY, 22))

    y = 248
    for ln in wrap(d, hook, font(F_HEAD, 92), W - 2 * SAFE):
        draw_shadow_text(d, (SAFE, y), ln, font(F_HEAD, 92))
        y += 96

    d.text((SAFE, H - SAFE - 118), context, fill=(223, 233, 226), font=font(F_BODY, 34))

    img = add_watermark(img)
    img.save(OUT / out_name, 'PNG', optimize=True)


def generate_batch003():
    # Carousel 1 (mistake)
    cover_template(
        'This English instinct breaks your Portuguese instantly',
        'Fix this and you sound cleaner in conversation.',
        'B003_CAR01_Mistake_S01.png',
        4,
    )
    content_template(2, 4, 'Mistake: Eu sou 30 anos.', 'B003_CAR01_Mistake_S02.png')
    content_template(3, 4, 'Correction: Eu tenho 30 anos.', 'B003_CAR01_Mistake_S03.png')
    content_template(4, 4, 'Portuguese uses TER for age, not SER.', 'B003_CAR01_Mistake_S04.png')

    # Carousel 2 (study)
    cover_template(
        'Most adults quit before Portuguese starts to click',
        'A tighter system keeps progress moving.',
        'B003_CAR02_Study_S01.png',
        4,
    )
    content_template(2, 4, 'Use repetition, real usage, and structured exposure.', 'B003_CAR02_Study_S02.png')
    content_template(3, 4, 'Track mistakes and recycle useful phrases weekly.', 'B003_CAR02_Study_S03.png')
    content_template(4, 4, 'Consistency compounds faster than motivation spikes.', 'B003_CAR02_Study_S04.png')

    # Carousel 3 (SRS)
    cover_template(
        'Random vocabulary review wastes time and attention',
        'Spaced timing is the leverage point.',
        'B003_CAR03_SRS_S01.png',
        4,
    )
    content_template(2, 4, 'Review right before forgetting for stronger recall.', 'B003_CAR03_SRS_S02.png')
    content_template(3, 4, 'Flashcards help retention, not full communication.', 'B003_CAR03_SRS_S03.png')
    content_template(4, 4, 'Brainscape supports process when usage stays real.', 'B003_CAR03_SRS_S04.png')

    # Reels covers
    reel_cover('Say this in Brazil and you sound local', 'Real phrase in daily speech', 'B003_REEL01_RealPhrase_Cover.png')
    reel_cover('BJJ Portuguese coaches actually shout', 'Live mat command you must understand', 'B003_REEL02_BJJ_Cover.png')

    for f in OUT.glob('B003_*.png'):
        (REVIEW / f.name).write_bytes(f.read_bytes())


if __name__ == '__main__':
    generate_batch003()
    print('Generated', len(list(OUT.glob('B003_*.png'))), 'Batch 003 assets')
