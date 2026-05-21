<?php

namespace Lib\Encoder;

class Serializer
{
    private array $encoders;

    public function __construct(array $encoders)
    {
        $this->encoders = $encoders;
    }

    private function getEncoder(string $format): EncoderInterface
    {
        $format = strtolower(trim($format));

        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder;
            }
        }

        throw new \RuntimeException("Brak enkodera dla formatu: {$format}");
    }

    public function deserialize(string $data, string $format): array
    {
        return $this->getEncoder($format)->decode($data, $format);
    }

    public function serialize(array $rows, string $format): string
    {
        return $this->getEncoder($format)->encode($rows, $format);
    }
}
