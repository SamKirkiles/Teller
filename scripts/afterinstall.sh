#!/bin/bash

echo "running hook: after install.sh"
cd /home/ubuntu/teller-install/Server && npm install
cd /home/ubuntu/teller-install/App/teller-app && npm install && ng build

exit 0