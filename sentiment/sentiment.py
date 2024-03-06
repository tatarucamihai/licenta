

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import pandas as pd
import nltk
import numpy as np
from sklearn.utils import shuffle
from nltk.stem import WordNetLemmatizer
from sklearn.linear_model import LogisticRegression
from bs4 import BeautifulSoup
from sklearn.model_selection import GridSearchCV
from joblib import dump, load
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS


data = pd.read_csv('data.csv')

# Initialize variables
wordnet_lemmatizer = WordNetLemmatizer()
word_index_map = {}
current_index = 0



def my_tokenizer(s):
    s = s.lower()
    tokens = nltk.tokenize.word_tokenize(s)
    tokens = [t for t in tokens if len(t) > 2]
    tokens = [wordnet_lemmatizer.lemmatize(t) for t in tokens]
  
    return tokens

reviews_tokenized = []

for _, row in data.iterrows():
    review = row['Sentence']  # Adjust the column name as necessary
    sentiment = 1 if row['Sentiment'] == 'positive' else 0  # Adjust the sentiment mapping as necessary
    tokens = my_tokenizer(review)
    reviews_tokenized.append((tokens, sentiment))
    for token in tokens:
        if token not in word_index_map:
            word_index_map[token] = current_index
            current_index += 1

def review_score(review, model):
    tokens = my_tokenizer(review)
    x = np.zeros(len(word_index_map))  # Initialize an array for the review
    for token in tokens:
        if token in word_index_map:  # Check if the token is in the map
            index = word_index_map[token]
            x[index] += 1
    x = x / sum(x)  # Normalize the vector
    x = np.array([x])  # Reshape for model input
    proba = model.predict_proba(x)  # Get probability estimates
    max_proba = np.argmax(proba, axis=1)

    
    if max_proba == 1:
        print('Positive review')
    else:
        print('Negative review')

    return np.max(proba, axis=1)

def tokens_to_vector(tokens, label):
    x = np.zeros(len(word_index_map) + 1)
    for t in tokens:
        i = word_index_map[t]
        x[i] += 1 
    x = x/sum(x) #sa dea o val intre 0 si 1
    x[-1] = label
    return x

N = len(reviews_tokenized)

data = np.zeros((N, len(word_index_map) + 1))
i = 0


for tokens, sentiment in reviews_tokenized:
    xy = tokens_to_vector(tokens, sentiment)  # Use the actual sentiment instead of hardcoding 1
    data[i, :] = xy
    i += 1

np.random.shuffle(data)

X = data[:,:-1]
Y = data[:,-1]

XTrain = X[:-100,]#toate in afara de ultimele elemente
YTrain = Y[:-100,]

XTest = X[-100:,]#ultimele 100 elemente
YTest = Y[-100:,]

model = LogisticRegression()
model.fit(XTrain, YTrain)
print("Classification rate: ", model.score(XTest, YTest))


param_grid = {'C': [0.01, 0.1, 1, 10, 100, 200, 1000], 'solver': ['liblinear']}
grid_search = GridSearchCV(LogisticRegression(max_iter=4000), param_grid, cv=5, scoring='accuracy')
grid_search.fit(XTrain, YTrain)
best_model = grid_search.best_estimator_
print("Best parameters:", grid_search.best_params_)
print("Best cross-validation score: {:.2f}".format(grid_search.best_score_))

dump(best_model, 'best_model.joblib')
best_model = load('best_model.joblib')


app = Flask(__name__)
CORS(app)
sentiment_analyzer = SentimentIntensityAnalyzer()
@app.route('/analyze', methods=['POST'])



def analyze_review():
    data = request.json
    review = data.get('review', '')  # Access the review from the POST request
    if not review:
        return jsonify({'error': 'No review provided'}), 400

    # Use the sentiment_analyzer instance to get the sentiment scores
    sentiment_scores = sentiment_analyzer.polarity_scores(review)
    compound_score = sentiment_scores['compound']

    predicted_sentiment = review_score(review, best_model)
    sentiment_score = float(predicted_sentiment[0])

    print("The VADER compound score of the review is", compound_score)
    print("Logistic regression predicted sentiment witn an accuracy of", predicted_sentiment)

    return jsonify({'logistic_regression_sentiment': sentiment_score, 'vader_compound_score': compound_score}), 200

if __name__ == '__main__':
    app.run(debug=True)


















