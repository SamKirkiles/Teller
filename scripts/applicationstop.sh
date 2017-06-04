#!/bin/bash

echo "Running Hook: applicationstop.sh"
sudo pm2 kill
sudo pm2 unstartup systemd -u ubuntu --hp /home/ubuntu
pm2 save

exit 0