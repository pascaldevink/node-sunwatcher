sunwatcher
===========

This node.js library watches the current position of the sun and emits events upon sunset and sunrise.

Example
=======

```
var sunwatcher = new Sunwatcher(
    52.384353,
    4.894542
);

sunwatcher.on("sunrise", function(now, sunrise, sunriseEnd) {
    // Do something while the sun is rising
}

sunwatcher.on("sunset", function(now, sunsetStart, sunset) {
    // Do something while the sun is setting
}
```
