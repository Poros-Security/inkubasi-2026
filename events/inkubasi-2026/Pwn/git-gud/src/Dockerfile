FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y socat && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m -s /bin/bash ctf

COPY git_gut /usr/local/bin/git_gut
COPY entrypoint.sh /home/ctf/entrypoint.sh
COPY flag.txt /root/flag.txt

RUN chown root:root /usr/local/bin/git_gut && \
    chmod 4755 /usr/local/bin/git_gut && \
    chmod 755 /home/ctf/entrypoint.sh && \
    chmod 1733 /tmp

EXPOSE 6769

CMD ["socat", "TCP-LISTEN:6769,reuseaddr,fork", "EXEC:/home/ctf/entrypoint.sh"]
