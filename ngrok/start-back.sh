#!/bin/bash
# Iniciar túnel ngrok para el Backend (NestJS en puerto 3000)
cd "$(dirname "$0")"
./ngrok.exe http 127.0.0.1:3000
