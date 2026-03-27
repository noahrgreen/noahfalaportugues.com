from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import textwrap

ROOT = Path('/Users/noahgreen/NGO/noahfalaportugues.com')
OUT_DIR = ROOT / 'assets' / 'instagram' / '5day-batch'
OUT_DIR.mkdir(parents=True, exist_ok=True)
LOGO_PATH = Path('/Users/noahgreen/Library/Mobile Documents/com~apple~CloudDocs/Downloads/NFP_Logo_150.png')

W, H = 1080, 1080
COLORS = {
    'bg': (243, 240, 232),
    'panel': (252, 250, 244),
    'text': (23, 34, 29),
    'muted': (94, 109, 100),
    'accent': (19, 84, 63),
    'accent_light': (227, 237, 232),
    'border': (217, 212, 200),
}

FONT_SANS = '/System/Library/Fonts/Supplemental/Arial.ttf'
FONT_SANS_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
FONT_SERIF = '/System/Library/Fonts/Supplemental/Times New Roman.ttf'
FONT_SERIF_BOLD = '/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf'


def font(path: str, size: int):
    return ImageFont.truetype(path, size=size)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_w: int):
    words = text.split()
    lines = []
    line = ''
    for w in words:
        test = f'{line} {w}'.strip()
        if draw.textlength(test, font=fnt) <= max_w:
            line = test
        else:
            if line:
                lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


def draw_header(draw, title, subtitle):
    draw.rounded_rectangle((56, 54, W - 56, 240), radius=28, fill=COLORS['panel'], outline=COLORS['border'], width=2)
    draw.text((88, 84), 'NOAH FALA PORTUGUÊS', fill=COLORS['accent'], font=font(FONT_SANS_BOLD, 24))
    draw.text((88, 124), title, fill=COLORS['text'], font=font(FONT_SERIF_BOLD, 54))
    draw.text((88, 190), subtitle, fill=COLORS['muted'], font=font(FONT_SANS, 30))


def draw_block(draw, box, label, heading, body):
    x1, y1, x2, y2 = box
    draw.rounded_rectangle(box, radius=24, fill=COLORS['panel'], outline=COLORS['border'], width=2)
    draw.rounded_rectangle((x1 + 18, y1 + 18, x1 + 170, y1 + 64), radius=18, fill=COLORS['accent_light'])
    draw.text((x1 + 34, y1 + 28), label, fill=COLORS['accent'], font=font(FONT_SANS_BOLD, 24))
    draw.text((x1 + 24, y1 + 86), heading, fill=COLORS['text'], font=font(FONT_SERIF_BOLD, 46))

    bf = font(FONT_SANS, 30)
    lines = wrap(draw, body, bf, (x2 - x1) - 48)
    y = y1 + 150
    for ln in lines:
        draw.text((x1 + 24, y), ln, fill=COLORS['muted'], font=bf)
        y += 42


