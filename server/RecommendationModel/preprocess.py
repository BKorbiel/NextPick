import pandas as pd
import json

df_movies = pd.read_csv("RecommendationModel/datasets/tmdb/tmdb-movie-metadata/versions/2/tmdb_5000_movies.csv")
df_books = pd.read_csv("RecommendationModel/datasets/abdallahwagih/books-dataset/versions/1/data.csv")

# Movies DF
df_movies['keywords'] = df_movies['keywords'].apply(lambda x: ' '.join([d['name'] for d in json.loads(x)]))
df_movies['additional_info'] = df_movies["release_date"]
df_movies = df_movies[['original_title','overview', 'vote_average', 'thumbnail', 'additional_info', 'keywords', 'vote_count']].rename(
    columns={'original_title': 'Title', 'overview': 'Description', 'vote_average': 'Rating'}
)
df_movies['Type'] = "Movie"

# Books DF
df_books['keywords'] = None
df_books["Title"] = df_books.apply(
    lambda row: row['title'] + (" - " + row['subtitle'] if pd.notna(row['subtitle']) else ""), 
    axis=1
)
df_books["additional_info"] = df_books["authors"]
df_books = df_books[['Title', 'description', 'average_rating', 'thumbnail', 'additional_info', 'keywords', 'ratings_count']].rename(
    columns={'description': 'Description', 'average_rating': 'Rating', 'ratings_count': 'vote_count'}
)
df_books['Type'] = "Book"

# Concat dataframes
df_combined = pd.concat([df_movies, df_books], ignore_index=False)
df_combined = df_combined.dropna(subset=['Title', 'Description'])

# Sort by popularity
df_combined = df_combined.sort_values(by='vote_count', ascending=False)

# ID
df_combined = df_combined.reset_index(drop=True)

# Save
df_combined.to_csv('RecommendationModel/datasets/raw_data.csv')