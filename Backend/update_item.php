<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
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

$sql = "UPDATE menu SET price='$price' WHERE item_name='$item_name' AND stall_name='$stall_name'";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Item updated successfully!"]);
} else {
    echo json_encode(["message" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>
