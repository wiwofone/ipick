(function($) {
    $.fn.ipick = function(options) {
    
        /**
         * Default settings
         *
         * source            : The source from which to get a JSON array of icons.
         * pickerTitle       : Title to show above picker (leave empty for none).
         * iconElement       : The element to be used for the icon.
         * iconAttribute     : The attribute in which to include the icon name.
         * iconsPerPage      : How many icons to show per tab in the picker.
         * navElement        : The element to use for the navigation buttons.
         * navElementClass   : Additional classes for the navigation button.
         * closeText         : The text to use in the "close" navigation button.
         * previousText      : The text to use in the "previous" navigation button.
         * nextText          : The text to use in the "next" navigation button.
         * onCreate          : Callback when picker is opened.
         * onPick            : Callback when an icon is picked (clicked on).
         * onClose           : Callback when picker is closed.
         */
        var defaults = {
            source: "icons.json",
            pickerTitle: "Choose icon",
            iconElement: "i",
            iconAttribute: "class",
            iconsPerPage: 48,
            navElement: "button",
            navElementClass: "",
            closeText: "Close",
            previousText: "Previous",
            nextText: "Next",
            onCreate: function() {},
            onPick: function() {},
            onClose: function() {}
        };
        
        var settings = $.extend({}, defaults, options);
        
        /**
         * Refresh the navigation button by checking if there is a next or
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
        
        /**
         * Removes the element and calls the callback function in the settings.
         */
        
        $.fn.ipick.close = function() {
            $(".ipick-container").remove();
            settings.onClose.call(this);;
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
        $.fn.ipick.populatePicker = function(source, element) {
    
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
            $picker.html('<div class="ipick-icons-tabs-container"></div>' +
                         '<div class="ipick-navigation"></div>');
                         
            if(settings.pickerTitle != "") {
                $picker.prepend('<h1>' + settings.pickerTitle + '</h1>');
            }
            
            /* Add navigational buttons */
            var navigationContent = '<' + settings.navElement + ' class="ipick-nav-close ' +
                                    settings.navElementClass + '">' + settings.closeText + 
                                    '</' + settings.navElement + '>' +
                                    '<' + settings.navElement + ' class="ipick-nav-next ' + 
                                    settings.navElementClass + '">' + settings.nextText + 
                                    '</' + settings.navElement + '> <' + settings.navElement + 
                                    ' class="ipick-nav-previous ' + settings.navElementClass + '">' 
                                    + settings.previousText + '</' + settings.navElement + '>';
            $picker.find(".ipick-navigation").html(navigationContent);
            
            /* Populate picker content */
            $.fn.ipick.populatePicker(settings.source, $picker);
            
            /* Bind navigation keys */
            $picker.on("click", ".ipick-nav-close", function() {
                $.fn.ipick.close();
            });

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
                settings.onPick.call($element, icon);
                $.fn.ipick.close();
            });
            
            /* Change position to bottom left of element clicked */
            $picker.css("top", $(this).offset().top + $(this).height())
                .css("left", $(this).offset().left).show();
                       
            /* Add the picker to the body */
            $("body").prepend($picker);  
            
            /* Start callback */
            settings.onCreate.call(this);
            
        };
    
        /**
         * We bind the ipickBind function to the element that ipick is called on,
         * and return the element which triggered the bind to allow for chaining.
         */
        $(this).click(ipickBind);
        return this;
    };
})(jQuery);