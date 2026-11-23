# Guitar tools

Petits outils pour apprendre la guitare, en ligne sur https://lophius-srl.github.io/guitar-tools/

## Tab → Gamme

Colle une tablature ASCII (6 cordes, mesures séparées par `|`). Pour chaque mesure :

- la gamme qui colle le mieux (détection automatique de la tonique et du type de gamme, par morceau et par mesure) ;
- le schéma de la gamme sur le manche, avec la position de la main mise en évidence ;
- l'ordre des notes à jouer (1, 2, 3…), leur nom et leur degré ;
- les notes hors gamme expliquées, et les doigtés corrigés pour rester dans la position (même octave) ;
- export PDF imprimable.

## Gammes

Choisis une tonique et une gamme (modes, pentatoniques, mineures harmonique et mélodique, blues, gammes « autres ») :

- le manche complet (cases 0 à 15) avec la position sélectionnée mise en évidence ;
- la position en grand ;
- le polygone des intervalles sur la roue des 12 demi-tons, avec le nombre de demi-tons sur chaque côté ;
- la formule (T, ½, 1½) et l'écoute de la gamme montante puis descendante.

## Analyse (bêta)

Version expérimentale de l'analyse, à côté de Tab → Gamme (qui reste inchangé) :

- tonalité du morceau à partir de plusieurs indices (notes dans la gamme, profils de Krumhansl, rôle des accords I/IV/V, premier et dernier accord) ;
- sections et modulations (algorithme de Viterbi : un changement de tonalité doit être confirmé sur plusieurs mesures) et couleur de chaque section (mixolydien, dorien, mineur harmonique…) ;
- accord et degré de chaque mesure, accords empruntés signalés ;
- positions choisies pour tout le morceau, avec le moins de déplacements possible ;
- accordage (Drop D, ½ ton ou 1 ton plus bas) et capodastre.

## Accords

Colle une grille (« Mim Sol Ré Lam » ou « Em G D Am », même avec les paroles) : tonalités possibles, degré de chaque accord (empruntés en rouge), diagrammes (ouverts et barrés, degrés dans les points), écoute, accords de la tonalité, gamme pour improviser.

## Improviser

Boucle d'accompagnement (accords, basse, batterie de synthèse) : grilles toutes faites, grille de l'onglet Accords ou grille libre, trois styles, tempo. Sur le manche : la gamme (pentatonique ou complète), par position, et les notes de l'accord en cours en orange. En option : un rythme de grattage (↓ ↑ ✕ sur 8 croches), au choix ou modifiable case par case, suivi en direct, avec la possibilité de couper la guitare de la boucle pour gratter soi-même. Les réglages (tonalité, grille, style, tempo, rythme) s'enregistrent sous un nom, sur l'appareil, et se partagent par un lien qui les recharge ailleurs.

## Manche

Jeux d'une minute : « Quelle note ? » et « Trouve la note » ; choix des cases, des cordes, notes naturelles ou toutes ; records et notes à revoir.

## Oreille

Intervalles (montants, descendants, ensemble), types d'accords, degrés après une cadence ; niveaux, série, statistiques par réponse.

## Structure

- Site statique, sans build : chaque outil est une page HTML autonome.
- `assets/music.js` : bibliothèque commune (notes, accords, tonalité d'une grille, son, dessin du manche et des diagrammes).
- `assets/nav.js` : la liste des onglets. Ajouter un outil = une nouvelle page + une ligne dans `TOOLS`.
- Bibliothèque externe : jsPDF (cdnjs) pour l'export PDF.

## Déploiement

En ligne via GitHub Pages (branche `main`, mis à jour à chaque push).

Option : déploiement sur Cloudflare Workers (fichiers statiques) via GitHub Actions (`.github/workflows/deploy.yml`, config dans `wrangler.jsonc`).
Secrets du dépôt nécessaires : `CLOUDFLARE_API_TOKEN` (modèle « Edit Cloudflare Workers ») et `CLOUDFLARE_ACCOUNT_ID`.
