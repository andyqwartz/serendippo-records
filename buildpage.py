import os
from pathlib import Path
import shutil
from shutil import copytree, ignore_patterns
from jinja2 import Environment, FileSystemLoader
from wcmatch import glob
import markdown
import zipfile

from utils import zipdir

TEMPLATES = Path("templates")

env = Environment(
    loader=FileSystemLoader(TEMPLATES)
)
env.globals.update(zip=zip)

def buildIndex(artist, artistfolder = Path, outputfolder = Path):

    OUTPUT = Path(outputfolder)

    if artist['configs']["artist_description"]:
        artist['configs']["artist_description"] = markdown.markdown(artist['configs']["artist_description"])

    theme = artist['configs'].get("template")

    template_html_index = env.get_template(f"{theme}/index.html")

    template_css_index = env.get_template(f"{theme}/style_index.css")

    html = template_html_index.render(artist=artist)

    css = template_css_index.render(artist=artist)


    OUTPUT.mkdir(exist_ok=True)

    with open(OUTPUT / "index.html", "w", encoding="utf-8") as f:
        f.write(html)

    # CSS write
    with open(OUTPUT / "style_index.css", "w", encoding="utf-8") as f:
        f.write(css)

    shutil.copytree(TEMPLATES / theme / "fonts", OUTPUT / "fonts", dirs_exist_ok="True")
    shutil.copytree(TEMPLATES / theme / "img", OUTPUT / "img", dirs_exist_ok="True")
    shutil.copytree(TEMPLATES / theme / "js", OUTPUT / "js", ignore=ignore_patterns("release.js"), dirs_exist_ok="True")

    # copy files
    for i in artist["artistimg"]:
        shutil.copy(i, OUTPUT / "img")
    for i in artist["banner"]:
        shutil.copy(i, OUTPUT / "img")
    
    print("Built index.html")





def buildRelease(artist,release_name, release_data, artistfolder = Path, outputfolder = Path):

    OUTPUT = Path(outputfolder)
    if release_data["config_release"]["release_description"]:
        release_data["config_release"]["release_description"] = markdown.markdown(release_data["config_release"]["release_description"])

    theme = artist['configs'].get("template")

    template_html = env.get_template(f"{theme}/release.html")

    template_css = env.get_template(f"{theme}/style_release.css")
    
    template_js = env.get_template(f"{theme}/js/release.js")

    release_dir = OUTPUT / release_data['slug']
    release_dir.mkdir(parents=True, exist_ok=True)

    html = template_html.render(
        release_name=release_name,
        release=release_data,
        artist=artist   
    )

    css = template_css.render(
        release_name=release_name,
        release=release_data,
        artist=artist      
    )

    js = template_js.render(
        release_name=release_name,
        release=release_data,
        artist=artist   
    )

    MEDIA = Path(release_dir / "media")
    RANDOM_MEDIA = Path (MEDIA / "randommedia") 
    SOUNDS = Path(release_dir / "sounds")

    SOUNDS.mkdir(exist_ok=True)
    MEDIA.mkdir(exist_ok=True)
    RANDOM_MEDIA.mkdir(exist_ok=True)
    
    # copy files
    for i in release_data["images"]:
        shutil.copy(i, RANDOM_MEDIA)
    for i in release_data["videos"]:
        shutil.copy(i, RANDOM_MEDIA)
    for i in release_data["tracks"]:
        shutil.copy(i, SOUNDS)
    for i in release_data["cover"]:
        shutil.copy(i, MEDIA)

    # zip for file download
    with zipfile.ZipFile(Path(release_dir / f"{release_name}.zip"), 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipdir(SOUNDS, zipf)

    # HTML write
    with open(release_dir / (f"{release_name}.html"), "w", encoding="utf-8") as f:
        f.write(html)

    # CSS write
    with open(release_dir / (f"{release_name}.css"), "w", encoding="utf-8") as f:
        f.write(css)
    
    # JS write
    with open(OUTPUT / (f"js/{release_name}.js"), "w", encoding="utf-8") as f:
        f.write(js)

    print(f"Built {release_name}/{release_name}.html")
