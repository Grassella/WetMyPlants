import os
from .db import db

SCHEMA = os.environ.get("SCHEMA", "public")
schema_args = {'schema': SCHEMA} if SCHEMA != 'public' else {}

class Room(db.Model):
    __tablename__ = 'rooms'
    __table_args__ = schema_args

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    plants = db.relationship("Plant", back_populates="room", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "plants": [plant.to_dict() for plant in self.plants]
        }
