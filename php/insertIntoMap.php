<?php
$servername = "localhost";
$username = "sombrero";
$password = "leoandluke";
$dbname = "sombrero";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO map0001 (posX, posY, image, width, height)
VALUES (20, 20, './image/ball.png', 20,15)";

if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?> 