# Pour chaque fichier dans le dossier Artiste principal :
    # Si le fichier est "config_artiste" : 
        # On ouvre le fichier en tant que yaml, on stocke les valeurs dans un dictionnaire

    # Si le fichier est une image :
        # On utilise cette image comme la photo de l'artiste

# On crée une liste pour stocker les dossiers : "folders"
# On crée une liste pour stocker les releases : "releases"

# Pour chaque dossier dans le dossier Artiste principal : on stocke ce dossier dans la liste "folders"

# Pour chaque dossier dans la liste "folders" :

    # On associe le chemin actuel à une variable (dossier Artist principal + dossier actuel)
    # On crée une liste "tracks"

    # Pour chaque fichier dans ce dossier actuel :

        # Si le fichier est "config_release" :
            # On ouvre le fichier en tant que yaml, on stocke les valeurs dans un dictionnaire

        # Si le fichier est nommé "cover"
            # On utilise cette image comme la cover

        # Si le fichier est un fichier audio (mimetype) :
            # On le stocke dans la liste "tracks"
            
    # On crée un slug à partir du titre de la release

    # On lance la fonction buildRelease qui crée la page html associée et qui renvoie un dictionnaire avec les valeurs de cette release

    # On stocke ce dictionnaire dans la liste "releases" 

# On lance la fonction buildIndex qui récupère le dictionnaire "releases"