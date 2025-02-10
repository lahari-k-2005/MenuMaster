<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "menumaster", 4306);

if ($conn->connect_error) {
    die(json_encode(["message" => "Connection failed: " . $conn->connect_error]));
}

$reg_no = isset($_GET['reg_no']) ? $_GET['reg_no'] : null;
$stall_name = isset($_GET['stall_name']) ? $_GET['stall_name'] : null;

$sql = "SELECT * FROM orders";

if ($stall_name) {
    $sql .= " WHERE stall_name = '$stall_name'";
}
elseif ($reg_no) {
    $sql .= " WHERE reg_no = '$reg_no'";
}

$result = $conn->query($sql);

$orders = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}

echo json_encode($orders);

$conn->close();
?>
