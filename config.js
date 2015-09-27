var baseUrl = 'email-data/';

var config = {
    authors: baseUrl + 'email_authors.pkl',
    wordData: baseUrl + 'word_data.pkl',
    jsonData: baseUrl + 'data.json',
    classifierFile: baseUrl + 'classifier.json',
    saveClassifier: true,
    loadExistingClassifier: true,


    logTrainingMessages: true,
    logDurationInfo: true,

    forceDataParsing: true,
    forceClassifierTeaching: true,

    limitData: 0.8,   // either false or a percentage (float, e.g. 0.5) to which limit data
    testDataPercentage: 0.2   // what percentage of data (post limit) should be used for testing
};

module.exports = config;