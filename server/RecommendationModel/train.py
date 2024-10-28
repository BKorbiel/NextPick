import pandas as pd
from Tfidf_model import Tfidf

data_df = pd.read_csv("RecommendationModel/datasets/raw_data.csv")
tfidf_model = Tfidf(data_df)
tfidf_model.compute_tfidf_matrix()