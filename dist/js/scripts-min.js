const Utils={urlWithPrefix:t=>((t=encodeURI(t)).startsWith("http")||t.startsWith("https")||(t="http://"+t),t),isValidURL:t=>!!new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i").test(t),htmlEntities:t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")};var A11yWebsiteChecker=function(t){this.$form=t,this.$loadingText=$(".loading-text"),this.$loadingBar=$(".a11y-website-checker-loading-bar"),this.$initialScreen=$("#a11yFormScreen"),this.$results=$("#a11yResults"),this.appHasError=!1,this.loadingAnimationComplete=!1,this.resultData={},this.websiteUrl="",this.score=0};A11yWebsiteChecker.prototype={maybeShowLoadingText(t){if(this.appHasError)return this.$form.addClass("shown"),void this.$loadingBar.hide();this.$loadingText.text(t)},initLoading(){this.$initialScreen.removeClass("shown"),this.$loadingBar.show().focus(),setTimeout(()=>{this.maybeShowLoadingText("Analyzing website...")},2e3),setTimeout(()=>{this.maybeShowLoadingText("Checking for sufficient color contrast...")},4e3),setTimeout(()=>{this.maybeShowLoadingText("Processing results...")},6e3),setTimeout(()=>{this.appHasError||(this.loadingAnimationComplete=!0,this.showResultsScreen())},8e3)},swapPlaceholderImg(t){this.$results.find(".results-overview-image img").attr("src",t).attr("alt","screenshot for "+this.websiteUrl)},calcScore(){const t=this.resultData.passes.length,e=t/(t+this.resultData.violations.length)*100;let s="bad";return 100===e?s="perfect":e>=90?s="good":e<90&&e>=80&&(s="average"),this.score={raw:e,label:s,output:parseInt(e)+"%"},this.score},showResultsScreen(){this.$loadingBar.hide(),this.$results.addClass("shown").find(".results-content").focus()},displayResults(){const t=this.calcScore(),e=wwA11yVars.resultsText[t.label];this.loadingAnimationComplete&&this.showResultsScreen(),this.swapPlaceholderImg(this.resultData.screenshots.desktop),this.formatResultCategories(),this.$results.addClass("score-"+t.label),this.$results.find(".results-website-name").text(this.websiteUrl),this.$results.find(".results-score").text(t.output),this.$results.find(".results-description").html(e.label),this.$results.find(".instructions").html(e.text)},getResultItemHtml(t,e=null){const s=Utils.htmlEntities(t.description),i=e||Utils.htmlEntities(t.impact);return`<li>\n            <span class="impact-label ${i}">${i} </span>\n            ${s}\n            <a href="${Utils.htmlEntities(t.helpUrl)}" class="link-offsite" target="_blank" rel="noopener">\n                <span class="visually-hidden">Learn more (offsite)</span>\n                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/></svg>\n            </a>\n        </li>`},formatResultCategories(){this.resultData.violations.forEach(t=>{$("#violations ul").append(this.getResultItemHtml(t))}),this.resultData.passes.forEach(t=>{$("#passes ul").append(this.getResultItemHtml(t,"pass"))}),this.resultData.incomplete.forEach(t=>{$("#incomplete ul").append(this.getResultItemHtml(t))})},runAnalysis(t){$.ajax("https://api.walkwest.com/accessibility/scan/"+encodeURIComponent(t),{method:"GET"}).done(e=>{this.appHasError=!1,this.resultData=e,this.websiteUrl=t,this.displayResults()}).fail(t=>{console.log(t),this.appHasError=!0,alert("Apologies, there has been an error. Please try again later."),location.reload()})}},$(document).ready(function(){const t=new A11yWebsiteChecker($("#a11yWebsiteChecker"));t.$form.on("submit",function(e){const s=Utils.urlWithPrefix($(".form-input").val());e.preventDefault(),Utils.isValidURL(s)?(t.initLoading(),t.runAnalysis(s)):alert("It appears there is something wrong with the URL you entered. Please check and try again.")}),window.A11yWebsiteChecker=t});