/*globals io, document */
// Begin by declaring your globals
// The socket.io connection to the server
var    connection = io.connect('http://browsertest.htmltoronto.ca:57800'),

    // The document’s stylesheets. Note that this is loaded AFTER the page loads meaning that all the CSS
    // Should be loaded by this time. If you run the javascript before loading the CSS files, this will
    // not capture all of the CSS rules in the page.
    cssRules = document.styleSheets[0].cssRules,

    // Capture all the input elements that have a rel value stating their control elements
    allLayoutInputs = document.querySelectorAll('[rel="layoutControllers"]'),

    // Setup the various function globals
    updateLayout,
    remoteUpdateLayout,
    prepareFormElements;

(function () {
    "use strict"; // Use strict to ensure that we’re following proper javascript guidelines

    // Action to perform upon receiving instructions from the server to update a rule
    remoteUpdateLayout = function (adjustment) {

        // Best practice to declare your variables at the beginning of the function
        var i;

        // Loop through the rules
        for (i = 0; i < cssRules.length; i = i + 1) {

            // Confirm which rule it is that matches the selector text
            if (cssRules[i].selectorText === adjustment.selectorText) {

                // Update the style of the rule’s attribute to the new value
                cssRules[i].style[adjustment.attribute] = adjustment.value;

            }

        }

    };

    // Initializing function to append the change function to the layout controllers
    prepareFormElements = function () {
        var i;
        for (i = 0; i < allLayoutInputs.length; i = i + 1) {

            // Use addEventListener for good practice rather than the onchange method
            allLayoutInputs[i].addEventListener('change', updateLayout);
            // Using the addEventListener method means we can always removeEventListener if we ever needed to
            // and it also allows for additional events to be associated to the event.

        }
    };

    // Capture the update and submit to the server
    updateLayout = function (evt) {

        // Capture the new value to be sent as a raw value
        var newValue = evt.target.value;

        // Depending on the type of data needed for CSS, append the prefix or postfix
        switch (evt.target.dataset.type) {

        // Primary case, most values are simple pixel values
        case 'px':
            newValue = newValue + 'px';
            break;
        // Although generally not a good method, percentage is use on occasion (margin demo for sample only)
        case 'perc':
            newValue = newValue + '%';
            break;
        // Background images are often used, while not in the demo, this is how you would perform it
        case 'url':
            newValue = 'url(' + newValue + ')';
            break;
        }
        // Emit the target information as well as the new data
        connection.emit('submitUpdateLayout', {
            selectorText: evt.target.dataset.target,
            attribute: evt.target.dataset.attribute,
            value: newValue
        });
    };

    // Perform the preperation of the input fields
    prepareFormElements();

    // Add the event listener for remote updating
    connection.on('updateLayout', remoteUpdateLayout);
}());