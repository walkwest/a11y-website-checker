/**
 * Utility functions
 */
var Utils = {
    /**
     * Update url string with http if not present.
     *
     * @returns {string}
     */
    urlWithPrefix(url) {
        var url = encodeURI(url),
            defaultPrefix = 'http://';

        // Prepend http if http|https is not present
        if (!url.startsWith('http') && !url.startsWith('https')) {
            url = defaultPrefix + url;
        }

        return url;
    },

    /**
     * Make sure we have a valid URL.
     *
     * @param str
     * @returns {boolean}
     */
    isValidURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

        return !!pattern.test(str);
    },
}

/**
 * A11y Website Checker
 *
 * @param $el
 * @constructor
 */
var A11yWebsiteChecker = function( $el ) {
    this.$form = $el;
    this.$loadingText = $('.loading-text');
    this.$loadingBar = $('.a11y-website-checker-loading-bar');
    this.$initialScreen = $('#a11yFormScreen');
    this.$results = $('#a11yResults');
    this.appHasError = false;
}

/**
 * A11yWebsiteChecker Methods
 */
A11yWebsiteChecker.prototype = {

    /**
     * Maybe show loading text.
     * @param text
     */
    maybeShowLoadingText(text) {
        // interrupt loading if app has an error
        if (this.appHasError) {
            this.$form.addClass('shown');
            this.$loadingBar.hide();
            return;
        }
        this.$loadingText.text(text);
    },

    /**
     * Initialize loading sequence and animations.
     */
    initLoading() {
        this.$initialScreen.removeClass('shown');
        this.$loadingBar.show().focus();

        setTimeout(() => {
            this.maybeShowLoadingText('Analyzing headings...');
        }, 2000);

        setTimeout(() => {
            this.maybeShowLoadingText('Checking for sufficient color contrast...');
        }, 4000);

        setTimeout(() => {
            if (!this.appHasError) {
                this.$loadingBar.hide();
                this.$results.addClass('shown').find('.results-content').focus();
            }
        }, 6000);

    },

    /**
     * Update placeholder image in results panel from 3rd
     * party service.
     */
    swapPlaceholderImg() {
        var width = '700',
            height = '760',
            service = 'https://image.thum.io/get/width/' + width + '/crop/' + height + '/',
            website = websiteURLWithPrefix();

        // results in an image 1200x780 -> resized down to 700px wide
        this.$results
            .find('img')
            .attr('src', service + website)
            .attr('alt', 'screenshot for ' + website);
    },

    /**
     * Calculate the score.
     *
     * @param passes
     * @param fails
     * @returns {{output: string, raw: number}}
     */
    calcScore(passes, fails) {
        var valPasses = parseInt(passes),
            valFails = parseInt(fails),
            total = valPasses + valFails,
            score = (valPasses / total) * 100;
        return {
            raw: score,
            output: parseInt(score) + '%',
        };
    },

    /**
     * Get the results text.
     * Managed in a window variable set in PHP.
     *
     * @param score
     * @returns {string}
     */
    getResultsText(score) {
        var $scoreEl = $results.find('.results-score');

        if (score.raw === 100) {
            this.$scoreEl.addClass('pass');
            return wwA11yVars.resultsText.perfect;
        } else if (score.raw >= 80) {
            this.$scoreEl.addClass('pass');
            return wwA11yVars.resultsText.pass;
        } else {
            this.$scoreEl.addClass('fail');
            return wwA11yVars.resultsText.fail;
        }
    },

    /**
     * Display the results.
     * @param results
     */
    displayResults(results) {
        var passes = results.passes.length,
            fails = results.violations.length,
            score = calcScore(passes, fails);

        // append text
        this.$results.find('.website-name').text(websiteURLWithPrefix());
        this.$results.find('.results-score').text(score.output);
        this.$results.find('.results-text').html(getResultsText(score));
        $('#passCount').html(passes);
        $('#failCount').html(fails);
    },

    /**
     * Kick off the analysis with an ajax request to the server
     * which will provide the scraped website html.
     */
    runAnalysis(url) {
        // do ajax request to server to scrape website and return html
        $.ajax( 'http://localhost:3000/accessibility/scan/'+url, {
            method: 'GET',
        }).done(function(data){
            if ( data.length === 0 || data === 'error' ) {
                this.appHasError = true;
                alert('Apologies, there was a problem loading that website.');
            }
            else if ( data === 'empty' ) {
                this.appHasError = true;
                alert('Please enter a website!');
            }
            else {
                this.appHasError = false;
                // load screenshot
                // swapPlaceholderImg();
                // run test
                console.log(data);
            }
        });
    }

}

/**
 * jQuery on document ready
 */
$(document).ready(function() {

    var App = new A11yWebsiteChecker( $('#a11yWebsiteChecker') );

    App.$form.on('submit', function(e) {
        var url = $('.form-input').val();

        e.preventDefault();

        // return early if URL is not valid
        if ( ! Utils.isValidURL( Utils.urlWithPrefix(url) ) ) {
            alert('It appears there is something wrong with the URL you entered. Please check and try again.');
            return;
        }

        // start loading animations
        App.initLoading();

        // start analysis
        App.runAnalysis( encodeURIComponent(url) ) ;
    });

});