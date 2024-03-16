<?php

/**
 * @version 2.2.2
 */

/*
Plugin Name: Crypto Converter ⚡ Widget
Plugin URI: https://co-w.io/
Description: The Crypto Converter Widget is a magical and easy-to-use web tool with a beautiful UI, providing real-time cryptocurrency conversion for any website, and it's free with Gutenberg block support. Users can choose from approximately ≈170 fiat currencies and around ≈2,200 cryptocurrencies.
Version: 2.2.2
Author: CurrencyRate.today
Author URI: https://currencyrate.today/
License: GPLv2 or later
Text Domain: crypto-converter-widget
Domain Path: /languages
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly

define('CCW_NAME', 'Crypto Converter ⚡ Widget');
define('CCW_PATH', plugin_dir_path(__FILE__));
define('CCW_URL', plugin_dir_url(__FILE__));
define('CCW_PLUGIN_SLUG', 'crypto-converter-widget');

if (file_exists(plugin_dir_path(__FILE__) . 'includes/ccw-admin-notices.php')) {
    include 'includes/ccw-admin-notices.php';

    $admin_notice = CCW_Admin_Notices::get_instance();
    $admin_notice->info(esc_html__('Rate', 'crypto-converter-widget'), 'rate');
}

class CCW_crypto_converter_widget
{
    protected static $_instance = null;

    public static function get_instance()
    {
        if (!self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public function __construct()
    {
        add_shortcode(CCW_PLUGIN_SLUG, [$this, 'CCW_shortcode']);
        add_action('admin_menu', [$this, 'CCW_add_plugin_page']);

        add_action('wp_enqueue_scripts', [$this, 'CCW_public_script']);
        add_action('admin_enqueue_scripts', [$this, 'CCW_admin_notify_scripts']);
        add_action('admin_enqueue_scripts', [$this, 'CCW_public_script']);
        add_action('admin_enqueue_scripts', [$this, 'CCW_admin_settins_scripts']);
        add_action('admin_enqueue_scripts', [$this, 'CCW_admin_settins_styles']);
        add_filter('plugin_action_links', [$this, 'CCW_plugin_action_links'], 10, 2);
    }

    function CCW_admin_notify_scripts() {
        $script_path = plugin_dir_path(__FILE__) . 'assets/admin/js/ccw-notify.js';
        wp_enqueue_script('crypto-converter-widget-script', plugin_dir_url(__FILE__) . 'assets/admin/js/ccw-notify.js', array('jquery'), filemtime($script_path), true);
        wp_localize_script('crypto-converter-widget-script', 'cryptoConverterWidgetAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('crypto-converter-widget-nonce')
        ));
    }

    public function CCW_shortcode($attr)
    {
        $allowed_attr = [
            'fiat', 'amount', 'decimal-places', 'font-family',
            'background-color', 'border-radius', 'shadow',
            'symbol', 'live', 'crypto',
        ];
        $js_object = '';
        $widget_dev = '<div style="margin-top:0px;margin-bottom:0px">' . __('Source:', 'crypto-converter-widget') . ' <a href="https://currencyrate.today/">CurrencyRate</a></div>';
        $output = '<!-- Crypto Converter ⚡ Widget --><crypto-converter-widget ';
        /* $signature = (boolval($attr['signature'])) ? true : false;
        unset($attr['signature']); */

        if (!empty($attr) && (is_array($attr) || is_object($attr))) {
            foreach ($attr as $key => $value) {
                if (in_array($key, $allowed_attr)) { // Check if the attribute is allowed
                    // Sanitize the attribute value. Adjust the sanitization function based on the expected type of the attribute.
                    $sanitized_value = sanitize_text_field($value);

                    // Additional step to sanitize parentheses
                    $sanitized_value = preg_replace('/[()]/', '', $sanitized_value);

                    // Escape the attribute value for safe output
                    $escaped_value = esc_attr($sanitized_value);
                    $output .= $key . '="' . $escaped_value . '" ';
                }
            }
        }

        $js_object = substr($js_object, 0, -1);

        $output .= $js_object;
        $output .= '></crypto-converter-widget>'
            . '<!-- /Crypto Converter ⚡ Widget -->';
        return $output . $widget_dev;
    }

    public function CCW_plugin_action_links($links, $file)
    {
        if ($file == plugin_basename(CCW_PATH . '/widget_init.php')) {
            $links[] = '<a href="' . admin_url('admin.php?page=' . CCW_PLUGIN_SLUG) . '">' . esc_html__('Settings', 'crypto-converter-widget') . '</a>';
        }

        return $links;
    }

    /**
     * Add options page.
     */
    public function CCW_add_plugin_page()
    {
        add_options_page(
            'Settings Admin',
            '⚡ Crypto Converter',
            'manage_options',
            CCW_PLUGIN_SLUG,
            [$this, 'CCW_admin_settins_page']
        );
    }

    public function CCW_admin_settins_scripts()
    {
        wp_register_script('CCW-select2', CCW_URL . 'assets/select2/js/select2.min.js', ['jquery-core'], '4.0.13', true);
        wp_enqueue_script('CCW-select2');
        wp_enqueue_script('wp-color-picker');
    }

    public function CCW_public_script()
    {
        wp_register_script('CCW-crypto-converter-widget', CCW_URL . 'assets/public/crypto-converter-widget.js', [], '1.5.2', array(
            'in_footer' => true,
            'strategy' => 'async',
        ));
        wp_enqueue_script('CCW-crypto-converter-widget');
    }

    public function CCW_admin_settins_styles()
    {
        wp_register_style('CCW-admin-style', CCW_URL . 'assets/admin/css/style.css', null, '1.0.0', 'all');
        wp_register_style('CCW-select2', CCW_URL . 'assets/select2/css/select2.min.css', null, '4.0.13', 'all');
        wp_enqueue_style('CCW-select2');
        wp_enqueue_style('CCW-admin-style');
        wp_enqueue_style('wp-color-picker');
    }

    public function CCW_admin_settins_page()
    {
        require_once CCW_PATH . 'includes/ccw-admin-settings.php';
    }
}

