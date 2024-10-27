FROM postgres:latest

COPY data.sql /docker-entrypoint-initdb.d/data.sql

RUN chmod 644 /docker-entrypoint-initdb.d/data.sql;\
    apt-get update && \
    apt-get install -y net-tools

EXPOSE 5432