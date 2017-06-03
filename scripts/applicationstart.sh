#!/bin/bash

echo "Running Hook: applicationstart.sh"
cd /home/ubuntu/teller-install/Server/ && pm2 start app.js
pm2 ls
exit 0