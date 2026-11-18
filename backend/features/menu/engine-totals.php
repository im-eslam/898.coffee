<?php

final class MenuPricing
{
    public static function apply(array $menu): array
    {
        foreach ($menu['categories'] as $ci => $category) {
            foreach ($category['products'] as $pi => $product) {
                foreach ($product['pricing']['options'] as $oi => $option) {
                    $menu['categories'][$ci]['products'][$pi]['pricing']['options'][$oi]['final']
                        = $option['price'] - $option['discount'];
                }
            }
        }
        foreach ($menu['pairings'] as $pi => $pairing) {
            $menu['pairings'][$pi]['pricing']['final']
                = $pairing['pricing']['price'] - $pairing['pricing']['discount'];
        }
        return $menu;
    }
}
