<h1 align="center">Coin Converter ⚡ Widget</h1>

The __[Coin Converter Widget](https://co-w.io)__ — is a free and easy-to-use with beauty UI real-time web tool to conversion cryptocurrencies. Customers can choose from available ≈170 fiat currencies and ≈1,650 crypto.

* Version: 1.0.0;
* Size: 83.6 kBytes;
* Dependencies: Vanilla JS.

<h2 align="center"><a href="https://co-w.io">DEMO</a></h2>

<h2 align="center">
    <a href="https://co-w.io"><img src="./anim.gif" alt="Coin Converter Widget"></a>
</h2>

<h3>Features 🤩</h3>

- [x] No Cryptojacking!
- [x] Pure JavaScript ≈83.6 kBytes (gzip), no dependencies;
- [x] Flexible settings and customizable design;
- [x] Real-time ⚡streaming price update;
- [x] Processed on a third-party server;
- [x] ≈1,650 cryptocurrencies and ≈170 fiat currencies;
- [x] SSL support;
- [x] SEO-friendly.

<h3>Example 💡</h3>

```
<coin-converter-widget
   live
   shadow
   fiat="united-states-dollar"
   crypto="bitcoin"
   amount="1"
   border-radius="0.60rem"
   background-color="#383a59"
   decimal-places="2"
   font-family="inherit"><a 
   href="https://cr.today/" 
   rel="noopener">converter</a></coin-converter-widget>
<a href="https://co-w.io/">co-w.io</a>
<script src="https://cdn.jsdelivr.net/gh/dejurin/coin-converter-widget/latest.js" async></script>
```

<b><a href="https://jsfiddle.net/cxwdhfup/" rel="noopener" target="_blank">Example JSFiddle</a></b>

<h3>For Developers 🧑‍💻</h3>

|Attribute|Type|Default|Reactive|Description|
|--- |--- |--- |--- |--- |
|Amount|float|1|+|Amount of cryptocurrency.|
|background-color|string|#383a59|+|Background color of widget.|
|border-radius|string|0.60rem|+|Border radius of widget.|
|crypto|string|bitcoin|+|Cryptocurrency ID.|
|decimal-places|int|2|+|Decimal places.|
|fiat|string|united-states-dollar|+|Fiat money symbol.|
|font-family|string|inherit|+|Font of widget.|
|live|boolean|false|+|Prices are updated real-time.|
|shadow|boolean|false|+|Shadow of widget.|
