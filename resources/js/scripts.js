(function($) {
    $(document).ready(function() {

        var shadow = document.getElementById('app').attachShadow({mode: 'open'}),
            $form = $('#a11yWebsiteChecker'),
            $input = $('#a11yWebsiteChecker .form-input'),
            $button = $('#a11yWebsiteChecker .form-submit'),
            $loadingText = $('.loading-text'),
            $loadingBar = $('.a11y-website-checker-loading-bar'),
            $results = $('#a11yResults'),
            appHasError = false;

        function maybeShowLoadingText(text) {
            // interrupt loading if app has an error
            if ( appHasError ) {
                $form.addClass('shown');
                $loadingBar.hide();
                return;
            }
            $loadingText.text(text);
        }

        /**
         * Initialize loading sequence and animations.
         */
        function initLoading() {
            $form.removeClass('shown');
            $loadingBar.show().focus();

            setTimeout(function(){
                maybeShowLoadingText('Analyzing headings...');
            }, 2000);

            setTimeout(function(){
                maybeShowLoadingText('Checking for sufficient color contrast...');
            }, 4000);

            setTimeout(function(){
                if ( !appHasError ) {
                    $loadingBar.hide();
                    $results.addClass('shown').find('.results-content').focus();
                }
            }, 6000);

        }

        /**
         * Update url string with http if not present.
         *
         * @returns {string}
         */
        function websiteURLWithPrefix() {
            var url = encodeURI( $input.val() ),
                defaultPrefix = 'http://';

            // Prepend http if http|https is not present
            if ( !url.startsWith('http') && !url.startsWith('https') ) {
                url = defaultPrefix + url;
            }

            return url;
        }

        /**
         * Update placeholder image in results panel from 3rd
         * party service.
         */
        function swapPlaceholderImg() {
            var width = '700',
                height = '760',
                service = 'https://image.thum.io/get/width/' + width + '/crop/' + height + '/',
                website = websiteURLWithPrefix();

            // results in an image 1200x780 -> resized down to 700px wide
            $results
                .find('img')
                .attr('src', service + website)
                .attr('alt', 'screenshot for ' + website);
        }

        /**
         * Calculate the score.
         *
         * @param passes
         * @param fails
         * @returns {{output: string, raw: number}}
         */
        function calcScore( passes, fails ) {
            var valPasses = parseInt(passes),
                valFails = parseInt(fails),
                total = valPasses + valFails,
                score = (valPasses/total) * 100;
            return {
                raw: score,
                output: parseInt(score) + '%',
            };
        }

        /**
         * Get the results text.
         * Managed in a window variable set in PHP.
         *
         * @param score
         * @returns {string}
         */
        function getResultsText( score ) {
            var $scoreEl = $results.find('.results-score');
            if ( score.raw === 100 ) {
                $scoreEl.addClass('pass');
                return wwA11yVars.resultsText.perfect;
            } else if ( score.raw >= 80 ) {
                $scoreEl.addClass('pass');
                return wwA11yVars.resultsText.pass;
            } else {
                $scoreEl.addClass('fail');
                return wwA11yVars.resultsText.fail;
            }
        }

        /**
         * Display the results.
         * @param results
         */
        function displayResults( results ) {
            var passes = results.passes.length,
                fails = results.violations.length,
                score = calcScore(passes, fails);

            console.log(results);

            // append text
            $results.find('.website-name').text( websiteURLWithPrefix() );
            $results.find('.results-score').text( score.output );
            $results.find('.results-text').html( getResultsText(score) );
            $('#passCount').html(passes);
            $('#failCount').html(fails);
        }

        /**
         * Run the Axe accessibility test.
         *
         * @param html string
         */
        function runAxeTest( html ) {
            var el = document.createElement( 'html' );

            // just in case, make sure we start with an empty shadow dom
            shadow.innerHTML = '';

            // Replace relative urls with absolute so that CSS and assets work
            var modHtml = html.replace(/href="\//g, 'href="' + websiteURLWithPrefix() + '/');

            // Append html to shadow dom so AXE can test it.
            el.innerHTML = modHtml;
            shadow.appendChild(el);

            // Run axe
            axe.run(
                '#app',
                {
                    runOnly: ['wcag2a', 'wcag2aa', 'best-practice'],
                    rules: {
                        'html-has-lang': { enabled: false },
                        'valid-lang': { enabled: false }
                    }
                },
                function (err, results) {
                    if (err) throw err;
                    displayResults(results);
                }
            );
        }

        /**
         * Make sure we have a valid URL.
         *
         * @param str
         * @returns {boolean}
         */
        function isValidURL(str) {
            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            return !!pattern.test(str);
        }

        /**
         * Kick off the analysis with an ajax request to the server
         * which will provide the scraped website html.
         */
        function runAnalysis() {
            // do ajax request to server to scrape website and return html
            $.ajax( '/wp-admin/admin-ajax.php', {
                method: 'POST',
                data: {
                    'action': 'ww_website_scrape',
                    '_ajax_nonce': $button.data('nonce'),
                    'website': websiteURLWithPrefix(),
                }
            }).done(function(data){
                if ( data.length === 0 || data === 'error' ) {
                    appHasError = true;
                    alert('Apologies, there was a problem loading that website.');
                }
                else if ( data === 'empty' ) {
                    appHasError = true;
                    alert('Please enter a website!');
                }
                else {
                    appHasError = false;
                    // load screenshot
                    swapPlaceholderImg();
                    // run test
                    runAxeTest(data);
                }
            });
        }

        /**
         * Listen for click event on form submit to kickoff process.
         */
        $button.on('click', function(e) {
            e.preventDefault();
            // return early if URL is not valid
            if ( ! isValidURL( websiteURLWithPrefix() ) ) {
                alert('It appears there is something wrong with the URL you entered. Please check and try again.');
                return;
            }
            // start loading animations
            initLoading();
            // start analysis
            runAnalysis();
        });


    });
})(jQuery);