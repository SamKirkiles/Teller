#!/bin/bash

echo "Running Hook: applicationstart.sh"
cd /home/ubuntu/teller-install/Server/ && echo pm2 start app.js && echo sudo pm2 startup && echo sudo pm2 save
exit 0