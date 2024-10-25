import pandas as pd

df_movies = pd.read_csv("RecommendationModel/datasets/tmdb/tmdb-movie-metadata/versions/2/tmdb_5000_movies.csv")
df_books = pd.read_csv("RecommendationModel/datasets/abdallahwagih/books-dataset/versions/1/data.csv")

# Concat dataframes
df_movies = df_movies[['overview']].rename(
    columns={'overview': 'Description'}
)
df_movies['Type'] = "Movie"
df_books = df_books[['description']].rename(
    columns={'description': 'Description'}
)
df_books['Type'] = "Book"
df_combined = pd.concat([df_movies, df_books], ignore_index=True)
df_combined = df_combined.dropna()

df_combined.to_csv('RecommendationModel/datasets/raw_data.csv')