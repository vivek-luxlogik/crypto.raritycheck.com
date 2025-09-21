

sudo bash raritycheckcrypto/run.sh


Checks the Nginx error logs:
sudo less /var/log/nginx/error.log

Checks the Nginx access logs:
sudo less /var/log/nginx/access.log

Checks the Nginx process logs:
sudo journalctl -u nginx

Checks your Flask app’s uWSGI logs:
sudo journalctl -u server


ssh-keygen -R 3.68.174.144


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


sudo certbot certonly -d crypto.raritycheck.com
Saving debug log to /var/log/letsencrypt/letsencrypt.log

How would you like to authenticate with the ACME CA?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: Nginx Web Server plugin (nginx)
2: Spin up a temporary webserver (standalone)
3: Place files in webroot directory (webroot)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-3] then [enter] (press 'c' to cancel): 1
Plugins selected: Authenticator nginx, Installer None
Obtaining a new certificate

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/crypto.raritycheck.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/crypto.raritycheck.com/privkey.pem
   Your cert will expire on 2021-09-13. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le