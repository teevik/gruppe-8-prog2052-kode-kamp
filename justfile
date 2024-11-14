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

prettier:
  npx prettier --write ./backend
  npx prettier --write ./frontend

check:
  (cd ./backend && npm run check)
  (cd ./frontend && npm run check)
