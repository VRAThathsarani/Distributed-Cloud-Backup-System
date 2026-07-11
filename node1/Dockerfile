FROM python:3.12-slim

WORKDIR /app

COPY . .

RUN pip install flask requests

EXPOSE 5001

CMD ["python", "app.py"]