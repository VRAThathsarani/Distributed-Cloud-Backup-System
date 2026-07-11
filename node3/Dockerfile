FROM python:3.12-slim

WORKDIR /app

COPY . .

RUN pip install flask requests

EXPOSE 5003

CMD ["python", "app.py"]