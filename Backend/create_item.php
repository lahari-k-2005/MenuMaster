<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "menumaster", 4306);

if ($conn->connect_error) {
    die(json_encode(["message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$item_name = $data['item_name'];
$price = $data['price'];
$stall_name = $data['stall_name'];
$is_in_menu = $data['is_in_menu'];

// Input validation
if (empty($item_name) || empty($price) || empty($stall_name)) {
    echo json_encode(["message" => "All fields are required"]);
    $conn->close();
    exit();
}

$sql = "INSERT INTO menu (item_name, price, stall_name, is_in_menu) VALUES ('$item_name', '$price', '$stall_name', '$is_in_menu')";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Item created successfully!"]);
} else {
    echo json_encode(["message" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>
