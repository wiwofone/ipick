$.fn.ipick = function(options) {

    /* Settings and defaults */
    var settings = $.extend({
        closeOnUnfocus: true,
        iconElement: "i",
        iconAttribute: "class",
        iconsPerPage: 48,
        navigationElement: "button",
        nextText: "Next",
        onPick: function() { },
        previousText: "Previous",
        source: "icons.json"
    }, options);
    
    /* Get icons */
    var icons = [];
    $.getJSON(settings.source, function(list) {
           icons = list.icons;
    });
    
    /* Function for checking which navigation buttons to show */
    var checkForButtons = function(tabNumber) {
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
    }

    /* Bind click on the ipick element */
    $(this).mousedown(function(e) {
    
        $element = $(this);
    
        e.preventDefault();
        
        /* Remove any existing picker */
        $(".ipick-container").remove();
        
        /* Create the picker */
        var picker = document.createElement("div");
        $picker = jQuery(picker);
        $picker.addClass("ipick-container");
        
        /* Create picker content */
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
        if (j == icons.length   ) {
            pickerContent += "</tr></table></div>";
        }
        
        /* Add navigation keys for tabs */
        pickerContent += '<div class="ipick-navigation">' +
                             '<' + settings.navigationElement + ' class="ipick-nav-previous">' + 
                             settings.previousText + '</' + settings.navigationElement + '>' +
                             '<' + settings.navigationElement + ' class="ipick-nav-next">' +
                              settings.nextText + '</' + settings.navigationElement + '>' +
                         '</div>';
        
        /* Add content to picker */
        $picker.append(pickerContent);
        
        /* Bind navigation keys */
        $picker.on("click", ".ipick-nav-previous", function() {
            $currentTab = $(".ipick-icons-tab-current");
            prevTab = $currentTab.data("ipick-tab")-1;
            $currentTab.removeClass("ipick-icons-tab-current");
            $('*[data-ipick-tab="' + prevTab + '"').addClass("ipick-icons-tab-current");
            checkForButtons(prevTab);
        });
        
        $picker.on("click", ".ipick-nav-next", function() {
            $currentTab = $(".ipick-icons-tab-current");
            nextTab = $currentTab.data("ipick-tab")+1;
            $currentTab.removeClass("ipick-icons-tab-current");
            $('*[data-ipick-tab="' + nextTab + '"').addClass("ipick-icons-tab-current");
            checkForButtons(nextTab);
        });
        
        /* Icons inside the picker should fire some methods */
        $picker.on("click", ".fa", function(e) {
            e.preventDefault();
            var icon = $(this).data("iconpick-name");
            settings.onPick.call(this, icon);
            $picker.remove();         
        });
        
        /* Change position to bottom left of element clicked */
        $picker.css("top", $(this).offset().top + $(this).height())
            .css("left", $(this).offset().left).show();
                   
        /* Add the picker to the body */
        $("body").prepend($picker);   
        
        /* Immediately check which navigation buttons should be shown */
        checkForButtons(1); 
        

        
        /* Close the picker if it loses focus (default is true) */
        if (settings.closeOnUnfocus) {
            $(document).on("click", function(e) {
                if (!$element.is(e.target) && !$picker.is(e.target)
                    && $picker.has(e.target).length === 0) {
                    $picker.remove();
                }
            });
        }
        
    });
     
    return this;
}