#!/bin/bash
set -e
# ALTER ROLE $POSTGRESQL_USERNAME SUPERUSER;
PGPASSWORD=$POSTGRESQL_PASSWORD  psql -v ON_ERROR_STOP=1 --username "$POSTGRESQL_USERNAME" --dbname="$POSTGRESQL_DATABASE"<<-EOSQL
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL