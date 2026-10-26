# SERENDIPPO RECORDS

Site statique vitrine pour **SERENDIPPO RECORDS** — label créatif et artistique pour l'écoute de musique, la visualisation d'artworks et la présentation de projets visuels.

**Direction créative** : Néo-brutalisme psychédélique — couleurs saturées, bordures épaisses, ombres dures, éléments inclinés comme des autocollants, typographie énorme, mouvement permanent mais léger.

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
| `main_color` | Couleur principale — **#FF2E93** (magenta) |
| `second_color` | Couleur secondaire — **#2B2BFF** (cobalt) |
| `background_color` | Fond pages (clair) — **#F3F0FF** |
| `font_color` | Couleur texte (clair) — **#14112B** |

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

## Palette & Thèmes

**Accents (fixes, utilisés pour --accent par page) :**
- Magenta `#FF2E93`
- Cobalt `#2B2BFF`
- Cyan `#00E5FF`
- Violet `#8A2BE2`
- Lime `#B6FF00`

**Mode CLAIR (défaut, `prefers-color-scheme: light` ou classe `.light`) :**
- Fond `--bg` : `#F3F0FF` (blanc froid)
- Texte `--fg` : `#14112B`
- `--bg-alt` : `#E8E0FF`
- `--border` / `--shadow` : `--fg`

**Mode SOMBRE (`prefers-color-scheme: dark` ou classe `.dark`) :**
- Fond `--bg` : `#0B0B1E`
- Texte `--fg` : `#F5F3FF`
- `--bg-alt` : `#14112B`
- `--border` / `--shadow` : `--fg`

**Aucun orange / ambre** — vérifié par script automatisé.

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

5. **Attendre le déploiement** (GitHub Actions → ~30s) : l'entrée apparaît automatiquement sur le site avec sa couleur d'accent unique.

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

## Fichiers custom : `templates/spore/custom.css` & `templates/spore/custom.js`

### `custom.css` — Styles néo-brutalistes psychédéliques
| Section | Description |
|---------|-------------|
| **Palette** | Variables CSS `--accent-*` (5 accents), `--bg/--fg/--border/--shadow` pour light/dark via `@media (prefers-color-scheme)` et classes `.dark`/`.light` |
| **Fond vivant** | `html::before` : 3 `radial-gradient` (magenta, cyan, violet) animés 30s en `@keyframes bgShift` sur `background-position` + `html::after` grain SVG `feTurbulence` en data URI (opacité 0.035) |
| **Typographie géante** | `h1`, `.hero-title` : police système `Impact, "Arial Black", "Helvetica Neue", sans-serif`, `font-weight: 900`, majuscules, `clamp(3rem, 12vw, 10rem)`, `-webkit-text-stroke: 2px var(--fg)`, `text-shadow` RGB décalé (magenta/cyan) animé au hover |
| **Bandeau défilant** | `.marquee` + `.marquee__track` : défilement horizontal infini CSS pur (`translateX` @keyframes 20s), contenu dupliqué ×3, pause au hover |
| **Autocollants (stickers)** | `.sticker` : bordure 3px `var(--border)`, ombre dure `4px 4px 0 var(--fg)`, rotation alternée `nth-child(odd) -3deg / nth-child(even) +3deg`, hover → `rotate(0deg) translateY(-2px)` + ombre `6px 6px` |
| **Page = une couleur** | `--accent` définie par `custom.js` (hash du pathname modulo 5), utilisée par titres, bordures, stickers, fond player |
| **Images vivantes** | `.releasecover`, `.artist-photo` : inclinaison 3D au `pointermove` (`perspective(600px) rotateX/Y`), reset au `pointerleave` ; révélation scroll via `IntersectionObserver` (`.reveal` → `.visible`) |
| **Player audio vivant** | Écoute événements `play`/`pause`/`ended` en **phase de capture** → toggle `body.is-playing` ; quand actif : fond animé ×3 vitesse (10s), stickers pulsent (`@keyframes stickerPulse` 0.8s) |
| **Bouton Hasard** | `#random-btn` (sticker fixe bas-droite) → collecte tous `a[href]` même origine, exclut page courante, `Math.random()` navigation |
| **Mode clair/sombre** | `prefers-color-scheme` d'abord, puis bouton `#theme-toggle-btn` (sticker) avec `localStorage` (try/catch), icône ☀️/🌙 |
| **Accessibilité mouvement** | **Toutes** animations/transitions dans `@media (prefers-reduced-motion: no-preference)` ; fallback lisible sans JS |

