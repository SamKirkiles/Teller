#!/bin/bash

msg() {
    local message=$1
    echo $message 1>&2
}


msg "This is called at before install"

cd /home/ubuntu/teller-install/Server && npm install


exit 0