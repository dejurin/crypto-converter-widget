<?php

/**
 * @version 3.0.5
 */

/*
Plugin Name: Crypto Converter ⚡ Widget
Plugin URI: https://co-w.io/
Description: The Crypto Converter Widget for WordPress is a secure, fast, and intuitive plugin that instantly turns your website into a real-time cryptocurrency and fiat currency converter. Offering seamless integration without API keys or complicated setup, this powerful tool supports over 3,313 cryptocurrencies, 170 fiat currencies, tokens, blockchains, and commodities—all with elegant styling, dark-theme compatibility, and built-in caching to keep your site lightning-fast.
Version: 3.0.5
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
define('CCW_VERSION', '3.0.5');
define('CCW_PATH', plugin_dir_path(__FILE__));
define('CCW_URL', plugin_dir_url(__FILE__));
define('CCW_PLUGIN_SLUG', 'crypto-converter-widget');


class CCW_crypto_converter_widget
{
    protected static $_instance = null;

    protected $gradients;
    protected $assets;
    protected $locales;
    protected $allowed_attr = [
        'base', 'quote', 'amount', 'decimal', 'theme',
        'locale', 'tax', 'background', 'background-color', 
        'rounded', 'shadow', 'symbol', 'stat', 'border'
    ];

    public static function get_instance()
    {
        if (!self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public function __construct()
    {
        $this->gradients = $this->CCW_load_json_file( CCW_PATH . 'assets/public/gradient.json' );
        $this->assets    = $this->CCW_load_json_file( CCW_PATH . 'assets/public/assets.json' );

        $this->locales = [
            "en-US" => "English (US)",
            "en-GB" => "English (UK)",
            "en-CA" => "English (Canada)",
            "en-AU" => "English (Australia)",
            "fr-FR" => "Français (France)",
            "de-DE" => "Deutsch (Deutschland)",
            "es-ES" => "Español (España)",
            "it-IT" => "Italiano (Italia)",
            "ja-JP" => "日本語 (日本)",
            "zh-CN" => "简体中文 (中国)",
            "pl-PL" => "Polski (Polska)",
            "uk-UA" => "Українська (Україна)",
            "ru-RU" => "Русский (Россия)",
            "pt-BR" => "Português (Brasil)",
            "he-IL" => "עברית (ישראל)",
            "fa-IR" => "فارسی (ایران)",
            "ar-SA" => "العربية (السعودية)",
            "ar-EG" => "العربية (مصر)",
            "hi-IN" => "हिन्दी (भारत)",
            "ko-KR" => "한국어 (대한민국)",
            "nl-NL" => "Nederlands (Nederland)",
            "sv-SE" => "Svenska (Sverige)",
            "da-DK" => "Dansk (Danmark)",
            "fi-FI" => "Suomi (Suomi)",
            "ro-RO" => "Română (România)",
            "bg-BG" => "Български (България)",
            "th-TH" => "ไทย (ประเทศไทย)",
            "cs-CZ" => "čeština (Česká republika)",
            "tr-TR" => "Türkçe (Türkiye)",
            "es-MX" => "Español (México)",
        ];

        add_action( 'admin_init', function() {
            require_once CCW_PATH . 'includes/ccw-admin-notices.php';
            CCW_Admin_Notices::get_instance();
        } );
        add_action( 'admin_notices', [ $this, 'CCW_show_admin_notice' ], 5 );

        add_shortcode(CCW_PLUGIN_SLUG, [$this, 'CCW_shortcode']);
        add_action('init', [ $this, 'load_textdomain' ], 5);
        add_action('init', [ $this, 'CCW_block_register_block' ],      10 );
        add_action('admin_menu', [$this, 'CCW_add_plugin_page']);
        add_action('wp_enqueue_scripts', [$this, 'CCW_public_script']);
        add_action('admin_enqueue_scripts', [$this, 'CCW_admin_notify_scripts']);
        add_action('admin_enqueue_scripts', [$this, 'CCW_public_script']);
        add_action('admin_enqueue_scripts', [$this, 'CCW_admin_settins_scripts']);
        add_action('admin_enqueue_scripts', [$this, 'CCW_admin_settins_styles']);

        add_filter('plugin_action_links', [$this, 'CCW_plugin_action_links'], 10, 2);
    }

    public function load_textdomain() {
        load_plugin_textdomain(
            'crypto-converter-widget',
            false,
            dirname(plugin_basename(__FILE__)) . '/languages'
        );
    }

    public function CCW_show_admin_notice() {
        if ( file_exists( CCW_PATH . 'includes/ccw-admin-notices.php' ) ) {
            include_once CCW_PATH . 'includes/ccw-admin-notices.php';
            CCW_Admin_Notices::get_instance()
                ->info( __( 'Rate', 'crypto-converter-widget' ), 'rate' );
        }
    }

    function CCW_block_register_block()
    {
        wp_register_script(
            'crypto-converter-widget-block-editor-script',
            plugins_url('block.js', __FILE__),
            ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'],
            CCW_VERSION,
            true
        );

        wp_localize_script('crypto-converter-widget-block-editor-script', 'blockData', [
            'locale' => get_locale(),
            'gradients' => $this->gradients,
            'assets'    => $this->assets,
            'locales'   => $this->locales,
            'i18n' => [
                'amount' => esc_html__('Amount', 'crypto-converter-widget'),
                'title' => esc_html__('Crypto Converter ⚡ Widget', 'crypto-converter-widget'),
                'description' => esc_html__('A simple block for displaying Crypto Converter ⚡ Widget.', 'crypto-converter-widget'),
                'container' => esc_html__('Container', 'crypto-converter-widget'),
                'shadow' => esc_html__('Shadow', 'crypto-converter-widget'),
                'decimalPlaces' => esc_html__('Decimal Places', 'crypto-converter-widget'),
                'backgroundColor' => esc_html__('Background Color', 'crypto-converter-widget'),
                'style' => esc_html__('Style', 'crypto-converter-widget'),
                'color' => esc_html__('Color', 'crypto-converter-widget'),
                'border' => esc_html__('Border', 'crypto-converter-widget'),
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
                'locale' => esc_html__('Locale', 'crypto-converter-widget'),
                'rounded' => esc_html__('Rounded', 'crypto-converter-widget'),
                'stat' => esc_html__('Stats', 'crypto-converter-widget'),
                'base' => esc_html__('Base', 'crypto-converter-widget'),
                'quote' => esc_html__('Quote', 'crypto-converter-widget'),
                'tax' => esc_html__('Tax/Fee', 'crypto-converter-widget'),
                'theme' => esc_html__('Theme', 'crypto-converter-widget'),
                'gradient' => esc_html__('Gradient', 'crypto-converter-widget'),
                'degrees' => esc_html__('Degrees', 'crypto-converter-widget'),
            ],
        ]);

        register_block_type('crypto-converter-widget-block/widget-block', [
            'editor_script' => 'crypto-converter-widget-block-editor-script',
            'script' => 'crypto-converter-widget-script',
        ]);
    }

    function CCW_admin_notify_scripts() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        $script_path = plugin_dir_path(__FILE__) . 'assets/admin/js/ccw-notify.js';
        wp_enqueue_script('crypto-converter-widget-script', plugin_dir_url(__FILE__) . 'assets/admin/js/ccw-notify.js', ['jquery'], CCW_VERSION, true);
        wp_localize_script('crypto-converter-widget-script', 'cryptoConverterWidgetAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('crypto-converter-widget-nonce')
        ));
    }

    public function CCW_shortcode( $attr ) {
        $output = '<!-- Crypto Converter ⚡ Widget -->';
        $output .= '<crypto-converter-widget ';
        if ( is_array( $attr ) ) {
            foreach ( $attr as $key => $value ) {
                if ( in_array( $key, $this->allowed_attr, true ) ) {
                    // sanitize & escape each value
                    $sanitized = sanitize_text_field( $value );
                    $escaped   = esc_attr( $sanitized );
                    $output   .= sprintf( '%s="%s" ', $key, $escaped );
                }
            }
        }
        $output = rtrim( $output ) . '></crypto-converter-widget>';
    
        $style      = esc_attr( 'margin-top:0;margin-bottom:0' );
        $source_txt = esc_html__( 'Source:', 'crypto-converter-widget' );
        $url        = esc_url( 'https://currencyrate.today/' );
        $link_txt   = esc_html( 'CurrencyRate', 'crypto-converter-widget' );
    
        $widget_dev = sprintf(
            '<div style="%1$s">%2$s <a href="%3$s" target="_blank" rel="noopener noreferrer">%4$s</a></div>',
            $style, $source_txt, $url, $link_txt
        );
    
        // Разрешённые теги, чтобы сохранить <crypto-converter-widget>
        $allowed = [
            'crypto-converter-widget' => array_fill_keys( $this->allowed_attr, [] ),
            'div'                     => [ 'style' => [] ],
            'a'                       => [ 'href' => [], 'target' => [], 'rel' => [] ],
        ];
    
        return wp_kses( $output . $widget_dev, $allowed );
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
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        wp_register_script('CCW-select2', CCW_URL . 'assets/select2/js/select2.min.js', ['jquery'], '4.0.13', true);
        wp_enqueue_script('CCW-select2');
        wp_enqueue_script('wp-color-picker');
        wp_enqueue_script(
            'CCW-settings',
            CCW_URL . 'assets/admin/js/ccw-settings.js',
            ['jquery', 'CCW-select2'],
            CCW_VERSION,
            true
        );

        wp_localize_script('CCW-settings', 'ccwData', [
            'gradients'     => $this->gradients,
            'assets'        => $this->assets,
            'locales'       => $this->locales,
            'allowed_attr'  => $this->allowed_attr,
            'ajaxUrl'       => admin_url('admin-ajax.php'),
            'nonce'         => wp_create_nonce('crypto-converter-settings-nonce'),
        ]);
    }

    public function CCW_public_script()
    {
        wp_register_script('CCW-crypto-converter-widget', CCW_URL . 'assets/public/crypto-converter-widget.js', [], CCW_VERSION, array(
            'in_footer' => true,
            'strategy' => 'async',
        ));
        wp_enqueue_script('CCW-crypto-converter-widget');
    }

    public function CCW_admin_settins_styles()
    {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        wp_register_style('CCW-admin-style', CCW_URL . 'assets/admin/css/style.css', null, '1.0.0', 'all');
        wp_register_style('CCW-select2', CCW_URL . 'assets/select2/css/select2.min.css', null, '4.0.13', 'all');
        wp_enqueue_style('CCW-select2');
        wp_enqueue_style('CCW-admin-style');
        wp_enqueue_style('wp-color-picker');
    }

    public function CCW_admin_settins_page()
    {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        $locales = $this->locales;
        require_once CCW_PATH . 'includes/ccw-admin-settings.php';
    }

    private function CCW_load_json_file( $file ) {
        if ( ! file_exists( $file ) ) {
            // error_log( "CCW: JSON file not found — {$file}" );
            return [];
        }

        $raw = file_get_contents( $file );
        if ( false === $raw ) {
            // error_log( "CCW: Failed to read file — {$file}" );
            return [];
        }

        $data = json_decode( $raw, true );
        if ( JSON_ERROR_NONE !== json_last_error() || ! is_array( $data ) ) {
            // error_log( sprintf(
            //     'CCW: JSON decode error in %s — %s',
            //     $file,
            //     json_last_error_msg()
            // ) );
            return [];
        }

        return $data;
    }
}

add_action('plugins_loaded', [ 'CCW_Crypto_Converter_Widget', 'get_instance' ]);
