#!/bin/bash

echo "Running Hook: applicationstart.sh"
cd /home/ubuntu/teller-install/Server/
pm2 start app.js
sudo pm2 startup
sudo pm2 save
exit 0