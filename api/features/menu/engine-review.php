<?php

final class MenuValidator
{
    public static function validate(array $doc, MenuIssues $issues): void
    {
        self::currency($doc['currency'] ?? null, $issues);
        self::addOns($doc['addOns'] ?? null, $issues);
        self::categories($doc, $issues);
        self::signatures($doc['signatures'] ?? null, $issues);
        self::pairings($doc['pairings'] ?? null, $issues);
        self::popup($doc['popup'] ?? null, $issues);
    }

    private static function currency(mixed $value, MenuIssues $issues): void
    {
        if ($value !== null && (!is_string($value) || preg_match('/^[A-Z]{3}$/', $value) !== 1)) {
            $issues->error('currency', 'invalid_currency', 'currency must be a three-letter code such as EGP');
        }
    }

    private static function addOns(mixed $value, MenuIssues $issues): void
    {
        if ($value === null) {
            return;
        }
        if (!is_array($value)) {
            $issues->error('addOns', 'invalid_type', 'addOns must be a list or an object');
            return;
        }

        $seen = [];
        foreach (MenuRules::entries($value) as $i => $addOn) {
            $path = "addOns[$i]";
            if (!is_array($addOn)) {
                $issues->error($path, 'invalid_type', 'an add-on must be an object');
                continue;
            }
            self::checkId($addOn['id'] ?? null, "$path.id", $seen, $issues);
            if (!MenuRules::isLocalized($addOn['name'] ?? null, MenuRules::MAX_NAME)) {
                $issues->error("$path.name", 'invalid_name', 'add-on name needs non-empty en and ar');
            }
            if (!MenuRules::isPrice($addOn['price'] ?? null, 0)) {
                $issues->error("$path.price", 'invalid_price', 'add-on price must be a whole number, 0 or more');
            }
        }
    }

    private static function categories(array $doc, MenuIssues $issues): void
    {
        if (!isset($doc['categories']) || !is_array($doc['categories'])) {
            $issues->error('categories', 'missing_categories', 'categories must be a list (it may be empty)');
            return;
        }

        $seenCategories = [];
        $seenProducts = [];
        $productCount = 0;

        foreach (MenuRules::entries($doc['categories']) as $ci => $category) {
            $path = "categories[$ci]";
            if (!is_array($category)) {
                $issues->error($path, 'invalid_type', 'a category must be an object');
                continue;
            }
            self::checkId($category['id'] ?? null, "$path.id", $seenCategories, $issues);
            if (!MenuRules::isLocalized($category['name'] ?? null, MenuRules::MAX_NAME)) {
                $issues->error("$path.name", 'invalid_name', 'category name needs non-empty en and ar');
            }

            $products = $category['products'] ?? [];
            if (!is_array($products)) {
                $issues->error("$path.products", 'invalid_type', 'products must be a list');
                continue;
            }
            foreach (MenuRules::entries($products) as $pi => $product) {
                $productCount++;
                self::product($product, "$path.products[$pi]", $seenProducts, $issues);
            }
        }

        if ($productCount === 0) {
            $issues->error('categories', 'empty_menu', 'the menu needs at least one product');
        }
    }

    private static function product(mixed $product, string $path, array &$seen, MenuIssues $issues): void
    {
        if (!is_array($product)) {
            $issues->error($path, 'invalid_type', 'a product must be an object');
            return;
        }

        self::checkId($product['id'] ?? null, "$path.id", $seen, $issues);

        if (!MenuRules::isLocalized($product['name'] ?? null, MenuRules::MAX_NAME)) {
            $issues->error("$path.name", 'invalid_name', 'product name needs non-empty en and ar');
        }
        if (!MenuRules::isLocalized($product['description'] ?? null, MenuRules::MAX_DESCRIPTION)) {
            $issues->error("$path.description", 'invalid_description', 'product description needs non-empty en and ar');
        }

        $image = $product['image'] ?? null;
        if ($image !== null && !MenuRules::isImage($image)) {
            $issues->error("$path.image", 'invalid_image', 'image must be a .webp filename');
        }

        if (!in_array($product['availability'] ?? 'in_stock', MenuRules::AVAILABILITY, true)) {
            $issues->error("$path.availability", 'invalid_availability', 'availability must be in_stock or out_of_stock');
        }

        $badge = $product['badge'] ?? null;
        if ($badge !== null && !in_array($badge, MenuRules::BADGES, true)) {
            $issues->error("$path.badge", 'invalid_badge', 'badge must be null, new or top');
        }

        foreach (['addOns', 'baristaWay', 'oftenOrderedWith'] as $key) {
            $list = $product[$key] ?? null;
            if ($list !== null && !MenuRules::isIdList($list)) {
                $issues->error("$path.$key", 'invalid_list', "$key must be a list of ids");
            }
        }

        $own = $product['id'] ?? null;
        if (is_string($own) && is_array($product['oftenOrderedWith'] ?? null)
            && in_array($own, $product['oftenOrderedWith'], true)) {
            $issues->error("$path.oftenOrderedWith", 'self_reference', 'a product cannot be ordered with itself');
        }

        self::pricing($product['pricing'] ?? null, "$path.pricing", $issues);
    }

