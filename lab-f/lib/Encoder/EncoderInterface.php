<?php

namespace Lib\Encoder;

interface EncoderInterface
{
    public function supports(string $format): bool;

    public function encode(array $data, string $format): string;

    public function decode(string $data, string $format): array;
}