function CCW_load_plugin_textdomain()
{
    load_plugin_textdomain('crypto-converter-widget', false, basename(dirname(__FILE__)) . '/languages/');
}

function CCW_block_register_block()
{
    wp_register_script(
        'crypto-converter-widget-block-editor-script',
        plugins_url('block.js', __FILE__),
        ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'],
        filemtime(plugin_dir_path(__FILE__) . 'block.js'),
        true
    );
    wp_localize_script('crypto-converter-widget-block-editor-script', 'blockData', [
        'locale' => get_locale(),
        'i18n' => [
            'amount' => esc_html__('Amount', 'crypto-converter-widget'),
            'title' => esc_html__('Crypto Converter ⚡ Widget', 'crypto-converter-widget'),
            'description' => esc_html__('A simple block for displaying Crypto Converter ⚡ Widget.', 'crypto-converter-widget'),
            'container' => esc_html__('Container', 'crypto-converter-widget'),
            'shadow' => esc_html__('Shadow', 'crypto-converter-widget'),
            'decimalPlaces' => esc_html__('Decimal Places', 'crypto-converter-widget'),
            'backgroundColor' => esc_html__('Background Color', 'crypto-converter-widget'),
            'color' => esc_html__('Color', 'crypto-converter-widget'),
            'borderRadius' => esc_html__('Border Radius', 'crypto-converter-widget'),
            'options' => esc_html__('Options', 'crypto-converter-widget'),
            'display' => esc_html__('Display', 'crypto-converter-widget'),
            'fiat' => esc_html__('Fiat money', 'crypto-converter-widget'),
            'symbol' => esc_html__('Fiat symbol', 'crypto-converter-widget'),
            'fontFamily' => esc_html__('Font Family', 'crypto-converter-widget'),
            'about' => esc_html__('About', 'crypto-converter-widget'),
            'ratePlugin' => esc_html__('❤️ Rate plugin ★★★★★', 'crypto-converter-widget'),
            'widget' => esc_html__('Widget', 'crypto-converter-widget'),
            'demoPlugin' => esc_html__('DEMO 👀', 'crypto-converter-widget'),
            'none' => esc_html__('None', 'crypto-converter-widget'),
            'converter' => esc_html__('Converter', 'crypto-converter-widget'),
            'crypto' => esc_html__('Crypto', 'crypto-converter-widget'),
            'live' => esc_html__('Live', 'crypto-converter-widget'),
            'clearColors' => esc_html__('Clear Colors', 'crypto-converter-widget'),
        ],
    ]);

    register_block_type('crypto-converter-widget-block/widget-block', [
        'editor_script' => 'crypto-converter-widget-block-editor-script',
        'script' => 'crypto-converter-widget-script',
    ]);
}

add_action('init', 'CCW_block_register_block');
add_action('plugins_loaded', 'CCW_load_plugin_textdomain');

$GLOBALS['CCW_crypto_converter_widget'] = CCW_crypto_converter_widget::get_instance();
