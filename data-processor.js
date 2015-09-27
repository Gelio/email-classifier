/**
 * Main class that provides basic data processing, such as converting from pickle format to
 * regular Javascript's arrays
 *
 * @class dataProcessor
 * @constructor
 * @param {String|Object} authorsData Either a string or a buffer
 * @param {String|Object} wordData Either a string or a buffer
 */
var dataProcessor = function(authorsData, wordData) {
    /**
     * An array with authors and words from their emails.
     *
     * @property data
     * @type {{author: String, words: String}[]}
     */
    this.data = [];
    this.jpickle = require('jpickle');
    this.timeLogger = require('./time-logger.js');
    this.colors = require('colors');

    /**
     * Checks when different tasks are finished
     *
     * @property states
     * @type {{authorsParsed: boolean, wordsParsed: boolean, trimmed: boolean}}
     */
    this.states = {
        authorsParsed: false,
        wordsParsed: false,
        trimmed: false
    };



    console.log('Data processor initiated'.blue);

    this.parseAuthors(authorsData.toString());
    this.parseWordData(wordData.toString());

    console.log('\tParsed data, beginning trimming'.green);
    this.trimData();

    console.log('Data processor finished it\'s task'.green);
};


/**
 * Parses authors from Python's pickle format to an array
 *
 * @method parseAuthors
 * @param {String} authorsData Contents of the word data to be parsed (formatted in pickle)
 */
dataProcessor.prototype.parseAuthors = function(authorsData) {
    this.authorsData = authorsData;
    console.log('\tParsing authors'.blue);

    var parseAuthorsLogger = new this.timeLogger('parsing authors');
    for(var i=0; i < 4; ++i)
        this.data.push({});

    var unpickledAuthors = this.jpickle.loads(authorsData),
        self = this;

    unpickledAuthors.forEach(function(author) {
        self.data.push({
            author: author,
            words: null
        });
    });

    this.states.authorsParsed = true;
    parseAuthorsLogger.finished();
    console.log('\tFinished parsing authors'.green);
};

/**
 * Parses words from Python's pickle format to an array
 *
 * @method parseWordData
 * @param {String} wordData Contents of the word data to be parsed (formatted in pickle)
 */
dataProcessor.prototype.parseWordData = function(wordData) {
    this.wordData = wordData;
    console.log('\tParsing word data'.blue);

    var parseWordsLogger = new this.timeLogger('parsing words');
    var unpickledWords = this.jpickle.loads(wordData),
        self = this;

    unpickledWords.forEach(function(words, index) {
        self.data[index].words = words;
    });

    this.states.wordsParsed = true;
    parseWordsLogger.finished();
    console.log('\tFinished parsing words'.green);
};


/**
 * Deletes empty rows and trims words
 *
 * @method trimData
 * @throws {String} Error when tries to trim before words were parsed
 */
dataProcessor.prototype.trimData = function() {
    if(this.states.wordsParsed) {
        var self = this,
            trimLogger = new this.timeLogger('trimming data');

        this.data.forEach(function (email, index) {
            if (!email.words || email.words === null || !email.author || email.author === null) {
                self.data.splice(index, 1);
                return;
            }
            self.data[index].words = email.words.trim();
        });

        this.states.trimmed = true;
        trimLogger.finished();
    }
    else
        throw 'Tried to trim words before they were parsed';
};

module.exports = dataProcessor;