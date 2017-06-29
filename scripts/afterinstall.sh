#!/bin/bash

echo "Running hook: after install.sh"

cd /home/ubuntu/teller-install/Server && sudo npm install
cd /home/ubuntu/teller-install/App/teller-app
sudo npm install
sudo ng build --prod --env=prod

echo "Finished running hook: after install.sh"

exit 0