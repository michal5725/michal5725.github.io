<?php

namespace Lib\Encoder;

class JsonEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return $format === 'json';
    }

    public function decode(string $data, string $format): array
    {
        $decoded = json_decode($data, true);

        if (!is_array($decoded)) {
            return [];
        }

        if (!isset($decoded[0]) || !is_array($decoded[0])) {
            $decoded = [$decoded];
        }

        return $this->normalizeRows($decoded);
    }

    public function encode(array $rows, string $format): string
    {
        $rows = $this->normalizeRows($rows);

        return json_encode(
            $rows,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
        );
    }

    private function normalizeRows(array $rows): array
    {
        if (empty($rows)) {
            return [];
        }

        $keys = array_keys($rows[0]);
        $normalized = [];

        foreach ($rows as $row) {
            $item = [];
            foreach ($keys as $k) {
                $item[$k] = isset($row[$k]) ? (string)$row[$k] : '';
            }
            $normalized[] = $item;
        }

        return $normalized;
    }
}
