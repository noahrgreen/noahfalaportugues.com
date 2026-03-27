from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

BASE = Path('/Users/noahgreen/NGO/noahfalaportugues.com/instagram/batch_002')
SRC = BASE / 'source'
OUT = BASE / 'exports'
REVIEW = BASE / 'review'
OUT.mkdir(parents=True, exist_ok=True)
REVIEW.mkdir(parents=True, exist_ok=True)

RIO = SRC / 'rio_reference.jpg'
LOGO = Path('/Users/noahgreen/NGO/noahfalaportugues.com/instagram/assets/NFP_logo.png')

W = H = 1080
SAFE = 80
WM_PAD = 32
WM_W = int(W * 0.10)  # reduced watermark

C_TEXT = (245, 248, 246)
C_BODY = (231, 236, 232)
C_DARK = (15, 26, 21)
C_ACCENT = (68, 132, 108)
C_PANEL = (250, 248, 242)
C_PANEL_TEXT = (24, 36, 30)
C_PANEL_MUTED = (76, 94, 84)

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


def base_cover():
    rio = Image.open(RIO).convert('RGB').resize((W, H), Image.Resampling.LANCZOS)
    overlay = Image.new('RGBA', (W, H), (8, 19, 14, 125))
    img = rio.convert('RGBA')
    img.alpha_composite(overlay)
    return img.convert('RGB')


def base_interior():
    rio = Image.open(RIO).convert('RGB').resize((W, H), Image.Resampling.LANCZOS)
    rio = rio.filter(ImageFilter.GaussianBlur(radius=9))
    tint = Image.new('RGBA', (W, H), (22, 40, 32, 148))
    img = rio.convert('RGBA')
    img.alpha_composite(tint)
    return img.convert('RGB')


