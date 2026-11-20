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

## Structure

- Site statique, sans build : chaque outil est une page HTML autonome.
- `assets/nav.js` : la liste des onglets. Ajouter un outil = une nouvelle page + une ligne dans `TOOLS`.
- Bibliothèque externe : jsPDF (cdnjs) pour l'export PDF.

## Déploiement

En ligne via GitHub Pages (branche `main`, mis à jour à chaque push).

Option : déploiement sur Cloudflare Workers (fichiers statiques) via GitHub Actions (`.github/workflows/deploy.yml`, config dans `wrangler.jsonc`).
Secrets du dépôt nécessaires : `CLOUDFLARE_API_TOKEN` (modèle « Edit Cloudflare Workers ») et `CLOUDFLARE_ACCOUNT_ID`.