def apply_watermark(img: Image.Image):
    logo = Image.open(LOGO_PATH).convert('RGBA')
    size = 92
    logo = logo.resize((size, size), Image.Resampling.LANCZOS)
    # subtle backing circle for readability
    backing = Image.new('RGBA', (size + 14, size + 14), (252, 250, 244, 220))
    mask = Image.new('L', (size + 14, size + 14), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.ellipse((0, 0, size + 14, size + 14), fill=255)
    pos = (W - size - 50, H - size - 50)
    img.paste(backing, (pos[0] - 7, pos[1] - 7), mask)
    img.alpha_composite(logo, pos)


def make_post_01(path: Path):
    img = Image.new('RGBA', (W, H), COLORS['bg'])
    d = ImageDraw.Draw(img)
    draw_header(d, 'Post 01', 'Common mistake | correction | why it matters')
    draw_block(d, (56, 274, W - 56, 510), 'Slide 1', 'Mistake', '"Eu sou 30 anos."')
    draw_block(d, (56, 536, W - 56, 772), 'Slide 2', 'Correction', '"Eu tenho 30 anos."')
    draw_block(d, (56, 798, W - 56, 1028), 'Slide 3', 'Why', 'In Portuguese, age is expressed with TER, not SER. This sounds natural in Brazil.')
    apply_watermark(img)
    img.convert('RGB').save(path, 'PNG', optimize=True)


def make_post_02(path: Path):
    img = Image.new('RGBA', (W, H), COLORS['bg'])
    d = ImageDraw.Draw(img)
    draw_header(d, 'Post 02', 'One phrase Brazilians actually use')
    draw_block(d, (56, 274, W - 56, 510), 'Slide 1', 'Phrase', 'Pois é.')
    draw_block(d, (56, 536, W - 56, 772), 'Slide 2', 'Meaning', '"Yeah, exactly." / "Right."')
    draw_block(d, (56, 798, W - 56, 1028), 'Slide 3', 'Context', 'Used to agree, acknowledge, or react in natural conversation. Very common in spoken Brazilian Portuguese.')
    apply_watermark(img)
    img.convert('RGB').save(path, 'PNG', optimize=True)


def make_post_03(path: Path):
    img = Image.new('RGBA', (W, H), COLORS['bg'])
    d = ImageDraw.Draw(img)
    draw_header(d, 'Post 03', 'How I am learning as an adult')

    d.rounded_rectangle((56, 274, W - 56, 1028), radius=24, fill=COLORS['panel'], outline=COLORS['border'], width=2)
    d.text((84, 318), 'Structured process', fill=COLORS['accent'], font=font(FONT_SANS_BOLD, 28))
    items = [
        '1) Daily listening to real Brazilian speech',
        '2) Flashcard review for retention (SRS)',
        '3) Note mistakes and correction patterns',
        '4) Reuse phrases in real contexts',
        '5) Weekly review: what worked, what did not',
    ]
    y = 380
    for it in items:
        lines = textwrap.wrap(it, width=45)
        for ln in lines:
            d.text((90, y), ln, fill=COLORS['text'], font=font(FONT_SANS, 38))
            y += 50
        y += 18

    d.text((90, 940), 'Not random practice. Deliberate, repeatable steps.', fill=COLORS['muted'], font=font(FONT_SANS, 31))
    apply_watermark(img)
    img.convert('RGB').save(path, 'PNG', optimize=True)


def make_post_04(path: Path):
    img = Image.new('RGBA', (W, H), COLORS['bg'])
    d = ImageDraw.Draw(img)
    draw_header(d, 'Post 04', 'BJJ Portuguese in real training')
    draw_block(d, (56, 274, W - 56, 510), 'Slide 1', 'On the mats', '"Fica de base!"')
    draw_block(d, (56, 536, W - 56, 772), 'Slide 2', 'Meaning', '"Keep your base!"')
    draw_block(d, (56, 798, W - 56, 1028), 'Slide 3', 'Context', 'You hear this when balance and posture matter. Useful in drills, sparring, and coaching cues.')
    apply_watermark(img)
    img.convert('RGB').save(path, 'PNG', optimize=True)


def make_post_05(path: Path):
    img = Image.new('RGBA', (W, H), COLORS['bg'])
    d = ImageDraw.Draw(img)
    draw_header(d, 'Post 05', 'SRS and flashcards in my workflow')

    d.rounded_rectangle((56, 274, W - 56, 700), radius=24, fill=COLORS['panel'], outline=COLORS['border'], width=2)
    lines = [
        'Spaced repetition helps me keep useful words and phrases active.',
        'I use Brainscape to review consistently over time.',
        'Flashcards are a tool, not the full process.',
    ]
    y = 328
    for ln in lines:
        wrapped = textwrap.wrap(ln, width=44)
        for wln in wrapped:
            d.text((88, y), wln, fill=COLORS['text'], font=font(FONT_SANS, 36))
            y += 46
        y += 18

    d.rounded_rectangle((56, 728, W - 56, 1028), radius=24, fill=COLORS['accent_light'], outline=COLORS['border'], width=2)
    d.text((88, 780), 'Brainscape profile', fill=COLORS['accent'], font=font(FONT_SANS_BOLD, 30))
    d.text((88, 834), 'brainscape.com/profiles/1519861', fill=COLORS['text'], font=font(FONT_SANS_BOLD, 35))
    d.text((88, 896), 'Some decks may require Brainscape login.', fill=COLORS['muted'], font=font(FONT_SANS, 28))

    apply_watermark(img)
    img.convert('RGB').save(path, 'PNG', optimize=True)


make_post_01(OUT_DIR / 'IG_Post_01.png')
make_post_02(OUT_DIR / 'IG_Post_02.png')
make_post_03(OUT_DIR / 'IG_Post_03.png')
make_post_04(OUT_DIR / 'IG_Post_04.png')
make_post_05(OUT_DIR / 'IG_Post_05.png')

print('Generated 5 posts in', OUT_DIR)
