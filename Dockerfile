# HappyVibe Dockerfile
FROM rust:1.75-slim as builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js for frontend build
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY src-tauri/Cargo.toml src-tauri/Cargo.lock ./src-tauri/

# Build dependencies first (cache layer)
RUN cd src-tauri && cargo fetch

# Copy source code
COPY . .

# Build frontend
RUN npm install && npm run build

# Build Rust web server
RUN cd src-tauri && cargo build --release --bin opcode-web

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/src-tauri/target/release/opcode-web /usr/local/bin/
COPY --from=builder /app/dist ./dist

EXPOSE 9000

CMD ["opcode-web", "--port", "9000", "--host", "0.0.0.0"]
