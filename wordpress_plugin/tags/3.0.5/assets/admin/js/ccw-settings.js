/**
 * Admin code for dismissing notifications.
 *
 */
/**
 * @version 3.0.5
 */
jQuery(document).ready(function () {
  var { gradients, assets, allowed_attr } = ccwData;

  var $form = jQuery("form#widget-settings");
  var $widget = jQuery("crypto-converter-widget");
  var $gradient = jQuery('select[name="gradient"]');
  var $base = jQuery('select[name="base"]');
  var $quote = jQuery('select[name="quote"]');
  var $deg = jQuery('input[name="deg"]');
  var $background = jQuery('input[name="background"]');

  var initialOptions = assets.map((asset) => ({
    id: asset.SYMBOL,
    text: asset.SYMBOL,
  }));

  var initialGradientOptions = gradients.map((asset) => {
    var hexValue = asset.hex;
    if (Array.isArray(asset.hex)) {
      hexValue = asset.hex.join(", ");
    }
    if (typeof hexValue !== "string" || !hexValue) {
      hexValue = "#FFFFFF";
    }
    return {
      id: (asset.name || "unnamed").replace(" ", "_"),
      text: asset.name || "No name",
      value: hexValue,
    };
  });

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  function isDark(hex) {
    if (hex.startsWith("#")) {
      hex = hex.slice(1);
    }
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    var brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness < 128;
  }
  function ws() {
    var data = $form.serializeArray();

    if (!data.some((item) => item.name === "rounded")) {
      data.push({ name: "rounded", value: "false" });
    }

    if (!data.some((item) => item.name === "border")) {
      data.push({ name: "border", value: "false" });
    }

    $widget.removeAttributes();

    var shortCode = "crypto-converter-widget ";

    data.forEach(({ name, value }) => {
      if (!allowed_attr.includes(name)) return;

      if (name === "background" && $background.val() !== "") {
        var gr = gradients.find((g) => g.name === $gradient.val());
        if (!gr) return;
        value = `linear-gradient(${$deg.val()}deg,${gr.hex.join(",")})`;
      }

      if (name === "gradient" || value === "" || name === "deg") return;

      $widget.attr(name, value);

      shortCode += `${name}="${value}" `;
    });

    jQuery("#deg").attr("disabled", !$gradient.val());

    shortCode = shortCode.trim() + "";
    jQuery("#widget-shortcode").val("[" + shortCode + "]");

    var htmlCode =
      `&lt;${shortCode}&gt;&lt;/crypto-converter-widget&gt;\n` +
      `&lt;script async src="https://cdn.jsdelivr.net/gh/dejurin/crypto-converter-widget@latest/dist/latest.min.js"&gt;&lt;/script&gt;`;
    jQuery("#widget-htmlcode").html(htmlCode);
  }

  jQuery.fn.removeAttributes = function () {
    return this.each(function () {
      var attributes = jQuery.map(this.attributes, function (item) {
        return item.name;
      });
      var img = jQuery(this);
      jQuery.each(attributes, function (_, item) {
        img.removeAttr(item);
      });
    });
  };
  jQuery(".copy-button").on("click", function () {
    var targetId = jQuery(this).data("copy-target");
    var $targetElement = jQuery("#" + targetId);

    if ($targetElement.length) {
      var textToCopy = $targetElement.text() || $targetElement.val();
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          var $button = jQuery(this);
          var originalText = $button.html();
          $button.html("<span class='dashicons dashicons-saved'></span>");
          setTimeout(() => {
            $button.html(originalText);
          }, 2000);
        })
        .catch((err) => {
          console.error("Copy error: ", err);
          $(this).text("Error!");
          setTimeout(() => {
            $(this).text("Copy");
          }, 2000);
        });
    }
  });
  jQuery('input[name="random-color"]').on("click", function () {
    var newColor = getRandomColor();
    jQuery('input[name="background-color"]').val(newColor);
    jQuery("#background-color").wpColorPicker("color", newColor);
    $background.val("");
    ws();
  });
  jQuery('input[name="random-gradient"]').on("click", function () {
    var $options = $gradient.find("option");
    var idx = Math.floor(Math.random() * $options.length);
    var randomVal = $options.eq(idx).val();
    $gradient.val(randomVal).trigger("change");
    ws();
  });
  jQuery('input[class="checkbox-options"]').on("change", function () {
    ws();
  });
  jQuery('input[name="decimal"], input[name="amount"], input[name="tax"]').on(
    "input",
    function () {
      ws();
    }
  );
  jQuery("#decimal-value").text(
    "(" + jQuery('input[name="decimal"]').val() + ")"
  );
  jQuery("#deg-value").text("(" + $deg.val() + ")");
  jQuery('input[name="decimal"]').on("input", function () {
    jQuery("#decimal-value").text("(" + this.value + ")");
    ws();
  });
  $deg.on("input", function () {
    jQuery("#deg-value").text("(" + this.value + ")");
    ws();
  });
  jQuery('select[name="locale"]').on("change", function () {
    ws();
  });
  jQuery('select[name="theme"]').on("change", function () {
    jQuery('input[name="background-color"]').val("");
    $background.val("");
    $gradient.val(null).trigger("change");
    ws();
  });
  jQuery(".color-field").wpColorPicker({
    defaultColor: !1,
    change: function (t, e) {
      if (!$gradient.data("color-changed")) {
        $gradient.val(null).trigger("change");
        $gradient.data("color-changed", true);
      }
      jQuery('input[name="background-color"]').val(
        jQuery(this).iris("color", true).toCSS("hex")
      );
      $background.val("");
      ws();
    },
    clear: function () {
      $background.val("");
      $gradient.val(null).trigger("change");
      ws();
    },
    hide: !0,
    palettes: [
      "#383a59",
      "#414770",
      "#4D5382",
      "#0000FF",
      "#007BFF",
      "#6610F2",
      "#5F00BA",
      "#6F42C1",
      "#E83E8C",
      "#DC3545",
      "#FD7E14",
      "#FFC107",
      "#28A745",
      "#20C997",
      "#17A2B8",
      "#6C757D",
      "#343A40",
      "#F8F9FA",
      "#343A40",
      "#FFFFFF",
      "#333333",
    ],
  });

  $gradient.select2({
    data: initialGradientOptions,
    placeholder: "",
    width: "50%",
    matcher: (params, data) => {
      if (!params.term || !data.text) {
        return data;
      }
      return data.text.toLowerCase().includes(params.term.toLowerCase())
        ? data
        : null;
    },
    templateResult: (selection) => {
      if (!selection) return;

      var gradient =
        typeof selection.value === "string" && selection.value
          ? selection.value
          : "transparent";

      var firstColor = "#FFFFFF";
      if (
        typeof selection.value === "string" &&
        selection.value.includes(",")
      ) {
        try {
          firstColor = selection.value.split(",")[0].trim();
          if (!/^#[0-9A-Fa-f]{6}$/i.test(firstColor)) {
            console.warn("Invalid hex color:", firstColor);
            firstColor = "#FFFFFF";
          }
        } catch (e) {
          console.error("Error parsing firstColor:", e);
          firstColor = "#FFFFFF";
        }
      }
      var textColor = isDark(firstColor) ? "#fff" : "#000";
      return jQuery("<div>", {
        css: {
          background: `linear-gradient(${$deg.val()}deg, ${gradient})`,
          color: textColor,
          padding: "10px",
        },
        text: selection.text || "Select...",
      });
    },
    templateSelection: (selection) => {
      if (!selection) return;
      try {
        if (selection.value) {
          var firstColor = selection.value.split(",")[0].trim();
          jQuery("#background").val(
            `linear-gradient(${$deg.val()}deg,${selection.value})`
          );
          jQuery("#background-color").val(firstColor);
        }
        ws();
      } catch (e) {
        console.error("Error in ws function:", e);
      }
      return selection.text || "Select...";
    },
    selectOnClose: true,
  });
  $base
    .select2({
      data: initialOptions,
      placeholder: "BTC",
      width: "100%",
      matcher: matcherSelect2,
      templateResult: renderOption,
      templateSelection: renderOption,
      escapeMarkup: (m) => m,
    })
    .on("change", () => {
      ws();
    });
  $quote
    .select2({
      data: initialOptions,
      placeholder: "USD",
      width: "100%",
      matcher: matcherSelect2,
      templateResult: renderOption,
      templateSelection: renderOption,
      escapeMarkup: (m) => m,
    })
    .on("change", () => {
      ws();
    });
  function matcherSelect2(params, data) {
    if (!params.term || !data.text) return data;
    return data.text.toLowerCase().includes(params.term.toLowerCase())
      ? data
      : null;
  }
  function renderOption(option) {
    if (!option.id) return option.text;
    return `
      <span style="display: flex; align-items: center;">
        <img src="https://cdn.jsdelivr.net/gh/dejurin/crypto-converter-widget@master/assets/${option.id}.png"
             style="width:24px; height:24px; margin-right:6px;"
             onerror="this.style.display='none'" loading="lazy" />
        ${option.text}
      </span>
    `;
  }

  $gradient.val("Amin");
  $base.val("BTC");
  $quote.val("USD");
  $gradient.trigger("change");
  $base.trigger("change");
  $quote.trigger("change");
  ws();
});
