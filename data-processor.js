/**
 * Main class that provides basic data processing, such as converting from pickle format to
 * regular Javascript's arrays
 *
 * @class dataProcessor
 * @constructor
 * @param {jpickle} jpickle jPickle module
 * @param {String|Buffer} authorsData
 * @param {String|Buffer} wordData
 */
var dataProcessor = function(jpickle, authorsData, wordData) {
    /**
     * An array with authors and words from their emails.
     *
     * @property data
     * @type {{author: String, words: String}[]}
     */
    this.data = [];
    this.jpickle = jpickle;

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



    console.log('Data processor initiated');


    this.parseAuthors(authorsData.toString());
    this.parseWordData(wordData.toString());

    console.log('\tParsed data, beginning trimming');
    this.trimData();

    console.log('Data processor finished it\'s task');
};


/**
 * Parses authors from Python's pickle format to an array
 *
 * @method parseAuthors
 * @param {String} authorsData Contents of the word data to be parsed (formatted in pickle)
 */
dataProcessor.prototype.parseAuthors = function(authorsData) {
    this.authorsData = authorsData;
    console.log('\tParsing authors');

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
    console.log('\tFinished parsing authors');
};

/**
 * Parses words from Python's pickle format to an array
 *
 * @method parseWordData
 * @param {String} wordData Contents of the word data to be parsed (formatted in pickle)
 */
dataProcessor.prototype.parseWordData = function(wordData) {
    this.wordData = wordData;
    console.log('\tParsing word data');

    var unpickledWords = this.jpickle.loads(wordData),
        self = this;

    unpickledWords.forEach(function(words, index) {
        self.data[index].words = words;
    });

    this.states.wordsParsed = true;
    console.log('\tFinished parsing words');
};


/**
 * Deletes empty rows and trims words
 *
 * @method trimData
 * @throws {String} Error when tries to trim before words were parsed
 */
dataProcessor.prototype.trimData = function() {
    if(this.states.wordsParsed) {
        var self = this;

        this.data.forEach(function (email, index) {
            if (!email.words || email.words === null) {
                self.data.splice(index, 1);
                return;
            }
            self.data[index].words = email.words.trim();
        });

        this.states.trimmed = true;
    }
    else
        throw 'Tried to trim words before they were parsed';
};

module.exports = dataProcessor;