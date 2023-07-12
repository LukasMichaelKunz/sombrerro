<?php
$doIt=true;
if (!isset($_GET['left']))$doIt=false; 
if (!isset($_GET['top']))$doIt=false; 
if (!isset($_GET['width']))$doIt=false; 
if (!isset($_GET['height']))$doIt=false;
if (!isset($_GET['map']))$doIt=false;
if ($doIt)
{
    // Create connection
    $conn = new mysqli('localhost', 'sombrero', 'leoandluke', 'sombrero');
    // Check connection
    if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
    }
    $right = intval($_GET['left'])+intval($_GET['width']);
    $bottom = intval($_GET['top'])+intval($_GET['height']);
    $sql = "select * from ".$_GET['map']." where posX>=".$_GET['left']." and posX<=".$right." and posY>=".$_GET['top']." and posY<=".$bottom;
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "<object>";
        echo $row['object']."<split>".$row['posX']."<split>".$row['posY']."<split>".$row['width']."<split>".$row['height'];
    }
    } else {
    echo "0 results";
    }



    $conn->close();

} 
else
{
    echo "missing Input";
}
?>