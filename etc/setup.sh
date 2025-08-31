#!/usr/bin/env bash
set -euo pipefail

[ "$(id -u)" -ne 0 ] || {
    echo "Error: This script should not be run as root";
    exit 1;
}

DOMAIN="user/$(id -u)"
PLIST="$HOME/Library/LaunchAgents/com.ollama.serve.plist"

echo Setup
echo
echo
echo Reading env
SERVER_NAME=$(grep SERVER_NAME .env | awk -F= '{print $2}')
echo
echo Got server name: $SERVER_NAME
echo
echo Making ollama service file
sed "s|\\\$SERVER_NAME|$SERVER_NAME|g" \
    ./etc/com.ollama.serve.plist > "$PLIST"
sed -i '' "s|\\\$HOME|$HOME|g" "$PLIST"
echo
mkdir -p "$HOME/Library/Logs" "$HOME/Library/LaunchAgents"
chown "$(id -un)":"$(id -gn)" "$HOME/Library/LaunchAgents/com.ollama.serve.plist"
chmod 644 "$HOME/Library/LaunchAgents/com.ollama.serve.plist"
touch "$HOME/Library/Logs/ollama-serve.out" "$HOME/Library/Logs/ollama-serve.err"
chmod 644 "$HOME/Library/Logs/ollama-serve."*
echo
echo Loading ollama service
# Unload only if currently loaded
if launchctl print "$DOMAIN/com.ollama.serve" >/dev/null 2>&1; then
  launchctl bootout "$DOMAIN" com.ollama.serve || { echo "bootout failed"; exit 1; }
fi
launchctl bootstrap "$DOMAIN" "$PLIST" || { echo "bootstrap failed"; exit 1; }
launchctl enable "$DOMAIN/com.ollama.serve" || { echo "enable failed"; exit 1; }
launchctl kickstart -k "$DOMAIN/com.ollama.serve" || { echo "kickstart failed"; exit 1; }
echo
echo Verifying ollama is running
curl -sf --ipv4 http://127.0.0.1:11434/api/tags >/dev/null || { echo "Test req failed"; exit 1; }
lsof -i :11434 >/dev/null 2>&1 || { echo "Process isnt bound"; exit 1; }
echo Ok
echo
echo Making server conf
sed "s|\\\$SERVER_NAME|$SERVER_NAME|g" \
    ./etc/server.nginx.conf > "/usr/local/etc/nginx/servers/${SERVER_NAME}.conf"
echo
echo Done
