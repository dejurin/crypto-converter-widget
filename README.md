![ccw3](https://github.com/user-attachments/assets/1ed886bc-ea57-4e8e-857e-840fca0aa131)<h1 align="center">Crypto Converter ⚡ Widget</h1>

* Latest version: 3.0.0;
* Size: ≈79.96 kB;
* License: MIT

> ❗ As of April 1, the widget stopped working due to the closure of the api we used for 5 years.
Fortunately, we found an even better alternative, so the widget will live on!
> **Tomorrow** is the launch 🚀 of the new updated widget. The third version. 

[![WordPress Plugin Version](https://img.shields.io/wordpress/plugin/v/crypto-converter-widget?label=WordPress&logo=wordpress)](https://wordpress.org/plugins/crypto-converter-widget/)

The __[Crypto Converter Widget](https://co-w.io)__ is a secure, fast, and fully customizable JavaScript widget for real-time cryptocurrency and fiat currency conversion. Lightweight (≈79.96 kB), dependency-free, and hosted via CDN, it ensures reliable performance on any website without cryptojacking risks or the need for API keys. Supporting ≈3,313 cryptocurrencies, ≈170 fiat currencies, tokens, blockchains, and commodities, it features real-time ⚡ streaming price updates, SSL security, and flexible design customization. Completely free and ready for instant integration as an Exchange Rate tool or Currency Converter.

---

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/deyurii)

---

- [Features](#features-)
- [Install](#install-%EF%B8%8F)
- [Example](#example-)
- [Changelog](#changelog-%EF%B8%8F)
- [For Developers](#for-developers-)
- [Cryptocurrencies id list](https://github.com/dejurin/crypto-converter-widget/blob/master/list.md)

## DEMO 👀 **[Example 1](https://bitcoin-pulse.pages.dev/)** | **[Example 2](https://co-w.io/)**

<a href="https://co-w.io"><img src="./ccw3.gif" alt="Cryptocurrency Converter Widget"></a>

### Features 🤩 ###

- [x] No Cryptojacking!
- [x] No API key needed;
- [x] Pure JavaScript ≈79.96 kB, no dependencies;
- [x] Flexible settings and customizable design;
- [x] Real-time ⚡ streaming price update;
- [x] Processed on a third-party server;
- [x] Fiat, Tokens, Blockchains, Commodity;
- [x] ≈3,313 cryptocurrencies and ≈170 fiat currencies;
- [x] Can be used as Exchange Rates or Currency Converter;
- [x] CDN;
- [x] SSL support;
- [x] SEO-friendly;
- [x] Free.

---

### Install 🖥️ ###

0. Copy [example](#example-) below and set your attributes customize.
1. Enjoy.

---

### Example 💡 ###

```html
<!-- Crypto Converter ⚡ Widget --><crypto-converter-widget amount="1" shadow="true" locale="auto" rounded="true" quote="USD" base="BTC" theme="auto" decimal="2" stat="false"></crypto-converter-widget><a href="https://currencyrate.today/" target="_blank" rel="noopener">CurrencyRate.Today</a><script async src="https://cdn.jsdelivr.net/gh/dejurin/crypto-converter-widget@master/dist/latest.min.js"></script><!-- /Crypto Converter ⚡ Widget -->
```

Examples: <b><a href="https://jsfiddle.net/yuridarwin/8jbq1Lua/">JSFiddle</a></b> | <b><a href="https://codepen.io/currencyrate_today/pen/eYWxGGX">CodePen</a></b> | <b><a href="https://codepen.io/currencyrate_today/pen/GRmzMOm">CodePen (multi color example)</a></b> | <b><a href="https://co-w.io/coins.html">A lot widget on one page</a></b>

You can find many uses for this widget, not just on the website. See how I did a live stream with cryptocurrencies: <a href="https://www.youtube.com/watch?v=LQIsk5wIAzw">https://www.youtube.com/watch?v=LQIsk5wIAzw</a>

---

### jsDelivr CDN

##### Latest

```html
https://cdn.jsdelivr.net/gh/dejurin/crypto-converter-widget@main/dist/latest.min.js
```

---

### Light Theme
<a href="https://co-w.io"><img src="./light.png" width="380" alt="Cryptocurrency Converter Widget Light"></a>

### Dark Theme
<a href="https://co-w.io"><img src="./dark.png" width="380" alt="Cryptocurrency Converter Widget Dark"></a>

### Custom Theme
<a href="https://co-w.io"><img src="./custom.png" width="380" alt="Cryptocurrency Converter Widget Custom"></a>

---

### Changelog ✳️ ###

#### [3.0.0] - 2025-04-18
##### Fixed
- New engine
- New API
- Major fixed
- Fiat currencies💵
- Blockchains 🔗
- Tokens 🔑
- Commodity 🛢️
- Exchange Rates
- Currency Converter


#### [1.5.2] - 2021-01-10
##### Fixed
- Major fixes

#### [1.5.1] - 2021-01-10
##### Fixed
- Major fixes

#### [1.5.0] - 2021-01-09
##### Fixed
- Major fixes

#### [1.4.2] - 2021-01-08
##### Fixed
- Minor fixes

#### [1.4.1] - 2021-01-08
##### Fixed
- Minor fixes
##### Add
- Loading anim

#### [1.4.0] - 2021-01-07
##### Fixed
- Add interceptors for poor request
- Minor fixes
##### Add
- Play/Pause price updates
##### Delete
- Sound beep when price changed

#### [1.3.5] - 2021-01-05
##### Fixed
- Minor fixes
##### Add
- Sound beep when price changed

#### [1.1.7] - 2021-01-04
##### Fixed
- Select fiat [live]
- Minor fixes

#### [1.1.6] - 2021-01-03
##### Fixed
- Currency symbol
- Minor fixes
##### Add
- Currency symbol attribut

#### [1.0.4] - 2020-12-12
##### Fixed
- Select form [await load]
- Background image
- WebSocket stop/start

#### [1.0.0] - 2020-12-11
- First release

---


### For Developers 🧑‍💻 ###

| Attribute         | Type    | Default | Reactive | Description                              |
|-------------------|---------|---------|----------|------------------------------------------|
| base              | string  | BTC     | ☑️       | Base currency of widget (From).          |
| quote             | string  | USD     | ☑️       | Quote currency of widget (To).           |
| symbol            | boolean | false   | ☑️       | Display currency symbol ($).             |
| shadow            | boolean | false   | ☑️       | Display shadow for widget.               |
| rounded           | boolean | true    | ☑️       | Rounded corners for widget.              |
| background-color  | string  |         | ☑️       | Background color of widget (supports gradients). |
| stat              | boolean | false   | ☑️       | Display fiat currency.                   |
| tax               | float   | 0       | ☑️       | Additional tax/fee for quote.            |
| decimal           | int     | 2       | ☑️       | Number of decimal places.                |
| amount            | float   | 1       | ☑️       | Amount of currency.                      |
| locale            | string  | auto    | ☑️       | Locale setting for widget.               |
| theme             | string  | auto    | ☑️       | Theme of widget.                         |

---

The list of cryptocurrencies that can be selected in the widget:
https://github.com/dejurin/crypto-converter-widget/blob/master/list.md

---

### Copyright and license ![Github](https://img.shields.io/github/license/dejurin/coin-converter-widget?logo=Github)
Code copyright 2023 CR.Today, [CurrencyRate](https://currencyrate.today/). Code released under [the MIT license](https://github.com/dejurin/coin-converter-widget/blob/master/LICENSE).
