<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "menumaster";
$port = 4306;

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$response = array('status' => 'error');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'];
    $password = $input['password'];

    // Check student_details table
    $sql = "SELECT reg_no FROM student_details WHERE reg_no = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($reg_no);
        $stmt->fetch();
        $response = array('status' => 'success', 'type' => 'student', 'reg_no' => $reg_no);
    } else {
        // Check vendor_details table
        $sql = "SELECT stall_name FROM vendor_details WHERE stall_name = ? AND password = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $username, $password);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($stall_name);
            $stmt->fetch();
            $response = array('status' => 'success', 'type' => 'vendor', 'stall_name' => $stall_name);
        }
    }
    $stmt->close();
}

$conn->close();
echo json_encode($response);
?>
