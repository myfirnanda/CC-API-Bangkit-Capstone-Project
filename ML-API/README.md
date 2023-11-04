
# My FastAPI Project

This is a simple FastAPI project structured for a company-level application. The project serves a Hello World message through the API endpoint `/api/hello`.

## Requirements

- Python 3.7+
- Pip

## Installation

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/your-username/my_fastapi_project.git
cd my_fastapi_project
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Running the Application

To run the FastAPI application, use `uvicorn`:

```bash
uvicorn app.main:app --reload
```

The application will be available at [http://127.0.0.1:8000/](http://127.0.0.1:8000/). You can access the API documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) and the ReDoc at [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc).

## Endpoints

- `GET /`: Returns a welcome message.
- `GET /api/hello`: Returns a Hello World message.
