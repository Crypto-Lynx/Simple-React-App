from sqlalchemy import create_engine, Column, Integer, String, PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
#from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select
from contextlib import asynccontextmanager

DATABASE_URL = "postgresql://postgres:1532@db:5432/students"

engine = create_engine(DATABASE_URL)

Base = declarative_base()

#was async, rewrote it to normal cuz don't work
#AsyncSessionLocal = sessionmaker(
#    bind=engine, class_=AsyncSession, autocommit=False, autoflush=False
#)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Students(Base):
    __tablename__ = "students"
    #id = Column(Integer, primary_key=True)
    first_name = Column(String)
    middle_name = Column(String)
    last_name = Column(String)
    study_year = Column(Integer)
    group = Column(String)
    faculty = Column(String)

    __table_args__ = (
        PrimaryKeyConstraint('first_name', 'middle_name', 'last_name'),
    )

