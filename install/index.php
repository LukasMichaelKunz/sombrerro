<?php
    echo "<h2>MYSQL DATENBANK und USER erstellen:</h2>";
    echo "<h3>create database sombrero;</h3>";
    echo "<h3>create user 'sombrero'@'localhost' identified by 'leoandluke';</h3>";
    echo "<h3>grant all privileges on sombrero.* to 'sombrero'@'localhost' with grant option;</h3>";
    echo "<h3>use sombrero;</h3>";
    echo "<h3>create table map0001 (id int not null auto_increment primary key, posX int, posY int, image VARCHAR(64), width int, height int);</h3>";

?>