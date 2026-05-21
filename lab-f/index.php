<?php

use Lib\Encoder\CsvEncoder;
use Lib\Encoder\JsonEncoder;
use Lib\Encoder\YamlEncoder;
use Lib\Encoder\Serializer;

require_once __DIR__ . '/lib/Encoder/EncoderInterface.php';
require_once __DIR__ . '/lib/Encoder/CsvEncoder.php';
require_once __DIR__ . '/lib/Encoder/JsonEncoder.php';
require_once __DIR__ . '/lib/Encoder/YamlEncoder.php';
require_once __DIR__ . '/lib/Encoder/Serializer.php';

$input        = $_COOKIE['input']         ?? '';
$inputFormat  = $_COOKIE['input_format']  ?? 'csv';
$outputFormat = $_COOKIE['output_format'] ?? 'json';
$output       = '';
$error        = null;

$serializer = new Serializer([
    new CsvEncoder(),
    new JsonEncoder(),
    new YamlEncoder(),
]);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input        = $_POST['input']         ?? '';
    $inputFormat  = strtolower(trim($_POST['input_format']  ?? 'csv'));
    $outputFormat = strtolower(trim($_POST['output_format'] ?? 'json'));

    // zapis do ciasteczek
    setcookie('input', $input, time() + 3600);
    setcookie('input_format', $inputFormat, time() + 3600);
    setcookie('output_format', $outputFormat, time() + 3600);

    try {
        if (trim($input) === '') {
            $rows = [];
        } else {
            $rows = $serializer->deserialize($input, $inputFormat);
        }

        $output = $serializer->serialize($rows, $outputFormat);

    } catch (Throwable $e) {
        $error = 'Błąd podczas konwersji: ' . $e->getMessage();
        $output = '';
    }
}

require __DIR__ . '/templates/layout.php';
