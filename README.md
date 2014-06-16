# ipick

A lightweight plugin jQuery plugin for picking icons from an icon font in a simple way.

This plugin was created semi-experimentally to learn jQuery plugin programming and Bower packaging, but also for use in my projects.

## Download
You can download ipick in one of several ways.

### Use Bower (recommended)
```shell
$ bower install ipick
```

### Clone the repo
```shell
$ git clone git://github.com/wiwofone/ipick.git
```

### Download the zip file
You can get the repo zip file [here](https://github.com/wiwofone/ipick/archive/master.zip).

## Installation

First of all, make sure that jQuery is included in your document before the plugin is initialized.

Include the CSS file to allow for default styling of the picker:

```html
<link rel="stylesheet" href="css/ipick.css">
```

Then, include the plugin. Do this *after* the jQuery library:

```html
<script src="js/ipick.min.js"></script>
```

## Usage
ipick fetches icons from any file with a JSON array in it. See the sample `icons.json` file for an example with FontAwesome.

The simplest way to initialize ipick is to bind it to any element (in this case, the defaults seen below are used):

```html
<script type="text/javascript">
    jQuery(document).ready(function($) {
        $(".myPicker").ipick();
    }
</script>
```

Or, you can initialize it with any of the following options:
```html
<script type="text/javascript">
    jQuery(document).ready(function($) {
        $(".myPicker").ipick({
            source: "icons.json",         /// Source file for icon names
            iconElement: "i",             /// HTML element for the icon
            iconAttribute: "class",       /// HTML element attribute for name
            iconsPerPage: 48,             /// Icons per tab
            navElement: "button",         /// HTML element for nav-buttons
            navElementClass: ""           /// Additional classes for the navigation button
            closeText: "Close",           /// Text in "close" button
            previousText: "Previous",     /// Text in "previous" button
            nextText: "Next",             /// Text in "next" button
            onPick: function() {},        /// Callback when an icon is picked
            onClose: function() {}        /// Callback when picker is closed
        });
    }
</script>
```

## License
See `LICENSE`.

## Authors
* Shahin Zarrabi - shahin@wiwo.se - [@wiwofone](http://twitter.com/wiwofone) - http://www.wiwo.se