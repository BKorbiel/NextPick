from flask import Flask, jsonify, request
import pandas as pd
from RecommendationModel.Tfidf_model import Tfidf
from routes.search import search_route
from globals import Globals
from flask_cors import CORS

app = Flask(__name__)
allowed_origins = [
    "http://localhost:3000",
]

CORS(app, resources={r"/*": {"origins": allowed_origins}})

def load_data_and_model():
    Globals.data_df = pd.read_csv("RecommendationModel/datasets/raw_data.csv")
    Globals.tfidf_model = Tfidf(Globals.data_df)
    Globals.tfidf_model.load_data()

    print("Data loaded successfully.")

with app.app_context():
    load_data_and_model()

app.register_blueprint(search_route)

if __name__ == "__main__":
    app.run(debug=True)