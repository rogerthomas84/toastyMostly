Toasty Mostly
=============

Toasty Mostly is a simple and straightforward JavaScript function for Bootstrap 4 and jQuery to ease toast management.

## Quick Start

```html
<head>
    <link href="/path/to/bootstrap-4.css" rel="stylesheet">
    
    <script src="/path/to/jquery.js"></script>
    <script src="/path/to/bootstrap-4.js"></script>
    
    <script src="/path/to/toastyMostly/dist/toastyMostly.min/js"></script>
</head>
<body>
    
    <script>
    let toasty = toastyMostly({delay:2000, autohide:true, animation:true});
    let toastId = toasty.send({'title':'Saving','body': 'The system is saving your last action.', 'time': 'Just now'});
    setTimeout(function(){
        toasty.update(toastId, {'title':'Saving','body': 'The system is STILL saving your last action.', 'time': '2 secs ago'});
    }, 2000);
    </script>
</body>
```

## Defaults

Options to configure toastyMostly can be passed in at point of requesting an area.

The default values are:

```javascript
let toastyMostlyConfig = {
    animation: true,
    autohide: true,
    delay: 2000,
    style: {
        'position': 'fixed', 
        'top': '100px', 
        'right': '0', 
        'height': '0', 
        'z-index': '2000', 
        'width': '250px'
    }
}
```

## Constructor Options:

* `animation`
    * Default: `true`
    * Apply a CSS fade transition to the toast
* `autohide`
    * Default `true`
    * Auto hide the toast
* `delay`
    * Default: `2000`
    * Delay hiding the toast (ms)
* `style`
    * Default: `{'position':'fixed', 'top':'100px', 'right':'0', 'height':'0', 'z-index':'2000', 'width':'250px'}`
    * A key value pair object for assigning CSS properties to the toasts.

## Sending a toast:

After construction of toastyMostly, you don't have to provide any config options from that point onwards.

To use toastyMostly again, simply call `toastyMostly()` (without any configuration parameters) and the existing instance will be used.

If you're interested in where the instance is stored, it's in `window._toastyMostly`.

```javascript
let myToastId = toasty.send(
    {
        title: null, // Required, the title of the toast
        body: null, // Required, the body of the toast
        time: null, // Optional, a string to show on the right of the header, for example '11 mins ago'
        class: null,  // Optional, default null, a custom class name (or class names) to assign to this toast.
        id: null, // Optional, default null, a custom ID to assign to this toast.
        closeBtn: false, // Optional, default false, whether to show a close button on the toast.
        append: true, // Optional, default true, whether to append or prepend (bottom or top) this toast to the current list.
        animation: true, // Optional, overrides the value passed into the constructor.
        autohide: true, // Optional, overrides the value passed into the constructor.
        delay: 2000 // Optional, overrides the value passed into the constructor.
    }
);
```

## Updating an existing toast:

Updating an existing toast will only occur if you provide either the `title`, `body` or `time`. If you want a value to remain unchanged, omit it or assign it the value of `null.

**Please note:** If you're trying to update the `time` value then you would have needed to assign a `time` at the point of `send()`. If you don't need one when first sending the toast, assign the value of `''`

```javascript
toasty.update(
    myToastId,
    {
        title: null, // Required, the title of the toast
        body: null, // Required, the body of the toast
        time: null, // Optional, a string to show on the right of the header, for example '11 mins ago'
        addClass: null, // Optional, a custom class name (or class names) to add to this toast.
        removeClass: null // Optional, a custom class name (or class names) to remove to this toast.
    }
);
```

## Removing a toast manually:

Removing a toast will immediately call `hide` against the toast and remove any hidden

```javascript
toasty.remove(toastId);
```

## Use case example:

```javascript
let toasty = toastyMostly(
    {
        autohide: false // persist this toast.
    }
);
let toastId = toasty.send(
    {
        'title': 'Saving',
        'body': 'The system is saving your last action.',
        'class': 'isInProgress isPending', // An initial couple of classes to style the toast as in progress
        'time': '', // We want to add the element, but don't set a value.
        'closeBtn': false // We don't want a close button
    }
);

setTimeout(function() {
    toasty.update(
        toastId,
        {
            'title': 'Save error',
            'body': 'The system failed to save your last action. Possible reasons are<br />&middot; The server errored.<br />&middot; The data was invalid.',
            'time': 'Just now', // set the time to now
            'addClass': 'isFailed', // Add a class for failure
            'removeClass': 'isInProgress isPending' // Remove the 2 initial classes
        }
    );
}, 2000);

setTimeout(function() {
    toasty.update(
        toastId,
        {
            'time': '2 seconds ago'
        }
    );
}, 4000);

setTimeout(function() {
    toasty.update(
        toastId,
        {
            'title': 'Change the title',
            'body': '... and the body.',
            'time': '2 seconds ago'
        }
    );
}, 4000);

setTimeout(function() {
    // Hide the toast eventually.
    toasty.remove(toastId);
}, 8000);
```
