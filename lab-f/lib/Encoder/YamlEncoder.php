<?php

namespace Lib\Encoder;

class YamlEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return $format === 'yaml';
    }

    public function encode(array $data, string $format): string
    {
        return yaml_emit($data, YAML_UTF8_ENCODING);
    }

    public function decode(string $data, string $format): array
    {
        try {
            return yaml_parse($data) ?? [];
        } catch (\Throwable $e) {
            throw new \RuntimeException("Invalid YAML: " . $e->getMessage());
        }
    }
}