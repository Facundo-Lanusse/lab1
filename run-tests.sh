#!/bin/bash

# Script para ejecutar todos los tests del proyecto Brain Battle
echo "🧪 Ejecutando suite completa de tests para Brain Battle"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar resultados
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2 - PASARON${NC}"
    else
        echo -e "${RED}❌ $2 - FALLARON${NC}"
    fi
}

# Variables para tracking de resultados
backend_tests=0
frontend_tests=0
total_errors=0

echo -e "${BLUE}📦 Tests del Backend${NC}"
echo "-------------------"
cd backend

# Ejecutar tests del backend
npm test 2>/dev/null
backend_tests=$?
show_result $backend_tests "Tests del Backend"

if [ $backend_tests -eq 0 ]; then
    echo -e "${YELLOW}📊 Generando reporte de cobertura del backend...${NC}"
    npm run test:coverage 2>/dev/null
fi

echo ""
echo -e "${BLUE}🌐 Tests del Frontend${NC}"
echo "--------------------"
cd ../client

# Ejecutar tests del frontend
npm test -- --watchAll=false 2>/dev/null
frontend_tests=$?
show_result $frontend_tests "Tests del Frontend"

if [ $frontend_tests -eq 0 ]; then
    echo -e "${YELLOW}📊 Generando reporte de cobertura del frontend...${NC}"
    npm run test:coverage -- --watchAll=false 2>/dev/null
fi

echo ""
echo "=================================================="
echo -e "${BLUE}📋 Resumen de Tests${NC}"
echo "=================================================="

# Calcular errores totales
total_errors=$((backend_tests + frontend_tests))

if [ $total_errors -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Todos los tests pasaron exitosamente!${NC}"
    echo -e "${GREEN}✅ Backend: PASÓ${NC}"
    echo -e "${GREEN}✅ Frontend: PASÓ${NC}"
    echo ""
    echo -e "${YELLOW}📊 Reportes de cobertura generados en:${NC}"
    echo "   - backend/coverage/"
    echo "   - client/coverage/"
else
    echo -e "${RED}❌ Algunos tests fallaron${NC}"
    if [ $backend_tests -ne 0 ]; then
        echo -e "${RED}❌ Backend: FALLÓ${NC}"
    else
        echo -e "${GREEN}✅ Backend: PASÓ${NC}"
    fi
    
    if [ $frontend_tests -ne 0 ]; then
        echo -e "${RED}❌ Frontend: FALLÓ${NC}"
    else
        echo -e "${GREEN}✅ Frontend: PASÓ${NC}"
    fi
fi

echo ""
echo -e "${BLUE}🔧 Comandos útiles:${NC}"
echo "-------------------"
echo "Backend:"
echo "  npm test                 # Ejecutar tests"
echo "  npm run test:watch       # Tests en modo watch"
echo "  npm run test:coverage    # Tests con cobertura"
echo "  npm run test:verbose     # Tests con output detallado"
echo ""
echo "Frontend:"
echo "  npm test                 # Ejecutar tests"
echo "  npm run test:watch       # Tests en modo watch"
echo "  npm run test:coverage    # Tests con cobertura"
echo ""

# Regresar al directorio raíz
cd ..

exit $total_errors
