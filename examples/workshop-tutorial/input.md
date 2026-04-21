---
contract: presentation-skill/v1
title: Building REST APIs with FastAPI
speaker: Jordan Kim
event: Python Web Development Workshop
date: November 8, 2024
duration: 90 minutes
audience: Python developers new to API development
tone: Practical and beginner-friendly
theme: default-dark
objective: Teach participants to build and deploy a production-ready REST API from scratch
---

<!-- slide:type=title -->
# Building REST APIs with FastAPI

A hands-on workshop for Python developers

- Jordan Kim
- Senior Backend Engineer
- Python Web Development Workshop

??? notes
- Welcome everyone, quick intro
- Check: who has Python experience? Who has built APIs before?
- Set expectations: hands-on, we'll build a real API together
- Link to workshop repo will be shared in chat

---

# What You'll Learn Today

- FastAPI fundamentals and why it's powerful
- Building CRUD endpoints with path and query parameters
- Request validation with Pydantic models
- Database integration with SQLAlchemy
- Authentication and authorization basics
- Testing your API with pytest
- Deployment to production

??? notes
- This is the roadmap, keep it visible
- We'll cover a lot but focus on practical patterns
- Code repo has all examples and exercises
- Breaks at 30 and 60 minute marks

---

# Workshop Prerequisites

**Required:**
- Python 3.9+ installed
- Basic Python knowledge (functions, classes, decorators)
- Text editor or IDE (VS Code recommended)

**Helpful but not required:**
- Experience with HTTP and REST concepts
- Basic SQL understanding

**Setup:** Clone workshop repo and install dependencies

??? notes
- Quick environment check: ask who needs help with setup
- Share repo link again
- Give 5 minutes for setup if needed
- Dependencies: fastapi, uvicorn, sqlalchemy, pydantic, pytest

---

# Why FastAPI?

- **Fast:** High performance, comparable to Node.js and Go
- **Easy:** Intuitive API design, great docs
- **Standards-based:** OpenAPI, JSON Schema built-in
- **Type-safe:** Leverage Python type hints for validation
- **Async-ready:** Native async/await support

??? notes
- FastAPI has exploded in popularity since 2019
- Used by Microsoft, Netflix, Uber in production
- Type hints aren't just for IDEs - FastAPI uses them for validation
- We'll see OpenAPI docs auto-generated from our code

---

<!-- slide:type=code -->
# Hello World API

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "query": q}
```

Run with: `uvicorn main:app --reload`

??? notes
- Walk through each line
- Path parameter: item_id is in the URL path
- Query parameter: q is optional, comes after ?
- Type hints: FastAPI validates item_id is an int
- --reload enables hot reloading during development

---

# Checkpoint #1: Run Your First API

**Exercise (5 minutes):**
1. Create `main.py` with the Hello World code
2. Run `uvicorn main:app --reload`
3. Visit `http://localhost:8000` in your browser
4. Visit `http://localhost:8000/docs` for interactive API docs

**What to expect:** JSON response and auto-generated Swagger UI

??? notes
- Give participants 5 minutes
- Walk around to help with issues
- The /docs endpoint is magical - FastAPI generates it automatically
- Check: can everyone see the Swagger UI?

---

<!-- slide:type=code -->
# Pydantic Models for Validation

```python
from pydantic import BaseModel, Field
from typing import Optional

class Item(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    tax: Optional[float] = None

@app.post("/items/")
def create_item(item: Item):
    total = item.price + (item.tax or 0)
    return {"item": item, "total_price": total}
```

??? notes
- Pydantic handles validation, serialization, and documentation
- Field() adds constraints: min_length, max_length, gt (greater than)
- FastAPI will return 422 for invalid requests
- Try posting invalid data in the Swagger UI to see validation errors

---

# Checkpoint #2: Add Data Validation

