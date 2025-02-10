<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "menumaster";

$reg_no = $_GET['reg_no'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, 4306);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM cart WHERE reg_no = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $reg_no);
$stmt->execute();
$result = $stmt->get_result();

$cart = $result->fetch_assoc();

if ($cart) {
    // Ensure the lists are valid JSON arrays
    $cart['items_list'] = json_decode($cart['items_list']) ? $cart['items_list'] : json_encode([]);
    $cart['quantity_list'] = json_decode($cart['quantity_list']) ? $cart['quantity_list'] : json_encode([]);
    $cart['price_list'] = json_decode($cart['price_list']) ? $cart['price_list'] : json_encode([]);
}

echo json_encode($cart);

$stmt->close();
$conn->close();
?>
