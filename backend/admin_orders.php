<?php
session_start();
include "db.php";

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$action = $_POST['action'] ?? '';

if ($action === 'get_orders') {
    // In production, fetch from database
    // For now, get from localStorage (sent from frontend)
    $orders = json_decode($_POST['orders'] ?? '[]', true);
    
    // Process orders data
    $processedOrders = array_map(function($order) {
        return [
            'id' => $order['id'],
            'customer' => $order['shippingInfo']['name'] ?? 'Unknown',
            'email' => $order['shippingInfo']['email'] ?? '',
            'phone' => $order['shippingInfo']['phone'] ?? '',
            'address' => $order['shippingInfo']['address'] ?? '',
            'city' => $order['shippingInfo']['city'] ?? '',
            'state' => $order['shippingInfo']['state'] ?? '',
            'zip' => $order['shippingInfo']['zip'] ?? '',
            'products' => count($order['items']),
            'total' => $order['total'],
            'paymentMethod' => $order['paymentMethod'] ?? 'COD',
            'date' => $order['date'],
            'status' => $order['status'] ?? 'Processing'
        ];
    }, $orders);
    
    echo json_encode($processedOrders);
}

elseif ($action === 'update_order_status') {
    $orderId = $_POST['orderId'];
    $status = $_POST['status'];
    
    // In production, update database
    // $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    
    echo json_encode(["success" => true]);
}
?>