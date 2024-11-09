# Always use bash as the shell
set shell := ["bash", "-uc"]

db:
  cd ./backend && docker compose up -d

alias i := install
install:
  npx concurrently -n backend,frontend -c "green.bold,yellow.bold" \
    "cd ./backend && npm i" \
    "cd ./frontend && npm i"

dev:
  npx concurrently -n backend,frontend -c "green.bold,yellow.bold" \
    "cd ./backend && npm run dev" \
    "cd ./frontend && npm run dev"
