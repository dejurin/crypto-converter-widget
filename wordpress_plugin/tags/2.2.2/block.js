/**
 * @version 2.2.2
 * @since 2.0.0
 */
(function (blocks, editor, element, components) {
  const { locale, i18n } = blockData;

  var fiatOptions = [
    {
      value: "united-states-dollar",
      label: "USD",
    },
    {
      value: "bitcoin",
      label: "Bitcoin",
    },
    {
      value: "ethereum",
      label: "Ethereum",
    },
    {
      value: "tether",
      label: "Tether",
    },
    {
      value: "mauritanian-ouguiya",
      label: "MRU",
    },
    {
      value: "surinamese-dollar",
      label: "SRD",
    },
    {
      value: "malagasy-ariary",
      label: "MGA",
    },
    {
      value: "qatari-rial",
      label: "QAR",
    },
    {
      value: "barbadian-dollar",
      label: "BBD",
    },
    {
      value: "cuban-convertible-peso",
      label: "CUC",
    },
    {
      value: "united-arab-emirates-dirham",
      label: "AED",
    },
    {
      value: "turkmenistani-manat",
      label: "TMT",
    },
    {
      value: "moroccan-dirham",
      label: "MAD",
    },
    {
      value: "dash",
      label: "DASH",
    },
    {
      value: "kenyan-shilling",
      label: "KES",
    },
    {
      value: "samoan-tala",
      label: "WST",
    },
    {
      value: "trinidad-and-tobago-dollar",
      label: "TTD",
    },
    {
      value: "solomon-islands-dollar",
      label: "SBD",
    },
    {
      value: "cfa-franc-bceao",
      label: "XOF",
    },
    {
      value: "comorian-franc",
      label: "KMF",
    },
    {
      value: "silver-ounce",
      label: "XAG",
    },
    {
      value: "venezuelan-bolГ­var-fuerte",
      label: "VEF",
    },
    {
      value: "mongolian-tugrik",
      label: "MNT",
    },
    {
      value: "zcash",
      label: "ZEC",
    },
    {
      value: "liberian-dollar",
      label: "LRD",
    },
    {
      value: "costa-rican-colГіn",
      label: "CRC",
    },
    {
      value: "nicaraguan-cГіrdoba",
      label: "NIO",
    },
    {
      value: "serbian-dinar",
      label: "RSD",
    },
    {
      value: "congolese-franc",
      label: "CDF",
    },
    {
      value: "waves",
      label: "WAVES",
    },
    {
      value: "euro",
      label: "EUR",
    },
    {
      value: "uruguayan-peso",
      label: "UYU",
    },
    {
      value: "macedonian-denar",
      label: "MKD",
    },
    {
      value: "croatian-kuna",
      label: "HRK",
    },
    {
      value: "cfa-franc-beac",
      label: "XAF",
    },
    {
      value: "azerbaijani-manat",
      label: "AZN",
    },
    {
      value: "saint-helena-pound",
      label: "SHP",
    },
    {
      value: "norwegian-krone",
      label: "NOK",
    },
    {
      value: "new-taiwan-dollar",
      label: "TWD",
    },
    {
      value: "peruvian-nuevo-sol",
      label: "PEN",
    },
    {
      value: "gibraltar-pound",
      label: "GIP",
    },
    {
      value: "manx-pound",
      label: "IMP",
    },
    {
      value: "maldivian-rufiyaa",
      label: "MVR",
    },
    {
      value: "namibian-dollar",
      label: "NAD",
    },
    {
      value: "usd-coin",
      label: "C",
    },
    {
      value: "iraqi-dinar",
      label: "IQD",
    },
    {
      value: "thai-baht",
      label: "THB",
    },
    {
      value: "syrian-pound",
      label: "SYP",
    },
    {
      value: "bolivian-boliviano",
      label: "BOB",
    },
    {
      value: "kyrgystani-som",
      label: "KGS",
    },
    {
      value: "vanuatu-vatu",
      label: "VUV",
    },
    {
      value: "gambian-dalasi",
      label: "GMD",
    },
    {
      value: "libyan-dinar",
      label: "LYD",
    },
    {
      value: "mexican-peso",
      label: "MXN",
    },
    {
      value: "zimbabwean-dollar",
      label: "ZWL",
    },
    {
      value: "swazi-lilangeni",
      label: "SZL",
    },
    {
      value: "jordanian-dinar",
      label: "JOD",
    },
    {
      value: "ethiopian-birr",
      label: "ETB",
    },
    {
      value: "malawian-kwacha",
      label: "MWK",
    },
    {
      value: "czech-republic-koruna",
      label: "CZK",
    },
    {
      value: "cambodian-riel",
      label: "KHR",
    },
    {
      value: "sri-lankan-rupee",
      label: "LKR",
    },
    {
      value: "sierra-leonean-leone",
      label: "SLL",
    },
    {
      value: "brazilian-real",
      label: "BRL",
    },
    {
      value: "east-caribbean-dollar",
      label: "XCD",
    },
    {
      value: "saudi-riyal",
      label: "SAR",
    },
    {
      value: "icelandic-krГіna",
      label: "ISK",
    },
    {
      value: "swedish-krona",
      label: "SEK",
    },
    {
      value: "venezuelan-bolГ­var-soberano",
      label: "VES",
    },
    {
      value: "brunei-dollar",
      label: "BND",
    },
    {
      value: "algerian-dinar",
      label: "DZD",
    },
    {
      value: "iranian-rial",
      label: "IRR",
    },
    {
      value: "laotian-kip",
      label: "LAK",
    },
    {
      value: "guatemalan-quetzal",
      label: "GTQ",
    },
    {
      value: "mauritian-rupee",
      label: "MUR",
    },
    {
      value: "paraguayan-guarani",
      label: "PYG",
    },
    {
      value: "binance-coin",
      label: "BNB",
    },
    {
      value: "indonesian-rupiah",
      label: "IDR",
    },
    {
      value: "swiss-franc",
      label: "CHF",
    },
    {
      value: "kuwaiti-dinar",
      label: "KWD",
    },
    {
      value: "multi-collateral-dai",
      label: "DAI",
    },
    {
      value: "sudanese-pound",
      label: "SDG",
    },
    {
      value: "lesotho-loti",
      label: "LSL",
    },
    {
      value: "belarusian-ruble",
      label: "BYN",
    },
    {
      value: "hungarian-forint",
      label: "HUF",
    },
    {
      value: "ethereum",
      label: "ETH",
    },
    {
      value: "egyptian-pound",
      label: "EGP",
    },
    {
      value: "chinese-yuan-(offshore)",
      label: "CNH",
    },
    {
      value: "philippine-peso",
      label: "PHP",
    },
    {
      value: "ugandan-shilling",
      label: "UGX",
    },
    {
      value: "seychellois-rupee",
      label: "SCR",
    },
    {
      value: "singapore-dollar",
      label: "SGD",
    },
    {
      value: "belize-dollar",
      label: "BZD",
    },
    {
      value: "cuban-peso",
      label: "CUP",
    },
    {
      value: "honduran-lempira",
      label: "HNL",
    },
    {
      value: "romanian-leu",
      label: "RON",
    },
    {
      value: "lebanese-pound",
      label: "LBP",
    },
    {
      value: "bitcoin",
      label: "BTC",
    },
    {
      value: "colombian-peso",
      label: "COP",
    },
    {
      value: "georgian-lari",
      label: "GEL",
    },
    {
      value: "tunisian-dinar",
      label: "TND",
    },
    {
      value: "guernsey-pound",
      label: "GGP",
    },
    {
      value: "indian-rupee",
      label: "INR",
    },
    {
      value: "bosnia-herzegovina-convertible-mark",
      label: "BAM",
    },
    {
      value: "polish-zloty",
      label: "PLN",
    },
    {
      value: "omani-rial",
      label: "OMR",
    },
    {
      value: "salvadoran-colГіn",
      label: "SVC",
    },
    {
      value: "special-drawing-rights",
      label: "XDR",
    },
    {
      value: "nepalese-rupee",
      label: "NPR",
    },
    {
      value: "danish-krone",
      label: "DKK",
    },
    {
      value: "myanma-kyat",
      label: "MMK",
    },
    {
      value: "south-korean-won",
      label: "KRW",
    },
    {
      value: "guinean-franc",
      label: "GNF",
    },
    {
      value: "cape-verdean-escudo",
      label: "CVE",
    },
    {
      value: "sГЈo-tomГ©-and-prГ­ncipe-dobra",
      label: "STN",
    },
    {
      value: "tanzanian-shilling",
      label: "TZS",
    },
    {
      value: "vietnamese-dong",
      label: "VND",
    },
    {
      value: "angolan-kwanza",
      label: "AOA",
    },
    {
      value: "cfp-franc",
      label: "XPF",
    },
    {
      value: "bangladeshi-taka",
      label: "BDT",
    },
    {
      value: "qtum",
      label: "QTUM",
    },
    {
      value: "rwandan-franc",
      label: "RWF",
    },
    {
      value: "tether",
      label: "USDT",
    },
    {
      value: "eos",
      label: "EOS",
    },
    {
      value: "ukrainian-hryvnia",
      label: "UAH",
    },
    {
      value: "chilean-peso",
      label: "CLP",
    },
    {
      value: "netherlands-antillean-guilder",
      label: "ANG",
    },
    {
      value: "pakistani-rupee",
      label: "PKR",
    },
    {
      value: "guyanaese-dollar",
      label: "GYD",
    },
    {
      value: "panamanian-balboa",
      label: "PAB",
    },
    {
      value: "yemeni-rial",
      label: "YER",
    },
    {
      value: "litecoin",
      label: "LTC",
    },
    {
      value: "jersey-pound",
      label: "JEP",
    },
    {
      value: "fijian-dollar",
      label: "FJD",
    },
    {
      value: "tajikistani-somoni",
      label: "TJS",
    },
    {
      value: "armenian-dram",
      label: "AMD",
    },
    {
      value: "british-pound-sterling",
      label: "GBP",
    },
    {
      value: "hong-kong-dollar",
      label: "HKD",
    },
    {
      value: "burundian-franc",
      label: "BIF",
    },
    {
      value: "japanese-yen",
      label: "JPY",
    },
    {
      value: "botswanan-pula",
      label: "BWP",
    },
    {
      value: "djiboutian-franc",
      label: "DJF",
    },
    {
      value: "mozambican-metical",
      label: "MZN",
    },
    {
      value: "husd",
      label: "HUSD",
    },
    {
      value: "bermudan-dollar",
      label: "BMD",
    },
    {
      value: "falkland-islands-pound",
      label: "FKP",
    },
    {
      value: "papua-new-guinean-kina",
      label: "PGK",
    },
    {
      value: "dogecoin",
      label: "DOGE",
    },
    {
      value: "haitian-gourde",
      label: "HTG",
    },
    {
      value: "afghan-afghani",
      label: "AFN",
    },
    {
      value: "platinum-ounce",
      label: "XPT",
    },
    {
      value: "kazakhstani-tenge",
      label: "KZT",
    },
    {
      value: "israeli-new-sheqel",
      label: "ILS",
    },
    {
      value: "gold-ounce",
      label: "XAU",
    },
    {
      value: "mauritanian-ouguiya-(pre-2018)",
      label: "MRO",
    },
    {
      value: "aruban-florin",
      label: "AWG",
    },
    {
      value: "bahraini-dinar",
      label: "BHD",
    },
    {
      value: "cayman-islands-dollar",
      label: "KYD",
    },
    {
      value: "eritrean-nakfa",
      label: "ERN",
    },
    {
      value: "palladium-ounce",
      label: "XPD",
    },
    {
      value: "bulgarian-lev",
      label: "BGN",
    },
    {
      value: "new-zealand-dollar",
      label: "NZD",
    },
    {
      value: "chinese-yuan-renminbi",
      label: "CNY",
    },
    {
      value: "moldovan-leu",
      label: "MDL",
    },
    {
      value: "nigerian-naira",
      label: "NGN",
    },
    {
      value: "bhutanese-ngultrum",
      label: "BTN",
    },
    {
      value: "argentine-peso",
      label: "ARS",
    },
    {
      value: "malaysian-ringgit",
      label: "MYR",
    },
    {
      value: "russian-ruble",
      label: "RUB",
    },
    {
      value: "turkish-lira",
      label: "TRY",
    },
    {
      value: "macanese-pataca",
      label: "MOP",
    },
    {
      value: "somali-shilling",
      label: "SOS",
    },
    {
      value: "dominican-peso",
      label: "DOP",
    },
    {
      value: "south-sudanese-pound",
      label: "SSP",
    },
    {
      value: "zambian-kwacha",
      label: "ZMW",
    },
    {
      value: "australian-dollar",
      label: "AUD",
    },
    {
      value: "north-korean-won",
      label: "KPW",
    },
    {
      value: "jamaican-dollar",
      label: "JMD",
    },
    {
      value: "south-african-rand",
      label: "ZAR",
    },
    {
      value: "ghanaian-cedi",
      label: "GHS",
    },
    {
      value: "chilean-unit-of-account-(uf)",
      label: "CLF",
    },
    {
      value: "bitcoin-cash",
      label: "BCH",
    },
    {
      value: "uzbekistan-som",
      label: "UZS",
    },
    {
      value: "canadian-dollar",
      label: "CAD",
    },
  ];

  var cryptoOptions = [
    { label: "Bitcoin", value: "bitcoin" },
    { label: "Ethereum", value: "ethereum" },
    { label: "Tether", value: "tether" },
    { label: "BNB", value: "binance-coin" },
    { label: "Solana", value: "solana" },
    { label: "USDC", value: "usd-coin" },
    { label: "XRP", value: "xrp" },
    { label: "Cardano", value: "cardano" },
    { label: "Dogecoin", value: "dogecoin" },
    { label: "Shiba Inu", value: "shiba-inu" },
    { label: "Avalanche", value: "avalanche" },
    { label: "Polkadot", value: "polkadot" },
    { label: "Polygon", value: "polygon" },
    { label: "TRON", value: "tron" },
    { label: "Chainlink", value: "chainlink" },
    { label: "Wrapped Bitcoin", value: "wrapped-bitcoin" },
    { label: "Bitcoin Cash", value: "bitcoin-cash" },
    { label: "Uniswap", value: "uniswap" },
    { label: "Internet Computer", value: "internet-computer" },
    { label: "Litecoin", value: "litecoin" },
    { label: "NEAR Protocol", value: "near-protocol" },
    { label: "Filecoin", value: "filecoin" },
    { label: "Ethereum Classic", value: "ethereum-classic" },
    { label: "Multi Collateral DAI", value: "multi-collateral-dai" },
    { label: "UNUS SED LEO", value: "unus-sed-leo" },
    { label: "Stacks", value: "stacks" },
    { label: "Render Token", value: "render-token" },
    { label: "The Graph", value: "the-graph" },
    { label: "Crypto.com Coin", value: "crypto-com-coin" },
    { label: "OKB", value: "okb" },
    { label: "Stellar", value: "stellar" },
    { label: "VeChain", value: "vechain" },
    { label: "Cosmos", value: "cosmos" },
    { label: "THETA", value: "theta" },
    { label: "Lido DAO", value: "lido-dao" },
    { label: "Injective", value: "injective-protocol" },
    { label: "THORChain", value: "thorchain" },
    { label: "Arweave", value: "arweave" },
    { label: "Monero", value: "monero" },
    { label: "Fetch.ai", value: "fetch" },
    { label: "Maker", value: "maker" },
    { label: "Bitcoin BEP2", value: "bitcoin-bep2" },
    { label: "Fantom", value: "fantom" },
    { label: "Bitcoin SV", value: "bitcoin-sv" },
    { label: "Algorand", value: "algorand" },
    { label: "Flow", value: "flow" },
    { label: "Gala", value: "gala" },
    { label: "Aave", value: "aave" },
    { label: "Hedera Hashgraph", value: "hedera-hashgraph" },
    { label: "The Sandbox", value: "the-sandbox" },
  ];

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  var el = element.createElement;
  var InspectorControls = editor.InspectorControls;
  var ComboboxControl = components.ComboboxControl;
  var Button = components.Button;
  var PanelBody = components.PanelBody;
  var ColorPicker = components.ColorPicker;
  var TextControl = components.TextControl;
  var ExternalLink = components.ExternalLink;
  var RangeControl = components.RangeControl;
  var SelectControl = components.SelectControl;
  var ToggleControl = components.ToggleControl;
  var Divider = components.__experimentalDivider;
  var source = "currencyrate.today";

  blocks.registerBlockType("crypto-converter-widget/widget-block", {
    title: i18n["title"] || "Crypto Converter Widget",
    description: i18n["description"] || "crypto-converter-widget",
    icon: el(
      "svg",
      { width: 28, height: 28, viewBox: "0 0 14 14" },
      el("path", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        d: "M7.79 6.45h0A2.23 2.23 0 0 0 7.83 2H4.39a.81.81 0 0 0-.81.81v8.09a.81.81 0 0 0 .81.81h3.4a2.63 2.63 0 0 0 0-5.26ZM5.13 2V.5M7.63 2V.5m-2.5 13V12m2.5 1.5V12m.2-5.55H3.58",
      })
    ),
    category: "widgets",
    keywords: [
      i18n["converter"] || "Converter",
      i18n["crypto"] || "Crypto",
      i18n["widget"] || "Widget",
      "convert",
      "converter",
      "widget",
      "simple",
      "crypto",
      "Crypto Converter Widget",
    ],
    attributes: {
      fontFamily: {
        type: "string",
        default: "inherit",
      },
      backgroundColor: {
        type: "string",
        default: "#1e40af",
      },
      borderRadius: {
        type: "string",
        default: "0.5rem",
      },
      decimalPlaces: {
        type: "number",
        default: 2,
      },
      symbol: {
        type: "boolean",
        default: true,
      },
      live: {
        type: "boolean",
        default: true,
      },
      shadow: {
        type: "boolean",
        default: true,
      },
      amount: {
        type: "string",
        default: "1",
      },
      crypto: {
        type: "string",
        default: "bitcoin",
      },
      fiat: {
        type: "string",
        default: "united-states-dollar",
      },
    },
    edit: function (props) {
      var crypto = props.attributes.crypto;
      var fiat = props.attributes.fiat;
      var amount = props.attributes.amount;
      var symbol = props.attributes.symbol;
      var live = props.attributes.live;
      var shadow = props.attributes.shadow;
      var backgroundColor = props.attributes.backgroundColor;
      var fontFamily = props.attributes.fontFamily;
      var decimalPlaces = props.attributes.decimalPlaces;
      var borderRadius = props.attributes.borderRadius;

      function onChangeBackgroundColor(newValue) {
        props.setAttributes({ backgroundColor: newValue.hex });
      }

      function onChangeBorderRadius(newValue) {
        props.setAttributes({ borderRadius: `${newValue}rem` });
      }

      function onChangeSymbol(newValue) {
        props.setAttributes({ symbol: newValue });
      }

      function onChangeshadow(newValue) {
        props.setAttributes({ shadow: newValue });
      }

      function onChangeAmount(newValue) {
        props.setAttributes({ amount: newValue });
      }

      function onChangeFontFamily(newValue) {
        props.setAttributes({ fontFamily: newValue });
      }

      function onChangeLive(newValue) {
        props.setAttributes({ live: newValue });
      }

      function onChangeDecimalPlaces(newValue) {
        props.setAttributes({ decimalPlaces: newValue });
      }
      function onChangeCrypto(newValue) {
        props.setAttributes({ crypto: newValue });
      }
      function onChangeFiat(newValue) {
        props.setAttributes({ fiat: newValue });
      }

      const [cryptoOptionsState, setCryptoOptions] =
        wp.element.useState(cryptoOptions);

      // Function to perform autocomplete fetch
      function autocomplete(query) {
        fetch(
          `https://api.coincap.io/v2/assets?search=${query}&limit=25&offset=0`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setCryptoOptions(
              data.data.map((item) => {
                return {
                  value: item.id,
                  label: item.name,
                };
              })
            );
          })
          .catch((error) => {
            console.error(
              "There was a problem with the autocomplete request:",
              error
            );
          });
      }

      // Debounce the autocomplete function with a delay of 300ms
      const debouncedAutocomplete = debounce(autocomplete, 300);

      return [
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: i18n["container"] || "Container", initialOpen: false },
            [
              el(Divider, { style: { margin: "1rem 0" } }),
              el(ToggleControl, {
                label: i18n["shadow"] || "Shadow",
                checked: props.attributes.shadow,
                onChange: onChangeshadow,
              }),
              el(RangeControl, {
                label: i18n["borderRadius"] || "Radius",
                value: parseFloat(props.attributes.borderRadius),
                onChange: onChangeBorderRadius,
                min: 0,
                max: 3,
                step: 0.1,
              }),
            ]
          ),
          el(
            PanelBody,
            {
              title: i18n["backgroundColor"] || "Background Color",
              initialOpen: false,
            },
            [
              el(
                Button,
                {
                  variant: "secondary",
                  onClick: () => {
                    onChangeBackgroundColor({ hex: "" });
                  },
                },
                i18n["clearColors"] || "Clear Colors"
              ),
              el(Divider, { style: { margin: "1rem 0" } }),
              el(ColorPicker, {
                label: i18n["color"] || "Color",
                color: props.attributes.backgroundColor,
                onChangeComplete: onChangeBackgroundColor,
                disableAlpha: true,
              }),
            ]
          ),
          el(
            PanelBody,
            { title: i18n["options"] || "Options", initialOpen: false },
            [
              el(ToggleControl, {
                label: i18n["symbol"] || "Symbol",
                checked: props.attributes.symbol,
                onChange: onChangeSymbol,
              }),
              el(ToggleControl, {
                label: i18n["live"] || "Live",
                checked: props.attributes.live,
                onChange: onChangeLive,
              }),
            ]
          ),
          el(
            PanelBody,
            { title: i18n["display"] || "Display", initialOpen: false },
            [
              el(ComboboxControl, {
                label: i18n["crypto"] || "Crypto",
                value: props.attributes.crypto,
                options: cryptoOptionsState,
                onChange: onChangeCrypto,
                onFilterValueChange: (inputValue) => {
                  const query = inputValue.trim();
                  if (query.length >= 2) {
                    debouncedAutocomplete(query);
                  }
                },
              }),
              el(ComboboxControl, {
                label: i18n["fiat"] || "Fiat",
                value: props.attributes.fiat,
                options: fiatOptions,
                onChange: onChangeFiat,
              }),
              el(TextControl, {
                label: i18n["amount"] || "Amount",
                value: props.attributes.amount,
                onChange: onChangeAmount,
              }),
              el(RangeControl, {
                label: i18n["decimalPlaces"] || "Decimal Places",
                value: props.attributes.decimalPlaces,
                onChange: onChangeDecimalPlaces,
                min: 0,
                max: 7,
                step: 1,
              }),
              el(SelectControl, {
                label: i18n["fontFamily"] || "Font Family",
                value: props.attributes.fontFamily,
                options: [
                  { label: "inherit", value: "inherit" },
                  { label: "Sans-serif", value: "sans-serif" },
                  { label: "Serif", value: "serif" },
                  { label: "Cursive", value: "cursive" },
                  { label: "Fantasy", value: "fantasy" },
                  { label: "Monospace", value: "monospace" },
                ],
                onChange: onChangeFontFamily,
              }),
            ]
          ),
          el(
            PanelBody,
            { title: i18n["about"] || "About", initialOpen: true },
            [
              el(
                ExternalLink,
                {
                  href: "https://wordpress.org/plugins/crypto-converter-widget/",
                  target: "_blank",
                  style: { textDecoration: "none" },
                },
                "Crypto Converter ⚡ Widget"
              ),
              el(Divider, { style: { margin: "1rem 0" } }),
              el(
                ExternalLink,
                {
                  href: "https://wordpress.org/support/plugin/crypto-converter-widget/reviews/#new-post",
                  target: "_blank",
                  style: { textDecoration: "none" },
                },
                i18n["ratePlugin"] || "❤️ Rate Plugin ★★★★★"
              ),
              el(Divider, { style: { margin: "1rem 0" } }),
              el(
                ExternalLink,
                {
                  href: "https://co-w.io/",
                  target: "_blank",
                  style: { textDecoration: "none" },
                },
                i18n["demoPlugin"] || "DEMO 👀"
              ),
            ]
          )
        ),
        el(
          "div",
          {
            className: props.className,
            style: { ...props.style, ...{ pointerEvents: "none" } },
          },
          el("crypto-converter-widget", {
            ...(fiat && fiat !== "" ? { fiat } : {}),
            ...(crypto && crypto !== "" ? { crypto } : {}),
            ...(amount && amount !== "" ? { amount } : {}),
            ...(symbol ? { symbol: "true" } : {}),
            ...(live ? { live: "true" } : {}),
            ...(shadow ? { shadow: "true" } : {}),
            ...(fontFamily && fontFamily !== ""
              ? { "font-family": fontFamily }
              : {}),
            ...(backgroundColor && backgroundColor !== ""
              ? { "background-color": backgroundColor }
              : {}),
            ...(decimalPlaces && decimalPlaces !== ""
              ? { "decimal-places": decimalPlaces }
              : {}),
            ...(borderRadius && borderRadius !== ""
              ? { "border-radius": borderRadius }
              : {}),
          })
        ),
      ];
    },
    save: function (props) {
      var amount = props.attributes.amount;
      var symbol = props.attributes.symbol;
      var crypto = props.attributes.crypto;
      var fiat = props.attributes.fiat;
      var borderRadius = props.attributes.borderRadius;
      var backgroundColor = props.attributes.backgroundColor;
      var decimalPlaces = props.attributes.decimalPlaces;
      var live = props.attributes.live;
      var fontFamily = props.attributes.fontFamily;
      var shadow = props.attributes.shadow;

      return el(
        "div",
        {
          className: props.className,
          style: { ...props.style },
        },
        el("crypto-converter-widget", {
          ...(fiat && fiat !== "" ? { fiat } : {}),
          ...(crypto && crypto !== "" ? { crypto } : {}),
          ...(amount && amount !== "" ? { amount } : {}),
          ...(symbol ? { symbol: "true" } : {}),
          ...(live ? { live: "true" } : {}),
          ...(shadow ? { shadow: "true" } : {}),
          ...(fontFamily && fontFamily !== ""
            ? { "font-family": fontFamily }
            : {}),
          ...(backgroundColor && backgroundColor !== ""
            ? { "background-color": backgroundColor }
            : {}),
          ...(decimalPlaces && decimalPlaces !== ""
            ? { "decimal-places": decimalPlaces }
            : {}),
          ...(borderRadius && borderRadius !== ""
            ? { "border-radius": borderRadius }
            : {}),
        }),
        el(
          "div",
          {},
          "",
          el(
            "a",
            {
              href: `https://${source}/`,
              target: "_blank",
              rel: "noopener noreferrer",
            },
            "CurrencyRate"
          )
        )
      );
    },
  });
})(
  window.wp.blocks,
  window.wp.blockEditor,
  window.wp.element,
  window.wp.components
);
