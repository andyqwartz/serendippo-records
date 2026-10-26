# SERENDIPPO RECORDS

Site statique vitrine pour **SERENDIPPO RECORDS** — label créatif et artistique pour l'écoute de musique, la visualisation d'artworks et la présentation de projets visuels.

Généré avec **HzMycelium** (https://codeberg.org/Lelio/HzM.git), déployé sur **GitHub Pages** via GitHub Actions.

**Site en ligne :** https://andyqwartz.github.io/serendippo-records/  
**Dépôt GitHub :** https://github.com/andyqwartz/serendippo-records

---

## Structure du dossier `artist/`

```
artist/
├── config_artist.txt          # Configuration globale (artiste, liens, couleurs, template, police)
├── artist_profilepic.jpg      # Photo de l'artiste/label (affichée sur la page d'accueil)
└── <dossier-projet>/          # Chaque sous-dossier = une entrée (album, EP, projet visuel)
    ├── config_release.txt     # Configuration de la sortie (titre, date, description, pistes, couleurs)
    ├── cover_<slug>.png       # Pochette (renommée automatiquement en cover.png)
    ├── 1_<piste>.mp3          # Fichiers audio numérotés (renommés d'après release_tracks)
    ├── 2_<piste>.mp3
    └── medias/                # Images additionnelles (artworks, ascii art, etc.)
        └── ...
```

### Fichiers de configuration

#### `config_artist.txt` (global)
| Champ | Description |
|-------|-------------|
| `artist` | Nom affiché (header, title, méta) |
| `artist_description` | Bio/description (page index, méta description) |
| `links.*` | Réseaux sociaux (Spotify, YouTube, Instagram, etc.) |
| `tips_links.*` | Liens de soutien (Buy me a coffee, Patreon, etc.) |
| `friend_links.*` | Artistes amis (nom, lien, description) |
| `template` | Thème visuel : `hyphe`, `psilo`, `spore` (actuel: `spore`) |
| `font` | Police : `inter`, `gnf`, `lamachine`, `mba`, `wondertype` |
| `main_color` | Couleur principale (liens, accents) — **#7e61d4** |
| `second_color` | Couleur secondaire (hover) — **#5a42a6** |
| `background_color` | Fond pages (clair) — **#ffffff** |
| `font_color` | Couleur texte (clair) — **#1a1a1a** |

#### `<dossier>/config_release.txt` (par entrée)
| Champ | Description |
|-------|-------------|
| `release_artist` | Artiste de cette sortie |
| `release_title` | Titre de l'album/projet |
| `release_date` | Date (JJ/MM/AAAA) |
| `release_description` | Description/texte de présentation |
| `release_tracks` | Liste des pistes (ordre du player) — ex: `["Piste 1", "Piste 2"]` |
| `main_color`, `second_color`, `background_color`, `font_color` | Couleurs spécifiques (écrasent le global) |

---

## Ajouter une entrée (album/projet)

1. **Créer un dossier** dans `artist/` avec un préfixe numérique pour l'ordre :  
   `artist/2_mon-nouvel-album/`

2. **Ajouter les fichiers** :
   - `cover_mon-nouvel-album.png` (ou `.jpg`) — pochette
   - `1_premiere-piste.mp3`, `2_deuxieme-piste.mp3`… — fichiers audio numérotés
   - (optionnel) dossier `medias/` avec images additionnelles

3. **Créer `config_release.txt`** dans ce dossier avec les infos (voir modèle ci-dessus)

4. **Commit + push** :
   ```bash
   git add -A
   git commit -m "Ajout : 2_mon-nouvel-album"
   git push
   ```

5. **Attendre le déploiement** (GitHub Actions → ~30s) : l'entrée apparaît automatiquement sur le site.

---

## Tester en local

```bash
cd /Users/andy/Documents/SERENDIPPO-RECORDS
source .venv/bin/activate
rm -rf site
python main.py -af artist -of site build
# Ouvrir site/index.html dans le navigateur
```

Le script demande confirmation si `site/` existe déjà — `rm -rf site` l'évite.

---

## Modifications apportées au générateur (vs dépôt d'origine)

| Fichier | Modification | Raison |
|---------|--------------|--------|
| `templates/spore/style_index.css` | Ajout variables CSS `--bg-dark`, `--fg-dark`, `--accent-dark`, `--accent2-dark` + `@media (prefers-color-scheme: dark)` + classe `.dark` + bouton `#theme-toggle-btn` | Support mode clair/sombre (système + toggle JS + localStorage) |
| `templates/spore/style_release.css` | Idem | Support mode clair/sombre sur les pages de sortie |
| `templates/spore/index.html` | Ajout bouton `#theme-toggle-btn` + script IIFE thème (localStorage + prefers-color-scheme) | Bouton bascule visible sur page d'accueil |
| `templates/spore/release.html` | Idem | Bouton bascule visible sur pages de sortie |

**Aucune modification** du code Python (`main.py`, `build.py`, `buildpage.py`, `doc.py`, `utils.py`, `slughifi.py`).

---

## Design

- **Palette** : violet de base `#7e61d4` / `#5a42a6` (aucun orange, ambre, cyan)
- **Mode clair/sombre** :
  - Détection automatique via `@media (prefers-color-scheme: dark)`
  - Bouton de bascule (coin bas-droit) mémorisant le choix dans `localStorage`
  - Icône flèche rotative (haut/bas) selon le mode
- **Liens relatifs** : compatible GitHub Pages (`/serendippo-records/`)
- **Zero framework JS** : vanilla JS uniquement, pas de dépendances externes à l'exécution

---

## Memory Bank (locale, jamais poussée)

```
memory-bank/
├── projet.md   # But, décisions, doc config
└── journal.md  # Entrées datées par session
```

Ajoutée au `.gitignore` avant le premier commit.

---

*README mis à jour automatiquement à chaque évolution du projet.*