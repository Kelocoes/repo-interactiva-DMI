#!/bin/bash
# Iniciar ambos túneles simultáneamente (Backend 3000 y Frontend 5173)
cd "$(dirname "$0")"
./ngrok.exe start --all --config ngrok.yml
