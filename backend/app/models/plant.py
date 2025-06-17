from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .db import db
from datetime import datetime

class Plant(db.Model):
    __tablename__ = 'plant'

    id = db.Column(db.Integer, primary_key=True)  # <-- THIS is required
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    api_id = db.Column(db.Integer)
    common_name = db.Column(db.String)
    image_url = db.Column(db.String)

    watering = db.Column(db.String)
    sunlight = db.Column(db.String)
    growth_rate = db.Column(db.String)
    care_level = db.Column(db.String)
    maintenance = db.Column(db.String)
    soil = db.Column(db.String)
    last_watered = db.Column(db.DateTime, nullable=True)


    room = db.relationship("Room", back_populates="plants")

    def to_dict(self):
        return {
            "id": self.id,
            "room_id": self.room_id,
            "api_id": self.api_id,
            "common_name": self.common_name,
            "image_url": self.image_url,
            "watering": self.watering,
            "sunlight": self.sunlight,
            "growth_rate": self.growth_rate,
            "care_level": self.care_level,
            "maintenance": self.maintenance,
            "soil": self.soil,
            "last_watered": self.last_watered.isoformat() if self.last_watered else None,
        }
