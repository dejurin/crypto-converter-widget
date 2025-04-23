/**
 * Admin code for dismissing notifications.
 *
 */
/**
 * @version 3.1.1
 */

(function ($) {
  "use strict";
  $(function () {
    $("#crypto-converter-widget-notice").on(
      "click",
      ".notice-dismiss",
      function () {
        $.ajax({
          url: cryptoConverterWidgetAjax.ajaxurl,
          type: "post",
          data: {
            action: "CCW_admin_hide_notice",
            security: cryptoConverterWidgetAjax.nonce,
          },
          success: function (response) {
            console.log(response);
          },
          error: function (response) {
            console.log(response);
          },
        });
      }
    );
  });
})(jQuery);
