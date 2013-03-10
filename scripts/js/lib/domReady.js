/**
 * @license RequireJS domReady 2.0.1 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/domReady for details
 */

/**
 * I changed this a little. Basically removed support for old browsers
 * and server-side.
 */


define(function () {
    'use strict';

    var isTop, testDiv, scrollIntervalId,
        isPageLoaded = false,
        doc = document,
        readyCalls = [];

    function runCallbacks(callbacks) {
        var i;
        for (i = 0; i < callbacks.length; i += 1) {
            callbacks[i](doc);
        }
    }

    function callReady() {
        var callbacks = readyCalls;

        if (isPageLoaded) {
            //Call the DOM ready callbacks
            if (callbacks.length) {
                readyCalls = [];
                runCallbacks(callbacks);
            }
        }
    }

    /**
     * Sets the page as loaded.
     */
    function pageLoaded() {
        if (!isPageLoaded) {
            isPageLoaded = true;
            if (scrollIntervalId) {
                clearInterval(scrollIntervalId);
            }

            callReady();
        }
    }

    
        
    document.addEventListener("DOMContentLoaded", pageLoaded, false);
    window.addEventListener("load", pageLoaded, false);
    
    /**
     * Check if document already complete, and if so, just trigger page load
     * listeners. Latest webkit browsers also use "interactive", and
     * will fire the onDOMContentLoaded before "interactive" but not after
     * entering "interactive" or "complete". More details:
     * http://dev.w3.org/html5/spec/the-end.html#the-end
     * http://stackoverflow.com/questions/3665561/document-readystate-of-interactive-vs-ondomcontentloaded
     * Hmm, this is more complicated on further use, see "firing too early"
     * bug: https://github.com/requirejs/domReady/issues/1
     * so removing the || document.readyState === "interactive" test.
     * There is still a window.onload binding that should get fired if
     * DOMContentLoaded is missed.
     */
    
    if (document.readyState === "complete") {
        pageLoaded();
    }
    

    /** START OF PUBLIC API **/

    /**
     * Registers a callback for DOM ready. If DOM is already ready, the
     * callback is called immediately.
     * @param {Function} callback
     */
    function domReady(callback) {
        if (isPageLoaded) {
            callback(doc);
        } else {
            readyCalls.push(callback);
        }
        return domReady;
    }


    // domReady.version = '2.0.1';
    domReady.version = 'custom';

    /**
     * Loader Plugin API method
     */
    domReady.load = function (name, req, onLoad, config) {
        if (config.isBuild) {
            onLoad(null);
        } else {
            domReady(onLoad);
        }
    };

    /** END OF PUBLIC API **/

    return domReady;
});