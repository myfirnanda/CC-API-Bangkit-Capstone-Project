FROM python:3.10-slim

ENV DEBIAN_FRONTEND=non-interactive
ENV PYTHONUNBUFFERED True

WORKDIR /app

COPY requirements.txt /app/

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

CMD uvicorn main:app --port=8000 --host=0.0.0.0
