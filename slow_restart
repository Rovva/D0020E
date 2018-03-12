#!/bin/bash
# Run this file rebuild the containers and deploy
sudo docker stop rcm-mysql
sudo docker rm -f rcm-web rcm-elasticsearch rcm-pull rcm-myadmin
sudo ./deploy
sleep 5
sudo docker start rcm-mysql
sudo docker restart rcm-pull
