<?php

include "db.php";

if($_SERVER["REQUEST_METHOD"] !== "POST"){
    echo "Invalid request";
    exit();
}

$email = trim($_POST['email']);
$password = trim($_POST['password']);

if(empty($email) || empty($password)){
    echo "All fields required";
    exit();
}

$stmt = $conn->prepare("SELECT password FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows === 1){

    $row = $result->fetch_assoc();

    if(password_verify($password, $row['password'])){
        echo "success";
    } else {
        echo "invalid";
    }

} else {
    echo "invalid";
}

$stmt->close();
$conn->close();

?>