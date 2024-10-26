'''
The first class is a TF-IDF model created from scratch using only Pandas, NumPy, and SciPy (for sparse 
matrix optimization). The second class is a TF-IDF model built using scikit-learn to compare with original model.
Classes provide similar, though not identical, recommendations.
'''
import numpy as np
import pandas as pd
import nltk
from nltk.corpus import stopwords
import re
import math
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import joblib
from scipy.sparse import csr_matrix, hstack

class Tfidf:
    def __init__(self, data_df):
        self.data_df = data_df
        self.tfidf_matrix = None
        self.norms = None
        self.word_dict = None
    
    def load_data(self,
                  matrix_filename="RecommendationModel/datasets/tfidf_matrix.pkl", 
                  word_dict_filename="RecommendationModel/datasets/word_dict.pkl"):
        nltk.download('stopwords')

        tfidf_matrix_with_norms = joblib.load(matrix_filename)
        if not isinstance(tfidf_matrix_with_norms, csr_matrix):
            tfidf_matrix_with_norms = tfidf_matrix_with_norms.tocsr()
        tfidf_matrix = tfidf_matrix_with_norms[:, :-1]
        norms = tfidf_matrix_with_norms[:, -1].toarray().flatten()

        self.tfidf_matrix = tfidf_matrix
        self.norms = norms
        self.word_dict = joblib.load(word_dict_filename)

    def get_words_from_text(self, text):
        text = text.lower()
        stop_words = set(stopwords.words('english'))
        words = re.findall(r'\b[a-z]+\b', text)
        words = [word for word in words if word not in stop_words]
        return words

    def compute_tf(self, word_list):
        tf_dict = Counter(word_list)
        total_words = len(word_list)
        for word in tf_dict:
            tf_dict[word] = tf_dict[word] / total_words
        return tf_dict
    
    def compute_idf(self, word_lists):
        N = len(word_lists)
        idf_dict = {}
        for word_list in word_lists:
            for word in set(word_list):
                idf_dict[word] = idf_dict.get(word, 0) + 1

        for word in idf_dict:
            idf_dict[word] = math.log(N / float(idf_dict[word]))
        return idf_dict
    
    def compute_tfidf(self, tf, idf):
        tfidf = {}
        for word, tf_value in tf.items():
            tfidf[word] = tf_value * idf.get(word, 0)
        return tfidf
    
    def compute_tfidf_matrix(self):
        # Get the tf-idf data
        word_lists = [
            self.get_words_from_text(description + " " + (keywords if pd.notna(keywords) else ""))
            for description, keywords in zip(self.data_df["Description"], self.data_df["keywords"])
        ]
        tf_list = [self.compute_tf(word_list) for word_list in word_lists]
        idf = self.compute_idf(word_lists)
        tfidf_list = [self.compute_tfidf(tf, idf) for tf in tf_list]

        # List of unique words
        unique_words = idf.keys()
        word_dict = {word: {'idx': i, 'idf': idf[word]} for i, word in enumerate(unique_words)}
        joblib.dump(word_dict, "RecommendationModel/datasets/word_dict.pkl")

        # Creating sparse matrix
        data = []
        row_indices = []
        col_indices = []
        for i, tfidf in enumerate(tfidf_list):
            for word, value in tfidf.items():
                row_indices.append(i)
                col_indices.append(word_dict[word]['idx'])
                data.append(value)
        tfidf_matrix_sparse = csr_matrix((data, (row_indices, col_indices)), shape=(len(word_lists), len(unique_words)))

        # Calculate norms
        norms = np.sqrt(tfidf_matrix_sparse.multiply(tfidf_matrix_sparse).sum(axis=1))
        norms = np.array(norms).flatten()
        norms[norms == 0] = 1e-10
        norms_sparse = csr_matrix(norms).T

        # Save matrix and norms
        tfidf_matrix = hstack([tfidf_matrix_sparse, norms_sparse])
        joblib.dump(tfidf_matrix, "RecommendationModel/datasets/tfidf_matrix.pkl")

    def get_recommendations_by_ids(self, indicies_list, n_top_books=10, n_top_movies=10):
        similarity_scores = np.zeros(self.tfidf_matrix.shape[0])
        for idx in indicies_list:
            vector = self.tfidf_matrix[idx]
            similarity_scores += (self.tfidf_matrix.dot(vector.T)).toarray().flatten() / (self.norms * self.norms[idx])

        similarity_scores = enumerate(similarity_scores)
        similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

        return self.get_recommendations_by_sim_score(similarity_scores, indicies_list, n_top_books, n_top_movies)

    def get_recommendations_by_custom_input(self, input, n_top_books, n_top_movies):
        vector, norm = self.calculate_text_vector(input)

        similarity_scores = np.zeros(self.tfidf_matrix.shape[0])

        similarity_scores += (self.tfidf_matrix.dot(vector.T)).toarray().flatten() / (self.norms * norm)

        similarity_scores = enumerate(similarity_scores)
        similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

        return self.get_recommendations_by_sim_score(similarity_scores, [], n_top_books, n_top_movies)

    def calculate_text_vector(self, text):
        word_list = self.get_words_from_text(text)
        filtered_words = [word for word in word_list if word in self.word_dict]
        idf_dict = {word: data['idf'] for word, data in self.word_dict.items()}

        tf = self.compute_tf(filtered_words)
        tf_idf = self.compute_tfidf(tf, idf_dict)
        data = []
        col_indices = []
        for word, value in tf_idf.items():
            col_indices.append(self.word_dict[word]['idx'])
            data.append(value)

        vector = csr_matrix((data, ([0] * len(col_indices), col_indices)), shape=(1, len(self.word_dict)))
        norm = np.sqrt(np.sum(vector.data ** 2))

        return vector, norm

    def get_recommendations_by_sim_score(self, similarity_scores, indicies_list, n_top_books, n_top_movies):
        books = []
        movies = []
        idx = 0
        while idx < len(similarity_scores) and (len(books) < n_top_books or len(movies) < n_top_movies):
            elem = similarity_scores[idx]
            if elem[0] in indicies_list:
                idx += 1
                continue
            if len(books) < n_top_books and self.data_df.loc[elem[0], 'Type'] == "Book":
                books.append(elem[0])
            if len(movies) < n_top_movies and self.data_df.loc[elem[0], 'Type'] == "Movie":
                movies.append(elem[0])
            idx += 1

        return books, movies
    
