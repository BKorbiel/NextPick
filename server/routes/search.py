from thefuzz import fuzz
from flask import Flask, jsonify, request, Blueprint
from globals import Globals
import pandas as pd

search_route = Blueprint('search', __name__)

SIMILARITY_THRESHOLD = 80

def fuzzy_search(title, query_words):
    title_lower = str(title).lower()
    for query_word in query_words:
        title_words = title_lower.split()
        if not any(fuzz.ratio(query_word, title_word) > SIMILARITY_THRESHOLD 
                  for title_word in title_words):
            return False
    return True

@search_route.route("/search", methods=["GET"])
def search():
    query = request.args.get("query", "")
    query_lower = query.lower()
    include_books = request.args.get("books", "") != "false"
    include_movies = request.args.get("movies", "") != "false"

    query_words = query_lower.split()

    try:
        filtered_df = Globals.data_df[
            Globals.data_df['Title'].apply(lambda x: fuzzy_search(x, query_words)) &
            ((include_books & (Globals.data_df['Type'] == 'Book')) |
            (include_movies & (Globals.data_df['Type'] == 'Movie')))
        ].head(100)

        filtered_df.drop(columns="keywords", inplace=True)
        filtered_df.columns.values[0] = 'ID'
        result = filtered_df.to_dict(orient="records")
        result = [{k: (v if pd.notna(v) else None) for k, v in item.items()} for item in result]
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(result)