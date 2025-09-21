#!/bin/sh
sudo apt update -y 
sudo apt install python3-pip python3-dev build-essential libssl-dev libffi-dev python3-setuptools  -y
sudo apt-get install gcc libpq-dev -y
sudo apt-get install python-dev  python-pip -y
sudo apt-get install python3-dev python3-pip python3-venv python3-wheel -y
sudo apt-get install build-essential python-dev -y 
sudo add-apt-repository ppa:certbot/certbot -y
sudo apt install python-certbot-nginx -y
sudo apt install python3-venv -y



echo "--------------------------------------"
echo "Creating server folder and copy things"
echo "--------------------------------------"
sudo mkdir -p ~/server

sudo cp -r ~/raritycheckcrypto/. ~/server/
echo "--------------------------------------"
echo "DONE"
echo "--------------------------------------"

cd ~/server

echo $PWD

echo "--------------------------------------"
echo "Creating server ENV"
echo "--------------------------------------"


sudo python3.6 -m venv serverenv

sudo chmod -R 777 serverenv

source serverenv/bin/activate

echo "--------------------------------------"
echo "pip3 isntall wheel"
echo "--------------------------------------"
pip install  wheel

echo "--------------------------------------"
echo "DONE"
echo "--------------------------------------"

echo "--------------------------------------"
echo "pip3 install uwsgi flask"
echo "--------------------------------------"
pip install uwsgi flask
pip install requests

echo "--------------------------------------"
echo "DONE"
echo "--------------------------------------"
deactivate
echo "--------------------------------------"
echo "deactivate DONE"
echo "--------------------------------------"
echo "--------------------------------------"
echo "Nginx and creating SSl certificates"
echo "--------------------------------------"
echo "--------------------------------------"
sudo cp ~/server/server.service /etc/systemd/system/
sudo cp ~/server/configs/conf.d/crypto.raritycheck.com /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/crypto.raritycheck.com /etc/nginx/sites-enabled/

sudo nginx -t

sudo systemctl restart nginx

sudo mkdir /etc/systemd/system/nginx.service.d
printf "[Service]\nExecStartPost=/bin/sleep 0.1\n" | \
    sudo tee /etc/systemd/system/nginx.service.d/override.conf
sudo systemctl daemon-reload
sudo systemctl restart nginx

sudo certbot --nginx  -d crypto.raritycheck.com 
echo "--------------------------------------"
echo "DONE"
echo "--------------------------------------"

echo "--------------------------------------"
echo "Restarting Nginx "
echo "--------------------------------------"
sudo ufw allow 'Nginx Full'

sudo ufw delete allow 'Nginx HTTP'

sudo systemctl start server

sudo systemctl enable server

sudo systemctl status server

sudo systemctl restart nginx
echo "--------------------------------------"
echo "DONE"
echo "--------------------------------------"

