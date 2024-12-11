from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from models import PaginationResult, StudentInfo
from database import get_db, Base, engine, Students
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Base.metadata.create_all(bind=engine)

origins = [
    'http://frontend:80',
    'http://api:3000',
    'http://0.0.0.0',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.post("/students/create/")
def create_student(student: StudentInfo, db: Session = Depends(get_db)):
    if db.query(Students).filter(
        Students.first_name == student.first_name,
        Students.middle_name == student.middle_name,
        Students.last_name == student.last_name
    ).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student with this name already exists."
        )
    
    new_student = Students(**student.dict())

    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return new_student

@app.delete("/students/delete/")
def remove_student(student: StudentInfo, db: Session = Depends(get_db)):
    db_student = db.query(Students).filter(
        Students.first_name == student.first_name,
        Students.middle_name == student.middle_name,
        Students.last_name == student.last_name
    ).first()

    if not db_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student does not exist."
        )
    
    db.delete(db_student)
    db.commit()
    
    return db_student

@app.get("/students/", response_model=PaginationResult)
def list_students(page: int = 1, size: int = 10, db: Session = Depends(get_db)):
    if page <= 0 or size <= 0:
        return {"error": "Page and size must be positive integers."}

    offset = (page - 1) * size

    try:
        students_query = db.query(Students).offset(offset).limit(size).all()

        total_students = db.query(Students).count()

        total_pages = (total_students // size) + (1 if total_students % size > 0 else 0)

        student_info_list = [StudentInfo.from_orm(student) for student in students_query]

        return PaginationResult(
            users=student_info_list,
            total_pages=total_pages
        )

    except SQLAlchemyError as e:
        return {"error": str(e)}
