FROM golang:alpine as builder

WORKDIR /app 

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o ./main ./cmd/main.go

FROM scratch

WORKDIR /app

COPY --from=builder /app/main /usr/bin/

ENV LISTEN_URL=:8080

EXPOSE 8080

ENTRYPOINT ["main"]