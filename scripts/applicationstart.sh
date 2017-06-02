#!/bin/bash

msg() {
    local message=$1
    echo $message 1>&2
}

msg "This is called at applicatoin start"

cd /home/ubuntu/teller-install/Server/ && pm2 start app.js
pm2 ls
exit 0