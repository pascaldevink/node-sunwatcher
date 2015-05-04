var buster = require("buster");
var assert = buster.assert;
var Sunwatcher = require('../sunwatcher');

buster.testCase("sunwatcher", {
    tearDown: function () {
        this.clock.restore();
    },

    "watches the sunrise every 2 seconds": function(done) {
        var startTime = new Date(2015, 4, 3, 6, 7, 30).getTime();
        this.clock = this.useFakeTimers(startTime);

        var numberOfSecondsPerTick = 2;
        var numberOfExpectedRuns = 118;

        var sunwatcher = new Sunwatcher(
            52.384353,
            4.894542
        );

        var runs = 0;

        sunwatcher.on("sunrise", function(now, sunrise, sunriseEnd) {
            assert.equals(new Date(2015, 4, 3, 6, 7, 35, 25), sunrise);
            assert.equals(new Date(2015, 4, 3, 6, 11, 30, 107), sunriseEnd);
            runs += 1;
        });

        sunwatcher.startSunWatch();

        for (var tick = 1; tick <= 150; tick++) {
            this.clock.tick(numberOfSecondsPerTick*1000);
        }

        this.clock.tick(numberOfSecondsPerTick*1000);

        assert.equals(numberOfExpectedRuns, runs);
        done();
    },

    "watches the sunset every 2 seconds": function(done) {
        var startTime = new Date(2015, 4, 3, 21, 5, 30).getTime();
        this.clock = this.useFakeTimers(startTime);

        var numberOfSecondsPerTick = 2;
        var numberOfExpectedRuns = 118;

        var sunwatcher = new Sunwatcher(
            52.384353,
            4.894542
        );

        var runs = 0;

        sunwatcher.on("sunset", function(now, sunsetStart, sunset) {
            assert.equals(new Date(2015, 4, 3, 21, 5, 37, 991), sunsetStart);
            assert.equals(new Date(2015, 4, 3, 21, 9, 33, 73), sunset);
            runs += 1;
        });

        sunwatcher.startSunWatch();

        for (var tick = 1; tick <= 150; tick++) {
            this.clock.tick(numberOfSecondsPerTick*1000);
        }

        this.clock.tick(numberOfSecondsPerTick*1000);

        assert.equals(numberOfExpectedRuns, runs);
        done();
    }
});