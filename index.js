var fs = require('fs'),
    natural = require('natural'),
    jpickle = require('jpickle'),
    config = require('./config.js'),
    jsonfile = require('jsonfile'),
    timeLogger = require('./time-logger.js'),
    dataLoader = require('./data-loader.js'),
    dataProcessorModule = require('./data-processor.js');


var emailData = null, // array of objects
    classifier = null,  // naive bayes classifier
    testData = null;  // data to be classified

if(config.loadExistingClassifier && !config.forceClassifierTeaching) {
    dataLoader.loadClassifier(function(naiveClassifier) {
        classifier = naiveClassifier;
        console.log('Classifier loaded'.green.bold);

        // Load data
        var loadDataLogger = new timeLogger('loading data from JSON');
        emailData = dataLoader.loadData();
        loadDataLogger.finished();

        if(config.limitData)
            emailData.splice(0, Math.floor(emailData.length*config.limitData));

        // Generate test data
        testData = emailData.slice(0, Math.floor(emailData.length*config.testDataPercentage));

        // TODO: Proceed with classifying
        classify(classifier, testData);
    });
}
else {
    // Check if data was parsed already (file exists)
    fs.stat(config.jsonData, function(err, stat) {
        if(err == null && !config.forceDataParsing) {
            // Load data
            var loadDataLogger = new timeLogger('loading data from JSON');
            emailData = dataLoader.loadData();
            loadDataLogger.finished();
        }
        else {
            // Parse data
            var parseDataLogger = new timeLogger('parsing data');

            var authorsBuffer, wordsBuffer;

            var authorsReadLogger = new timeLogger('reading authors file');
            authorsBuffer = dataLoader.readFile(config.authors);
            authorsReadLogger.finished();

            var wordsReadLogger = new timeLogger('reading words file');
            wordsBuffer = dataLoader.readFile(config.wordData);
            wordsReadLogger.finished();

            var dataProcessorLogger = new timeLogger('processing data');
            var dataProcessor = new dataProcessorModule(authorsBuffer, wordsBuffer);
            dataProcessorLogger.finished();

            emailData = dataProcessor.data;

            var savingDataLogger = new timeLogger('saving data to JSON');
            dataLoader.saveData(emailData);
            savingDataLogger.finished();
        }

        if(config.limitData)
            emailData.splice(0, Math.floor(emailData.length*(1-config.limitData)));

        // Generate test data
        testData = emailData.slice(0, Math.floor(emailData.length*config.testDataPercentage));

        console.log('Email data loaded'.green.bold + (' (' + emailData.length + ' items)'));


        // teaching classifier
        classifier = new natural.BayesClassifier();

        if(config.logTrainingMessages) {
            classifier.events.on('trainedWithDocument', function (obj) {
                console.log(('Training ' + (obj.index + 1) + ' out of ' + obj.total + " (" + ((obj.index + 1) / obj.total * 100) + "%)").green);
            });
        }

        var addDocumentLogger = new timeLogger('adding documents');
        emailData.forEach(function(email) {
            classifier.addDocument(email.words, email.author);
        });
        addDocumentLogger.finished();


        console.log('Training classifier (this may take a while)'.underline);
        var trainLogger = new timeLogger('training classifier');
        classifier.train();
        trainLogger.finished();

        if(config.saveClassifier) {
            dataLoader.saveClassifier(classifier);
        }

        // TODO: Proceed with classifying
        classify(classifier, testData);
    });
}


function classify(bayesClassifier, data) {
    console.log(data[0]);
    var correct = 0;
    data.forEach(function(email) {
        if(bayesClassifier.classify(email.words) == email.author)
            ++correct;
    });

    console.log(correct, 'out of', data.length, 'classified correctly', '(' + correct/data.length*100 + "%)");
    //console.log(bayesClassifier.getClassifications(data[200].words));
}