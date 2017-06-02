#!/bin/bash

msg() {
    local message=$1
    echo $message 1>&2
}

msg "This is called at applicatoin start"

pm2 start /home/ubuntu/teller-install/Server/app.js

exit 0