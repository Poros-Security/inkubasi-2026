FROM python:3.12-slim
WORKDIR /app
COPY ./server.py ./server.py
ENV CTF_HOST=0.0.0.0
ENV CTF_PORT=8181
EXPOSE 8181
CMD ["python3", "server.py"]