/**
 * @version 3.0.3
 * @since 2.0.0
 */
(function (blocks, editor, element, components) {
  const { locale: lang, i18n, gradients, assets, locales } = blockData;

  const initialGradients = gradients.map((i) => ({
    value: i.name,
    label: i.name,
  }));
  const initialLocales = [
    { value: "auto", label: "Auto" },
    ...Object.entries(locales).map(([k, v]) => ({ value: k, label: v })),
  ];
  const initialOptions = assets.map((i) => ({
    value: i.SYMBOL,
    label: i.SYMBOL,
  }));

  const formatTag = ({ tag, content, ...attrs }, mode = "shortcode") => {
    // build attributes string
    const attrsStr = Object.entries(attrs)
      .map(([key, val]) => ` ${key}="${val}"`)
      .join("");

    return mode === "html"
      ? // HTML format with closing tag
        `<${tag}${attrsStr}>${content || ""}</${tag}>`
      : // default: WordPress shortcode
        `[${tag}${attrsStr}]`;
  };

  const buildWidgetAttributes = ({
    base = "",
    quote = "",
    amount = "",
    tax = "",
    symbol = false,
    shadow = false,
    decimal = 2,
    rounded = true,
    stat = false,
    border = true,
    theme = "auto",
    locale = "auto",
    backgroundColor = "",
    gradient = "",
    deg = 120,
    background = "",
  }) => {
    const result = {
      theme,
      locale,
      rounded: rounded ? "true" : "false",
      border: border ? "true" : "false",
    };

    // simple string props
    if (base) result.base = base;
    if (quote) result.quote = quote;
    if (amount) result.amount = amount;
    if (tax) result.tax = tax;

    // boolean props (only when true)
    if (symbol) result.symbol = "true";
    if (shadow) result.shadow = "true";
    if (stat) result.stat = "true";

    // numeric prop (allow 0)
    if (typeof decimal === "number") {
      result.decimal = decimal;
    }

    // custom colors
    if (backgroundColor) {
      result["background-color"] = backgroundColor;
    }

    // gradient background
    if (gradient) {
      result.background = `linear-gradient(${deg}deg,${background})`;
    }

    return result;
  };

  var el = element.createElement;
  var InspectorControls = editor.InspectorControls;
  var ComboboxControl = components.ComboboxControl;
  var TextareaControl = components.TextareaControl;
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
      deg: {
        type: "number",
        default: 120,
      },
      theme: {
        type: "string",
        default: "auto",
      },
      locale: {
        type: "string",
        default: "auto",
      },
      backgroundColor: {
        type: "string",
        default: "#1e40af",
      },
      background: {
        type: "string",
        default: "#8E2DE2,#4A00E0",
      },
      decimal: {
        type: "number",
        default: 2,
      },
      symbol: {
        type: "boolean",
        default: true,
      },
      shadow: {
        type: "boolean",
        default: true,
      },
      rounded: {
        type: "boolean",
        default: true,
      },
      border: {
        type: "boolean",
        default: true,
      },
      stat: {
        type: "boolean",
        default: false,
      },
      amount: {
        type: "string",
        default: "1",
      },
      tax: {
        type: "string",
        default: "0",
      },
      base: {
        type: "string",
        default: "BTC",
      },
      quote: {
        type: "string",
        default: "USD",
      },
      gradient: {
        type: "string",
        default: "Amin",
      },
      mode: {
        type: "boolean",
        default: false,
      },
    },
    edit: function (props) {
      function onChangeBackgroundColor(newValue) {
        props.setAttributes({ backgroundColor: newValue.hex });
        props.setAttributes({ background: "" });
      }

      function onChangeRounded(newValue) {
        props.setAttributes({ rounded: newValue });
      }

      function onChangeBorder(newValue) {
        props.setAttributes({ border: newValue });
      }

      function onChangeStat(newValue) {
        props.setAttributes({ stat: newValue });
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

      function onChangeTax(newValue) {
        props.setAttributes({ tax: newValue });
      }

      function onChangeLocale(newValue) {
        props.setAttributes({ locale: newValue });
      }

      function onChangeTheme(newValue) {
        if (newValue !== "auto") {
          onChangeBackgroundColor({ hex: "" });
          props.setAttributes({ gradient: "" });
          props.setAttributes({ background: "" });
        }
        props.setAttributes({ theme: newValue });
      }

      function onChangeDecimal(newValue) {
        props.setAttributes({ decimal: newValue });
      }

      function onChangeBase(newValue) {
        props.setAttributes({ base: newValue });
      }

      function onChangeQuote(newValue) {
        props.setAttributes({ quote: newValue });
      }

      function onChangeGradient(newValue) {
        const gradient = gradients.find((g) => g.name === newValue);
        console.log(gradient.hex.join(",").trim());
        props.setAttributes({ gradient: newValue });
        props.setAttributes({ backgroundColor: gradient.hex[0].trim() || "" });
        props.setAttributes({ background: gradient.hex.join(",").trim() });
      }

      function onChangedeg(newValue) {
        props.setAttributes({ deg: newValue });
      }

      const [baseOptions, setBaseOptions] = wp.element.useState(initialOptions);
      const [quoteOptions, setQuoteOptions] =
        wp.element.useState(initialOptions);
      const [gradientOptions, setGradientOptions] =
        wp.element.useState(initialGradients);

      return [
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            {
              title: "🖼️ " + i18n["container"] || "Container",
              initialOpen: false,
            },
            [
              el(Divider, { style: { margin: "1rem 0" } }),
              el(ToggleControl, {
                label: i18n["shadow"] || "Shadow",
                checked: props.attributes.shadow,
                onChange: onChangeshadow,
                __nextHasNoMarginBottom: true,
                __next40pxDefaultSize: true,
              }),
              el(ToggleControl, {
                label: i18n["rounded"] || "Rounded",
                checked: props.attributes.rounded,
                onChange: onChangeRounded,
                __nextHasNoMarginBottom: true,
                __next40pxDefaultSize: true,
              }),
              el(ToggleControl, {
                label: i18n["border"] || "Border",
                checked: props.attributes.border,
                onChange: onChangeBorder,
                __nextHasNoMarginBottom: true,
                __next40pxDefaultSize: true,
              }),
              el(ToggleControl, {
                label: i18n["stat"] || "Stat",
                checked: props.attributes.stat,
                onChange: onChangeStat,
                __nextHasNoMarginBottom: true,
                __next40pxDefaultSize: true,
              }),
            ]
          ),
          el(
            PanelBody,
            {
              title: "💅 " + i18n["style"] || "Style",
              initialOpen: false,
            },
            [
              el(SelectControl, {
                label: i18n["theme"] || "Theme",
                value: props.attributes.theme,
                options: [
                  { value: "auto", label: i18n["auto"] || "Auto" },
                  { value: "light", label: i18n["light"] || "Light" },
                  { value: "dark", label: i18n["dark"] || "Dark" },
                ],
                onChange: onChangeTheme,
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
              }),
              el(Divider, { style: { margin: "1rem 0" } }),
              el(ComboboxControl, {
                label: i18n["gradient"] || "Gradient",
                value: props.attributes.gradient,
                options: gradientOptions,
                onChange: onChangeGradient,
                onFilterValueChange: (inputValue) => {
                  const q = inputValue.trim().toLowerCase();
                  setGradientOptions(
                    initialGradients.filter((o) =>
                      o.label.toLowerCase().includes(q)
                    )
                  );
                },
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
              }),
              el(Divider, { style: { margin: "1rem 0" } }),
              el(RangeControl, {
                label: i18n["degrees"] || "Degrees",
                value: props.attributes.deg,
                min: 0,
                max: 360,
                step: 1,
                onChange: onChangedeg,
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
              }),
              el(Divider, { style: { margin: "1rem 0" } }),
              el(
                Button,
                {
                  variant: "secondary",
                  onClick: () => {
                    onChangeBackgroundColor({ hex: "" });
                    props.setAttributes({ gradient: "" });
                    props.setAttributes({ background: "" });
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
            { title: "🖥️ " + i18n["display"] || "Display", initialOpen: false },
            [
              el(SelectControl, {
                label: i18n["locale"] || "Locale",
                value: props.attributes.locale,
                options: initialLocales,
                onChange: onChangeLocale,
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
              }),
              el(ToggleControl, {
                label: i18n["symbol"] || "Symbol ($)",
                checked: props.attributes.symbol,
                onChange: onChangeSymbol,
                __nextHasNoMarginBottom: true,
                __next40pxDefaultSize: true,
              }),
              el(Divider, { style: { margin: "1rem 0" } }),
              el(ComboboxControl, {
                label: i18n["base"] || "Base",
                value: props.attributes.base,
                options: baseOptions,
                onChange: onChangeBase,
                onFilterValueChange: (inputValue) => {
                  const q = inputValue.trim().toLowerCase();
                  setBaseOptions(
                    initialOptions.filter((o) =>
                      o.label.toLowerCase().includes(q)
                    )
                  );
                },
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
              }),
              el(Divider, { style: { margin: "1rem 0" } }),
              el(ComboboxControl, {
                label: i18n["quote"] || "Quote",
                value: props.attributes.quote,
                options: quoteOptions,
                onChange: onChangeQuote,
                onFilterValueChange: (inputValue) => {
                  const q = inputValue.trim().toLowerCase();
                  setQuoteOptions(
                    initialOptions.filter((o) =>
                      o.label.toLowerCase().includes(q)
                    )
                  );
                },
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
              }),
              el(Divider, { style: { margin: "1rem 0" } }),
              el(TextControl, {
                label: i18n["amount"] || "Amount",
                value: props.attributes.amount,
                onChange: onChangeAmount,
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
              }),
              el(Divider, { style: { margin: "1rem 0" } }),
              el(RangeControl, {
                label: i18n["decimal"] || "Decimal Places",
                value: props.attributes.decimal,
                onChange: onChangeDecimal,
                min: 0,
                max: 7,
                step: 1,
                __nextHasNoMarginBottom: true,
                __next40pxDefaultSize: true,
              }),
              el(Divider, { style: { margin: "1rem 0" } }),
              el(TextControl, {
                label: i18n["tax"] || "Tax/Fee",
                value: props.attributes.tax,
                onChange: onChangeTax,
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
              }),
            ]
          ),
          el(
            PanelBody,
            { title: "ℹ️ " + i18n["about"] || "About", initialOpen: true },
            [
              el(
                ExternalLink,
                {
                  href: "https://wordpress.org/plugins/crypto-converter-widget/",
                  target: "_blank",
                  style: { textDecoration: "none" },
                },
                "📟 Crypto Converter ⚡ Widget"
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
              el(Divider, { style: { margin: "1rem 0" } }),
              el(TextareaControl, {
                label: props.attributes.mode ? "HTML" : "Shortcode",
                value: formatTag(
                  {
                    tag: "crypto-converter-widget",
                    ...buildWidgetAttributes(props.attributes),
                  },
                  props.attributes.mode ? "html" : "shortcode"
                ),
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
              }),
              el(ToggleControl, {
                label: "HTML",
                checked: props.attributes.mode,
                onChange: (value) => {
                  props.setAttributes({ mode: value });
                },
                __nextHasNoMarginBottom: true,
                __next40pxDefaultSize: true,
              }),
            ]
          )
        ),
        el(
          "div",
          {
            className: props.className,
            style: { ...props.style, ...{ pointerEvents: "none" } },
          },
          el("crypto-converter-widget", buildWidgetAttributes(props.attributes))
        ),
      ];
    },
    save: function (props) {
      return el(
        "div",
        {
          className: props.className,
          style: { ...props.style },
        },
        el("crypto-converter-widget", buildWidgetAttributes(props.attributes)),
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
