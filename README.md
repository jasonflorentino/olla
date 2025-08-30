# LLM Chat

Simple llm chat client for ollama.

# Setup

You will need
- ollama: https://github.com/ollama/ollama
- Node: https://nodejs.org/en/download

At least Node v22
```bash
node -v # v22.18.0
```

Create an `.env` file
```bash
cp .env.example .env
```

# Developing

- ollama server should be running:
```bash
./ollama serve
```
- start the dev server:
```bash
npm run dev
```

# TODO

check for 'thinking' capabilities

curl http://localhost:11434/api/show -d '{
  "model": "llava"
}'
