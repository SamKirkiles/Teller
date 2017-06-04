#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
echo BEGIN
apt-get -y update
apt-get -y install ruby
apt-get -y install wget
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y nodejs
apt-get -y install npm
cd /home/ubuntu
wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install
chmod +x ./install
./install auto
npm install pm2 --global
npm install @angular/cli --global

echo export PLAID_CLIENT_ID="58b19b60bdc6a44288ea2050" >> /etc/profile
echo export PLAID_PUBLIC_KEY="e839335cc584216e29feff916f1d77" >> /etc/profile
echo export PLAID_SECRET="b9f6580301de6cf4bac33353f87f4e" >> /etc/profile

echo export DATABASE_USERNAME="nodejsec2user" >> /etc/profile
echo export DATABASE_PASSWORD="Ew359854$" >> /etc/profile
echo export DATABASE_HOST="mytestdbinstance.c5wy1ciqweer.us-east-1.rds.amazonaws.com" >> /etc/profile
echo export DATABASE_PORT="3306" >> /etc/profile

echo export FB_MESSENGER_TOKEN="EAAFhcDC2C1IBANSBiWBoZAZBCic6nTAbQZCeZB2NeK5waC6MiKSYkRSgdc02823OtOMRJZC5dfCTPSPdCdVa0hEZB4CJasmYZAADbgBmVMa80EWZAaUc9UIlV6hFPLZBmGHFdgaWSZAknSkZA13t247A4R6iFZBxtw8oQ62u01Cz5yZBYgQZDZD" >> /etc/profile
echo export FB_VERIFY_TOKEN="tellerverifytoken" >> /etc/profile

echo export PORT="3000"


echo END