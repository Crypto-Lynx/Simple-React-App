from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, Field
from typing import List

Base = declarative_base()

class StudentInfo(BaseModel):
    middle_name: str
    first_name: str
    last_name: str
    study_year: int
    group: str
    faculty: str

    class Config:
        from_attributes = True

class PaginationResult(BaseModel):
    users: List[StudentInfo]
    total_pages: int
