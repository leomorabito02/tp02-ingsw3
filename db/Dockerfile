FROM mysql:latest

COPY ./init.sql /docker-entrypoint-initdb.d/

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=databse
ENV MySQL_DB_HOST=databse-db
ENV MYSQL_PORT=3306