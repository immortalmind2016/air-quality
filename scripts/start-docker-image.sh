#!/bin/bash

docker build -t air-information .
docker run -p 3000:3000 air-information