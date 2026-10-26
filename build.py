import os
import yaml
from pathlib import Path
import fnmatch
from wcmatch import glob
import mimetypes
from natsort import natsorted

from slughifi import slughifi
from buildpage import buildRelease, buildIndex
from utils import has_transparency

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
VIDEO_EXTS = {".mp4", ".mpeg4", ".mov", ".mkv", ".webm"}
AUDIO_EXTS = {".mp3", ".wav", ".aac", ".flac", ".ogg"}

def build_site( template= Path, artistfolder = Path, outputfolder = Path):

    root = Path(artistfolder)

    filesDepth2 = glob.glob(f'{root}/*/*')
    # dirsDepth2 = filter(lambda f: os.path.isdir(f), filesDepth2)
    
    filesDepth3 = glob.glob(f'{root}/*/*/*')
    # dirsDepth3 = filter(lambda f: os.path.isdir(f), filesDepth3)

    artist = {
        "configs": {},
        "releases": {},
        "artistimg": [],
        "banner": []
    }

    for path in root.rglob("*"):

        if not path.is_file():
            continue

        rel = path.relative_to(root)
        ext = path.suffix.lower()
        count = 0

        # ROOT LEVEL (/artist/*)
        if rel.parent == Path("."):


            # YAML
            if ext in {".yml", ".txt"}:

                def check_description(path):
                    # en cas de fichier description externe à la config
                    if path.stem.startswith("description"):
                        with open(path, "r", encoding="utf-8") as f_description:
                            artist_description_file = f_description.read()
                        
                            return artist_description_file
                    # sinon config normale
                    else:
                        try:
                            with open(path, "r", encoding="utf-8") as f:
                                artist_data = yaml.safe_load(f)
                                return artist_data

                        except yaml.YAMLError as e:
                            print(f"Bad YAML: {path}")
                            print(e)

                filetype = check_description(path)

                if isinstance(filetype, dict):
                    artist["configs"] = filetype
                elif isinstance(filetype, str):
                    artist["description_file"] = filetype


            # Images
            elif ext in IMAGE_EXTS:
                if path.stem.startswith("artist"):
                    artist["artistimg"].append(path)
                if path.stem.startswith("banner"):
                    artist["banner"].append(path)



        # RELEASE LEVEL
        else:
            if (str(path) in filesDepth2):

                release_name = rel.parent.name
                shortpath = os.path.basename(os.path.normpath(rel))

                release = artist["releases"].setdefault(
                    release_name,
                    {
                        "config_release": {},
                        "cover": [],
                        "images": [],
                        "videos": [],
                        "tracks": [],
                        "randommedia": [],
                        "randommedia_transparency": [],
                        "audiopath": [],
                        "data_index": []
                    }
                )

                # slug
                release["slug"] = slughifi(release_name)
                slug = str(release["slug"])


                # YAML / txt
                if ext in {".yml", ".txt"}:

                    def check_description(path):
                        # en cas de fichier description externe à la config
                        if path.stem.startswith("description"):
                            with open(path, "r", encoding="utf-8") as f_description:
                                release_description_file = f_description.read()
                            
                                return release_description_file
                        # sinon config normale
                        else:
                            try:
                                with open(path, "r", encoding="utf-8") as f:
                                    release_data = yaml.safe_load(f)
                                    return release_data

                            except yaml.YAMLError as e:
                                print(f"Bad YAML: {path}")
                                print(e)

                    filetype = check_description(path)

                    if isinstance(filetype, dict):
                        release["config_release"] = filetype
                    elif isinstance(filetype, str):
                        release["description_file"] = filetype


                # Cover
                elif ext in IMAGE_EXTS:                
                    if path.stem.startswith("cover"):
                        release["cover"].append(path)


                # Videos
                elif ext in VIDEO_EXTS:
                    release["videos"].append(path)
                    release["randommedia"].append(shortpath)
                

                # Audio
                elif ext in AUDIO_EXTS:
                    release["tracks"].append(path)
                    release["audiopath"].append(shortpath)

                    if len(release["data_index"]) == 0 :
                        release["data_index"].append(count)

                    newcount = release["data_index"][-1] + 1
                    release["data_index"].append(newcount)
                    release["audiopath"] = natsorted(release["audiopath"])



    # Détecter les img random dans leur sous dossier
    # Franchement je suis 100% sûr que c'est horrible mais j'ai pas trouvé mieux je me suis cassé la tête 1 mois dessus, si qqun veut améliorer faites vous plaisir
    # ça amène plein de problèmes, il fallait réécrire la façon de parcourir les fichiers/dossiers et flemme

    for releasename, releaseinfo in artist["releases"].items():

        for path in root.rglob("*"):    

            rel = path.relative_to(root)
            shortpath = os.path.basename(path)

            if (str(path) in filesDepth3):

                if (str(rel.parent.parent) == str(releasename)) == True :

                    if (has_transparency(path)) == True:
                        releaseinfo["images"].append(path)
                        releaseinfo["randommedia_transparency"].append(shortpath)
                    else:
                        releaseinfo["images"].append(path)
                        releaseinfo["randommedia"].append(shortpath)


    # dump !
    print()
    print("------------------------------")
    print("CONFIG ARTISTE :")
    print()

    print(yaml.dump( artist["configs"], default_flow_style=False ))
    
    print()
    print("------------------------------")
    print("CONFIGS RELEASES :")
    print()

    print(yaml.dump( artist["releases"], default_flow_style=False ))
    
    print()



    def startbuilding():
        # check si fichiers descriptions externes puis build
        if artist.get('description_file') != None:
            artist["configs"]["artist_description"] = artist["description_file"]

        buildIndex(artist, artistfolder, outputfolder)
        
        for release_name, release_data in artist["releases"].items():

            if release_data.get('description_file') != None:
                release_data["config_release"]["release_description"] = release_data["description_file"]

            buildRelease(artist,release_name, release_data, artistfolder, outputfolder)

    # Overwrite confirmation
    if os.path.isdir(outputfolder):
        print("------------------------------")
        print(f"Folder '{outputfolder}' already exists !")
        choice = input("Do you want to overwrite it ? (enter y or n)")
        print()
        
        if choice == "y":
            print(f"Overwriting '{outputfolder}'...")
            print()
            startbuilding()

        elif choice == "n":
            print("Stopping script...")
            print()
            exit()
    else:
        startbuilding()