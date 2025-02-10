<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "menumaster";
$port = 4306; // Ensure this is the correct port for your MySQL server

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die(json_encode(["message" => "Connection failed: " . $conn->connect_error]));
}

// Read the input data
$data = json_decode(file_get_contents('php://input'), true);

if ($data === null) {
    echo json_encode(["message" => "Invalid input data"]);
    exit;
}

$reg_no = $data['reg_no']; // Replace with the dynamic user reg_no if needed
$items_list = json_encode($data['items_list']);
$quantity_list = json_encode($data['quantity_list']);
$price_list = json_encode($data['price_list']);
$stall_name = $data['stall_name']; // Assuming stall_name is always 'Yummy'

// Check for JSON encoding errors
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["message" => "JSON encoding error: " . json_last_error_msg()]);
    exit;
}

$sql = "INSERT INTO cart (reg_no, items_list, quantity_list, price_list, stall_name) 
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE items_list = VALUES(items_list), quantity_list = VALUES(quantity_list), price_list = VALUES(price_list), stall_name = VALUES(stall_name)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["message" => "Prepare statement failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("sssss", $reg_no, $items_list, $quantity_list, $price_list, $stall_name);

if ($stmt->execute()) {
    echo json_encode(["message" => "Cart saved successfully!"]);
} else {
    echo json_encode(["message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
