# 🧪 Suite de Tests - Brain Battle

Esta documentación describe la suite de tests implementada para mantener la calidad y estabilidad del proyecto Brain Battle.

## 📋 Cobertura de Tests

### Backend Tests
- **Autenticación** (`auth.test.js`) - Login, registro, validaciones
- **Modo Clásico** (`classicMode.test.js`) - Batallas, turnos, categorías
- **Modo Bullet** (`bulletMode.test.js`) - Preguntas rápidas, scoring
- **Middlewares** (`middleware.test.js`) - Validaciones de batalla y amistad
- **Integración** (`integration.test.js`) - Flujos completos de API

### Frontend Tests
- **Login Component** - Autenticación y validaciones
- **BulletPlay Component** - Gameplay y temporizador
- **ClassicMode Component** - Batallas y estado de juego

## 🚀 Comandos de Ejecución

### Ejecutar todos los tests
```bash
./run-tests.sh
```

### Backend (desde carpeta `/backend`)
```bash
npm test                 # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con reporte de cobertura
npm run test:verbose     # Tests con output detallado
```

### Frontend (desde carpeta `/client`)
```bash
npm test                 # Ejecutar tests
npm run test:watch       # Tests en modo watch  
npm run test:coverage    # Tests con reporte de cobertura
```

## 📊 Reportes de Cobertura

Los reportes se generan en:
- Backend: `backend/coverage/`
- Frontend: `client/coverage/`

## 🧱 Estructura de Tests

### Backend
```
backend/tests/
├── setup.js              # Configuración global y mocks
├── auth.test.js           # Tests de autenticación
├── classicMode.test.js    # Tests del modo clásico
├── bulletMode.test.js     # Tests del modo bullet
├── middleware.test.js     # Tests de middlewares
└── integration.test.js    # Tests de integración
```

### Frontend
```
client/src/components/
├── Login.test.jsx         # Tests del componente Login
├── BulletPlay.test.jsx    # Tests del componente BulletPlay
└── ClassicMode.test.jsx   # Tests del componente ClassicMode
```

## 🔍 Qué se testea

### ✅ Funcionalidades Críticas Cubiertas

**Autenticación:**
- Login exitoso y fallido
- Registro de usuarios
- Validación de campos
- Manejo de errores

**Modo Clásico:**
- Creación de batallas
- Gestión de turnos
- Procesamiento de respuestas
- Selección de categorías
- Estados de batalla

**Modo Bullet:**
- Carga de preguntas
- Respuestas correctas/incorrectas
- Sistema de scoring
- Gestión de tiempo

**Middlewares:**
- Validación de batallas existentes
- Validación de turnos de usuario
- Validación de amistad

**Frontend:**
- Renderizado de componentes
- Interacciones de usuario
- Llamadas a API
- Manejo de estados

### 🎯 Casos de Uso Principales

1. **Flujo de autenticación completo**
2. **Creación y jugada de batalla clásica**
3. **Sesión completa de modo bullet**
4. **Validaciones de seguridad**
5. **Manejo de errores y casos extremos**

## 🛠️ Configuración

### Dependencias Backend
- **Jest**: Framework de testing
- **Supertest**: Tests de API HTTP
- **Mocks**: Base de datos y middlewares

### Dependencias Frontend
- **Jest**: Framework de testing
- **React Testing Library**: Testing de componentes
- **Jest DOM**: Matchers adicionales
- **User Event**: Simulación de interacciones

## 📝 Escribir Nuevos Tests

### Backend Example
```javascript
describe('Nueva Funcionalidad', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('debería hacer algo específico', async () => {
    // Arrange
    mockDb.query.mockResolvedValue({ rows: [/* datos */] });

    // Act
    const response = await request(app)
      .post('/api/endpoint')
      .send({ data: 'test' });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('expectedProperty');
  });
});
```

### Frontend Example
```javascript
describe('Nuevo Componente', () => {
  it('debería renderizar correctamente', () => {
    render(<NuevoComponente />);
    
    expect(screen.getByText('Texto Esperado')).toBeInTheDocument();
  });

  it('debería manejar clicks', async () => {
    render(<NuevoComponente />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('Resultado')).toBeInTheDocument();
    });
  });
});
```

## 🐛 Debugging Tests

### Si los tests fallan:

1. **Verificar mocks**: Asegúrate de que los mocks están configurados correctamente
2. **Revisar setup**: Verifica la configuración en `setup.js`
3. **Logs detallados**: Usa `npm run test:verbose`
4. **Modo watch**: Usa `npm run test:watch` para desarrollo iterativo

### Comandos de debug:
```bash
# Ver solo tests que fallan
npm test -- --verbose

# Ejecutar test específico
npm test -- --testNamePattern="nombre del test"

# Ver coverage detallado
npm run test:coverage
```

## 🎯 Beneficios Obtenidos

1. **Detección temprana de bugs**
2. **Refactoring seguro**
3. **Documentación del comportamiento esperado**
4. **Confianza en el código**
5. **Facilita el debugging**
6. **Previene regresiones**

## 🔄 Mantenimiento

- Ejecutar tests antes de cada commit
- Actualizar tests cuando cambies funcionalidades
- Mantener coverage alto (objetivo: >80%)
- Revisar y actualizar mocks periódicamente

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
