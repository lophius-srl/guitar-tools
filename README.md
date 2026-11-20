# Guitar tools

Petits outils pour apprendre la guitare, en ligne sur https://lophius-srl.github.io/guitar-tools/

## Tab → Gamme

Colle une tablature ASCII (6 cordes, mesures séparées par `|`). Pour chaque mesure :

- la gamme qui colle le mieux (détection automatique de la tonique et du type de gamme, par morceau et par mesure) ;
- le schéma de la gamme sur le manche, avec la position de la main mise en évidence ;
- l'ordre des notes à jouer (1, 2, 3…), leur nom et leur degré ;
- les notes hors gamme expliquées, et les doigtés corrigés pour rester dans la position (même octave) ;
- export PDF imprimable.

## Structure

- Site statique, sans build : chaque outil est une page HTML autonome.
- `assets/nav.js` : la liste des onglets. Ajouter un outil = une nouvelle page + une ligne dans `TOOLS`.
- Bibliothèque externe : jsPDF (cdnjs) pour l'export PDF.

## Déploiement

GitHub Pages sur la branche `main`, dossier racine.
