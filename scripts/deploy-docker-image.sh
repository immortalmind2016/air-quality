#!/bin/bash

docker build -t air-app .
docker tag air-app:latest immortalmind/air-app:latest
docker push immortalmind/air-app:latest
