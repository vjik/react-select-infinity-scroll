<?php

declare(strict_types=1);

header("Access-Control-Allow-Origin: *");

$data = require __DIR__ . '/data.php';

if (isset($_GET['value'])) {
    $value = (int) $_GET['value'];
    foreach ($data as $item) {
        if ($item['value'] === $value) {
            header('Content-Type: application/json');
            echo json_encode($item);
            exit;
        }
    }

    header('Content-Type: application/json');
    exit;
}

$query = $_GET['query'] ?? '';
$page = max(1, (int) $_GET['page']);

const PER_PAGE = 10;

$filteredData = empty($query)
    ? $data
    : array_filter(
        $data,
        static fn($item) => stripos($item['label'], $query) !== false
    );

$totalItems = count($filteredData);
$totalPages = (int) ceil($totalItems / PER_PAGE);

$filteredData = $page > $totalPages
    ? []
    : array_slice($filteredData, ($page - 1) * PER_PAGE, PER_PAGE);

foreach ($filteredData as $index => $item) {
    $filteredData[$index]['label'] = $item['value'] . '. ' . $item['label'];
}

header('Content-Type: application/json');
echo json_encode([
    'options' => array_values($filteredData),
    'hasNextPage' => $totalPages > $page,
]);
