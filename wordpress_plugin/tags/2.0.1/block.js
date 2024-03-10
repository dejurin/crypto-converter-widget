/**
 * @version 2.0.1
 * @since 2.0.0
 */
(function (blocks, editor, element, components) {
  const { locale, i18n } = blockData;

  function parseGradientsToHex(gradient) {
    if (gradient) {
      const rgbMatches = gradient.match(
        /rgb(a)?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+(\.\d+)?)?\)/g
      );
      const hexMatches =
        gradient.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/g) || [];

      if (rgbMatches) {
        var rgbToHexColors = rgbMatches.map((rgb) => {
          const [r, g, b] = rgb.match(/\d+/g).map(Number);
          return rgbToHex(r, g, b);
        });

        return rgbToHexColors;
      }
      if (hexMatches) {
        return hexMatches;
      }
    } else {
      return;
    }
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  var el = element.createElement;
  var InspectorControls = editor.InspectorControls;
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
        default: "",
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
        type: "string",
        default: "",
      },
      amount: {
        type: "number",
        default: 1,
      },
    },
    edit: function (props) {
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
                value: props.attributes.borderRadius,
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
            ...(amount && amount !== "" ? { amount } : {}),
            ...(symbol && { symbol: "true" }),
            ...(live && { live: "true" }),
            ...(shadow && { shadow: "true" }),
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
          ...(amount && amount !== "" ? { amount } : {}),
          ...(symbol && { symbol: "true" }),
          ...(live && { live: "true" }),
          ...(shadow && { shadow: "true" }),
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
})(window.wp.blocks, window.wp.editor, window.wp.element, window.wp.components);
