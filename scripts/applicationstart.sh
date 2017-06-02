#!/bin/bash

msg "This is called at applicatoin start"

pm2 start /home/ubuntu/teller-install/Server/app.js

exit 0