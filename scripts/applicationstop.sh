#!/bin/bash

echo "Running Hook: applicationstop.sh"
sudo pm2 kill
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 unstartup systemd -u ubuntu --hp /home/ubuntu
pm2 save

exit 0