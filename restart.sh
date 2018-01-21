#!/bin/bash
# Run this file rebuild the containers and deploy

sudo docker rm -f rcm-web rcm-elasticsearch rcm-pull
sudo ./deploy
sleep 5
sudo docker restart rcm-pull
