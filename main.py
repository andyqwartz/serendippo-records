import argparse
from pathlib import Path

from build import build_site
# from publish import publish_site


def _parse_args():
    p = argparse.ArgumentParser(description="XXXXXXXXXXX")

    subparsers = p.add_subparsers(dest="command", required=True)

    # `build` command
    parser_build = subparsers.add_parser("build", help="Build the static site")
    
    # `publish` command
    parser_publish = subparsers.add_parser("publish", help="Publish the site via rsync")

    # `update` command
    # parser_update = subparsers.add_parser("update", help="Update the existing site")

    p.add_argument("-af", "--artistfolder", type=Path, default=Path("artist"), help="Dossier dans lequel placer l'arborescence de fichiers")

    p.add_argument("-of", "--outputfolder", type=Path, default=Path("site"), help="Dossier qui sera créé par le script")

    return p.parse_args()



def main():
    
    args = _parse_args()
    
    if args.command == "build":    
        build_site(
            artistfolder=args.artistfolder,
            outputfolder=args.outputfolder
        )
    elif args.command == "publish":
        build_site(
            artistfolder=artistfolder,
            outputfolder=args.outputfolder
        )
        publish_site()
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()