**Exercise (10 minutes):**
1. Define a `Book` model with title, author, year, and isbn
2. Add constraints: title required, year between 1000 and 2100
3. Create a POST endpoint that accepts a Book
4. Test with valid and invalid data in `/docs`

**Bonus:** Add a list of tags to the Book model

??? notes
- This reinforces Pydantic models
- Solution is in the repo under checkpoint-2
- Common mistake: forgetting to import Field
- Check: who got 422 validation errors? That's correct behavior!

---

<!-- slide:type=code -->
# Database Integration with SQLAlchemy

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./books.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class BookDB(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    year = Column(Integer)
```

??? notes
- SQLAlchemy is the de facto Python ORM
- We're using SQLite for simplicity, but this works with PostgreSQL, MySQL, etc.
- SessionLocal creates database sessions
- Base is the declarative base for ORM models
- We'll separate Pydantic models (API) from SQLAlchemy models (DB)

---

<!-- slide:type=code -->
# Dependency Injection for Database Sessions

```python
from fastapi import Depends
from sqlalchemy.orm import Session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/books/")
def list_books(db: Session = Depends(get_db)):
    books = db.query(BookDB).all()
    return books

@app.post("/books/")
def create_book(book: Book, db: Session = Depends(get_db)):
    db_book = BookDB(**book.dict())
    db.add(db_book)
    db.commit()
    return db_book
```

??? notes
- Depends() is FastAPI's dependency injection system
- get_db() creates a session, yields it, then closes it
- This pattern ensures proper resource cleanup
- Works great for auth, logging, config, etc.

---

# Checkpoint #3: Add Database Persistence

**Exercise (15 minutes):**
1. Set up SQLAlchemy with SQLite
2. Create a database model for books
3. Implement GET /books/ to list all books
4. Implement POST /books/ to create a new book
5. Test CRUD operations in `/docs`

**Bonus:** Add GET /books/{book_id} to fetch a single book

??? notes
- This is the big one, give participants time
- Solution is in checkpoint-3 folder
- Common issues: forgetting to create tables, session management
- Use Base.metadata.create_all(engine) to create tables

---

# HTTP Status Codes Matter

```python
from fastapi import HTTPException, status

@app.get("/books/{book_id}")
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(BookDB).filter(BookDB.id == book_id).first()
    if book is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book {book_id} not found"
        )
    return book
```

**Common status codes:**
- 200 OK, 201 Created, 204 No Content
- 400 Bad Request, 401 Unauthorized, 404 Not Found
- 500 Internal Server Error

??? notes
- Use correct status codes for better API design
- HTTPException is FastAPI's way to return errors
- status module has constants for all HTTP codes
- Clients rely on status codes for error handling

---

<!-- slide:type=code -->
# Authentication with JWT

```python
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key-here"
security = HTTPBearer()

def create_token(user_id: int) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY)
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
```

??? notes
- JWT = JSON Web Token, industry standard for API auth
- Token contains claims (user_id, expiration)
- Never commit SECRET_KEY to git, use environment variables
- In production, use a proper secrets manager

---

# Checkpoint #4: Add Basic Auth

**Exercise (15 minutes):**
1. Install `python-jose[cryptography]` and `passlib[bcrypt]`
2. Create `/auth/login` endpoint that returns a JWT
3. Protect `/books/` POST endpoint with token verification
4. Test: login to get token, use token to create a book

**Bonus:** Add password hashing with bcrypt

??? notes
- Auth is complex, we're simplifying for the workshop
- Production auth needs: password hashing, refresh tokens, HTTPS
- Solution includes password hashing with bcrypt
- Check: who successfully protected an endpoint?

---

<!-- slide:type=code -->
# Testing Your API with pytest

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_list_books():
    response = client.get("/books/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_book():
    book_data = {
        "title": "Test Book",
        "author": "Test Author",
        "year": 2024
    }
    response = client.post("/books/", json=book_data)
    assert response.status_code == 200
    assert response.json()["title"] == "Test Book"
```

