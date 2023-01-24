# 鈴地銀行 - Server
Track money with your partner or friend.

## About
* Docker
* Docker Compose
* Node.js
* Express
* TypeScript

## Getting Started

After you run Docker, build the container:

```bash
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d --build
```


Check if your container runs

```bash
docker ps
```

You should see two containers, names will be similar to: ``` suzuchi-ginkou-server ``` and ``` suzuchi-ginkou-database ```.

The server will be running at port 3005.
In case of any problems, see the logs for the server container:
``` docker logs suzuchi-ginkou-server ```

To remove the container:

```bash
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml down
```