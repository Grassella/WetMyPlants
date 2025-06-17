from flask import Blueprint, request, jsonify, current_app
import requests
import os
from app.models import db, Room, Plant
from datetime import datetime

room_routes = Blueprint('rooms', __name__)

PERENUAL_API_KEY = os.environ.get("PERENUAL_API_KEY")

@room_routes.route("/", methods=["GET"])
def get_rooms():
    rooms = Room.query.all()
    return jsonify([
        {
            "id": room.id,
            "name": room.name,
            "plants": [
                {
                    "id": plant.id,
                    "api_id": plant.api_id,
                    "common_name": plant.common_name,
                    "image_url": plant.image_url,
                    "watering": plant.watering,
                    "sunlight": plant.sunlight,
                    "growth_rate": plant.growth_rate,
                    "care_level": plant.care_level,
                    "maintenance": plant.maintenance,
                    "soil": plant.soil
                } for plant in room.plants
            ]
        } for room in rooms
    ])

@room_routes.route("/", methods=["POST"])
def create_room():
    data = request.json
    name = data.get("name")
    if not name:
        return jsonify({"error": "Room name is required"}), 400

    new_room = Room(name=name)
    db.session.add(new_room)
    db.session.commit()
    return jsonify({"id": new_room.id, "name": new_room.name}), 201

@room_routes.route("/<int:room_id>", methods=["DELETE"])
def delete_room(room_id):
    room = Room.query.get(room_id)
    if not room:
        return jsonify({"error": "Room not found"}), 404
    db.session.delete(room)
    db.session.commit()
    return jsonify({"message": "Room deleted"}), 200

@room_routes.route("/plant/<int:plant_id>", methods=["DELETE"])
def delete_plant(plant_id):
    plant = Plant.query.get(plant_id)
    if not plant:
        return jsonify({"error": "Plant not found"}), 404
    db.session.delete(plant)
    db.session.commit()
    return jsonify({"message": "Plant deleted"}), 200

@room_routes.route('/api/record-date', methods=['POST'])
def record_date():
    data = request.get_json()
    date_str = data.get("date")
    if not date_str:
        return jsonify({"error": "Date not provided"}), 400
    recorded_dates.append(date_str)
    print(f"Recorded date: {date_str}")
    return jsonify({"message": "Date recorded", "dates": recorded_dates})


@room_routes.route('/<int:room_id>/plants', methods=['POST'])
def add_plant_to_room(room_id):
    data = request.json
    api_id = data.get("api_id")
    common_name = data.get("common_name")
    image_url = data.get("image_url")

    if not PERENUAL_API_KEY:
        return jsonify({"error": "Missing API key"}), 500

    try:
        care_url = f"https://perenual.com/api/species-care-guide-list?key={PERENUAL_API_KEY}&species_id={api_id}"
        care_res = requests.get(care_url)

        if not care_res.ok:
            return jsonify({"error": "Failed to fetch care guide"}), 500

        care_data = care_res.json()
        guide = care_data.get("data", [{}])[0]

        new_plant = Plant(
            api_id=api_id,
            room_id=room_id,
            common_name=common_name,
            image_url=image_url,
            watering=guide.get("watering"),
            sunlight=guide.get("sunlight"),
            growth_rate=guide.get("growth_rate"),
            care_level=guide.get("care_level"),
            maintenance=guide.get("maintenance"),
            soil=guide.get("soil")
        )

        db.session.add(new_plant)
        db.session.commit()
        return jsonify(new_plant.to_dict())

    except Exception as e:
        print("Error adding plant:", e)
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@room_routes.route("/plant/<int:plant_id>/water", methods=["PUT"])
def water_plant(plant_id):
    plant = Plant.query.get(plant_id)
    if not plant:
        return jsonify({"error": "Plant not found"}), 404

    plant.last_watered = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Plant watered", "last_watered": plant.last_watered.isoformat()})