class Tfidf_sklearn:
    def __init__(self, data_filename="RecommendationModel/datasets/raw_data.csv", matrix_filename="RecommendationModel/datasets/tfidf_matrix.pkl"):
        self.data_filename = data_filename
        self.matrix_filename = matrix_filename
        
    def compute_tfidf_matrix(self):
        df_data = pd.read_csv(self.data_filename)

        tfidf = TfidfVectorizer(stop_words="english")
        tfidf_matrix = tfidf.fit_transform(df_data["Description"])

        joblib.dump(tfidf_matrix, self.matrix_filename)

    def get_recommendations_by_ids(self, indicies_list, n_top_books=10, n_top_movies=10):
        df_data = pd.read_csv(self.data_filename)

        tfidf_matrix = joblib.load(self.matrix_filename)
        similarity_scores = np.zeros(tfidf_matrix.shape[0])
        for idx in indicies_list:
            vector = tfidf_matrix[idx]
            similarity_scores += linear_kernel(tfidf_matrix, vector).flatten()

        similarity_scores = enumerate(similarity_scores)
        similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
        
        books = []
        movies = []
        idx = 0
        while idx < len(similarity_scores) and (len(books) < n_top_books or len(movies) < n_top_movies):
            elem = similarity_scores[idx]
            if elem[0] in indicies_list:
                idx += 1
                continue
            if len(books) < n_top_books and df_data.loc[elem[0], 'Type'] == "Book":
                books.append(elem[0])
            if len(movies) < n_top_movies and df_data.loc[elem[0], 'Type'] == "Movie":
                movies.append(elem[0])
            idx += 1

        return books, movies