??? notes
- TestClient simulates HTTP requests without running a server
- Write tests alongside your code, not after
- Test happy paths and error cases
- Use fixtures for test data and database setup

---

# Checkpoint #5: Write Tests

**Exercise (10 minutes):**
1. Create `test_main.py`
2. Write tests for GET /books/ and POST /books/
3. Run tests with `pytest`
4. Aim for 100% coverage of your endpoints

**Bonus:** Test error cases (404, 422 validation errors)

??? notes
- Testing is not optional in production APIs
- pytest makes testing Python code easy
- Use pytest-cov for coverage reports
- Solution has examples of fixture usage

---

# API Best Practices

- **Versioning:** Use `/api/v1/` prefix for future compatibility
- **Rate Limiting:** Prevent abuse with request limits
- **CORS:** Configure for browser-based clients
- **Documentation:** Keep API docs updated (FastAPI does this!)
- **Logging:** Log requests, errors, and performance metrics
- **Monitoring:** Track API health and usage patterns

??? notes
- These are production concerns, not just workshop exercises
- FastAPI has middleware for CORS and rate limiting
- Structured logging with tools like structlog
- Monitoring with tools like Prometheus, Datadog, Sentry

---

# Deployment Options

**Development:**
- `uvicorn main:app --reload`

**Production:**
- **Docker:** Containerize with official Python image
- **Cloud Platforms:** Heroku, AWS Lambda, Google Cloud Run, Azure App Service
- **Traditional VPS:** Ubuntu + nginx + systemd + uvicorn workers

**Key considerations:** HTTPS, environment variables, process management

??? notes
- Never run with --reload in production
- Use multiple uvicorn workers for concurrency
- Docker is the easiest path to production
- HTTPS is mandatory, use Let's Encrypt for free certs

---

# Checkpoint #6: Dockerize Your API

**Exercise (15 minutes):**
1. Create a `Dockerfile` for your API
2. Build the Docker image
3. Run the container and test the API
4. Check: can you access the API from your host machine?

**Starter Dockerfile provided in the repo**

??? notes
- Docker isn't scary, it's just a way to package your app
- Dockerfile in repo uses multi-stage build for small images
- Common issue: exposing the port with EXPOSE and -p flag
- Solution includes docker-compose for local development

---

# Additional Resources

**FastAPI Docs:** https://fastapi.tiangolo.com
**Workshop Repo:** github.com/jordankim/fastapi-workshop
**SQLAlchemy Tutorial:** docs.sqlalchemy.org/tutorial
**Pytest Guide:** docs.pytest.org
**JWT Spec:** jwt.io

**Next steps:**
- Add pagination to list endpoints
- Implement filtering and sorting
- Add background tasks with Celery
- Set up CI/CD for automated deployments

??? notes
- All resources will be in the workshop repo README
- Encourage participants to explore FastAPI docs
- Next level: async database queries, GraphQL, WebSockets
- Community: FastAPI Discord is very active

---

# Review: What We Built

✓ FastAPI application with multiple endpoints
✓ Pydantic models for request validation
✓ SQLAlchemy database integration
✓ JWT authentication
✓ pytest test suite
✓ Docker deployment setup

**You now have a production-ready API template!**

??? notes
- Celebrate what we accomplished in 90 minutes
- This is a real foundation for production APIs
- Participants can extend this for their own projects
- Encourage them to build something and share it

---

<!-- slide:type=closing -->
# Thank You!

**Jordan Kim**
jordan@example.com
GitHub: @jordankim

**Workshop repo:** github.com/jordankim/fastapi-workshop
**Slides:** github.com/jordankim/fastapi-slides

Questions? Feedback? Let's chat!

??? notes
- Keep yourself available after for 1:1 questions
- Share contact info for follow-ups
- Ask for feedback: what worked, what didn't
- Thank the organizers and participants
