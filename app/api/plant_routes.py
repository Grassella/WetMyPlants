import os
import requests
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

load_dotenv()
plant_routes = Blueprint("plant_routes", __name__)
PERENUAL_API_KEY = os.getenv("PERENUAL_API_KEY")

@plant_routes.route("/api/plant/search")
def search_plants():
    query = request.args.get("q")
    if not query:
        return jsonify({"error": "Missing search query"}), 400

    url = f"https://perenual.com/api/species-list?key={PERENUAL_API_KEY}&q={query}"
    res = requests.get(url)

    if res.status_code != 200:
        return jsonify({"error": "Failed to fetch plant data"}), res.status_code

    return jsonify(res.json())
