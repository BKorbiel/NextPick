# NextPick - a book and movie recommendation system
Live demo available [here](https://the-next-pick.web.app/)

## Table of Contents
* [General Info](#general-information)
* [Recommendation Model](#recommendation-model)
* [Technologies & Tools Used](#technologies--tools-used)

## General Information
NextPick is a book and movie recommendation system. There are two ways to get recommendations: users can select up to 20 of their favorite books and movies, and the system will suggest the next pick based on description similarity. Alternatively, users can enter a custom input with keywords or a description of their ideal book or movie, and the system will generate a recommendation.

## Recommendation Model
The system is based on a TF-IDF model built from scratch using only NumPy, Pandas, and SciPy for matrix operations. Additionally, a model utilizing TfidfVectorizer from sklearn has been created, but it is not used; it was developed solely for comparison with the original model. The model creates a TF-IDF matrix based on the description, categories, keywords (for movies), and authors (for books), and saves it to the file RecommendationModel/tfidf_matrix.pkl. It also saves a file RecommendationModel/word_dict.pkl, which contains a dictionary mapping words to their indices in the matrix and their IDF values. The model can provide recommendations in two ways: either by providing it a list of IDs for movies and books or by providing custom input. In the first case, the cosine similarity scores of the vectors for the provided movies/books are calculated against every other item, and these scores are summed for each ID in the provided list. The items with the highest scores are then returned. In the second case, a TF-IDF vector for the input text is computed (using the RecommendationModel/word_dict.pkl file, which indicates which words correspond to which indices and their IDF values), and cosine similarity is calculated to return the items with the highest scores.

## Technologies & Tools Used
- Client side: React
- Server side: Python (Flask), Numpy, Pandas, thefuzz
- Recommendation Model: scipy (for sparse matricies), nltk (for stopwords), joblib, scikit-learn (to compare with original model)
- Datasets from https://www.kaggle.com/datasets/abdallahwagih/books-dataset/data and https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata?select=tmdb_5000_movies.csv
- Live demo hosting: Firebase & PythonAnywhere
