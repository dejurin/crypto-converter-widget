<?php

/**
 * @version 3.1.1
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly
?>
<div class="wrap" id="ccw-admin-settings">
   <h1 class="wp-heading-inline"><?php echo esc_html(CCW_NAME); ?></h1>
   <div class="ccw-row">
      <div class="col-12 col-lg-6">
         <h2><?php esc_html_e('Settings', 'crypto-converter-widget');?></h2>
         <form id="widget-settings">
            <?php wp_nonce_field('crypto-converter-settings-nonce', 'crypto_converter_settings_nonce'); ?>
            <table class="form-table">
                <tbody>
                <tr>
                    <th scope="ccw-row">
                        <label for="base"><?php esc_html_e('Base', 'crypto-converter-widget');?> (<a href="https://github.com/dejurin/crypto-converter-widget/blob/master/list.md" target="_blank"><?php esc_html_e('Crypto ID list', 'crypto-converter-widget');?></a>)</label>
                    </th>
                    <td>
                        <select id="base" name="base">
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                        <label for="quote"><?php esc_html_e('Quote', 'crypto-converter-widget');?></label>
                    </th>
                    <td>
                        <select id="quote" name="quote">
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                        <label for="amount"><?php esc_html_e('Amount', 'crypto-converter-widget');?></label>
                    </th>
                    <td>
                        <input id="amount" name="amount" value="1" type="text">
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                        <label for="tax"><?php esc_html_e('Tax/Fee', 'crypto-converter-widget');?></label>
                    </th>
                    <td>
                        <input id="tax" name="tax" value="0" type="text">
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                        <label for="decimal">
                            <?php esc_html_e('Decimal places', 'crypto-converter-widget');?>
                            <small id="decimal-value">0</small>
                        </label>
                    </th>
                    <td>
                        <input type="range" name="decimal" id="decimal" min="0" max="8" value="4" step="1">
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                        <label for="locale"><?php esc_html_e('Locale', 'crypto-converter-widget');?></label>
                    </th>
                    <td>
                        <select name="locale" id="locale">
                            <option value="auto" selected><?php esc_html_e('Auto', 'crypto-converter-widget');?></option>
                            <?php foreach ($this->locales as $key => $value) { ?>
                                <option value="<?php echo esc_attr($key); ?>"><?php echo esc_html($value); ?></option>
                            <?php } ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                        <label for="theme"><?php esc_html_e('Theme', 'crypto-converter-widget');?></label>
                    </th>
                    <td>
                        <select name="theme" id="theme">
                            <option value="auto" selected><?php esc_html_e('Auto', 'crypto-converter-widget');?></option>
                            <option value="light"><?php esc_html_e('Light', 'crypto-converter-widget');?></option>
                            <option value="dark"><?php esc_html_e('Dark', 'crypto-converter-widget');?></option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                        <label for="gradient"><?php esc_html_e('Gradient', 'crypto-converter-widget');?></label>
                    </th>
                    <td>
                        <select id="gradient" name="gradient">
                        </select>
                        <input id="background" name="background" type="hidden">
                        <input id="random-gradient" type="button" name="random-gradient" class="button button-primary" value="<?php esc_html_e('Random gradient', 'crypto-converter-widget');?>">
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                        <label for="deg"><?php esc_html_e('Degrees', 'crypto-converter-widget');?>
                        <small id="deg-value">0</small></label>
                    </th>
                    <td>
                        <input type="range" name="deg" id="deg" min="0" max="360" value="120" step="1">
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                        <label for="background-color"><?php esc_html_e('Color', 'crypto-converter-widget');?></label>
                    </th>
                    <td>
                        <input id="background-color" name="background-color" type="text" value="#282a36" class="color-field">
                        <input type="button" name="random-color" class="button button-primary" value="<?php esc_html_e('Random color', 'crypto-converter-widget');?>">
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                    <?php esc_html_e('Options', 'crypto-converter-widget');?>
                    </th>
                    <td>
                        <div><label><input class="checkbox-options" name="rounded" value="true" type="checkbox" checked> <?php esc_html_e('Rounded', 'crypto-converter-widget');?></label></div>
                        <div><label><input class="checkbox-options" name="shadow" value="true" type="checkbox" checked> <?php esc_html_e('Shadow', 'crypto-converter-widget');?></label></div>
                        <div><label><input class="checkbox-options" name="symbol" value="true" type="checkbox"> <?php esc_html_e('Symbol', 'crypto-converter-widget');?> ($)</label></div>
                        <div><label><input class="checkbox-options" name="stat" value="true" type="checkbox"> <?php esc_html_e('Stats', 'crypto-converter-widget');?></label></div>
                        <div><label><input class="checkbox-options" name="border" value="true" type="checkbox" checked> <?php esc_html_e('Border', 'crypto-converter-widget');?></label></div>
                     </td>
                </tr>
                </tbody>
            </table>
         </form>
      </div>
      <div class="col-12 col-lg-6">
         <h2><?php esc_html_e('Preview', 'crypto-converter-widget');?></h2>
         <div style="width:380px">
            <crypto-converter-widget></crypto-converter-widget>
         </div>
      </div>
   </div>
   <hr>
   <div class="ccw-row">
    <div class="col-12 col-lg-6">
        <div>
            <h3><?php esc_html_e('Shortcode', 'crypto-converter-widget');?></h3>
                <?php wp_editor('', 'widget-shortcode', [
                    'wpautop' => 1,
                    'media_buttons' => 0,
                    'textarea_name' => '',
                    'textarea_rows' => 4,
                    'tabindex' => null,
                    'teeny' => 0,
                    'dfw' => 0,
                    'tinymce' => 0,
                    'quicktags' => 0,
                    'drag_drop_upload' => false,
                ]);?>
            <button class="copy-button" style="margin-top: 10px;float: right;" data-copy-target="widget-shortcode">
                <span class="dashicons dashicons-admin-page"></span>
            </button>
        </div>
        <div style="margin-top: 50px; display: none;">
            <h3><?php esc_html_e('HTML code', 'crypto-converter-widget');?></h3>
            <pre id="widget-htmlcode" style="border: 1px solid #ccc; padding: 10px; border-radius: 5px;overflow: auto;background-color: #fff;"></pre>
            <button class="copy-button" style="float: right" data-copy-target="widget-htmlcode">
                <span class="dashicons dashicons-admin-page"></span>
            </button>
        </div>
   </div>
      <div class="col-12 col-lg-auto">
        <h3><?php esc_html_e('Help', 'crypto-converter-widget');?></h3>
            <ul>   
                <li>Crypto Converter ⚡ Widget: <b>v<?php echo CCW_VERSION ;?></b></li>
                <li>ℹ️ <?php esc_html_e('Official website', 'crypto-converter-widget');?>: <a href="https://co-w.io/" target="_blank">CO-W.io</a> | <a href="https://github.com/dejurin/crypto-converter-widget" target="_blank">Github</a></li>
                <li>❓ <?php esc_html_e('Feel free, write if you will have any questions', 'crypto-converter-widget');?>: <a href="https://t.me/converter_support" target="_blank"><?php esc_html_e('Online support', 'crypto-converter-widget');?></a></li>
                <li>💰 <?php esc_html_e('Your might like it', 'crypto-converter-widget');?>: <a href="https://wordpress.org/plugins/cryptocurrency-price-widget/" target="_blank">Cryptocurrency Price Widget</a></li>
                <li>💹 <?php esc_html_e('Supported by', 'crypto-converter-widget');?>: <a href="https://currencyrate.today/" target="_blank">CurrencyRate</a></li>
            </ul>
      </div>
   </div>
</div>
