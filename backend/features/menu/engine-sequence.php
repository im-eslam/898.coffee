<?php

final class MenuIdAllocator
{
    public static function assign(array $doc): array
    {
        $highest = self::highest($doc);

        $addOns = MenuRules::entries($doc['addOns'] ?? []);
        foreach ($addOns as $i => $addOn) {
            $addOns[$i]['id'] = self::fill($addOn['id'] ?? null, 'a', 2, $highest);
        }
        $doc['addOns'] = $addOns;

        $categories = MenuRules::entries($doc['categories']);
        foreach ($categories as $ci => $category) {
            $categories[$ci]['id'] = self::fill($category['id'] ?? null, 'c', 2, $highest);
            $products = MenuRules::entries($category['products'] ?? []);
            foreach ($products as $pi => $product) {
                $products[$pi]['id'] = self::fill($product['id'] ?? null, 'p', 3, $highest);
            }
            $categories[$ci]['products'] = $products;
        }
        $doc['categories'] = $categories;

        $pairings = MenuRules::entries($doc['pairings'] ?? []);
        foreach ($pairings as $i => $pairing) {
            $pairings[$i]['id'] = self::fill($pairing['id'] ?? null, 'pr', 2, $highest);
        }
        $doc['pairings'] = $pairings;

        return $doc;
    }

    private static function highest(array $doc): array
    {
        $ids = [];
        foreach (MenuRules::entries($doc['addOns'] ?? []) as $addOn) {
            $ids[] = $addOn['id'] ?? '';
        }
        foreach (MenuRules::entries($doc['categories'] ?? []) as $category) {
            $ids[] = $category['id'] ?? '';
            foreach (MenuRules::entries($category['products'] ?? []) as $product) {
                $ids[] = $product['id'] ?? '';
            }
        }
        foreach (MenuRules::entries($doc['pairings'] ?? []) as $pairing) {
            $ids[] = $pairing['id'] ?? '';
        }

        $highest = [];
        foreach ($ids as $id) {
            if (is_string($id) && preg_match('/^(pr|p|c|a)(\d+)/', $id, $m) === 1) {
                $highest[$m[1]] = max($highest[$m[1]] ?? 0, (int) $m[2]);
            }
        }
        return $highest;
    }

    private static function fill(mixed $id, string $prefix, int $width, array &$highest): string
    {
        if (is_string($id) && trim($id) !== '') {
            return trim($id);
        }
        $number = ($highest[$prefix] ?? 0) + 1;
        $highest[$prefix] = $number;
        return $prefix . str_pad((string) $number, $width, '0', STR_PAD_LEFT);
    }
}
