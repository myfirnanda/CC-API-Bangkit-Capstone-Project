
# Recipe Recommendation API

This is a recipe recommendation API for EatWise mobile application.
## Requirements

- Python 3.10+
- Pip

## Installation

Clone the repository and navigate to the project directory:

```bash
git https://github.com/yg-firnanda/CC-API-Bangkit-Capstone-Project.git
cd CC-API-Bangkit-Capstone-Project/ML-API/
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Running the Application

To run the FastAPI application, use `uvicorn`:

```bash
uvicorn main:app --reload
```

The application will be available at [http://127.0.0.1:8000/](http://127.0.0.1:8000/). You can access the API documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) and the ReDoc at [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc).

## Request body
```json
{
"ingredients": "apple",
"limit": "all"
}
```

## Endpoints

- `GET /main`: Returns a welcome message.
- `GET /recommen-recipes/predict/`: Returns a recipe recommendation.
