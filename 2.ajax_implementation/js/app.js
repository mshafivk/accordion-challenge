(function() {
    /*assume that there can be multiple accordions*/
    var accordions = document.querySelectorAll('.accordion');

    /*Will make sure content loaded only once*/
    var contentAvailableForOptions = {};

    for (var i = 0; i < accordions.length; i++) {
        updateAccordionEvents(accordions[i]);
    };

    //Autoselects first item
    accordions[0].getElementsByClassName('accordion-header')[0].click();

    /**
     * bind click events to accordion item
     *
     * @param accordion
     */
    function updateAccordionEvents(accordion) {
        optionsNodes = document.querySelectorAll('.accordion-header');
        accordion.addEventListener('click', function(event) {
            onAccordionOptionClick(event.target, optionsNodes);
        });
    };


    /**
     * Accordion Option click handler.Invokes httpRequest to load Content
     *
     * @param option (selected item)
     * @param optionNodes
     */
    function onAccordionOptionClick(option, optionsNodes) {
    	var arrayOfOptions = Array.from(optionsNodes);
        var optionIndex = arrayOfOptions.indexOf(option);
        if (option.innerHTML && optionIndex >=0 && !contentAvailableForOptions[optionIndex]) {
            loadAccordionContent(option, function(responseData) {
                contentAvailableForOptions[optionIndex] = true;
                renderContent(responseData, option);
            }, function(error) {
                //error response callback
                var errorMessage = 'UNABLE TO LOAD CONTENT..';
                renderContent(errorMessage, option);
            });
        }
    }
    /**
     * render content to DOM
     *
     * @param htmlToRender
     * @param accordionItem (on which content has to be rendered)
     */
    function renderContent(htmlToRender, accordionItem) {
        var contentEl = document.createElement('div');
        contentEl.className = "accordion-content";
        contentEl.innerHTML = htmlToRender;
        accordionItem.insertAdjacentElement('afterend', contentEl);
    }

    /**
     * requests to load accordion content
     *
     * @param option
     * @param successCallback
     * @param errorCallback
     */
    function loadAccordionContent(option, successCallback, errorCallback) {
        /*File names to be fetched will be matching with option label.*/
        var optionText = option.innerHTML.trim();
        var file = getAccordionFileName(optionText);
        var request = new XMLHttpRequest();
        request.open('GET', './public/content/' + file + '.html', true);
        request.onload = function() {
            if (request.status == 200) {
                var response = request.responseText;
                successCallback(response);
            } else {
                // We reached our target server, but it returned an error
                errorCallback(response)
            }
        };

        request.onerror = function(error) {
            errorCallback(error)
        };

        request.send();
    }
    /**
     * 
     * @param optionText
     * @return key
     */
    function getAccordionFileName(optionText) {
    	var contentMap = {
            1: "Option 1",
            2: "Option 2",
            3: "Option 3"
        };
        //Returns the index of otpion Text if it matches in the Object
        return Object.keys(contentMap).find(function (element) {
        	return contentMap[element] === optionText;
        });
    }
})();
