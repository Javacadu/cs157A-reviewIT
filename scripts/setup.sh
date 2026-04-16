#!/usr/bin/env bash
# ReviewIT Local Setup Script
# Platform-agnostic: works on macOS, Linux, and Windows (Git Bash/WSL)

set -e

# Colors for output (platform-safe)
if [ -t 1 ]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  NC='\033[0m'
else
  RED=''
  GREEN=''
  YELLOW=''
  NC=''
fi

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Detect package manager
detect_pkg_manager() {
  if command -v npm &> /dev/null; then
    echo "npm"
  elif command -v pnpm &> /dev/null; then
    echo "pnpm"
  elif command -v yarn &> /dev/null; then
    echo "yarn"
  elif command -v bun &> /dev/null; then
    echo "bun"
  else
    echo "none"
  fi
}

# Check for Node.js
check_node() {
  if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
  fi
  NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js version 18+ required. Current: $(node -v)"
    exit 1
  fi
  log_info "Node.js $(node -v) detected"
}

# Check for PostgreSQL
check_postgres() {
  if command -v psql &> /dev/null; then
    log_info "PostgreSQL client detected"
  else
    log_warn "PostgreSQL client not found. Ensure PostgreSQL is installed and running."
  fi
}

# Setup environment file
setup_env() {
  if [ ! -f ".env.local" ]; then
    if [ -f ".env.local.example" ]; then
      cp .env.local.example .env.local
      log_info "Created .env.local from example"
      log_warn "Please edit .env.local and set your DATABASE_URL"
    else
      log_error ".env.local.example not found"
      exit 1
    fi
  else
    log_info ".env.local already exists, skipping"
  fi
}

# Install dependencies
install_deps() {
  PKG_MANAGER=$(detect_pkg_manager)
  case "$PKG_MANAGER" in
    npm)
      log_info "Installing dependencies with npm..."
      npm install
      ;;
    pnpm)
      log_info "Installing dependencies with pnpm..."
      pnpm install
      ;;
    yarn)
      log_info "Installing dependencies with yarn..."
      yarn install
      ;;
    bun)
      log_info "Installing dependencies with bun..."
      bun install
      ;;
    *)
      log_error "No package manager found (npm, pnpm, yarn, or bun)"
      exit 1
      ;;
  esac
}

# Print next steps
print_next_steps() {
  echo ""
  log_info "Setup complete!"
  echo ""
  echo "Next steps:"
  echo "  1. Edit .env.local and set your DATABASE_URL"
  echo "  2. Create the database: createdb reviewit (or via your DB tool)"
  echo "  3. Run the schema: psql \$DATABASE_URL -f src/lib/db/schema.sql"
  echo "  4. Start dev server: npm run dev"
  echo "  5. Open http://localhost:3000"
  echo ""
}

# Main
main() {
  echo "=========================================="
  echo "  ReviewIT Local Setup"
  echo "=========================================="
  echo ""

  check_node
  check_postgres
  setup_env
  install_deps
  print_next_steps
}

main "$@"
