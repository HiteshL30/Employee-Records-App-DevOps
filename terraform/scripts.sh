#!/bin/bash

set -e

echo "Employee Records EC2 setup started"
echo " Updating Ubuntu packages..."

apt-get update -y

echo " Installing basic tools..."

apt-get install -y \
    ca-certificates \
    curl \
    wget \
    gnupg \
    git \
    nginx \
    fontconfig \
    openjdk-21-jre
