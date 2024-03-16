<?php
/**
 * @version 2.2.2
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly
?>
<div class="wrap">
   <h1 class="wp-heading-inline"><?php echo esc_html(CCW_NAME); ?></h1>
   <div class="ccw-row">
      <div class="col-12 col-lg-6">
         <h2><?php esc_html_e('Settings', 'crypto-converter-widget');?></h2>
         <form id="widget-settings">
            <table class="form-table">
                <tbody>
                <tr>
                    <th scope="ccw-row">
                        <label for="crypto"><?php esc_html_e('Crypto', 'crypto-converter-widget');?> (<a href="https://github.com/dejurin/crypto-converter-widget/blob/master/list.md" target="_blank"><?php esc_html_e('Crypto ID list', 'crypto-converter-widget');?></a>)</label>
                    </th>
                    <td>
                        <select id="crypto" name="crypto">
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                        <label for="fiat"><?php esc_html_e('Fiat', 'crypto-converter-widget');?></label>
                    </th>
                    <td>
                        <select id="fiat" name="fiat"></select>
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
                        <label for="decimal-places"><?php esc_html_e('Decimal places', 'crypto-converter-widget');?></label>
                    </th>
                    <td>
                        <input type="number" min="0" max="7" value="2" id="decimal-places" name="decimal-places">
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                        <label for="font-family"><?php esc_html_e('Font', 'crypto-converter-widget');?></label>
                    </th>
                    <td>
                        <select name="font-family" id="font-family">
                            <option value="inherit" selected>inherit</option>
                            <option value="sans-serif">sans-serif</option>
                            <option value="serif">serif</option>
                            <option value="cursive">cursive</option>
                            <option value="fantasy">fantasy</option>
                            <option value="monospace">monospace</option>
                        </select>
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
                        <label for="border-radius"><?php esc_html_e('Border radius', 'crypto-converter-widget');?></label>
                    </th>
                    <td>
                        <label>
                            <input type="range" name="border-radius" id="border-radius" min="0" max="100" value="10" step="1">
                            <small id="border-radius-value">(0.30rem)</small>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="ccw-row">
                        <label><?php esc_html_e('Options', 'crypto-converter-widget');?></label>
                    </th>
                    <td>
                        <div><label><input class="checkbox-options" name="shadow" value="true" type="checkbox" checked> <?php esc_html_e('Shadow', 'crypto-converter-widget');?></label></div>
                        <div><label><input class="checkbox-options" name="symbol" value="true" type="checkbox" checked> <?php esc_html_e('Fiat symbol', 'crypto-converter-widget');?> ($)</label></div>
                        <div><label><input class="checkbox-options" name="live" value="true" type="checkbox" checked> ⚡ <?php esc_html_e('Live', 'crypto-converter-widget');?> <small>(<?php esc_html_e('price updates in real-time', 'crypto-converter-widget');?>)</small></label></div>
                        <!-- <div><label><input class="checkbox-signature" name="signature" value="true" type="checkbox" checked> <?php esc_html_e('Signature', 'crypto-converter-widget');?></label></div> -->
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
      </div>
      <div class="col-12 col-lg-auto">
        <h3><?php esc_html_e('Help', 'crypto-converter-widget');?></h3>
            <ul>
                <li>ℹ️ <?php esc_html_e('Official website', 'crypto-converter-widget');?>: <a href="https://co-w.io/" target="_blank">CO-W.io</a> | <a href="https://github.com/dejurin/crypto-converter-widget" target="_blank">Github</a></li>
                <li>❓ <?php esc_html_e('Feel free, write if you will have any questions', 'crypto-converter-widget');?>: <a href="https://t.me/converter_support" target="_blank"><?php esc_html_e('Online support', 'crypto-converter-widget');?></a></li>
                <li>💰 <?php esc_html_e('Your might like it', 'crypto-converter-widget');?>: <a href="https://wordpress.org/plugins/cryptocurrency-price-widget/" target="_blank">Cryptocurrency Price Widget</a></li>
                <li>💹 <?php esc_html_e('Supported by', 'crypto-converter-widget');?>: <a href="https://currencyrate.today/" target="_blank">CurrencyRate</a></li>
                <li>💵 <?php esc_html_e('Fiat money', 'crypto-converter-widget');?>: <a href="https://moneyconvert.net/" target="_blank">MoneyConvert.net</a></li>
            </ul>
      </div>
   </div>
</div>
<script>
    jQuery(document).ready(function() {
        jQuery.fn.removeAttributes = function() {
            return this.each(function() {
                var attributes = jQuery.map(this.attributes, function(item) {
                    return item.name;
                });
                var img = jQuery(this);
                jQuery.each(attributes, function(i, item) {
                    img.removeAttr(item);
                });
            });
        }

        jQuery('input[name="random-color"]').on('click', function() {
            var newColor = getRandomColor();
            jQuery('input[name="background-color"]').val(newColor);
            ws();
        });
        jQuery('input[class="checkbox-options"]').on('change', function() {
            ws();
        });
        jQuery('input[name="decimal-places"], input[name="amount"]').on('input', function() {
            ws();
        });
        jQuery('input[name="border-radius"]').on('input', function() {
            var val = ((3 / 100) * this.value).toFixed(2);
            var valRem = val + 'rem';
            jQuery('#border-radius-value').text('(' + valRem + ')');
            ws();
        });
        jQuery('select[name="font-family"]').on('change', function() {
            ws();
        });
        jQuery('.color-field').wpColorPicker({
            defaultColor: !1,
            change: function(t, e) {
                jQuery('input[name="background-color"]').val(jQuery(this).iris("color", !0).toCSS("hex"));
                ws();
            },
            clear: function() {},
            hide: !0,
            palettes: ["#383a59", "#414770", "#4D5382", "#0000FF", "#007BFF", "#6610F2", "#5F00BA", "#6F42C1", "#E83E8C", "#DC3545", "#FD7E14", "#FFC107",
                "#28A745", "#20C997", "#17A2B8", "#6C757D", "#343A40", "#F8F9FA", "#343A40",
                "#FFFFFF", "#333333"
            ]
        });
        jQuery('select[name="crypto"]').select2({
            ajax: {
                url: 'https://api.coincap.io/v2/assets',
                dataType: 'json',
                delay: 250,
                cache: true,
                data: function (params) {
                    return {
                        search: params.term
                    };
                },
                processResults: function (response, params) {
                    return {
                        results: response.data
                    };
                },
            },
            placeholder: 'BTC',
            width: "100%",
            templateResult: function(data) {
                return data.symbol;
            },
            templateSelection: function(e) {
                ws();
                return e.text || e.symbol
            }
        });
        jQuery('select[name="fiat"]').select2({
            placeholder: 'USD',
            width: "100%",
            data: [{"id":"bitcoin","text":"BTC"},{"id":"surinamese-dollar","text":"SRD"},{"id":"rwandan-franc","text":"RWF"},{"id":"afghan-afghani","text":"AFN"},{"id":"barbadian-dollar","text":"BBD"},{"id":"dogecoin","text":"DOGE"},{"id":"thai-baht","text":"THB"},{"id":"cfa-franc-beac","text":"XAF"},{"id":"seychellois-rupee","text":"SCR"},{"id":"argentine-peso","text":"ARS"},{"id":"myanma-kyat","text":"MMK"},{"id":"platinum-ounce","text":"XPT"},{"id":"swiss-franc","text":"CHF"},{"id":"zcash","text":"ZEC"},{"id":"lesotho-loti","text":"LSL"},{"id":"cayman-islands-dollar","text":"KYD"},{"id":"ugandan-shilling","text":"UGX"},{"id":"brunei-dollar","text":"BND"},{"id":"laotian-kip","text":"LAK"},{"id":"sri-lankan-rupee","text":"LKR"},{"id":"venezuelan-bolívar-fuerte","text":"VEF"},{"id":"namibian-dollar","text":"NAD"},{"id":"papua-new-guinean-kina","text":"PGK"},{"id":"kenyan-shilling","text":"KES"},{"id":"brazilian-real","text":"BRL"},{"id":"tether","text":"USDT"},{"id":"tanzanian-shilling","text":"TZS"},{"id":"eos","text":"EOS"},{"id":"qtum","text":"QTUM"},{"id":"comorian-franc","text":"KMF"},{"id":"guernsey-pound","text":"GGP"},{"id":"tunisian-dinar","text":"TND"},{"id":"qatari-rial","text":"QAR"},{"id":"azerbaijani-manat","text":"AZN"},{"id":"litecoin","text":"LTC"},{"id":"colombian-peso","text":"COP"},{"id":"sudanese-pound","text":"SDG"},{"id":"turkmenistani-manat","text":"TMT"},{"id":"honduran-lempira","text":"HNL"},{"id":"botswanan-pula","text":"BWP"},{"id":"indonesian-rupiah","text":"IDR"},{"id":"chinese-yuan-(offshore)","text":"CNH"},{"id":"nigerian-naira","text":"NGN"},{"id":"british-pound-sterling","text":"GBP"},{"id":"czech-republic-koruna","text":"CZK"},{"id":"yemeni-rial","text":"YER"},{"id":"maldivian-rufiyaa","text":"MVR"},{"id":"jersey-pound","text":"JEP"},{"id":"cfa-franc-bceao","text":"XOF"},{"id":"egyptian-pound","text":"EGP"},{"id":"kuwaiti-dinar","text":"KWD"},{"id":"canadian-dollar","text":"CAD"},{"id":"guinean-franc","text":"GNF"},{"id":"usd-coin","text":"USDC"},{"id":"swedish-krona","text":"SEK"},{"id":"polish-zloty","text":"PLN"},{"id":"macedonian-denar","text":"MKD"},{"id":"south-african-rand","text":"ZAR"},{"id":"liberian-dollar","text":"LRD"},{"id":"nepalese-rupee","text":"NPR"},{"id":"euro","text":"EUR"},{"id":"silver-ounce","text":"XAG"},{"id":"hungarian-forint","text":"HUF"},{"id":"netherlands-antillean-guilder","text":"ANG"},{"id":"iraqi-dinar","text":"IQD"},{"id":"congolese-franc","text":"CDF"},{"id":"zimbabwean-dollar","text":"ZWL"},{"id":"united-arab-emirates-dirham","text":"AED"},{"id":"cambodian-riel","text":"KHR"},{"id":"nicaraguan-córdoba","text":"NIO"},{"id":"falkland-islands-pound","text":"FKP"},{"id":"georgian-lari","text":"GEL"},{"id":"haitian-gourde","text":"HTG"},{"id":"jordanian-dinar","text":"JOD"},{"id":"guatemalan-quetzal","text":"GTQ"},{"id":"ukrainian-hryvnia","text":"UAH"},{"id":"bangladeshi-taka","text":"BDT"},{"id":"são-tomé-and-príncipe-dobra","text":"STN"},{"id":"ethiopian-birr","text":"ETB"},{"id":"new-zealand-dollar","text":"NZD"},{"id":"jamaican-dollar","text":"JMD"},{"id":"hong-kong-dollar","text":"HKD"},{"id":"russian-ruble","text":"RUB"},{"id":"east-caribbean-dollar","text":"XCD"},{"id":"djiboutian-franc","text":"DJF"},{"id":"sierra-leonean-leone","text":"SLL"},{"id":"dash","text":"DASH"},{"id":"burundian-franc","text":"BIF"},{"id":"kyrgystani-som","text":"KGS"},{"id":"venezuelan-bolívar-soberano","text":"VES"},{"id":"iranian-rial","text":"IRR"},{"id":"malaysian-ringgit","text":"MYR"},{"id":"vietnamese-dong","text":"VND"},{"id":"dominican-peso","text":"DOP"},{"id":"chilean-unit-of-account-(uf)","text":"CLF"},{"id":"gold-ounce","text":"XAU"},{"id":"moldovan-leu","text":"MDL"},{"id":"bulgarian-lev","text":"BGN"},{"id":"israeli-new-sheqel","text":"ILS"},{"id":"samoan-tala","text":"WST"},{"id":"zambian-kwacha","text":"ZMW"},{"id":"cape-verdean-escudo","text":"CVE"},{"id":"moroccan-dirham","text":"MAD"},{"id":"gambian-dalasi","text":"GMD"},{"id":"eritrean-nakfa","text":"ERN"},{"id":"bhutanese-ngultrum","text":"BTN"},{"id":"solomon-islands-dollar","text":"SBD"},{"id":"turkish-lira","text":"TRY"},{"id":"paraguayan-guarani","text":"PYG"},{"id":"guyanaese-dollar","text":"GYD"},{"id":"cuban-peso","text":"CUP"},{"id":"uruguayan-peso","text":"UYU"},{"id":"mongolian-tugrik","text":"MNT"},{"id":"south-korean-won","text":"KRW"},{"id":"croatian-kuna","text":"HRK"},{"id":"malawian-kwacha","text":"MWK"},{"id":"serbian-dinar","text":"RSD"},{"id":"saint-helena-pound","text":"SHP"},{"id":"special-drawing-rights","text":"XDR"},{"id":"multi-collateral-dai","text":"DAI"},{"id":"angolan-kwanza","text":"AOA"},{"id":"waves","text":"WAVES"},{"id":"peruvian-nuevo-sol","text":"PEN"},{"id":"bolivian-boliviano","text":"BOB"},{"id":"kazakhstani-tenge","text":"KZT"},{"id":"norwegian-krone","text":"NOK"},{"id":"danish-krone","text":"DKK"},{"id":"philippine-peso","text":"PHP"},{"id":"indian-rupee","text":"INR"},{"id":"malagasy-ariary","text":"MGA"},{"id":"ghanaian-cedi","text":"GHS"},{"id":"belarusian-ruble","text":"BYN"},{"id":"new-taiwan-dollar","text":"TWD"},{"id":"uzbekistan-som","text":"UZS"},{"id":"palladium-ounce","text":"XPD"},{"id":"fijian-dollar","text":"FJD"},{"id":"gibraltar-pound","text":"GIP"},{"id":"manx-pound","text":"IMP"},{"id":"japanese-yen","text":"JPY"},{"id":"ethereum","text":"ETH"},{"id":"panamanian-balboa","text":"PAB"},{"id":"chilean-peso","text":"CLP"},{"id":"somali-shilling","text":"SOS"},{"id":"cuban-convertible-peso","text":"CUC"},{"id":"armenian-dram","text":"AMD"},{"id":"binance-coin","text":"BNB"},{"id":"trinidad-and-tobago-dollar","text":"TTD"},{"id":"são-tomé-and-príncipe-dobra-(pre-2018)","text":"STD"},{"id":"algerian-dinar","text":"DZD"},{"id":"costa-rican-colón","text":"CRC"},{"id":"husd","text":"HUSD"},{"id":"bermudan-dollar","text":"BMD"},{"id":"bahraini-dinar","text":"BHD"},{"id":"mauritanian-ouguiya","text":"MRU"},{"id":"swazi-lilangeni","text":"SZL"},{"id":"united-states-dollar","text":"USD", },{"id":"omani-rial","text":"OMR"},{"id":"australian-dollar","text":"AUD"},{"id":"romanian-leu","text":"RON"},{"id":"syrian-pound","text":"SYP"},{"id":"belize-dollar","text":"BZD"},{"id":"chinese-yuan-renminbi","text":"CNY"},{"id":"mauritanian-ouguiya-(pre-2018)","text":"MRO"},{"id":"saudi-riyal","text":"SAR"},{"id":"aruban-florin","text":"AWG"},{"id":"icelandic-króna","text":"ISK"},{"id":"salvadoran-colón","text":"SVC"},{"id":"lebanese-pound","text":"LBP"},{"id":"libyan-dinar","text":"LYD"},{"id":"tajikistani-somoni","text":"TJS"},{"id":"mexican-peso","text":"MXN"},{"id":"pakistani-rupee","text":"PKR"},{"id":"south-sudanese-pound","text":"SSP"},{"id":"vanuatu-vatu","text":"VUV"},{"id":"mozambican-metical","text":"MZN"},{"id":"macanese-pataca","text":"MOP"},{"id":"north-korean-won","text":"KPW"},{"id":"bosnia-herzegovina-convertible-mark","text":"BAM"},{"id":"bitcoin-cash","text":"BCH"},{"id":"mauritian-rupee","text":"MUR"},{"id":"cfp-franc","text":"XPF"},{"id":"singapore-dollar","text":"SGD"}],
            templateSelection: function(e) {
                ws();
                return e.text
            }
        }).val('united-states-dollar').trigger('change');

        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        function ws() {
            var serializeData = jQuery("form#widget-settings").serializeArray();
            jQuery('crypto-converter-widget').removeAttributes();
            var shortCode = '[crypto-converter-widget ';
            for(val in serializeData) {
                var attrValue = serializeData[val].value

                if (serializeData[val].name === 'live' || serializeData[val].name === 'shadow') {
                    attrValue = true;
                } else if (serializeData[val].name === 'border-radius') {
                    var _val = ((3 / 100) * parseInt(serializeData[val].value));
                    var attrValue = _val.toFixed(2) + 'rem';
                }

                if (serializeData[val] !== undefined) {
                    if (serializeData[val].name !== 'signature') {
                        jQuery('crypto-converter-widget').attr(serializeData[val].name, attrValue);
                    }
                    var y = serializeData[val].name + '="' + attrValue + '" ';
                }
                shortCode += y;
            }
            htmlCode = '&lt;' + (shortCode.substring(1)).substring(0, shortCode.length - 2) + '></crypto-converter-widget>'
            htmlCode += "&lt;script async src=&quot;https://cdn.jsdelivr.net/gh/dejurin/crypto-converter-widget@1.5.2/dist/latest.min.js&quot;&gt;&lt;/script&gt;'";
            shortCode = shortCode.substring(0, shortCode.length - 1) + ']'
            jQuery('#widget-shortcode').val(shortCode);
            jQuery('#widget-htmlcode').val(htmlCode);
        }
        ws();
    });
</script>