<?php

namespace Lib\Encoder;

class CsvEncoder implements EncoderInterface
{
    private const DELIMITERS = [
        'csv' => ',',
        'ssv' => ';',
        'tsv' => "\t",
    ];

    public function supports(string $format): bool
    {
        return isset(self::DELIMITERS[$format]);
    }

    public function decode(string $data, string $format): array
    {
        $delimiter = self::DELIMITERS[$format];

        $lines = preg_split('/\R/u', trim($data));
        if (!$lines || count($lines) < 2) {
            return [];
        }

        $headers = str_getcsv(array_shift($lines), $delimiter);
        $rows = [];

        foreach ($lines as $line) {
            if (trim($line) === '') {
                continue;
            }
            $values = str_getcsv($line, $delimiter);
            if (count($values) !== count($headers)) {
                continue;
            }
            $rows[] = array_combine($headers, $values);
        }

        return $rows;
    }

    public function encode(array $rows, string $format): string
    {
        $delimiter = self::DELIMITERS[$format];

        if (empty($rows)) {
            return '';
        }

        $headers = array_keys($rows[0]);

        $stream = fopen('php://temp', 'r+');
        fputcsv($stream, $headers, $delimiter);

        foreach ($rows as $row) {
            $ordered = [];
            foreach ($headers as $h) {
                $ordered[] = $row[$h] ?? '';
            }
            fputcsv($stream, $ordered, $delimiter);
        }

        rewind($stream);
        return rtrim(stream_get_contents($stream), "\n");
    }
}
