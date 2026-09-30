#!/bin/bash

set -e

echo "Employee Records EC2 setup started"

echo "[1/6] Updating Ubuntu packages..."

apt-get update -y

echo "[2/6] Installing basic tools..."

apt-get install -y \
    ca-certificates \
    curl \
    wget \
    gnupg \
    git \
    nginx \
    fontconfig \
    openjdk-21-jre

echo "[3/6] Installing Docker..."

install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    -o /etc/apt/keyrings/docker.asc

chmod a+r /etc/apt/keyrings/docker.asc

echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    > /etc/apt/sources.list.d/docker.list

apt-get update -y

apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

echo "[4/6] Starting Docker..."

systemctl enable docker
systemctl start docker

echo "[5/6] Adding ubuntu user to Docker group..."

usermod -aG docker ubuntu

echo "[6/6] Verifying installation..."

docker --version
docker compose version
java -version
nginx -v

echo "Employee Records EC2 setup completed"
