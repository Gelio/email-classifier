/**
 * Used to log durations of various operations
 *
 * @class timeLogger
 * @param {String} action Action that this logger is for
 */
var timeLogger = function(action) {
    this.config = require('./config.js');
    this.action = action.charAt(0).toUpperCase() + action.slice(1);
    this.endTime = null;
    this.startTime = new Date().getTime();
    this.colors = require('colors');
};

/**
 * Sets the endTime and prints out message
 *
 * @method finished
 */
timeLogger.prototype.finished = function() {
    this.endTime = new Date().getTime();

    if(this.config.logDurationInfo)
        console.log(('Time logger: '.bgGreen + this.action + ' took ' + (this.endTime-this.startTime) + ' ms').cyan);
};

module.exports = timeLogger;