<?php
/**
 * Website scraping function to return html from a given
 * website url. Make sure to include valid headers or some
 * websites will return a forbidden error.
 *
 * @link https://oxylabs.io/blog/5-key-http-headers-for-web-scraping
 * @param $website
 *
 * @return mixed
 */
function scrape( $website ) {
	$response = wp_remote_get( esc_url_raw($website), [
		'headers' => [
			'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
			'Accept-Language' => 'en-us',
			'Accept-Encoding' => 'br, gzip, deflate',
			'Accept' => 'application/xhtml',
			'Referer' => 'APP NAME GOES HERE'
		]
	]);

	if ( wp_remote_retrieve_response_code($response) != 200 ) {
		return wp_remote_retrieve_response_message($response);
	}

	return wp_remote_retrieve_body($response);
}

/**
 * Ajax function to kickoff scraping.
 * Called from our a11y-checker js file.
 */
function walkwest_ajax_website_scraper() {

	// verify nonce
	check_ajax_referer('a11y-website-checker', '_ajax_nonce');

	if ( isset($_POST['action']) && $_POST['action'] == 'ww_website_scrape' ) {
		if ( $_POST['website'] !== '' ) {
			$website_html = scrape($_POST['website']);
			echo $website_html;
		} else {
			echo 'empty';
		}
	} else {
		echo 'unauthorized';
	}

	wp_die();
}
add_action( 'wp_ajax_ww_website_scrape', 'walkwest_ajax_website_scraper' );
add_action( 'wp_ajax_nopriv_ww_website_scrape', 'walkwest_ajax_website_scraper' );