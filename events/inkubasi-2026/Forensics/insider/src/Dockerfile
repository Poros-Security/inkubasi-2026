FROM python:3.11-slim

WORKDIR /app

COPY server.py .

ENV CTF_HOST=0.0.0.0
ENV CTF_PORT=6741

EXPOSE 6741

CMD ["python", "server.py"]
