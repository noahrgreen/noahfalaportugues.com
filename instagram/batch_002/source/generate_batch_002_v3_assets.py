from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

BASE = Path('/Users/noahgreen/NGO/noahfalaportugues.com/instagram/batch_002')
SRC = BASE / 'source'
OUT = BASE / 'exports_v3'
REVIEW = BASE / 'review_v3'
OUT.mkdir(parents=True, exist_ok=True)
REVIEW.mkdir(parents=True, exist_ok=True)

RIO = SRC / 'rio_reference.jpg'
LOGO = Path('/Users/noahgreen/NGO/noahfalaportugues.com/instagram/assets/NFP_logo.png')

W = H = 1080
SAFE = 80
WM_PAD = 32
WM_W = int(W * 0.10)  # 10%

F_SANS = '/System/Library/Fonts/Supplemental/Arial.ttf'
F_SANS_B = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F_SERIF_B = '/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf'


def font(path, size):
    return ImageFont.truetype(path, size)


def wrap(draw, txt, fnt, max_w):
    words = txt.split()
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


def text_shadow(draw, xy, text, fnt, fill=(245, 248, 246), shadow=(8, 16, 12)):
    x, y = xy
    for dx, dy in [(2,2), (1,1), (0,2), (2,0)]:
        draw.text((x + dx, y + dy), text, font=fnt, fill=shadow)
    draw.text((x, y), text, font=fnt, fill=fill)


def base_cover():
    rio = Image.open(RIO).convert('RGB').resize((W, H), Image.Resampling.LANCZOS)
    rio = ImageEnhance.Contrast(rio).enhance(1.15)
    overlay = Image.new('RGBA', (W, H), (5, 14, 10, 150))
    img = rio.convert('RGBA')
    img.alpha_composite(overlay)
    return img.convert('RGB')


def base_interior():
    rio = Image.open(RIO).convert('RGB').resize((W, H), Image.Resampling.LANCZOS)
    rio = rio.filter(ImageFilter.GaussianBlur(radius=10))
    overlay = Image.new('RGBA', (W, H), (18, 35, 28, 152))
    img = rio.convert('RGBA')
    img.alpha_composite(overlay)
    return img.convert('RGB')


