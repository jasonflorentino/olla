#!/usr/bin/env bash
set -euo pipefail

echo "Setup"
echo
echo "Reading env"
SERVER_NAME=$(grep SERVER_NAME .env | awk -F= '{print $2}')
echo
echo "Got server name: $SERVER_NAME"
echo
echo "Copying server conf"
sed "s|\\\$SERVER_NAME|$SERVER_NAME|g" \
    ./etc/server.nginx.conf > "/usr/local/etc/nginx/servers/${SERVER_NAME}.conf"
echo
echo "Done"
