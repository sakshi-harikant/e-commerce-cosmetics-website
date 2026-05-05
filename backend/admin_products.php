<?php
session_start();
include "db.php";

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$action = $_POST['action'] ?? '';

if ($action === 'get_products') {
    // In production, fetch from database
    // For now, return sample data
    $products = [
        [
            'id' => 'prod1',
            'name' => 'Gentle Face Serum with Aloe Vera',
            'description' => 'Hydrating serum with pure aloe vera extract for all skin types',
            'price' => 300,
            'originalPrice' => 450,
            'stock' => 50,
            'badge' => 'BESTSELLER',
            'image' => 'https://i.postimg.cc/bwkrK6HM/IMG-20250308-WA0040.jpg',
            'tags' => ['serum', 'hydrating', 'aloe']
        ],
        // Add more products...
    ];
    echo json_encode($products);
}

elseif ($action === 'add_product') {
    $name = $_POST['name'];
    $description = $_POST['description'];
    $price = $_POST['price'];
    $originalPrice = $_POST['originalPrice'];
    $stock = $_POST['stock'];
    $badge = $_POST['badge'];
    $image = $_POST['image'];
    $tags = $_POST['tags'];
    
    // Generate unique ID
    $id = 'prod' . time();
    
    // In production, insert into database
    // $stmt = $conn->prepare("INSERT INTO products (...) VALUES (...)");
    
    echo json_encode(["success" => true, "id" => $id]);
}

elseif ($action === 'update_product') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $description = $_POST['description'];
    $price = $_POST['price'];
    $originalPrice = $_POST['originalPrice'];
    $stock = $_POST['stock'];
    $badge = $_POST['badge'];
    $image = $_POST['image'];
    $tags = $_POST['tags'];
    
    // In production, update database
    // $stmt = $conn->prepare("UPDATE products SET ... WHERE id = ?");
    
    echo json_encode(["success" => true]);
}

elseif ($action === 'delete_product') {
    $id = $_POST['id'];
    
    // In production, delete from database
    // $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    
    echo json_encode(["success" => true]);
}
?>