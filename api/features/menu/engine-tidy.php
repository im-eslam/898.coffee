<?php

final class MenuReferences
{
    public static function resolve(array $menu, MenuIssues $issues): array
    {
        $productIds = [];
        foreach ($menu['categories'] as $category) {
            foreach ($category['products'] as $product) {
                $productIds[$product['id']] = true;
            }
        }
        $addOnIds = array_fill_keys(array_keys($menu['addOns']), true);

        foreach ($menu['categories'] as $ci => $category) {
            foreach ($category['products'] as $pi => $product) {
                $path = "categories[$ci].products[$pi]";
                $menu['categories'][$ci]['products'][$pi]['addOns'] =
                    self::keep($product['addOns'], "$path.addOns", $addOnIds, 'add-on', $issues);
                $menu['categories'][$ci]['products'][$pi]['baristaWay'] =
                    self::keep($product['baristaWay'], "$path.baristaWay", $addOnIds, 'add-on', $issues);
                $menu['categories'][$ci]['products'][$pi]['oftenOrderedWith'] =
                    self::keep($product['oftenOrderedWith'], "$path.oftenOrderedWith", $productIds, 'product', $issues);
            }
        }

        $menu['signatures'] = self::keep($menu['signatures'], 'signatures', $productIds, 'product', $issues);

        $pairings = [];
        foreach ($menu['pairings'] as $pi => $pairing) {
            $items = self::keep($pairing['items'], "pairings[$pi].items", $productIds, 'product', $issues);
            if (count($items) < 2) {
                $issues->warning(
                    "pairings[$pi]",
                    'pairing_dropped',
                    "pairing {$pairing['id']} was removed because fewer than two of its products still exist"
                );
                continue;
            }
            $pairing['items'] = $items;
            $pairings[] = $pairing;
        }
        $menu['pairings'] = $pairings;

        return $menu;
    }

    private static function keep(array $ids, string $path, array $existing, string $label, MenuIssues $issues): array
    {
        $kept = [];
        $seen = [];
        foreach ($ids as $id) {
            if (!isset($existing[$id])) {
                $issues->warning($path, 'missing_reference', "removed {$label} \"{$id}\" because it does not exist");
                continue;
            }
            if (isset($seen[$id])) {
                $issues->warning($path, 'duplicate_reference', "removed the repeated {$label} \"{$id}\"");
                continue;
            }
            $seen[$id] = true;
            $kept[] = $id;
        }
        return $kept;
    }
}
