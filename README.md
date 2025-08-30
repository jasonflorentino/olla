# Olla

A simple ollama chat client for my home network.

# Repo Setup

You will need
- ollama: https://github.com/ollama/ollama
- Node: https://nodejs.org/en/download

At least Node v22
```bash
node -v # v22.18.0
```

Install deps
```bash
npm i
```

Create an `.env` file
```bash
cp .env.example .env
```


# Developing

ollama server should be running:
```bash
./ollama serve
```

Start the dev server:
```bash
npm run dev
```

# Deploying

Note: This is geared towards the intel mac that runs ollama in my local network.

## One time setup
If it hasn't already been done,
- Create a local DNS record for the machine.
  - Set the domain name as the SERVER_NAME value in `.env`
- Install and run ollama
  - TODO: Add ollama service setup steps
- Install and run nginx. I've done this as a `brew` service.
- Run the `setup.sh` script to configure a reverse proxy server for our app.
```bash
./etc/setup.sh
sudo nginx -t
sudo brew services restart nginx
```

## Publish updates

- Copy/pull this repo
- Build the app
```bash
npm run build
```
- Copy the build artifacts to the site dir
```bash
npm run deploy
```

# TODO

check for 'thinking' capabilities

curl http://localhost:11434/api/show -d '{
  "model": "llava"
}'
