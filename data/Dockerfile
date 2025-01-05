FROM mongo:latest

# Install mongosh
RUN apt-get update && apt-get install -y wget gnupg && \
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb.gpg && \
    echo "deb [ signed-by=/usr/share/keyrings/mongodb.gpg ] https://repo.mongodb.org/apt/debian buster/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list && \
    apt-get update && apt-get install -y mongodb-mongosh && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /data/db
