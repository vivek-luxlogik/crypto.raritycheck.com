server {
    listen 80;
    listen [::]:80;
    server_name crypto.raritycheck.com www.crypto.raritycheck.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;

    server_name crypto.raritycheck.com www.crypto.raritycheck.com;

    # ssl configuration;
    ssl_certificate /etc/letsencrypt/live/crypto.raritycheck.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/crypto.raritycheck.com/privkey.pem;

    location / {
        include uwsgi_params;
        uwsgi_pass unix:/tmp/server.sock;
    }
}