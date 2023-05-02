const natural = require("natural");
const ml = require("ml-sentiment")();

const Sentiment = require("sentiment");
const sentiment = new Sentiment();

const multiSentiment = require("multilang-sentiment");

// Convert "I'm" -> "I am"
const aposToLexForm = require("apos-to-lex-form");

// Correct misspelled words
const SpellCorrector = require("spelling-corrector");

// Remove stop words "but, a, or, what"
const SW = require("stopword");

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

function getSentiment(text) {
    // Convert contractions to standard lexicon
    const lexedReview = aposToLexForm(text);

    // Convert text to lower case
    const casedReview = lexedReview.toLowerCase();

    // Remove non-alphabets and special characters
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, "");

    // Tokenize words from sentence
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

    // Correct spelling for each word
    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    });

    // Remove stop words
    const filteredReview = SW.removeStopwords(tokenizedReview);

    // Stemming and Sentiment Analysis
    // AFINN - Vocabulary
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer(
        "English",
        PorterStemmer,
        "senticon"
    );
    const analysis = analyzer.getSentiment(filteredReview);
    const unfilteredAnalysis = analyzer.getSentiment(tokenizer.tokenize(text));
    const analysis2 = sentiment.analyze(text);
    const analysis3 = multiSentiment(text);
    const analysis4 = ml.classify(text);

    return {
        analysis,
        unfilteredAnalysis,
        analysis2,
        analysis3,
        analysis4,
    };
}

module.exports = {
    getSentiment,
};
