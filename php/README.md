guesser - a guessing game that learns, PHP version
==================================================

Installation
------------

Do

    sudo apt-get install apache2 libapache2-mod-php5
    sudo a2enmod rewrite
    sudo a2enmod userdir

Add "PUT" to the "Limit" and "LimitExcept" list of methods in
`userdir.conf` to allow PUT requests.

Edit `php5.conf` and comment out the part

    <IfModule mod_userdir.c>
        <Directory /home/*/public_html>
            php_admin_value engine Off
        </Directory>
    </IfModule>

to allow for PHP scripts in user home directories' web pages.

Checkout repo at (github)[https://github.com/neunhoef/guesser]

    cd guesser/php
    cp * .htaccess ~/public_html/

and edit `~/public_html/.htaccess` to adjust the `RewriteBase` with
the correct username. Then get the composer.shar and install the 
dependencies:

    curl -sS https://getcomposer.org/installer | php

say in your homedirectory. This gives you a file `composer.shar`.

Now, in `~/public_html`, do:

    php ../composer.shar install

which installs all the dependencies.

Finally restart apache2:

    sudo service apache2 restart

and visit

    http://<YOURHOST>/~<YOURUSERNAME>/index.html

with a browser.

