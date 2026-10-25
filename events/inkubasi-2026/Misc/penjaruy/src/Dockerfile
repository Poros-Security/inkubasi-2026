FROM python:3.11-slim

RUN useradd -m -s /bin/bash ctf

WORKDIR /home/ctf

COPY server.py .
COPY flag.txt /flag.txt

RUN chmod 444 /flag.txt && \
    chmod 555 server.py && \
    chown root:root /flag.txt

EXPOSE 7771

USER ctf

CMD ["python3", "-u", "server.py"]
