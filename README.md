<h1 align="center">Crypto Converter ⚡ Widget 📟</h1>

- Latest version: 3.2.5;
- Size: ≈69.39 kB gzip;
- License: MIT

> ❗ As of April 1, the widget stopped working due to the closure of the api we used for 5 years.
>
> 📟 Fortunately, we found an even better alternative, so the widget will live on!
>
> 🚀 We have completely updated the widget, now it works even better and faster. For the new widget to work correctly, you need to update the HTML code of the widget. How to do it, see below.

[![WordPress Plugin Version](https://img.shields.io/wordpress/plugin/v/crypto-converter-widget?label=WordPress&logo=wordpress)](https://wordpress.org/plugins/crypto-converter-widget/)

The **[Crypto Converter Widget](https://co-w.io)** is a lightweight JavaScript Web Component for adding crypto, fiat and commodity conversion to any website through a single CDN script. It works with symbol-based settings such as `BTC`, `ETH`, `USD` and `EUR`, requires no API key for normal usage, and uses a resilient provider pipeline built around CoinLore, MoneyConvert, Coinbase and OKX. The widget includes local caching, reactive HTML attributes, theme controls and a public asset manifest with ≈14k crypto symbols plus fiat and commodity entries.

---

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/deyurii)

---

- [Features](#features-)
- [Install](#install-%EF%B8%8F)
- [Example](#example-html-code-)
- [For Developers](#for-developers-)
- [WordPress Plugin](#wordpress-plugin)
- [Layers](#layers)
- [Changelog](#changelog-%EF%B8%8F)
- [Cryptocurrencies id list](https://github.com/dejurin/crypto-converter-widget/blob/master/list.md)

## DEMO 👀 **[Example 1](https://bitcoin-pulse.pages.dev/)** | **[Example 2](https://co-w.io/)**

<a href="https://co-w.io"><img src="./images/ccw3.gif" alt="Cryptocurrency Converter Widget"></a>

### Features 🤩

- [x] 🔑 No API key required for standard crypto, fiat and commodity conversion;
- [x] 🧩 Drop-in Web Component: install with one CDN script and HTML attributes;
- [x] ⚡ Reliable pricing pipeline with CoinLore + MoneyConvert as the primary source;
- [x] 🛡️ Automatic fallback to Coinbase and OKX when the primary route is unavailable;
- [x] ₿ Symbol-based configuration for `BTC`, `ETH`, `USD`, `EUR` and thousands of other assets;
- [x] 💵 Supports crypto assets, fiat currencies, tokens, blockchains and commodities;
- [x] 📚 CDN asset manifest with CoinLore IDs for crypto plus legacy fiat and commodity entries;
- [x] 🎛️ Reactive settings for amount, base, quote, locale, tax, decimals, theme and display options;
- [x] 🌈 Custom colors, CSS backgrounds and gradients for brand-friendly embeds;
- [x] 🌗 Light, dark and auto themes;
- [x] 🧠 Local asset metadata cache with live crypto polling and short-lived fiat rate cache;
- [x] 💱 Works as a compact exchange-rate widget or an interactive currency converter;
- [x] ☁️ Hosted on jsDelivr over HTTPS, with versioned and `latest` bundle paths;
- [x] 🧾 SEO-friendly custom-element markup with no required build step;
- [x] 🆓 Free to use.

---

### Install 🖥️

0. Copy [example](#example-) below and set your attributes customize.
1. Enjoy.

---

### Example HTML-code 💡

```html
<!-- Crypto Converter ⚡ Widget --><crypto-converter-widget
  amount="1"
  shadow="true"
  symbol="false"
  locale="en"
  rounded="true"
  quote="USD"
  base="BTC"
  theme="auto"
  decimal="4"
  stat="false"
  tax="0"
  background-color="#8E2DE2"
  background="linear-gradient(45deg, #8E2DE2, #4A00E0)"
></crypto-converter-widget
><a href="https://currencyrate.today/" target="_blank" rel="noopener"
  >CurrencyRate.Today</a
>
<script
  async
  src="https://cdn.jsdelivr.net/gh/dejurin/crypto-converter-widget@latest/dist/latest.min.js"
></script>
<!-- /Crypto Converter ⚡ Widget -->
```

Examples: <b><a href="https://codepen.io/dejurin/pen/xbbbVBL">CodePen</a></b>

You can find many uses for this widget, not just on the website. See how I did a live stream with cryptocurrencies: <a href="https://www.youtube.com/watch?v=LQIsk5wIAzw">https://www.youtube.com/watch?v=LQIsk5wIAzw</a>

---

### jsDelivr CDN

##### Latest

```html
https://cdn.jsdelivr.net/gh/dejurin/crypto-converter-widget@latest/dist/latest.min.js
```

---

### Light Theme

<a href="https://co-w.io"><img src="./images/light.png" width="480" alt="Cryptocurrency Converter Widget Light"></a>

### Dark Theme

<a href="https://co-w.io"><img src="./images/dark.png" width="480" alt="Cryptocurrency Converter Widget Dark"></a>

### Custom Theme

<a href="https://co-w.io"><img src="./images/custom.png" width="480" alt="Cryptocurrency Converter Widget Custom"></a>

---

### For Developers 🧑‍💻

The widget is distributed as a browser-native custom element:
`<crypto-converter-widget>`. It can be embedded in static HTML, CMS templates,
WordPress themes, landing pages and no-build frontend projects. All public
configuration is passed through HTML attributes, so webmasters can update the
widget without changing JavaScript code.

Boolean attributes accept `true` or `false`. Asset values remain symbol-based:
use `BTC`, `ETH`, `USD`, `EUR`, `XAU` and similar symbols, not provider-specific
asset ids.

| Attribute        | Type / Values              | Default | Reactive | Description |
| ---------------- | -------------------------- | ------- | -------- | ----------- |
| base             | asset symbol               | BTC     | ☑️       | Source asset for conversion. Examples: `BTC`, `ETH`, `EUR`, `XAU`. |
| quote            | asset symbol               | USD     | ☑️       | Target asset used to calculate and display the converted value. |
| amount           | number                     | 1       | ☑️       | Amount of the base asset to convert. |
| decimal          | integer                    | 2       | ☑️       | Number of decimal places used for formatted output. |
| decimal-places   | integer                    | 2       | ☑️       | Deprecated compatibility alias for `decimal`. Use `decimal` for new embeds. |
| locale           | BCP 47 locale or `auto`    | auto    | ☑️       | Controls number formatting and currency display rules. Examples: `en`, `de-DE`, `uk-UA`. |
| symbol           | boolean                    | false   | ☑️       | Displays the localized currency symbol when available. |
| stat             | boolean                    | false   | ☑️       | Shows supported 24h market movement data. Unsupported high, low or open values are not fabricated. |
| indicator        | `high`, `low`, `open`      | -       | ☑️       | Selects a legacy stat indicator when the active provider can supply it. |
| tax              | number                     | 0       | ☑️       | Applies an additional percentage adjustment to the quote value for fees, markup or tax scenarios. |
| theme            | `auto`, `light`, `dark`    | auto    | ☑️       | Controls the visual theme. `auto` follows the visitor's preferred color scheme. |
| rounded          | boolean                    | true    | ☑️       | Enables rounded widget corners. |
| border           | boolean                    | true    | ☑️       | Controls the widget border. |
| shadow           | boolean                    | false   | ☑️       | Adds a shadow around the widget container. |
| background-color | CSS color                  | -       | ☑️       | Sets a custom background color. Examples: `#8E2DE2`, `rgb(20 20 20)`. |
| background       | CSS background value       | -       | ☑️       | Sets a full CSS background, including gradients. Overrides simple color styling when provided. |
| name             | string                     | -       | ☑️       | Optional display/integration label for site builders and generated embed flows. |
| api-key          | string                     | -       | ☑️       | Optional key for legacy provider fallback paths. Standard v3 usage does not require it. |
| apiKey           | JavaScript property string | -       | ☑️       | Property-based compatibility alias for integrations that set values from JavaScript. |

---

### WordPress Plugin

[![WordPress Plugin Version](https://img.shields.io/wordpress/plugin/v/crypto-converter-widget?label=WordPress&logo=wordpress)](https://wordpress.org/plugins/crypto-converter-widget/)

[![Watch the video](https://img.youtube.com/vi/84HLvReF5VY/0.jpg)](https://www.youtube.com/watch?v=84HLvReF5VY)

---

### Layers

The widget keeps the public API symbol-based: webmasters configure `BTC`,
`ETH`, `USD`, `EUR`, `XAU` and similar symbols. Provider-specific metadata is
resolved internally from the CDN asset manifest.

#### Asset manifest

The v3 widget reads selectable assets from:

```plaintext
https://cdn.jsdelivr.net/gh/dejurin/crypto-converter-widget@latest/public/assets_v3.json?v=YYYY-MM-DD
```

Runtime does not call CoinLore `/api/assets/`. The CDN manifest is the single
source of truth for the asset picker and includes CoinLore `ID` metadata for
crypto pricing. The legacy `public/assets.json` remains available for older
builds, the website and WordPress integrations.

Asset cache:

- key: `co-w.io_ccw_assets_V3`
- schemaVersion: `3`
- validity: `24h`

#### Pricing

- 🟠 Crypto assets use CoinLore ticker: `https://api.coinlore.net/api/ticker/?id=...`
- ⏱️ Crypto prices are polled every `5s` and are not cached between polling ticks.
- 🟢 Fiat and commodity rates use MoneyConvert: `https://cdn.moneyconvert.net/api/latest.json`
- 🧠 MoneyConvert rates are cached for `60s`; `USD` is treated as `1`.
- 🧮 Pair conversion is calculated as `base USD value / quote USD value`.

#### Fallback order

1. CoinLore + MoneyConvert primary path.
2. Coinbase fallback.
3. OKX fallback.
4. CoinDesk fallback only when an API key is provided.
5. CryptoCompare fallback only when an API key is provided.

CoinDesk and CryptoCompare are not part of the no-key hot path. The widget also
ignores stale in-flight responses, so an older provider response cannot overwrite
a newer selected pair.

The UI displays only data that the active provider actually supplies. For
example, 24h change can be shown when available, but high, low and open values
are not fabricated when a provider does not return them.

#### Runtime flow

```plaintext
┌──────────────────────────────────────────┐
│ <crypto-converter-widget> is mounted     │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│ Normalize attributes and saved settings  │
│ - base / quote remain symbols            │
│ - decimal-places maps to decimal         │
│ - background-color maps to CSS styling   │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│ Resolve asset metadata                   │
│ 1. Use localStorage cache if schema = 3  │
│ 2. Fetch public/assets_v3.json from CDN  │
│ 3. Store manifest cache for 24h          │
│ 4. Keep public API symbol-based          │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│ Price pipeline                           │
│ 1. CoinLore + MoneyConvert composite     │
│    - crypto ticker by CoinLore ID        │
│    - fiat/commodity rates from USD table │
│    - pair = base USD / quote USD         │
│ 2. Coinbase fallback                     │
│ 3. OKX fallback                          │
│ 4. Legacy API-key fallback, if provided  │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│ Render result                            │
│ - converted amount                       │
│ - optional localized symbol              │
│ - supported 24h movement data            │
│ - no fabricated unsupported stats        │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│ If no provider can price the pair,       │
│ show a controlled error state            │
└──────────────────────────────────────────┘
```

---

### Changelog ✳️

#### [3.2.5] - 2026-06-12

##### Fixed

- Fixed asset picker loading when `localStorage` cache writes fail, including Safari/private-storage style failures.
- Made asset manifest cache writes best-effort while keeping fetched assets in widget state.
- Fixed mobile asset dropdown width so it aligns with the two select controls without horizontal overflow.
- Fixed mobile touch scrolling inside the asset list so scrolling no longer selects an option.

##### Verified

- Confirmed the production asset manifest contract remains `public/assets_v3.json` via `@latest`.
- Confirmed runtime assets still come from the CDN manifest, not CoinLore `/api/assets/`.
- Confirmed crypto pricing still polls every `5s`, MoneyConvert fiat rates use a `60s` cache, and Coinbase/OKX fallback paths remain available.
- Confirmed public attributes remain symbol-based and backward compatible.

#### [3.2.4] - 2026-06-12

##### Changed

- Added the v3 CDN asset manifest `public/assets_v3.json` with CoinLore metadata for crypto assets.
- Published the verified `3.2.4` CDN bundle and refreshed `dist/latest.min.js`.
- Kept the production asset manifest contract on `public/assets_v3.json` with `@latest`.
- Kept `public/assets.json` as the legacy compatibility manifest.
- Updated the widget runtime contract to use `co-w.io_ccw_assets_V3` with `schemaVersion: 3`.
- Removed runtime dependency on CoinLore `/api/assets/`; the widget now reads the asset picker manifest from CDN.

##### Verified

- Confirmed live provider behavior: CoinLore crypto polling every `5s`, MoneyConvert fiat cache for `60s`, and Coinbase/OKX fallback paths.
- Confirmed the production bundle does not include development-only provider smoke helpers.

#### [3.2.2] - 2026-06-11

##### Changed

- Rebuilt and prepared verified CDN artifacts for the `3.2.2` release.
- Kept the public JSON asset manifest contract unchanged for the website and WordPress plugin.

#### [3.2.1] - 2026-06-11

##### Fixed

- Updated the widget About dialog to remove outdated asset-count copy.

#### [3.2.0] - 2026-06-11

##### Fixed

- Restored no-key pricing with CoinLore and MoneyConvert as the primary providers.
- Kept Coinbase and OKX as working fallbacks.
- Fixed asset picker scrolling and selection issues.
- Preserved the public symbol-based widget contract.

#### [3.1.1] - 2025-04-23

##### Fixed

- Minor bug fixes.

#### [3.1.0] - 2025-04-23

##### Fixed

- Minor bug fixes.
- Fixed compatibility.

#### [3.0.6] - 2025-04-20

##### Fixed

- Minor bug fixes.

#### [3.0.5] - 2025-04-19

##### Fixed

- Minor bug fixes.

#### [3.0.4] - 2025-04-19

##### Fixed

- Minor bug fixes.
-

#### [3.0.3] - 2025-04-19

##### Fixed

- Minor bug fixes.

#### [3.0.2] - 2025-04-18

##### Fixed

- Minor bug fixes and performance optimizations.

#### [3.0.1] - 2025-04-18

##### Added

- Implemented four layers of API data providers for enhanced reliability and redundancy.

##### Fixed

- Minor bug fixes and performance optimizations.

#### [3.0.0] - 2025-04-17

##### Added

- New core engine for improved performance and scalability.
- Updated API with expanded functionality and new endpoints.
- Support for fiat currency tracking.
- Integration with multiple blockchain networks and token standards.
- Commodity price tracking functionality.
- Exchange rate data integration.
- Currency converter feature.

##### Fixed

- Major bug fixes and stability improvements.

#### [1.5.2] - 2021-01-10

##### Fixed

- Addressed critical bugs and improved application stability.

#### [1.5.1] - 2021-01-10

##### Fixed

- Resolved major issues impacting performance and reliability.

#### [1.5.0] - 2021-01-09

##### Fixed

- Fixed significant bugs and optimized application performance.

#### [1.4.2] - 2021-01-08

##### Fixed

- Minor bug fixes and user interface improvements.

#### [1.4.1] - 2021-01-08

##### Added

- Loading animation to enhance user experience.

##### Fixed

- Minor bug fixes and performance enhancements.

#### [1.4.0] - 2021-01-07

##### Added

- Play/Pause functionality for real-time price updates.
- Request interceptors to handle poor network conditions.

##### Fixed

- Minor bug fixes and stability improvements.

##### Removed

- Sound notification for price changes.

#### [1.3.5] - 2021-01-05

##### Added

- Sound notification for price changes.

##### Fixed

- Minor bug fixes and performance tweaks.

#### [1.1.7] - 2021-01-04

##### Added

- Real-time fiat currency selection.

##### Fixed

- Minor bug fixes and user interface enhancements.

#### [1.1.6] - 2021-01-03

##### Added

- Currency symbol attribute for improved formatting.

##### Fixed

- Currency symbol display issues.
- Minor bug fixes.

#### [1.0.4] - 2020-12-12

##### Fixed

- Improved form selection with asynchronous loading.
- Fixed background image rendering issues.
- Resolved WebSocket connection start/stop issues.

#### [1.0.0] - 2020-12-11

##### Released

- Initial release of the application.

---

The list of cryptocurrencies that can be selected in the widget:
https://github.com/dejurin/crypto-converter-widget/blob/master/list.md

---

### Copyright and license ![Github](https://img.shields.io/github/license/dejurin/coin-converter-widget?logo=Github)

Code copyright 2023 CR.Today, [CurrencyRate](https://currencyrate.today/). Code released under [the MIT license](https://github.com/dejurin/coin-converter-widget/blob/master/LICENSE).
