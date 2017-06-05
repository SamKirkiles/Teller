#!/bin/bash

echo "Running Hook: applicationstart.sh"

cd /home/ubuntu/teller-install/Server/
source /etc/profile
pm2 start app.js
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save
exit 0