def add_watermark(img):
    logo = Image.open(LOGO).convert('RGBA').resize((WM_W, WM_W), Image.Resampling.LANCZOS)
    a = logo.split()[3]
    a = ImageEnhance.Brightness(a).enhance(0.9)
    logo.putalpha(a)

    x = W - WM_W - WM_PAD
    y = H - WM_W - WM_PAD

    back = Image.new('RGBA', (WM_W + 10, WM_W + 10), (252, 250, 244, 165))
    mask = Image.new('L', (WM_W + 10, WM_W + 10), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((0, 0, WM_W + 10, WM_W + 10), fill=255)

    out = img.convert('RGBA')
    out.paste(back, (x - 5, y - 5), mask)
    out.alpha_composite(logo, (x, y))
    return out.convert('RGB')


def add_slide_chip(draw, idx, total):
    t = f'{idx}/{total}'
    draw.rounded_rectangle((SAFE, 46, SAFE + 88, 90), radius=16, fill=(238, 243, 238))
    draw.text((SAFE + 23, 58), t, fill=(41, 71, 58), font=font(F_SANS_B, 24))


def draw_cover(title, subtitle, out_name, total):
    img = base_cover()
    d = ImageDraw.Draw(img)
    add_slide_chip(d, 1, total)
    d.text((SAFE, 145), 'NOAH FALA PORTUGUÊS', fill=(181, 214, 198), font=font(F_SANS_B, 24))

    y = 196
    for ln in wrap(d, title, font(F_SERIF_B, 76), W - 2 * SAFE):
        d.text((SAFE, y), ln, fill=C_TEXT, font=font(F_SERIF_B, 76))
        y += 82

    y += 12
    for ln in wrap(d, subtitle, font(F_SANS, 38), W - 2 * SAFE):
        d.text((SAFE, y), ln, fill=C_BODY, font=font(F_SANS, 38))
        y += 50

    d.text((SAFE, H - SAFE - 62), 'Save this for review later.', fill=(204, 222, 212), font=font(F_SANS_B, 30))
    img = add_watermark(img)
    img.save(OUT / out_name, 'PNG', optimize=True)


def draw_interior(headline, body, out_name, idx, total, cta=False):
    img = base_interior()
    d = ImageDraw.Draw(img)
    add_slide_chip(d, idx, total)

    panel = (SAFE, 132, W - SAFE, H - SAFE)
    d.rounded_rectangle(panel, radius=26, fill=(250, 248, 242), outline=(216, 210, 200), width=2)

    y = 184
    for ln in wrap(d, headline, font(F_SERIF_B, 64), panel[2] - panel[0] - 56):
        d.text((SAFE + 28, y), ln, fill=C_PANEL_TEXT, font=font(F_SERIF_B, 64))
        y += 74

    y += 12
    for ln in wrap(d, body, font(F_SANS, 38), panel[2] - panel[0] - 56):
        d.text((SAFE + 28, y), ln, fill=C_PANEL_MUTED, font=font(F_SANS, 38))
        y += 50

    if cta:
        d.rounded_rectangle((SAFE + 28, H - SAFE - 150, W - SAFE - 28, H - SAFE - 72), radius=18, fill=(225, 236, 230))
        d.text((SAFE + 52, H - SAFE - 127), 'Save • Share • Comment with your version', fill=(32, 68, 54), font=font(F_SANS_B, 30))

    img = add_watermark(img)
    img.save(OUT / out_name, 'PNG', optimize=True)


def make_carousels():
    # Carousel 1: Common mistake (4 slides)
    draw_cover('Most English speakers get this wrong in Portuguese', 'One correction that immediately sounds more natural in Brazil.', 'CAR_01_Mistake_S01.png', 4)
    draw_interior('Mistake', '“Eu sou 30 anos.”', 'CAR_01_Mistake_S02.png', 2, 4)
    draw_interior('Correction', '“Eu tenho 30 anos.” In Portuguese, age uses TER.', 'CAR_01_Mistake_S03.png', 3, 4)
    draw_interior('Why this matters', 'Small grammar shifts signal real conversational fluency.', 'CAR_01_Mistake_S04.png', 4, 4, cta=True)

    # Carousel 2: Study process (4 slides)
    draw_cover('How I’m learning Portuguese as an adult', 'No shortcuts. Structured exposure and repetition.', 'CAR_02_Study_S01.png', 4)
    draw_interior('System', 'Repetition + real usage + deliberate review.', 'CAR_02_Study_S02.png', 2, 4)
    draw_interior('Weekly focus', 'Track mistakes, retain high-frequency phrases, then reuse in context.', 'CAR_02_Study_S03.png', 3, 4)
    draw_interior('Consistency wins', 'Progress compounds when the system is simple and repeatable.', 'CAR_02_Study_S04.png', 4, 4, cta=True)

    # Carousel 3: SRS / Brainscape (4 slides)
    draw_cover('How I remember Portuguese vocabulary', 'Spaced repetition as a practical retention tool.', 'CAR_03_SRS_S01.png', 4)
    draw_interior('Method', 'Review just before forgetting. This strengthens recall over time.', 'CAR_03_SRS_S02.png', 2, 4)
    draw_interior('Limit', 'Flashcards help retention, but they do not replace real listening or speaking.', 'CAR_03_SRS_S03.png', 3, 4)
    draw_interior('Tool in workflow', 'Brainscape is one part of the process, not the full system.', 'CAR_03_SRS_S04.png', 4, 4, cta=True)


def make_reel_covers():
    draw_cover('Real phrase: “Fica tranquilo”', 'Daily-use Portuguese you will hear constantly.', 'REEL_01_RealPhrase_Cover.png', 1)
    draw_cover('BJJ phrase: “Segura a posição”', 'Practical mats language from Brazilian Jiu-Jitsu.', 'REEL_02_BJJPhrase_Cover.png', 1)


make_carousels()
make_reel_covers()

# copy exports into review for one-stop packet
for f in OUT.glob('*.png'):
    (REVIEW / f.name).write_bytes(f.read_bytes())

print('Generated assets:', len(list(OUT.glob('*.png'))))
