<?php

final class MenuRules
{
    public const CURRENCY        = 'EGP';
    public const BADGES          = ['top', 'new'];  
    public const AVAILABILITY    = ['in_stock', 'out_of_stock'];
    public const PRICING_TYPES   = ['single', 'sizes'];
    public const MAX_NAME        = 120;
    public const MAX_DESCRIPTION = 2000;
    public const MAX_PRICE       = 1000000;
    public const MAX_SIZES       = 10;
    public const MAX_DELAY       = 60;
    public const IMAGE_PATTERN   = '/^[A-Za-z0-9][A-Za-z0-9._-]{0,120}\.webp$/';

    public static function isId(mixed $value): bool
    {
        return is_string($value) && trim($value) !== '' && mb_strlen($value) <= 64;
    }

    public static function isText(mixed $value, int $max): bool
    {
        return is_string($value) && trim($value) !== '' && mb_strlen(trim($value)) <= $max;
    }

    public static function isLocalized(mixed $value, int $max): bool
    {
        return is_array($value)
            && self::isText($value['en'] ?? null, $max)
            && self::isText($value['ar'] ?? null, $max);
    }

    public static function isPrice(mixed $value, int $min): bool
    {
        return is_int($value) && $value >= $min && $value <= self::MAX_PRICE;
    }

    public static function isImage(mixed $value): bool
    {
        return is_string($value) && preg_match(self::IMAGE_PATTERN, $value) === 1;
    }

    public static function isIdList(mixed $value): bool
    {
        if (!is_array($value) || !array_is_list($value)) {
            return false;
        }
        foreach ($value as $id) {
            if (!self::isId($id)) {
                return false;
            }
        }
        return true;
    }

    public static function entries(mixed $value): array
    {
        if (!is_array($value)) {
            return [];
        }
        if (array_is_list($value)) {
            return $value;
        }
        $list = [];
        foreach ($value as $key => $entry) {
            if (is_array($entry)) {
                $entry['id'] ??= (string) $key;
            }
            $list[] = $entry;
        }
        return $list;
    }
}
