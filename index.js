var fs = require('fs'),
    natural = require('natural'),
    jpickle = require('jpickle'),
    config = require('./config.js'),
    dataProcessorModule = require('./data-processor.js');



// Fetching data
console.log('Reading config files\n');

console.log('\t[0/2] Beginning to read authors file');
fs.readFile(__dirname + config.authors, function(errAuthors, authorsData) {
    if(errAuthors)
        return console.error(errAuthors);

    console.log('\t[1/2] Finished reading authors file');
    console.log('\t[1/2] Beginning to read word data file');



    fs.readFile(__dirname + config.wordData, function(errWord, wordData) {
        if(errWord)
            return console.error(errWord);

        console.log('\t[2/2] Finished reading word data file\n');

        var dataProcessor = new dataProcessorModule(jpickle, authorsData, wordData),
            classifier = new natural.BayesClassifier();

        classifier.events.on('trainedWithDocument', function(obj) {
            console.log(obj);
        });

        dataProcessor.data.slice(0, 10).forEach(function(email) {
            classifier.addDocument(email.words, email.author);
        });

        console.log('\n\nThere are ' + dataProcessor.data.length + ' emails');
    });
});