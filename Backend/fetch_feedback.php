<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "menumaster";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, 4306);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT reg_no, comments, rating, created_at, stall_name FROM Feedback";
$result = $conn->query($sql);

$feedback = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $feedback[] = $row;
    }
}

echo json_encode($feedback);

$conn->close();
?>
