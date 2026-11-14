#!/usr/bin/env bash
# Les checks du projet : tests, lint, typecheck, build.
# Code de sortie 0 seulement si la branche est prête à être relue.
#
# C'est le gate de la factory an-forge : /build-ticket le lance et rien n'avance tant qu'il échoue.
# Il doit rester rapide, sans question, sans mode « watch », et ne jamais modifier de fichier.
set -euo pipefail

npm ci --prefer-offline
npm run lint
npm run typecheck
npm test
npm run build
