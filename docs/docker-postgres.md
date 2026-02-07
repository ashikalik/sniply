# PostgreSQL (Docker)

## Start a container

```bash
docker run --name sniply-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=sniply \
  -p 5432:5432 \
  -d postgres:16
```

## Start an existing container

```bash
docker start sniply-postgres
```

## Recreate the container

```bash
docker rm -f sniply-postgres

docker run --name sniply-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=sniply \
  -p 5432:5432 \
  -d postgres:16
```

## Optional: use a named volume

```bash
docker run --name sniply-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=sniply \
  -p 5432:5432 \
  -v sniply-postgres-data:/var/lib/postgresql/data \
  -d postgres:16
```
