#!/usr/bin/env bash
set -euo pipefail

echo "Deploy"
echo
echo "Reading env"
SERVER_NAME=$(grep SERVER_NAME .env | awk -F= '{print $2}')
echo
echo "Got server name: $SERVER_NAME"
echo
echo "Copying build"
rsync -av --delete dist/ "/usr/local/var/www/${SERVER_NAME}/"
echo
echo "Done"
