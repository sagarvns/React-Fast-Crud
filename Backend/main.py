from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import Note
from datetime import datetime
from pydantic import BaseModel
from fastapi import HTTPException

Base.metadata.create_all(bind=engine)

app = FastAPI()  # <-- This must be defined before using @app.get()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/hello")
def root():
    return {"message": "Hello from FastAPI + SQL Server!"}

@app.get("/api/notes")
def get_notes(db: Session = Depends(get_db)):
    return db.query(Note).all()



class NoteCreate(BaseModel):
    note_title: str
    note_content: str

@app.post("/api/notes")
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    new_note = Note(
        note_title=note.note_title,
        note_content=note.note_content
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


class NoteCreate(BaseModel):
    note_title: str
    note_content: str

@app.put("/api/notes/{note_id}")
def update_note(note_id: str, note: NoteCreate, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.note_id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    db_note.note_title = note.note_title
    db_note.note_content = note.note_content
    db_note.last_update = datetime.utcnow()
    db.commit()
    db.refresh(db_note)
    return db_note

@app.delete("/api/notes/{note_id}")
def delete_note(note_id: str, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.note_id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted"}