### `custom.js` — Interactions & logique
| Fonction | Description |
|----------|-------------|
| `computeAccentIndex(pathname)` | Hash simple du pathname → index 0-4 → `document.documentElement.style.setProperty('--accent', ACCENTS[idx])` |
| `initTheme()` | Lecture `localStorage` (try/catch), détection système, toggle bouton, écoute changement système si pas de préférence user |
| `injectMarquee()` | Crée `.marquee` avec mots-clés (meta `sr-keywords` + fallbacks : nom site, RECORDS, ART, MUSIC, VISUEL, CRÉATIF), insère après `#header` |
| `injectRandomButton()` | Crée `#random-btn.sticker` bas-droite, click → navigation aléatoire parmi liens même origine |
| `initLivingImages()` | `pointermove` sur images → tilt 3D calculé ; `IntersectionObserver` sur blocs → `.reveal.visible` |
| `initAudioReactive()` | `document.addEventListener('play'|'pause'|'ended', fn, true)` (capture phase) → `body.is-playing` |
| `enhanceHeroTitle()` | Ajoute `.hero-title` sur `h2` principal (index + release) |
| `ensureMetaTags()` | Injecte `meta[name="sr-site-name"]` si absent |

---

## Modifications apportées au générateur (vs dépôt d'origine)

| Fichier | Modification | Raison |
|---------|--------------|--------|
| `buildpage.py` | Copie `custom.css` et `custom.js` du thème vers `site/` (index) et `site/<slug>/` (releases) | Le build original ne copie que `fonts/`, `img/`, `js/` — fichiers custom requis |
| `templates/spore/index.html` | `<link rel="stylesheet" href="custom.css">` avant `</head>`, `<script src="custom.js" defer></script>` avant `</body>` | Charger les styles/scripts custom |
| `templates/spore/release.html` | `<link rel="stylesheet" href="../custom.css">`, `<script src="../custom.js" defer></script>` (chemins relatifs) | Idem pour pages de sortie |
| `templates/spore/custom.css` | **Nouveau fichier** — toute la direction créative (voir tableau ci-dessus) | Séparation des styles custom, chargés après CSS d'origine |
| `templates/spore/custom.js` | **Nouveau fichier** — toute l'interactivité (voir tableau ci-dessus) | Séparation de la logique custom |
| `artist/config_artist.txt` | Palette mise à jour : `main_color: #FF2E93`, `second_color: #2B2BFF`, `background_color: #F3F0FF`, `font_color: #14112B` | Nouvelle palette néon psychédélique |
| `artist/1_projet-exemple/config_release.txt` | Mêmes couleurs pour cohérence | Cohérence visuelle |

**Aucune modification** du code Python cœur (`main.py`, `build.py`, `doc.py`, `utils.py`, `slughifi.py`).

---

## Design — Récapitulatif technique

- **Fond vivant** : 3 radial-gradients animés (30s) + grain SVG data URI
- **Typographie** : Impact/Arial Black, clamp(3rem,12vw,10rem), text-stroke + text-shadow RGB animé
- **Marquee** : CSS pur, translateX infini, pause hover
- **Stickers** : bordure 3px, ombre dure 4px, rotation ±3°, hover 0° + translateY(-2px)
- **Couleur par page** : hash pathname → 1 des 5 accents → `--accent` sur `:root`
- **Images 3D** : pointermove → perspective rotateX/Y (max 8°), IntersectionObserver reveal
- **Audio réactif** : capture phase events → `body.is-playing` → fond ×3 vitesse + stickers pulse 0.8s
- **Bouton Hasard** : navigation aléatoire liens même origine
- **Clair/sombre** : prefers-color-scheme + localStorage + bouton sticker (try/catch)
- **Reduced motion** : tout dans `@media (prefers-reduced-motion: no-preference)`, fallback sans JS
- **Zéro dépendance externe** : pas de CDN, Google Fonts, libs JS — uniquement CSS/JS du projet

---

## Memory Bank (locale, jamais poussée)

```
memory-bank/
├── projet.md      # But, décisions, doc config
├── templates.md   # Inventaire complet des templates (ÉTAPE 3)
└── journal.md     # Entrées datées par session
```

Ajoutée au `.gitignore` avant le premier commit.

---

*README mis à jour automatiquement à chaque évolution du projet.*