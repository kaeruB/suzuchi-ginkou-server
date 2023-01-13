#鈴地銀行 - Server
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

You should see a volume with name ``` server_suzuchi-ginkou-server ```.

Open [http://localhost:3005](http://localhost:3005) with your browser to see the result.

To remove the container:

```bash
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml down
```