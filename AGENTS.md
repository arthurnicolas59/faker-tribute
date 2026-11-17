# faker-tribute

<!-- Posé par /project-init (an-forge). « À DÉCIDER AVEC /project-launch » est complété par /project-launch. -->

## Le projet

Un site de fan d'une seule page, en français et public, qui rend hommage à Faker, joueur de League of Legends. Il s'adresse aux fans francophones et contient un En-tête, le Parcours, le Palmarès et 5 Moments mythiques avec leurs vidéos YouTube intégrées. Le vocabulaire est défini dans `GLOSSARY.md`.

Stack : Astro (site statique) et TypeScript, testé avec Vitest, hébergé sur Netlify (voir `docs/adr/0001-astro-et-netlify.md`). Pas de serveur ni de base de données.

## L'utilisateur

L'utilisateur n'est pas développeur. Pour toute question technique (stack, tests, architecture, outils), ne pose pas la question brute : explique l'enjeu en une phrase simple, donne ta recommandation avec ses forces et ses faiblesses, résume les autres options en une ligne chacune, et demande seulement de valider. Explique chaque terme technique la première fois, avec une image de tous les jours.

## Workflow

<!-- an-forge:workflow : section gérée par an-forge. Ne la modifie pas : /project-init la remet à jour. -->
Ce projet suit an-forge. Le détail de chaque étape est dans les skills, pas ici.

- Une nouvelle idée ou une grosse évolution : `/project-launch`.
- Un bug, une retouche, un petit ajout : `/quick-ticket`.
- Construire un ticket `ready-for-agent` : `/build-ticket <numéro>`, dans une session neuve.
- Après le brief : l'utilisateur merge, ou demande un changement et `/build-ticket <numéro>` reprend la même pull request.
- Voir où en est le projet : `/project-dashboard`.
- Comment le projet est construit : `ARCHITECTURE.md` (vue d'ensemble, technologies, rôle de chaque dossier). Lis-le avant de ranger du code ; `/project-architecture` le tient à jour.
<!-- /an-forge:workflow -->

## Checks

`scripts/checks.sh` lance les tests, le lint, le typecheck et le build. Il doit passer avant toute pull request. GitHub le relance sur chaque pull request (`.github/workflows/checks.yml`). Ne modifie ni l'un ni l'autre pour faire passer une branche.

## Règles

- Ne commit jamais sur `main`. Ne force-push que sur ta propre branche, avec `--force-with-lease`.
- Ne merge pas sans demande explicite.
- Les textes destinés à des humains (commits, PR, docs) sont courts, précis et sans formules creuses.

- Les textes du site (Parcours, Palmarès, Moments mythiques) vivent dans des fichiers de données ou de contenu séparés du code des composants, et sont validés par un schéma.
- Aucune photo ni image copiée de Faker, de T1 ou de Riot Games. Les vidéos sont des Vidéos intégrées YouTube venant de chaînes officielles (LoL Esports, LCK, T1).
- La Mention site de fan est toujours présente en bas de page.
- Le site s'affiche correctement sur téléphone (dès 360 px de large) et sur ordinateur. Les animations restent légères et respectent le réglage « réduire les animations » du système.
- Node 22, npm. Les commandes `lint`, `typecheck`, `test` et `build` de `package.json` sont celles que lance `scripts/checks.sh`.

## Agent skills

### Issue tracker

Les tickets et les specs sont des issues GitHub de `arthurnicolas59/faker-tribute`, gérées avec `gh`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context : un `GLOSSARY.md` et `docs/adr/` à la racine. See `docs/agents/domain.md`.
