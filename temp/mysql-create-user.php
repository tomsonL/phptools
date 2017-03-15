

mysql> create user 'work'@'%’ identified by 'password';
mysql> grant all privileges on *.* to work@'%';
mysql> flush privileges