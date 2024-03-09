<?php

/**
 * @version 1.5.0
 */

/*
Plugin Name: Crypto Converter ⚡ Widget
Plugin URI: https://co-w.io/
Description: The Crypto Converter Widget — is a powerful and easy-to-use with beauty UI real-time web tool to conversion cryptocurrencies FOR ANY WEBSITES FREE without compromises and trial periods. Customers can choose from available ≈170 fiat currencies and ≈1,656 crypto. For FREE.
Version: 1.5.0
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


define('CCW_NAME', 'Crypto Converter Widget');
define('CCW_PATH', plugin_dir_path(__FILE__));
define('CCW_URL', plugin_dir_url(__FILE__));
define('CCW_PLUGIN_SLUG', 'crypto-converter-widget');

if(file_exists(plugin_dir_path(__FILE__) . 'includes/ccw-admin-notices.php')) {
    include('includes/ccw-admin-notices.php');

    $admin_notice = CCW_Admin_Notices::get_instance();
    $admin_notice->info('Rate', 'rate');
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
        add_action('admin_enqueue_scripts', [$this, 'CCW_admin_settins_scripts']);
        add_action('admin_enqueue_scripts', [$this, 'CCW_admin_settins_styles']);
        add_filter('plugin_action_links', [$this, 'CCW_plugin_action_links'], 10, 2);
    }

    public function CCW_shortcode($attr)
    {
        $js_object = '';
        $output = '<!-- Crypto Converter ⚡ Widget --><crypto-converter-widget ';
        $signature = (boolval($attr['signature'])) ? true : false;
        unset($attr['signature']);

        foreach ($attr as $key => $value) {
            $js_object .= $key.'="'.$value.'" ';
        }

        $js_object = substr($js_object, 0, -1);

        $output .= $js_object;
        return $output.'></crypto-converter-widget>'
            .'<script async src="https://cdn.jsdelivr.net/gh/dejurin/crypto-converter-widget/dist/latest.min.js"></script>'
            .(($signature) ? '<a href="https://co-w.io/" rel="noopener" target="_blank">Crypto Converter</a>' : '')
            .'<!-- /Crypto Converter ⚡ Widget -->';
    }

    public function CCW_plugin_action_links($links, $file)
    {
        if ($file == plugin_basename(CCW_PATH.'/widget_init.php')) {
            $links[] = '<a href="'.admin_url('admin.php?page='.CCW_PLUGIN_SLUG).'">'.__('Settings', 'crypto-converter-widget').'</a>';
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
        wp_register_script('CCW-select2', CCW_URL.'assets/select2/js/select2.min.js', ['jquery-core'], '4.0.13', true);
        wp_enqueue_script('CCW-select2');
        wp_enqueue_script('wp-color-picker');
    }

    public function CCW_admin_settins_styles()
    {
        wp_register_style('CCW-admin-style', CCW_URL.'assets/admin/css/style.css', null, '1.0.0', 'all');
        wp_register_style('CCW-select2', CCW_URL.'assets/select2/css/select2.min.css', null, '4.0.13', 'all');
        wp_enqueue_style('CCW-select2');
        wp_enqueue_style('CCW-admin-style');
        wp_enqueue_style('wp-color-picker');

    }

    public function CCW_admin_settins_page()
    {
        require_once CCW_PATH.'includes/ccw-admin-settings.php';
    }
}

function CCW_load_plugin_textdomain()
{
    load_plugin_textdomain('crypto-converter-widget', false, basename(dirname(__FILE__)).'/languages/');
}
add_action('plugins_loaded', 'CCW_load_plugin_textdomain');

$GLOBALS['CCW_crypto_converter_widget'] = CCW_crypto_converter_widget::get_instance();
