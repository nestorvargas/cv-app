#!/usr/bin/env bash
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        CV Editor - Nestor Vargas      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# Check Docker
if ! command -v docker &>/dev/null; then
  echo "❌ Docker no está instalado. Instálalo en https://docs.docker.com/get-docker/"
  exit 1
fi

if ! docker info &>/dev/null; then
  echo "❌ Docker no está corriendo. Inicia Docker Desktop y vuelve a intentarlo."
  exit 1
fi

# Parse args
ACTION="${1:-up}"

case "$ACTION" in
  up|start)
    echo -e "${GREEN}▶ Iniciando la aplicación...${NC}"
    echo ""
    docker compose up --build -d
    echo ""
    echo -e "${GREEN}✅ Aplicación corriendo:${NC}"
    echo -e "   🌐 Frontend:  ${YELLOW}http://localhost:5173${NC}"
    echo -e "   🔧 Backend:   ${YELLOW}http://localhost:3001${NC}"
    echo -e "   🐘 PostgreSQL: localhost:5432"
    echo ""
    echo -e "Para ver los logs: ${BLUE}./start.sh logs${NC}"
    echo -e "Para detener:      ${BLUE}./start.sh stop${NC}"
    ;;

  down|stop)
    echo -e "${YELLOW}⏹ Deteniendo la aplicación...${NC}"
    docker compose down
    echo -e "${GREEN}✅ Detenida.${NC}"
    ;;

  restart)
    echo -e "${YELLOW}🔄 Reiniciando...${NC}"
    docker compose down
    docker compose up --build -d
    echo -e "${GREEN}✅ Reiniciada en http://localhost:5173${NC}"
    ;;

  logs)
    SERVICE="${2:-}"
    if [ -n "$SERVICE" ]; then
      docker compose logs -f "$SERVICE"
    else
      docker compose logs -f
    fi
    ;;

  status)
    docker compose ps
    ;;

  reset)
    echo -e "${YELLOW}⚠️  Esto eliminará los datos de la base de datos. ¿Continuar? (s/N)${NC}"
    read -r confirm
    if [[ "$confirm" =~ ^[sS]$ ]]; then
      docker compose down -v
      docker compose up --build -d
      echo -e "${GREEN}✅ Aplicación reiniciada con DB limpia.${NC}"
    else
      echo "Cancelado."
    fi
    ;;

  *)
    echo "Uso: ./start.sh [comando]"
    echo ""
    echo "Comandos:"
    echo "  up / start    Iniciar la aplicación (default)"
    echo "  stop / down   Detener la aplicación"
    echo "  restart       Reiniciar la aplicación"
    echo "  logs [srv]    Ver logs (backend | frontend | postgres)"
    echo "  status        Estado de los contenedores"
    echo "  reset         Reiniciar con base de datos limpia"
    ;;
esac
