#!/usr/bin/env bash
set -euo pipefail

echo Setup
echo
[ "$(id -u)" -ne 0 ] || {
    echo "Error: This script should not be run as root";
    exit 1;
}
echo
echo Reading env
SERVER_NAME=$(grep SERVER_NAME .env | awk -F= '{print $2}')
echo
echo Got server name: $SERVER_NAME
echo
echo Making ollama service file
sed "s|\\\$SERVER_NAME|$SERVER_NAME|g" \
    ./etc/com.ollama.serve.plist > "~/Library/LaunchAgents/com.ollama.serve.plist"
echo
echo Loading ollama service
launchctl unload ~/Library/LaunchAgents/com.ollama.serve.plist 2>/dev/null || true
launchctl load -w ~/Library/LaunchAgents/com.ollama.serve.plist
echo
echo Verifying ollama is running
lsof -i :11434 >/dev/null 2>&1 || { echo "Process isnt bound"; exit 1; }
curl -sf http://localhost:11434/api/tags >/dev/null || { echo "Test req failed"; exit 1; }
echo Ok
echo
echo Making server conf
sed "s|\\\$SERVER_NAME|$SERVER_NAME|g" \
    ./etc/server.nginx.conf > "/usr/local/etc/nginx/servers/${SERVER_NAME}.conf"
echo
echo Done
