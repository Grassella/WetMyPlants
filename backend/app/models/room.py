class Room(db.Model):
    __tablename__ = 'rooms'
    __table_args__ = {'schema': 'graciela_cap'}  # add this line

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    plants = db.relationship("Plant", back_populates="room", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "plants": [plant.to_dict() for plant in self.plants]
        }
