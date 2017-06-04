#!/bin/bash

echo "Running Hook: applicationstop.sh"
echo sudo pm2 kill
echo sudo pm2 unstartup
echo sudo pm2 save

exit 0