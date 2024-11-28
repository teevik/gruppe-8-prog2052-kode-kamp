# Gruppe 8 - PROG2052 - Kodekamp

## Deploying

### Single machine, or development

The kode-kamp application can easily be deployed using docker-compose. The following command will build the images and start the services:

```bash
export PORT=3000 JWT_SECRET=... EMAIL_USER=... EMAIL_PASS=...
docker-compose up -d
```

### Docker swarm

If deploying on a swarm, you need to create a docker registry first:

```bash
docker service create --name registry --publish published=5000,target=5000 registry:2
```

And then deploy it using:

```bash
export PORT=80 JWT_SECRET=... EMAIL_USER=... EMAIL_PASS=...
docker compose build
docker compose push
docker stack deploy -c ./compose.yaml --detach=false kodekamp
```
