/**
 * Data loading class, that either parses pickle files, converts them to JSON, loads
 * and saves classifiers
 *
 * @class dataLoader
 */
var dataLoader = function() {
    this.config = require('./config.js');
    this.timeLogger = require('./time-logger.js');
    this.jsonfile = require('jsonfile');
    this.fs = require('fs');
    this.jpickle = require('jpickle');
    this.natural = require('natural');
};

/**
 * Saves classifier to a file
 *
 * @param {Object} classifier
 * @throws {String} When config option for saving is disabled and this method is called
 */
dataLoader.prototype.saveClassifier = function(classifier){
    if(!this.config.saveClassifier)
        throw 'Tried to save classifier when the option in the config is disabled';

    console.log('Saving classifier');
    var saveLogged = new this.timeLogger('saving a classifier');
    classifier.save(this.config.classifierFile, function (err, classifier) {
        if (err) {
            console.error('An error occured while trying to save classifier', err);
            return;
        }
        saveLogged.finished();

        console.log('Classifier saved successfully');
    });
};

/**
 * Loads classifier from a file
 *
 * @param {Object} natural class reference
 * @param {Callback} callback Callback with classifier
 * @async
 *
 * @throws {String} Callback is required
 */
dataLoader.prototype.loadClassifier = function(callback) {
    var loadClassifierLogger = new this.timeLogger('loading classifier');
    this.natural.BayesClassifier.load(this.config.classifierFile, null, function(err, classifier) {
        if(err) {
            console.error('Error while trying to load classifier');
            return;
        }

        loadClassifierLogger.finished();

        if(!callback)
            throw 'Callback required';

        callback(classifier);
    });
};


/**
 * Saves data array to a file
 *
 * @param {{author: String, words: String}[]} data
 */
dataLoader.prototype.saveData = function(data) {
    this.jsonfile.writeFileSync(this.config.jsonData, data);
};


/**
 * Loads data array from a file
 *
 * @returns {{author: String, words: String}[]}
 */
dataLoader.prototype.loadData = function() {
    return this.jsonfile.readFileSync(this.config.jsonData);
};

/**
 * Reads a file and returns its contents
 *
 * @param {String} path Path to a file that should be read
 *
 * @returns {Object} Buffer
 */
dataLoader.prototype.readFile = function(path) {
    return this.fs.readFileSync(path, 'utf8');
};

module.exports = new dataLoader();