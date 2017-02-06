var EventEmitter = require('events').EventEmitter;
var SunCalc = require('suncalc');
var util = require('util');

function Sunwatcher(config) {
    this._config = config;
}

module.exports = function (latitude, longitude) {
    var config = {
        latitude: latitude,
        longitude: longitude
    };

    return new Sunwatcher(config);
};

util.inherits(Sunwatcher, EventEmitter);

/**
 * Starts watching the current time and the time of sunset/sunrise. While the sun is setting
 * an event is emitted with the calculated brightness.
 *
 * The brightness is the inverted value of the remaining time until sunset, adjusted for the
 * maximum amount of brightness that is given.
 *
 */
Sunwatcher.prototype.startSunWatch = function () {
    var self = this;

    var sunPosition = getSunPosition(self._config.latitude, self._config.longitude);

    setInterval(function () {
        sunPosition = getSunPosition(self._config.latitude, self._config.longitude);
    }, 3600000);
    // Runs every hour so that no matter what time startSunWatch is called, times will always be right

    setInterval(function () {
        var now = new Date();

        if (isSunBetween('sunrise', 'sunriseEnd', now, sunPosition)) {
            self.emit("sunrise", now, sunPosition.sunrise, sunPosition.sunriseEnd);
        }

        if (isSunBetween('sunsetStart', 'sunset', now, sunPosition)) {
            self.emit("sunset", now, sunPosition.sunsetStart, sunPosition.sunset);
        }

        var nauticalDuskTimeDiff = getDifferenceBetweenNowAndSunType('nauticalDusk', now, sunPosition)
        if (nauticalDuskTimeDiff <= 0 && nauticalDuskTimeDiff >= -10000) {
            self.emit("nauticalDusk", now, sunPosition.nauticalDusk, sunPosition.nauticalDusk);
        }

    }, 2000); // Runs every 2 seconds
};

/**
 * Returns the times of the positions of the sun.
 *
 * @returns {*}
 */
function getSunPosition(latitude, longitude) {
    return SunCalc.getTimes(
        new Date(),
        latitude,
        longitude
    );
}

/**
 * Calculates if the sun is between 2 positions
 *
 * @param fromType
 * @param toType
 * @param now
 * @param sunPositions
 *
 * @returns {boolean}
 */
function isSunBetween(fromType, toType, now, sunPositions) {
    return (
        getDifferenceBetweenNowAndSunType(fromType, now, sunPositions) <= 0 &&
        getDifferenceBetweenNowAndSunType(toType, now, sunPositions) >= 0
    );
}

/**
 * Gets the difference (in ms) between now and the given type of sun event.
 *
 * @param type
 * @param now
 * @param sunPositions
 *
 * @returns {number}
 */
function getDifferenceBetweenNowAndSunType(type, now, sunPositions) {
    return sunPositions[type].getTime() - now.getTime();
}
