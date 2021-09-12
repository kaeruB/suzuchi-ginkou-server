#鈴地銀行 - Server
Track borrowed to your boyfriend money.

## About
* Docker
* Docker Compose
* Node.js
* Express
* TypeScript (to be added)

## Getting Started

After you run Docker, build the container:

```bash
docker-compose up -d --build
```


Check if your container runs

```bash
docker ps
```

You should see a volume with name ``` server_suzuchi-ginkou-server ```.

Open [http://localhost:3005](http://localhost:3005) with your browser to see the result.

To remove the container:

```bash
docker-compose down -v
```