from flask import jsonify, request, Blueprint
from globals import Globals
import pandas as pd

recommendations_by_ids_route = Blueprint('recommendations/by-ids', __name__)
recommendations_by_input_route = Blueprint('recommendations/by-input', __name__)

@recommendations_by_ids_route.route("/recommendations/by-ids", methods=["GET"])
def recommendations_by_ids():
    ids = request.args.get("ids", "")
    ids_list = [int(id) for id in ids.split(",") if id] if ids else []

    try:
        book_ids, movie_ids = Globals.tfidf_model.get_recommendations_by_ids(ids_list, 15, 15)
        filtered_df = Globals.data_df[
            Globals.data_df.iloc[:, 0].isin(book_ids + movie_ids)
        ]
        filtered_df.drop(columns="keywords", inplace=True)
        filtered_df.columns.values[0] = 'ID'
        result = filtered_df.to_dict(orient="records")
        result = [{k: (v if pd.notna(v) else None) for k, v in item.items()} for item in result]
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

    return jsonify(result)

@recommendations_by_input_route.route("/recommendations/by-input", methods=["GET"])
def recommendations_by_input():
    input = request.args.get("input", "")

    try:
        book_ids, movie_ids = Globals.tfidf_model.get_recommendations_by_custom_input(input, 15, 15)
        filtered_df = Globals.data_df[
            Globals.data_df.iloc[:, 0].isin(book_ids + movie_ids)
        ]
        filtered_df.drop(columns="keywords", inplace=True)
        filtered_df.columns.values[0] = 'ID'
        result = filtered_df.to_dict(orient="records")
        result = [{k: (v if pd.notna(v) else None) for k, v in item.items()} for item in result]
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

    return jsonify(result)