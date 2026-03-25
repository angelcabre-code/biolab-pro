import os
from PIL import Image

build_dir = r"d:\biolab\build"
if not os.path.exists(build_dir):
    os.makedirs(build_dir)

# Assets
sidebar_src = r"C:\Users\Alvaro\.gemini\antigravity\brain\50bf955c-c525-4226-bcd7-877c4bc0cb30\installer_sidebar_biolab_pro_v3_1774370073746.png"
header_src = r"d:\biolab\public\logo_sinergia.png"

def convert_to_bmp(src, dst_name, size):
    try:
        img = Image.open(src)
        img = img.resize(size, Image.Resampling.LANCZOS)
        # Handle alpha channel by pasting onto a white background
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            bg = Image.new('RGB', size, (255, 255, 255))
            if img.mode == 'RGBA':
                bg.paste(img, (0, 0), img)
            else:
                bg.paste(img, (0, 0))
            img = bg
        else:
            img = img.convert('RGB')
        
        bmp_path = os.path.join(build_dir, dst_name + ".bmp")
        img.save(bmp_path, "BMP")
        print(f"Created: {bmp_path}")
    except Exception as e:
        print(f"Error converting {src}: {e}")

convert_to_bmp(sidebar_src, "installerSidebar", (164, 314))
convert_to_bmp(header_src, "installerHeader", (57, 57))
