from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from datetime import datetime
import uuid

from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Note(Base):
    __tablename__ = "notes"

    note_id = Column(UNIQUEIDENTIFIER, primary_key=True, default=generate_uuid)
    note_title = Column(String(255))
    note_content = Column(String(1000))
    created_on = Column(DateTime, default=datetime.utcnow)
    last_update = Column(DateTime, default=datetime.utcnow)
