deviantART-Gallery-Plugin
=========================

Embed your deviantART gallery with this Javascript plugin.

This plugin combines two of my other projects: [deviantART-API](https://github.com/jamesl1001/deviantART-API) and [simpleslider](https://github.com/jamesl1001/simpleslider)

Usage
-----

1 - Link to `deviantART-gallery.min.css` in the `<head>` tag:

```html
<link rel="stylesheet" type="text/css" href="deviantART-gallery.min.css"/>
```

2 - Add the scripts before the closing `</body>` tag:

```html
<script src="deviantART-gallery-plugin.min.js"></script>
<script>
    deviantARTGalleryPlugin('fu51on', '27123391', '16:9');
</script>
```

`deviantARTGalleryPlugin()` takes three parameters: **username**, **gallery ID** and **aspect ratio**.

For the deviantART URL `http://fu51on.deviantart.com/gallery/27123391/SLR-Photography`, `fu510n` is the **username** and `27123391` is the **gallery ID**.

The **aspect ratio** sets the dimensions of the gallery to ensure that it remains at the same aspect ratio regardless of the screen size.

3 - Add the following element where the gallery is to be positioned:

```html
<div id="deviantART-gallery"></div>
```