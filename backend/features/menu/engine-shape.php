<?php

final class MenuComposer
{
    public static function compose(array $doc): array
    {
        return [
            'updatedAt'  => '',                      
            'currency'   => trim((string) ($doc['currency'] ?? MenuRules::CURRENCY)),
            'badges'     => MenuRules::BADGES,
            'addOns'     => self::addOns($doc['addOns']),
            'categories' => self::categories($doc['categories']),
            'signatures' => self::ids($doc['signatures'] ?? []),
            'pairings'   => self::pairings($doc['pairings']),
            'popup'      => self::popup($doc['popup'] ?? null),
        ];
    }

    public static function toWire(array $menu): array
    {
        if ($menu['addOns'] === []) {
            $menu['addOns'] = new stdClass();
        }
        return $menu;
    }

    private static function addOns(array $addOns): array
    {
        $map = [];
        foreach ($addOns as $addOn) {
            $map[trim((string) $addOn['id'])] = [
                'name'  => self::localized($addOn['name']),
                'price' => (int) $addOn['price'],
            ];
        }
        return $map;
    }

    private static function categories(array $categories): array
    {
        $out = [];
        foreach ($categories as $category) {
            $products = [];
            foreach (MenuRules::entries($category['products'] ?? []) as $product) {
                $products[] = self::product($product);
            }
            $out[] = [
                'id'       => trim((string) $category['id']),
                'name'     => self::localized($category['name']),
                'products' => $products,
            ];
        }
        return $out;
    }

    private static function product(array $product): array
    {
        return [
            'id'               => trim((string) $product['id']),
            'name'             => self::localized($product['name']),
            'description'      => self::localized($product['description']),
            'image'            => $product['image'] ?? null,
            'availability'     => $product['availability'] ?? 'in_stock',
            'badge'            => $product['badge'] ?? null,
            'addOns'           => self::ids($product['addOns'] ?? []),
            'baristaWay'       => self::ids($product['baristaWay'] ?? []),
            'oftenOrderedWith' => self::ids($product['oftenOrderedWith'] ?? []),
            'pricing'          => self::pricing($product['pricing']),
        ];
    }

    private static function pricing(array $pricing): array
    {
        $type = $pricing['type'];
        $options = [];
        foreach ($pricing['options'] as $option) {
            $options[] = [
                'id'       => $type === 'single' ? 'default' : trim((string) $option['id']),
                'name'     => $type === 'single' ? null : self::localized($option['name']),
                'price'    => (int) $option['price'],
                'discount' => (int) ($option['discount'] ?? 0),
                'final'    => 0,                      // MenuPricing sets this
            ];
        }
        return ['type' => $type, 'options' => $options];
    }

    private static function pairings(array $pairings): array
    {
        $out = [];
        foreach ($pairings as $pairing) {
            $out[] = [
                'id'      => trim((string) $pairing['id']),
                'items'   => self::ids($pairing['items']),
                'pricing' => [
                    'price'    => (int) $pairing['pricing']['price'],
                    'discount' => (int) ($pairing['pricing']['discount'] ?? 0),
                    'final'    => 0,                  // MenuPricing sets this
                ],
            ];
        }
        return $out;
    }

    private static function popup(?array $popup): array
    {
        $popup ??= [];
        return [
            'enabled'      => $popup['enabled'] ?? false,
            'image'        => $popup['image'] ?? null,
            'delaySeconds' => $popup['delaySeconds'] ?? 1,
        ];
    }

    private static function localized(array $text): array
    {
        return ['en' => trim((string) $text['en']), 'ar' => trim((string) $text['ar'])];
    }

    private static function ids(array $ids): array
    {
        return array_values(array_map(static fn($id) => trim((string) $id), $ids));
    }
}
