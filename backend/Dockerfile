# Dockerfile Backend
FROM golang:latest

COPY . /backend
WORKDIR /backend
RUN go mod init backend
RUN go mod tidy
RUN go build -o backend


ENV DB_USERNAME=root
ENV DB_PASSWORD=root
ENV DB_HOST=databse-db
ENV DB_PORT=3306
ENV DB_DATABASE=databse

EXPOSE 8080

# Usamos el script de espera.
# Si usamos el script de espera, no necesitamos el healthcheck en el docker-compose.
CMD ["/backend/backend"]