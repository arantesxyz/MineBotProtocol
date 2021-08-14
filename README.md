# MineBotProtocol
Simple Minecraft client bot. I normally use this for keeping my farms running AFK during the night.

### Usage
```sh
docker run -d --name minebot \
-e BOT_NAME=John \ # Put your email instead for online-mode=true
-e BOT_PASS=123456 \ # Remove this line if online-mode=false
-e SERVER_HOST=localhost \
-e SERVER_PORT=25565 \
ghcr.io/arantesxyz/minebotprotocol/minebotprotocol:latest
```

### TODO
- Create multiplataform docker builds (focus on ARM)
- Create kubernetes deployment