def add_watermark(img):
    logo = Image.open(LOGO).convert('RGBA').resize((WM_W, WM_W), Image.Resampling.LANCZOS)
    a = logo.split()[3]
    a = ImageEnhance.Brightness(a).enhance(0.88)
    logo.putalpha(a)

    x = W - WM_W - WM_PAD
    y = H - WM_W - WM_PAD

    back = Image.new('RGBA', (WM_W + 10, WM_W + 10), (252, 250, 244, 150))
    mask = Image.new('L', (WM_W + 10, WM_W + 10), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((0, 0, WM_W + 10, WM_W + 10), fill=255)

    out = img.convert('RGBA')
    out.paste(back, (x - 5, y - 5), mask)
    out.alpha_composite(logo, (x, y))
    return out.convert('RGB')


def add_progress_chip(draw, idx, total):
    draw.rounded_rectangle((SAFE, 44, SAFE + 90, 90), radius=16, fill=(237, 242, 238))
    draw.text((SAFE + 24, 57), f'{idx}/{total}', fill=(38, 68, 54), font=font(F_SANS_B, 24))


def cover(title, sub, out_name, total):
    img = base_cover()
    d = ImageDraw.Draw(img)
    add_progress_chip(d, 1, total)
    d.text((SAFE, 140), 'NOAH FALA PORTUGUÊS', fill=(190, 220, 205), font=font(F_SANS_B, 24))

    y = 192
    for ln in wrap(d, title, font(F_SERIF_B, 80), W - 2 * SAFE):
        text_shadow(d, (SAFE, y), ln, font(F_SERIF_B, 80))
        y += 84

    y += 8
    for ln in wrap(d, sub, font(F_SANS_B, 38), W - 2 * SAFE):
        text_shadow(d, (SAFE, y), ln, font(F_SANS_B, 38), fill=(226, 236, 230), shadow=(6, 14, 11))
        y += 48

    img = add_watermark(img)
    img.save(OUT / out_name, 'PNG', optimize=True)


def interior(headline, sentence, out_name, idx, total, cta=None):
    img = base_interior()
    d = ImageDraw.Draw(img)
    add_progress_chip(d, idx, total)

    panel = (SAFE, 138, W - SAFE, H - SAFE)
    d.rounded_rectangle(panel, radius=26, fill=(251, 249, 243), outline=(214, 208, 198), width=2)

    y = 188
    for ln in wrap(d, headline, font(F_SERIF_B, 66), panel[2] - panel[0] - 56):
        d.text((SAFE + 28, y), ln, fill=(20, 33, 27), font=font(F_SERIF_B, 66))
        y += 74

    y += 18
    for ln in wrap(d, sentence, font(F_SANS_B, 42), panel[2] - panel[0] - 56):
        d.text((SAFE + 28, y), ln, fill=(58, 78, 67), font=font(F_SANS_B, 42))
        y += 54

    if cta:
        d.rounded_rectangle((SAFE + 28, H - SAFE - 144, W - SAFE - 28, H - SAFE - 68), radius=18, fill=(224, 236, 229))
        d.text((SAFE + 50, H - SAFE - 121), cta, fill=(29, 63, 50), font=font(F_SANS_B, 30))

    img = add_watermark(img)
    img.save(OUT / out_name, 'PNG', optimize=True)


def generate():
    # Carousel 1: Common mistake
    cover('This one mistake instantly sounds unnatural in Portuguese', 'Fix this and your speech gets cleaner fast.', 'CAR_01_Mistake_S01_V3.png', 4)
    interior('Mistake', '“Eu sou 30 anos.”', 'CAR_01_Mistake_S02_V3.png', 2, 4)
    interior('Correction', '“Eu tenho 30 anos.”', 'CAR_01_Mistake_S03_V3.png', 3, 4)
    interior('Why it matters', 'Portuguese uses TER for age, not SER.', 'CAR_01_Mistake_S04_V3.png', 4, 4, cta='Save this if you switch from English patterns.')

    # Carousel 2: Study process
    cover('Why most adults stall in Portuguese after week three', 'A simple structure fixes that.', 'CAR_02_Study_S01_V3.png', 4)
    interior('Framework', 'Repetition + real usage + structured review.', 'CAR_02_Study_S02_V3.png', 2, 4)
    interior('Weekly rule', 'Track mistakes and recycle useful phrases.', 'CAR_02_Study_S03_V3.png', 3, 4)
    interior('Outcome', 'Consistency beats intensity over time.', 'CAR_02_Study_S04_V3.png', 4, 4, cta='Share this with someone rebuilding study habits.')

    # Carousel 3: SRS
    cover('You probably do vocabulary review at the wrong time', 'Spaced repetition solves timing, not motivation.', 'CAR_03_SRS_S01_V3.png', 4)
    interior('Timing', 'Review right before forgetting.', 'CAR_03_SRS_S02_V3.png', 2, 4)
    interior('Limit', 'Flashcards help recall but not full fluency.', 'CAR_03_SRS_S03_V3.png', 3, 4)
    interior('Use case', 'Brainscape supports retention inside a larger system.', 'CAR_03_SRS_S04_V3.png', 4, 4, cta='Comment “SRS” if you want my exact setup.')

    # Reels covers
    cover('Phrase you can use today: “Fica tranquilo”', 'Natural, daily Brazilian Portuguese.', 'REEL_01_RealPhrase_Cover_V3.png', 1)
    cover('BJJ command you must understand live', '“Segura a posição” in real mat context.', 'REEL_02_BJJPhrase_Cover_V3.png', 1)

    for f in OUT.glob('*_V3.png'):
        (REVIEW / f.name).write_bytes(f.read_bytes())


if __name__ == '__main__':
    generate()
    print('Generated V3 assets:', len(list(OUT.glob('*_V3.png'))))
