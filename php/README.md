guesser - a guessing game that learns, PHP version
==================================================

Installation
------------

Do

    sudo apt-get install apache2 libapache2-mod-php5
    sudo a2enmod rewrite
    sudo a2enmod userdir

Add "PUT" to the "Limit" and "LimitExcept" list of methods in
`userdir.conf` to allow PUT requests

checkout repo at (github)[https://github.com/neunhoef/guesser]

    cd guesser/php
    cp * .htaccess ~/public_html/

and edit `~/public_html/.htaccess` to adjust the `RewriteBase` with
the correct username. Then restart apache2 and visit:

    http://<YOURHOST>/~<YOURUSERNAME>/index.html

