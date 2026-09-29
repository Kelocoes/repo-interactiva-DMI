#!/bin/bash
# Iniciar túnel ngrok para el Frontend (Vite en puerto 5173)
cd "$(dirname "$0")"
./ngrok.exe http 127.0.0.1:5173
