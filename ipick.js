$.fn.ipick = function(options) {

    /**
     * Default settings
     *
     * closeOnUnfocus    : If true, closes the picker when picker loses focus.
     * source            : The source from which to get a JSON array of icons.
     * iconElement       : The element to be used for the icon.
     * iconAttribute     : The attribute in which to include the icon name.
     * iconsPerPage      : How many icons to show per tab in the picker.
     * navigationElement : The element to use for the navigation buttons.
     * previousText      : The text to use in the "previous" navigation button.
     * nextText          : The text to use in the "next" navigation button.
     * onPick            : Callback when an icon is picked (clicked on).
     * onClose           : Callback when picker is closed.
     */
    var defaults = {
        closeOnUnfocus: true,
        source: "icons.json",
        iconElement: "i",
        iconAttribute: "class",
        iconsPerPage: 48,
        navigationElement: "button",
        previousText: "Previous",
        nextText: "Next",
        onPick: function() {},
        onClose: function() {}
    };
    
    var settings = $.extend({}, defaults, options);
    
    /**
     * Refresh navigation
     * 
     * Refreshes the navigation button by checking if there is a next or
     * previous tab. If there is no previous tab, the previous button is not
     * visible, with the same functionality for the next button.
     *
     * @param tabNumber The current tab number
     */
    var refreshNavigation = function(tabNumber) {
        firstTab = tabNumber - 1;
        if($('*[data-ipick-tab="' + firstTab + '"').length == 0) {
            $(".ipick-nav-previous").hide();
        } else {
            $(".ipick-nav-previous").show();
        }
        
        lastTab = tabNumber + 1;
        if($('*[data-ipick-tab="' + lastTab + '"').length == 0) {
            $(".ipick-nav-next").hide();
        } else {
            $(".ipick-nav-next").show();
        }
    };
    
    var closePicker = function(element) {
        element.remove();
        settings.onClose();
    };
    
    /**
     * Fetch icons and populate the picker with them
     *
     * Icons are fetched from a JSON file with a JSON array inside. An example
     * is included both with the plugin and below. Each name in the array is
     * then used as an attribute value for an element to generate an icon.
     * E.g. "align-right" below might generate <i class="align-right"></i>.
     *
     * {icons : [
     *     "align-right",
     *     "align-left",
     *     "justify"
     * ]}
     */    
    var populatePicker = function(source, element) {

        var icons = [];
        
        $.getJSON(source, function(list) {
            icons = list.icons;
            element.remove(".ipick-icons-tab");
        
            var pickerContent = '<div class="ipick-icons-tab ipick-icons-tab-current" data-ipick-tab="1"><table><tr>';
            var i = 0;
            var j = 0;
            var t = 1;
            icons.forEach(function(icon) {       
                if (i % 8 == 0) {
                    pickerContent += "</tr><tr>";
                }
                
                if (j % settings.iconsPerPage == 0 && j != 0) {
                    pickerContent += "</tr></table></div>";
                    if (icons.length > i) {
                        i = 0;
                        t++;
                        pickerContent += '<div class="ipick-icons-tab" data-ipick-tab="' + t + '"><table><tr>';
                    }
                }
                
                pickerContent += '<td><' + settings.iconElement + ' data-iconpick-name="'
                               + icon + '" ' + settings.iconAttribute + '="' + icon + '"></'
                               + settings.iconElement + '></td>';
                
                i++;
                j++;
            });
            if (j == icons.length) {
                pickerContent += "</tr></table></div>";
            }
            
            /* Add content to picker and refresh navigation */
            element.find(".ipick-icons-tabs-container").html(pickerContent);
            refreshNavigation(0);
        })
            .fail(function() {
            
                element.find(".ipick-icons-tabs-container").html("No icons were found.");
                
            });
    };
    
    /**
     * ipick bind
     * 
     * The main function that is binded to a user action. Creates a picker and
     * displays it next to the element that triggers the event.
     */
    var ipickBind = function(e) {
    
        $element = $(this);
    
        e.preventDefault();
                
        /* Remove any existing picker */
        $(".ipick-container").remove();
        
        /* Create the picker */
        var picker = document.createElement("div");
        $picker = jQuery(picker);
        $picker.addClass("ipick-container");
        $picker.html('<div class="ipick-icons-tabs-container"></div><div class="ipick-navigation"></div>');
        
        /* Add navigational buttons */
        var navigationContent = '<' + settings.navigationElement + ' class="ipick-nav-previous">' + 
                                settings.previousText + '</' + settings.navigationElement + '>' +
                                '<' + settings.navigationElement + ' class="ipick-nav-next">' +
                                settings.nextText + '</' + settings.navigationElement + '>';
        $picker.find(".ipick-navigation").html(navigationContent);
        
        /* Populate picker content */
        populatePicker(settings.source, $picker);
        
        /* Bind navigation keys */
        $picker.on("click", ".ipick-nav-previous", function() {
            $currentTab = $(".ipick-icons-tab-current");
            prevTab = $currentTab.data("ipick-tab")-1;
            $currentTab.removeClass("ipick-icons-tab-current");
            $('*[data-ipick-tab="' + prevTab + '"').addClass("ipick-icons-tab-current");
            refreshNavigation(prevTab);
        });
        
        $picker.on("click", ".ipick-nav-next", function() {
            $currentTab = $(".ipick-icons-tab-current");
            nextTab = $currentTab.data("ipick-tab")+1;
            $currentTab.removeClass("ipick-icons-tab-current");
            $('*[data-ipick-tab="' + nextTab + '"').addClass("ipick-icons-tab-current");
            refreshNavigation(nextTab);
        });
        
        /* Icons inside the picker should fire some methods */
        $picker.on("click", ".fa", function(e) {
            e.preventDefault();
            var icon = $(this).data("iconpick-name");
            settings.onPick.call(this, icon);
            closePicker($picker);      
        });
        
        /* Change position to bottom left of element clicked */
        $picker.css("top", $(this).offset().top + $(this).height())
            .css("left", $(this).offset().left).show();
                   
        /* Add the picker to the body */
        $("body").prepend($picker);   
        
        /* Immediately check which navigation buttons should be shown */
        refreshNavigation(1);
        
        /* Close the picker if it loses focus (default is true) */
        if (settings.closeOnUnfocus) {
            $(document).on("click", function(e) {
                if (!$element.is(e.target) && !$picker.is(e.target)
                    && $picker.has(e.target).length === 0) {
                    closePicker($picker);
                }
            });
        }
        
    };

    /**
     * We bind the ipickBind function to the element that ipick is called on,
     * and return the element which triggered the bind to allow for chaining.
     */
    $(this).click(ipickBind);
    return this;
};