<?php
/**
 * Plugin Name: Kegustito Cart Sync
 * Description: Sincroniza el carrito construido en el frontend Next.js con el carrito nativo de WooCommerce antes de ir al checkout. Instalar como mu-plugin (wp-content/mu-plugins/) o plugin normal activo.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', function () {
    if (!isset($_GET['kg_sync_cart'])) {
        return;
    }

    if (!function_exists('WC') || !WC()->cart) {
        return;
    }

    $encoded = sanitize_text_field(wp_unslash($_GET['kg_sync_cart']));
    $decoded = base64_decode(strtr($encoded, '-_', '+/'), true);

    if ($decoded === false) {
        wp_safe_redirect(home_url('/carrito/'));
        exit;
    }

    $items = json_decode($decoded, true);

    if (!is_array($items)) {
        wp_safe_redirect(home_url('/carrito/'));
        exit;
    }

    WC()->cart->empty_cart();

    foreach ($items as $item) {
        if (empty($item['id']) || empty($item['qty'])) {
            continue;
        }

        $product_id = absint($item['id']);
        $quantity = absint($item['qty']);

        if ($product_id > 0 && $quantity > 0) {
            WC()->cart->add_to_cart($product_id, $quantity);
        }
    }

    $redirect_to = isset($_GET['redirect_to']) && $_GET['redirect_to'] === 'cart'
        ? wc_get_cart_url()
        : wc_get_checkout_url();

    wp_safe_redirect($redirect_to);
    exit;
});
