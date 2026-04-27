#!/usr/bin/env python3
"""Generate OG images for Product Grave."""

import os
import re
import yaml
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = "public/images/og"
GRAVES_DIR = "src/content/graves"

# Design tokens
BG = "#1A1423"
TEXT_PRIMARY = "#F4F1DE"
TEXT_SECONDARY = "#B5B0A3"
ACCENT = "#57CC99"
STONE = "#3E3633"
BLOOD = "#E07A5F"
WIDTH, HEIGHT = 1200, 630

def load_frontmatter(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    m = re.match(r"^---\n(.*?)\n---\n", content, re.DOTALL)
    if not m:
        return {}
    return yaml.safe_load(m.group(1))

def get_font(size, bold=False):
    """Try to find a decent system font."""
    candidates = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/System/Library/Fonts/SFCompact.ttf",
        "/System/Library/Fonts/SFPro.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                continue
    return ImageFont.load_default()

def draw_pixel_cross(draw, x, y, size, color):
    """Draw a pixel-art style cross/plus decoration."""
    s = size
    draw.rectangle([x, y+s//3, x+s, y+s*2//3], fill=color)
    draw.rectangle([x+s//3, y, x+s*2//3, y+s], fill=color)

def draw_pixel_dots(draw, cx, cy, color, count=3):
    """Draw small pixel dots."""
    for i in range(count):
        draw.rectangle([cx + i*16, cy, cx + i*16 + 8, cy + 8], fill=color)

def generate_default():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    # Top accent bar
    draw.rectangle([0, 0, WIDTH, 8], fill=ACCENT)
    # Bottom stone bar
    draw.rectangle([0, HEIGHT-8, WIDTH, HEIGHT], fill=STONE)

    # Decorative pixel crosses
    draw_pixel_cross(draw, 60, 60, 24, STONE)
    draw_pixel_cross(draw, WIDTH-100, 80, 20, STONE)
    draw_pixel_cross(draw, WIDTH-180, HEIGHT-140, 18, STONE)
    draw_pixel_dots(draw, 80, HEIGHT-100, STONE, 5)
    draw_pixel_dots(draw, WIDTH-200, 200, STONE, 4)

    title_font = get_font(72, bold=True)
    subtitle_font = get_font(28)
    tagline_font = get_font(24)

    # Title
    draw.text((WIDTH//2, 240), "PRODUCT GRAVE", font=title_font, fill=TEXT_PRIMARY, anchor="mm")

    # Subtitle
    draw.text((WIDTH//2, 340), "A pixel-art graveyard for dead tech products", font=subtitle_font, fill=TEXT_SECONDARY, anchor="mm")

    # Tagline
    draw.text((WIDTH//2, 420), "20 products  ·  $37B+ in funding  ·  All dead  ·  Learn from them", font=tagline_font, fill=ACCENT, anchor="mm")

    # Bottom URL
    draw.text((WIDTH//2, HEIGHT-60), "www.productgrave.net", font=tagline_font, fill=STONE, anchor="mm")

    os.makedirs(OUT_DIR, exist_ok=True)
    img.save(os.path.join(OUT_DIR, "default.png"))
    print("Generated default.png")

def generate_for_grave(slug, data):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    # Top accent bar (blood for individual graves)
    draw.rectangle([0, 0, WIDTH, 8], fill=BLOOD)
    draw.rectangle([0, HEIGHT-8, WIDTH, HEIGHT], fill=STONE)

    # Decorative elements
    draw_pixel_cross(draw, 60, 60, 20, STONE)
    draw_pixel_dots(draw, WIDTH-120, HEIGHT-80, STONE, 3)

    name_font = get_font(64, bold=True)
    epitaph_font = get_font(32)
    meta_font = get_font(22)
    site_font = get_font(20)

    name = data.get("name", slug)
    birth = data.get("birth", "")
    death = data.get("death", "")
    epitaph = data.get("epitaph", "")

    # Name
    draw.text((WIDTH//2, 200), name, font=name_font, fill=TEXT_PRIMARY, anchor="mm")

    # Dates
    dates = f"{birth}  —  {death}" if birth and death else ""
    if dates:
        draw.text((WIDTH//2, 290), dates, font=meta_font, fill=TEXT_SECONDARY, anchor="mm")

    # Epitaph (wrap if too long)
    max_width = WIDTH - 200
    words = epitaph.split()
    lines = []
    current = ""
    for word in words:
        test = current + " " + word if current else word
        bbox = draw.textbbox((0,0), f'"{test}"', font=epitaph_font)
        if bbox[2] - bbox[0] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)

    if not lines:
        lines = [epitaph] if epitaph else ["Rest in peace."]

    y = 360
    for line in lines:
        draw.text((WIDTH//2, y), f'"{line}"', font=epitaph_font, fill=ACCENT, anchor="mm")
        y += 50

    # Site
    draw.text((WIDTH//2, HEIGHT-60), "www.productgrave.net", font=site_font, fill=STONE, anchor="mm")

    out_path = os.path.join(OUT_DIR, f"{slug}.png")
    img.save(out_path)
    print(f"Generated {slug}.png")

def main():
    generate_default()

    for fname in os.listdir(GRAVES_DIR):
        if not fname.endswith(".md"):
            continue
        slug = fname[:-3]
        data = load_frontmatter(os.path.join(GRAVES_DIR, fname))
        if not data:
            continue
        generate_for_grave(slug, data)

    print(f"\nAll OG images written to {OUT_DIR}")

if __name__ == "__main__":
    main()
