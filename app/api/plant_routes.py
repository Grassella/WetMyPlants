from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import requests
import os

plant_routes = Blueprint('plants', __name__)

PERENUAL_API_KEY = os.environ.get("PERENUAL_API_KEY")
print("PERENUAL_API_KEY:", PERENUAL_API_KEY)

@plant_routes.route("/search")
def search_plants():
    query = request.args.get("q", "")
    if not query:
        return jsonify({"error": "Missing search query"}), 400

    url = f"https://perenual.com/api/species-list?key={PERENUAL_API_KEY}&q={query}"
    print("Fetching from URL:", url)

    response = requests.get(url)

    print("Status Code:", response.status_code)
    print("Response Text:", response.text) 

    if response.status_code != 200:
        return jsonify({"error": "Perenual API error"}), 500

    return jsonify(response.json())


@plant_routes.route("/details/<int:plant_id>")
def get_plant_details(plant_id):
    res = requests.get(f"https://perenual.com/api/species/details/{plant_id}?key={PERENUAL_API_KEY}")
    if res.ok:
        return jsonify(res.json())
    return jsonify({"error": "Failed to fetch plant details"}), 500





# import os
# import requests
# from flask import Blueprint, request, jsonify
# from dotenv import load_dotenv

# load_dotenv()
# plant_routes = Blueprint("plant_routes", __name__)
# PERENUAL_API_KEY = os.getenv("PERENUAL_API_KEY")

# @plant_routes.route("/api/plant/search")
# def search_plants():
#     query = request.args.get("q")
#     if not query:
#         return jsonify({"error": "Missing search query"}), 400

#     url = f"https://perenual.com/api/species-list?key={PERENUAL_API_KEY}&q={query}"
#     res = requests.get(url)

#     if res.status_code != 200:
#         return jsonify({"error": "Failed to fetch plant data"}), res.status_code

#     return jsonify(res.json())
