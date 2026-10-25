FROM mariadb:10.11

COPY conf.d/challenge.cnf /etc/mysql/conf.d/challenge.cnf
COPY init/ /docker-entrypoint-initdb.d/
COPY docker-entrypoint.sh /usr/local/bin/challenge-entrypoint.sh

RUN chmod 0644 /etc/mysql/conf.d/challenge.cnf \
    && chmod +x /usr/local/bin/challenge-entrypoint.sh

EXPOSE 3306

ENTRYPOINT ["challenge-entrypoint.sh"]
CMD ["mariadbd"]