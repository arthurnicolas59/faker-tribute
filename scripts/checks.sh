#!/usr/bin/env bash
# Les checks du projet : tests, lint, typecheck, build.
# Code de sortie 0 seulement si la branche est prête à être relue.
#
# C'est le gate de la factory an-forge : /build-ticket le lance et rien n'avance tant qu'il échoue.
# Il doit rester rapide, sans question, sans mode « watch », et ne jamais modifier de fichier.
#
# À REMPLIR : remplace les deux lignes en bas par les vraies commandes du projet. C'est /project-init qui le fait
# si le projet a déjà du code, sinon /project-launch, une fois la stack choisie. Par exemple :
#
#   npm ci --prefer-offline
#   npm run lint
#   npm run typecheck
#   npm test -- --run
#   npm run build
set -euo pipefail

echo "scripts/checks.sh n'a pas encore de checks : ajoute les commandes de tests, lint, typecheck et build du projet." >&2
exit 1
