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
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
$reg_no = $data['reg_no'];
$items_list = json_encode($data['items_list']);
$quantity_list = json_encode($data['quantity_list']);
$price_list = json_encode($data['price_list']);
$stall_name = $data['stall_name'];
// $placed_at = date('Y-m-d H:i:s');

// Generate order_id
$current_date = date('Y-m-d');
$sql = "SELECT COUNT(*) AS order_count FROM orders WHERE order_id LIKE '$current_date%'";
$result = $conn->query($sql);
$order_count = $result->fetch_assoc()['order_count'] + 1;
$order_id = $current_date . str_pad($order_count, 4, '0', STR_PAD_LEFT);

// Insert order into orders table
$sql = "INSERT INTO orders (reg_no, stall_name, items_list, quantity_list, price_list, order_id, order_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $reg_no, $stall_name, $items_list, $quantity_list, $price_list, $order_id, $current_date);

if ($stmt->execute()) {
    // Clear the user's cart
    $sql = "DELETE FROM cart WHERE reg_no = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $reg_no);
    $stmt->execute();

    echo json_encode(["message" => "Order placed successfully!", "order_id" => $order_id]);
} else {
    echo json_encode(["message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
