docker exec -it clippin_postgres_1 /bin/bash -c 'pg_dump -U postgres postgres > /var/lib/postgresql/dump.sql'