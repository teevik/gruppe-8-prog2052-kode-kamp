FROM rust:1.81

WORKDIR /usr/src/code-runner
COPY . .

RUN cargo install --path .

EXPOSE 3000
CMD ["code-runner"]
