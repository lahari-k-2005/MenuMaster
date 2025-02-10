// submit_feedback.php
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "menumaster";
$port = 4306;

$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $reg_no = $conn->real_escape_string($_POST['reg_no']);
    $comments = $conn->real_escape_string($_POST['comments']);
    $rating = (int)$_POST['rating'];
    $stall_name = $conn->real_escape_string($_POST['stall_name']);

    $sql = "INSERT INTO Feedback (reg_no, comments, rating, stall_name) 
            VALUES ('$reg_no', '$comments', $rating, '$stall_name') 
            ON DUPLICATE KEY UPDATE 
            comments='$comments', rating=$rating, stall_name='$stall_name'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Feedback submitted successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
    }
}

$conn->close();
?>
