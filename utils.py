from pathlib import Path
import PIL
from PIL import Image
import zipfile
import os

def load_config():
    config = get_root_path("config.yaml")
    with open(config) as f:
        return yaml.safe_load(f)

def get_root_path(p=None):
    root = Path(__file__).parent
    if p:
        root = root / p
    return root

def has_transparency(image):
    img = Image.open(image)
    # img.show()
    if img.info.get("transparency", None) is not None:
        return True
    if img.mode == "P":
        transparent = img.info.get("transparency", -1)
        for _, index in img.getcolors():
            if index == transparent:
                return True
    elif img.mode == "RGBA":
        extrema = img.getextrema()
        if extrema[3][0] < 255:
            return True

    return False

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file), 
                       os.path.relpath(os.path.join(root, file), 
                                       os.path.join(path, '..')))