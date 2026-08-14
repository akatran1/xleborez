<?php
/**
 * xleborez.ru — Обработчик заказа
 * Принимает JSON, отправляет email + Telegram
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

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

// Validate
$name = trim($input['name'] ?? '');
$phone = trim($input['phone'] ?? '');
$email = trim($input['email'] ?? '');
$delivery = trim($input['delivery'] ?? 'self');
$address = trim($input['address'] ?? '');
$comment = trim($input['comment'] ?? '');
$items = $input['items'] ?? [];
$total = floatval($input['total'] ?? 0);

if (empty($name) || empty($phone) || empty($items)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Заполните обязательные поля']);
    exit;
}

// Build email body
$subject = "Новый заказ на xleborez.ru от {$name}";

$html = "<h2>Новый заказ</h2>";
$html .= "<p><b>Имя:</b> {$name}</p>";
$html .= "<p><b>Телефон:</b> {$phone}</p>";
$html .= "<p><b>Email:</b> " . (!empty($email) ? $email : 'не указан') . "</p>";
$html .= "<p><b>Доставка:</b> " . getDeliveryLabel($delivery) . "</p>";
$html .= !empty($address) ? "<p><b>Адрес:</b> {$address}</p>" : '';
$html .= !empty($comment) ? "<p><b>Комментарий:</b> {$comment}</p>" : '';

$html .= "<h3>Товары:</h3><table border='1' cellpadding='8' cellspacing='0' style='border-collapse:collapse;width:100%;'>";
$html .= "<tr style='background:#fbb710;'><th>Товар</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>";

foreach ($items as $item) {
    $itemTotal = $item['price'] * $item['qty'];
    $html .= "<tr>
        <td>" . htmlspecialchars($item['name']) . "</td>
        <td>{$item['qty']}</td>
        <td>" . number_format($item['price'], 0, '', ' ') . " ₽</td>
        <td>" . number_format($itemTotal, 0, '', ' ') . " ₽</td>
    </tr>";
}

$html .= "</table>";
$html .= "<p><b>Итого:</b> " . number_format($total, 0, '', ' ') . " ₽</p>";

// Send email
$to = 'info@xleborez.ru';
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=utf-8\r\n";
$headers .= "From: xleborez.ru <info@xleborez.ru>\r\n";
$headers .= "Reply-To: {$phone}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$emailSent = mail($to, "=?UTF-8?B?" . base64_encode($subject) . "?=", $html, $headers);

// Send Telegram
$telegramSent = sendTelegram($subject . "\n\n" . strip_tags($html));

// Response
$success = $emailSent || $telegramSent;

echo json_encode([
    'success' => $success,
    'order_id' => time(),
    'email_sent' => $emailSent,
    'telegram_sent' => $telegramSent,
]);

// ========= FUNCTIONS =========

function getDeliveryLabel($code) {
    $labels = [
        'self' => 'Самовывоз (Москва)',
        'courier' => 'Доставка по Москве',
        'russia' => 'Доставка по РФ',
    ];
    return $labels[$code] ?? $code;
}

function sendTelegram($message) {
    // Kept outside the published website directory on the shared host.
    $envFile = __DIR__ . '/../../../tmp/xleborez.env';
    if (!file_exists($envFile)) return false;

    $env = parse_ini_file($envFile);
    $token = $env['TELEGRAM_BOT_TOKEN'] ?? $env['telegram_bot_token'] ?? '';
    $chatId = $env['TELEGRAM_CHAT_ID'] ?? $env['telegram_chat_id'] ?? '';

    if (empty($token) || empty($chatId)) return false;

    $url = "https://api.telegram.org/bot{$token}/sendMessage";

    $data = [
        'chat_id' => $chatId,
        'text' => mb_substr($message, 0, 4000),
        'parse_mode' => 'HTML',
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode === 200;
}
