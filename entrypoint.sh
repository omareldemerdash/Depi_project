#!/bin/bash
# entrypoint.sh

# Set MySQL root password from the secret
MYSQL_ROOT_PASSWORD=$(cat /run/secrets/mysql_root_password)

# Start MySQL with the custom root password
echo "MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}"

# Run the original entrypoint to start MySQL
exec docker-entrypoint.sh "$@"
