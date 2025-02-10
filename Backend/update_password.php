<?php
// update_password.php
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
    echo json_encode(['success' => false, 'message' => 'Database connection error']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$reg_no = $data['reg_no'] ?? '';
$old_password = $data['old_password'] ?? '';
$new_password = $data['new_password'] ?? '';

if (empty($reg_no) || empty($old_password) || empty($new_password)) {
    echo json_encode(['success' => false, 'message' => 'Please provide all required fields']);
    exit;
}

// Verify old password
$sql = "SELECT password FROM student_details WHERE reg_no = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $reg_no);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    $stmt->close();
    $conn->close();
    exit;
}

$row = $result->fetch_assoc();
if ($row['password'] !== $old_password) {
    echo json_encode(['success' => false, 'message' => 'Old password is incorrect']);
    $stmt->close();
    $conn->close();
    exit;
}

$stmt->close();

// Update password
$update_sql = "UPDATE student_details SET password = ? WHERE reg_no = ?";
$update_stmt = $conn->prepare($update_sql);
$update_stmt->bind_param("ss", $new_password, $reg_no);

if ($update_stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error updating password: ' . $conn->error]);
}

$update_stmt->close();
$conn->close();
?>