    private static function pricing(mixed $pricing, string $path, MenuIssues $issues): void
    {
        if (!is_array($pricing)) {
            $issues->error($path, 'required', 'pricing is required');
            return;
        }

        $type = $pricing['type'] ?? null;
        if (!in_array($type, MenuRules::PRICING_TYPES, true)) {
            $issues->error("$path.type", 'invalid_type', 'pricing type must be single or sizes');
            return;
        }

        $options = $pricing['options'] ?? null;
        if (!is_array($options) || !array_is_list($options)) {
            $issues->error("$path.options", 'invalid_list', 'pricing options must be a list');
            return;
        }

        if ($type === 'single' && count($options) !== 1) {
            $issues->error("$path.options", 'single_needs_one_option', 'single pricing has exactly one option');
        }
        if ($type === 'sizes' && (count($options) < 2 || count($options) > MenuRules::MAX_SIZES)) {
            $issues->error("$path.options", 'sizes_option_count', 'sizes pricing needs 2 to ' . MenuRules::MAX_SIZES . ' options');
        }

        $seen = [];
        foreach ($options as $oi => $option) {
            $opath = "$path.options[$oi]";
            if (!is_array($option)) {
                $issues->error($opath, 'invalid_type', 'a price option must be an object');
                continue;
            }

            if ($type === 'sizes') {
                $id = $option['id'] ?? null;
                if (!MenuRules::isId($id)) {
                    $issues->error("$opath.id", 'invalid_id', 'a size needs an id');
                } elseif (isset($seen[$id])) {
                    $issues->error("$opath.id", 'duplicate_id', "size id \"$id\" is used more than once");
                } else {
                    $seen[$id] = true;
                }
                if (!MenuRules::isLocalized($option['name'] ?? null, MenuRules::MAX_NAME)) {
                    $issues->error("$opath.name", 'invalid_name', 'a size needs a name in en and ar');
                }
            }

            $price = $option['price'] ?? null;
            if (!MenuRules::isPrice($price, 1)) {
                $issues->error("$opath.price", 'invalid_price', 'price must be a whole number, 1 or more');
                continue;
            }
            $discount = $option['discount'] ?? 0;
            if (!MenuRules::isPrice($discount, 0) || $discount > $price) {
                $issues->error("$opath.discount", 'invalid_discount', 'discount must be a whole number from 0 up to the price');
            }
        }
    }

    private static function signatures(mixed $value, MenuIssues $issues): void
    {
        if ($value !== null && !MenuRules::isIdList($value)) {
            $issues->error('signatures', 'invalid_list', 'signatures must be a list of product ids');
        }
    }

    private static function pairings(mixed $value, MenuIssues $issues): void
    {
        if ($value === null) {
            return;
        }
        if (!is_array($value)) {
            $issues->error('pairings', 'invalid_list', 'pairings must be a list');
            return;
        }

        $seen = [];
        foreach (MenuRules::entries($value) as $i => $pairing) {
            $path = "pairings[$i]";
            if (!is_array($pairing)) {
                $issues->error($path, 'invalid_type', 'a pairing must be an object');
                continue;
            }
            self::checkId($pairing['id'] ?? null, "$path.id", $seen, $issues);

            $items = $pairing['items'] ?? null;
            if (!is_array($items) || count($items) !== 2 || !MenuRules::isIdList($items)) {
                $issues->error("$path.items", 'invalid_items', 'a pairing needs exactly two product ids');
            } elseif ($items[0] === $items[1]) {
                $issues->error("$path.items", 'duplicate_item', 'a pairing needs two different products');
            }

            $pricing = $pairing['pricing'] ?? null;
            if (!is_array($pricing)) {
                $issues->error("$path.pricing", 'required', 'pairing pricing is required');
                continue;
            }
            $price = $pricing['price'] ?? null;
            if (!MenuRules::isPrice($price, 1)) {
                $issues->error("$path.pricing.price", 'invalid_price', 'bundle price must be a whole number, 1 or more');
                continue;
            }
            $discount = $pricing['discount'] ?? 0;
            if (!MenuRules::isPrice($discount, 0) || $discount > $price) {
                $issues->error("$path.pricing.discount", 'invalid_discount', 'bundle discount must be a whole number from 0 up to the price');
            }
        }
    }

    private static function popup(mixed $value, MenuIssues $issues): void
    {
        if ($value === null) {
            return;
        }
        if (!is_array($value)) {
            $issues->error('popup', 'invalid_type', 'popup must be an object');
            return;
        }

        $enabled = $value['enabled'] ?? false;
        if (!is_bool($enabled)) {
            $issues->error('popup.enabled', 'invalid_type', 'popup.enabled must be true or false');
        }

        $image = $value['image'] ?? null;
        if ($image !== null && !MenuRules::isImage($image)) {
            $issues->error('popup.image', 'invalid_image', 'popup image must be a .webp filename');
        }
        if ($enabled === true && $image === null) {
            $issues->error('popup.image', 'missing_image', 'an enabled popup needs an image');
        }

        $delay = $value['delaySeconds'] ?? 1;
        if (!is_int($delay) || $delay < 0 || $delay > MenuRules::MAX_DELAY) {
            $issues->error('popup.delaySeconds', 'invalid_delay', 'delaySeconds must be a whole number from 0 to ' . MenuRules::MAX_DELAY);
        }
    }

    private static function checkId(mixed $id, string $path, array &$seen, MenuIssues $issues): void
    {
        if ($id === null || $id === '') {
            return;
        }
        if (!MenuRules::isId($id)) {
            $issues->error($path, 'invalid_id', 'id must be a non-empty string of up to 64 characters');
            return;
        }
        if (isset($seen[$id])) {
            $issues->error($path, 'duplicate_id', "id \"$id\" is used more than once");
            return;
        }
        $seen[$id] = true;
    }
}
