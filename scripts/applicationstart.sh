#!/bin/bash

echo "Running Hook: applicationstart.sh"
echo The port is: $PORT
cd /home/ubuntu/teller-install/Server/
pm2 start app.js
exit 0