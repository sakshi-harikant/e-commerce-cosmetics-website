<?php
session_start();
include "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Invalid request";
    exit();
}

$username = trim($_POST['username']);
$password = trim($_POST['password']);

if (empty($username) || empty($password)) {
    echo "All fields required";
    exit();
}

// In production, fetch from database
// For now, hardcoded admin credentials
if ($username === "admin" && $password === "unleash2024") {
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_username'] = $username;
    echo "success";
} else {
    echo "invalid";
}
?>