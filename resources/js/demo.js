(function($){
    /**
     * jQuery on document ready
     */
    $(document).ready(function() {

        /**
         * Initialize App
         * @type {A11yWebsiteChecker}
         */
        const App = new A11yWebsiteChecker( $('#a11yWebsiteChecker') );

        /**
         * Listen for form submit to kickoff the app.
         */
        App.$form.on('submit', function(e) {
            const url = Utils.urlWithPrefix( $('.form-input').val() );

            e.preventDefault();

            // return early if URL is not valid
            if ( ! Utils.isValidURL(url) ) {
                alert('It appears there is something wrong with the URL you entered. Please check and try again.');
                return;
            }

            // start loading animations
            App.initLoading();

            // start analysis
            App.runAnalysis(url) ;
        });

        /**
         * Load App to window variable for ease of interaction.
         * @type {A11yWebsiteChecker}
         */
        window.A11yWebsiteChecker = App;

        /**
         * Bootstrap Tooltips
         */
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        const tooltipList = tooltipTriggerList.map( (tooltipTriggerEl) => {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                html: true,
            });
        });

    });
});