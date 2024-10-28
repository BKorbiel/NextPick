from thefuzz import fuzz
from flask import Flask, jsonify, request, Blueprint
from globals import Globals
import pandas as pd

search_route = Blueprint('search', __name__)

SIMILARITY_THRESHOLD = 80

def fuzzy_search(text, query_words):
    text_lower = str(text).lower()
    for query_word in query_words:
        text_words = text_lower.split()
        if not any(fuzz.ratio(query_word, text_word) > SIMILARITY_THRESHOLD 
                  for text_word in text_words):
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
        fuzzy_filter = Globals.data_df.apply(
            lambda row: fuzzy_search(row['Title'] + " " + 
                                     (row['additional_info'] if pd.notna(row['additional_info']) else ""), 
            query_words), 
            axis=1)
        type_filter = (include_books & (Globals.data_df['Type'] == 'Book')) | (include_movies & (Globals.data_df['Type'] == 'Movie'))

        filtered_df = Globals.data_df[fuzzy_filter & type_filter].head(100)

        filtered_df.drop(columns="keywords", inplace=True)
        filtered_df.columns.values[0] = 'ID'
        result = filtered_df.to_dict(orient="records")
        result = [{k: (v if pd.notna(v) else None) for k, v in item.items()} for item in result]
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

    return jsonify(result)