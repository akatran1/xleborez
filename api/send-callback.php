<?php
/**
 * xleborez.ru — Обработчик обратного звонка
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

$name = trim($input['name'] ?? '');
$phone = trim($input['phone'] ?? '');

if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Заполните имя и телефон']);
    exit;
}

// Email
$to = 'info@xleborez.ru';
$subject = "Обратный звонок с xleborez.ru от {$name}";
$message = "
<h2>Запрос обратного звонка</h2>
<p><b>Имя:</b> {$name}</p>
<p><b>Телефон:</b> {$phone}</p>
<p><b>Дата:</b> " . date('d.m.Y H:i') . "</p>
";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=utf-8\r\n";
$headers .= "From: xleborez.ru <info@xleborez.ru>\r\n";

mail($to, "=?UTF-8?B?" . base64_encode($subject) . "?=", $message, $headers);

// Telegram
sendTelegram("🔔 Обратный звонок\nИмя: {$name}\nТелефон: {$phone}\nДата: " . date('d.m.Y H:i'));

echo json_encode(['success' => true]);

function sendTelegram($message) {
    $envFile = __DIR__ . '/../.env';
    if (!file_exists($envFile)) return;

    $env = parse_ini_file($envFile);
    $token = $env['telegram_bot_token'] ?? '';
    $chatId = $env['telegram_chat_id'] ?? '';

    if (empty($token) || empty($chatId)) return;

    $url = "https://api.telegram.org/bot{$token}/sendMessage";
    $data = ['chat_id' => $chatId, 'text' => $message, 'parse_mode' => 'HTML'];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_exec($ch);
    curl_close($ch);
}
