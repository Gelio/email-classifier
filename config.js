var baseUrl = 'email-data/';

var config = {
    authors: baseUrl + 'email_authors.pkl',
    wordData: baseUrl + 'word_data.pkl',
    jsonData: baseUrl + 'data.json',
    classifierFile: baseUrl + 'classifier.json',
    saveClassifier: true,
    loadExistingClassifier: true,
    logTrainingMessages: false,

    logDurationInfo: true,

    forceDataParsing: true,
    forceClassifierTeaching: true,

    limitData: 0.1,   // either false or a percentage (float, e.g. 0.5) to which limit data
    testDataPercentage: 0.1   // what percentage of data should be used for testing
};

module.exports = config;