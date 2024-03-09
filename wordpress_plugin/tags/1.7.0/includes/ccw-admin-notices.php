<?php
// don't load directly
defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'CCW_Admin_Notices' ) ) {

    class CCW_Admin_Notices {

        private static $_instance;
        private $admin_notices;
        const TYPES = 'error,warning,info,success';

        private function __construct() {
            $this->admin_notices = new stdClass();
            foreach ( explode( ',', self::TYPES ) as $type ) {
                $this->admin_notices->{$type} = array();
            }
            add_action( 'admin_init', array( &$this, 'action_admin_init' ) );
            add_action( 'admin_notices', array( &$this, 'action_admin_notices' ) );
            add_action( 'admin_enqueue_scripts', array( &$this, 'action_admin_enqueue_scripts' ) );
        }

        public static function get_instance() {
            if ( ! ( self::$_instance instanceof self ) ) {
                self::$_instance = new self();
            }
            return self::$_instance;
        }

        public function action_admin_init() {
            $dismiss_option = filter_input( INPUT_GET, 'CCW_dismiss', FILTER_SANITIZE_STRING );
            if ( is_string( $dismiss_option ) ) {
                update_option( "CCW_dismissed_$dismiss_option", true );
                wp_die();
            }
        }

        public function action_admin_enqueue_scripts() {
            wp_enqueue_script( 'jquery' );
            wp_enqueue_script(
                'ccw-notify',
                CCW_URL.'assets/admin/js/ccw-notify.js',
                array( 'jquery' )
            );
        }

        public function action_admin_notices() {
            foreach ( explode( ',', self::TYPES ) as $type ) {
                foreach ( $this->admin_notices->{$type} as $admin_notice ) {

                    $dismiss_url = add_query_arg( array(
                        'CCW_dismiss' => $admin_notice->dismiss_option
                    ), admin_url() );
                    $screen = get_current_screen();
                    if ( ! get_option( "CCW_dismissed_{$admin_notice->dismiss_option}" ) || strpos($screen->id, 'crypto-converter-widget') !== false) {
                        ?><div class="notice is-dismissible ccw-notice notice-<?php echo $type;
                            if ( $admin_notice->dismiss_option ) {
                                echo ' is-dismissible" data-dismiss-url="' . esc_url( $dismiss_url );
                            } ?>">
                            <div class="ccw-rate-notice-container">
                                <div class="logo-img">
                                    <img src="<?php echo CCW_URL.'assets/admin/img/icon.svg'; ?>" style="width:96px">
                                </div>
                                <div>
                                    <h2>🥰 <?php _e('Please rate our free', 'crypto-converter-widget'); ?>
                                    &laquo;<?php echo CCW_NAME; ?>&raquo;</h2>
                                    <hr>
                                    <p><?php _e('Your valuable feedback will help us improve.', 'crypto-converter-widget'); ?><br><?php _e('It will only take a few minutes', 'crypto-converter-widget'); ?>: <a href="https://wordpress.org/support/plugin/crypto-converter-widget/reviews/#new-post" rel="noopener" target="_blank"><?php _e('Rate it now', 'crypto-converter-widget'); ?></a> 👍</p>
                                    <p><a href="https://wordpress.org/support/plugin/crypto-converter-widget/reviews/#new-post" rel="noopener" target="_blank"><img src="<?php echo CCW_URL.'assets/admin/img/stars.png'; ?>" alt="<?php _e('Rating', 'crypto-converter-widget'); ?>"></a></p>
                                </div>
                            </div>
                        </div>
                        <style>
                            .ccw-rate-notice-container {
                                display: flex;
                                padding: 10px 0;
                            }
                            .ccw-rate-notice-container .logo-img {
                                margin-right: 15px;
                            }
                            .ccw-rate-notice-container h2 {
                                margin: 0;
                            }
                            .ccw-rate-notice-container p {
                                padding: 0;
                                margin: 0;
                            }
                        </style><?php
                    }
                }
            }
        }

        public function error( $message, $dismiss_option = false ) {
            $this->notice( 'error', $message, $dismiss_option );
        }

        public function warning( $message, $dismiss_option = false ) {
            $this->notice( 'warning', $message, $dismiss_option );
        }

        public function success( $message, $dismiss_option = false ) {
            $this->notice( 'success', $message, $dismiss_option );
        }

        public function info( $message, $dismiss_option = false ) {
            $this->notice( 'info', $message, $dismiss_option );
        }

        private function notice( $type, $message, $dismiss_option ) {
            $notice = new stdClass();
            $notice->message = $message;
            $notice->dismiss_option = $dismiss_option;

            $this->admin_notices->{$type}[] = $notice;
        }
    }
}
