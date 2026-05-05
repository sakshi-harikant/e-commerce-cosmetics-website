<?php

include "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Invalid request";
    exit();
}

$fullname = trim($_POST['fullname']);
$email = trim($_POST['email']);
$password = trim($_POST['password']);

if (empty($fullname) || empty($email) || empty($password)) {
    echo "All fields required";
    exit();
}

// Check if email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email=?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo "Email already registered";
    exit();
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert user
$stmt = $conn->prepare("INSERT INTO users(fullname,email,password) VALUES(?,?,?)");
$stmt->bind_param("sss", $fullname, $email, $hashedPassword);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "Signup failed";
}

$stmt->close();
$conn->close();

?>