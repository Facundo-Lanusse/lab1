const request = require('supertest');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Mock completo de la aplicación para tests de integración
jest.mock('../database');

const authRoutes = require('../routes/authRoutes');
const classicRoutes = require('../routes/clsssicModeRoutes');
const bulletRoutes = require('../routes/BulletRoutes');

// Mock de middlewares para tests de integración
jest.mock('../middleware/battleMiddleware', () => ({
  validateFriendship: (req, res, next) => next(),
  validateBattleExists: (req, res, next) => {
    req.battle = mockData.battle;
    next();
  },
  validateUserTurn: (req, res, next) => next()
}));

describe('Integration Tests - API Endpoints', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(cors());
    app.use(bodyParser.json());
    
    // Configurar rutas
    app.use('/api', authRoutes);
    app.use('/api', classicRoutes);
    app.use('/api', bulletRoutes);
  });

  beforeEach(() => {
    resetMocks();
  });

  describe('Flujo completo de autenticación', () => {
    it('debería registrar usuario y luego hacer login', async () => {
      const newUser = {
        user_id: 1,
        username: 'integration_user',
        email: 'integration@test.com',
        password: 'password123'
      };

      // Mock para registro
      mockDb.query.mockResolvedValueOnce({ rows: [newUser] });

      // 1. Registrar usuario
      const registerResponse = await request(app)
        .post('/api/register')
        .send({
          username: 'integration_user',
          password: 'password123',
          email: 'integration@test.com'
        });

      expect(registerResponse.status).toBe(200);
      expect(registerResponse.body.username).toBe('integration_user');

      // Mock para login
      mockDb.query.mockResolvedValueOnce({ rows: [newUser] });

      // 2. Hacer login con el usuario registrado
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'integration@test.com',
          password: 'password123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');
      expect(loginResponse.body.user.username).toBe('integration_user');
    });
  });

  describe('Flujo completo de batalla clásica', () => {
    it('debería crear batalla, obtener estado y procesar respuesta', async () => {
      // 1. Crear batalla
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ battle_id: 1 }] }) // Crear batalla
        .mockResolvedValueOnce({ rows: mockData.categories }) // Obtener categorías
        .mockResolvedValue({ rows: [] }); // Insertar categorías

      const createBattleResponse = await request(app)
        .post('/api/classic/start')
        .send({
          userId: 1,
          opponentId: 2
        });

      expect(createBattleResponse.status).toBe(201);
      expect(createBattleResponse.body.success).toBe(true);
      expect(createBattleResponse.body.battleId).toBe(1);

      // 2. Obtener estado de la batalla
      const categoriesData = [
        { user_id: 1, category_id: 1, completed: false, name: 'Ciencia' },
        { user_id: 2, category_id: 1, completed: false, name: 'Ciencia' }
      ];
      
      mockDb.query.mockResolvedValueOnce({ rows: categoriesData });

      const battleStateResponse = await request(app)
        .get('/api/classic/battle/1/state');

      expect(battleStateResponse.status).toBe(200);
      expect(battleStateResponse.body.success).toBe(true);
      expect(battleStateResponse.body.battle).toHaveProperty('user1Categories');

      // 3. Obtener pregunta
      mockDb.query
        .mockResolvedValueOnce({ rows: [mockData.questions[0]] })
        .mockResolvedValueOnce({ rows: mockData.answers });

      const questionResponse = await request(app)
        .get('/api/classic/battle/1/questions?categoryId=1');

      expect(questionResponse.status).toBe(200);
      expect(questionResponse.body.success).toBe(true);
      expect(questionResponse.body.question).toHaveProperty('question_id');

      // 4. Procesar respuesta
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ is_correct: true }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{}] })
        .mockResolvedValueOnce({ rows: [{ count: '1' }] });

      const answerResponse = await request(app)
        .post('/api/classic/battle/1/answer')
        .send({
          questionId: 1,
          answerId: 1,
          userId: 1
        });

      expect(answerResponse.status).toBe(200);
      expect(answerResponse.body.success).toBe(true);
      expect(answerResponse.body.correct).toBe(true);
    });
  });

  describe('Flujo completo de modo bullet', () => {
    it('debería obtener pregunta, responder y actualizar score', async () => {
      const bulletQuestion = {
        bullet_question_id: 1,
        bullet_text: '¿Test question?',
        already_picked: false
      };

      const bulletAnswers = [
        { answer_text: 'Correct', is_correct: true },
        { answer_text: 'Wrong', is_correct: false }
      ];

      // 1. Obtener pregunta bullet
      mockDb.query
        .mockResolvedValueOnce({ rows: [bulletQuestion] })
        .mockResolvedValueOnce({ rows: bulletAnswers });

      const questionResponse = await request(app)
        .get('/api/FetchBulletQuestion');

      expect(questionResponse.status).toBe(200);
      expect(questionResponse.body.allQuestionChecked).toBe(false);
      expect(questionResponse.body.question).toHaveProperty('bullet_question_id');

      // 2. Marcar pregunta como respondida
      mockDb.query.mockResolvedValueOnce({ rows: [{}] });

      const checkResponse = await request(app)
        .post('/api/CheckBulletQuestion')
        .send({ questionId: 1 });

      expect(checkResponse.status).toBe(200);
      expect(checkResponse.body.message).toBe('Se actualizó la pregunta correctamente');

      // 3. Subir score
      mockDb.query
        .mockResolvedValueOnce({ rows: [] }) // No existe score previo
        .mockResolvedValueOnce({ rows: [{ score: 10 }] }); // Insertar nuevo score

      const scoreResponse = await request(app)
        .post('/api/UploadUserBulletBestScore')
        .send({
          score: 10,
          userId: 1
        });

      expect(scoreResponse.status).toBe(200);
    });
  });

  describe('Manejo de errores en flujos completos', () => {
    it('debería manejar errores de base de datos en cascada', async () => {
      // Simular error en la primera llamada
      mockDb.query.mockRejectedValueOnce(new Error('Database connection failed'));

      const response = await request(app)
        .post('/api/classic/start')
        .send({
          userId: 1,
          opponentId: 2
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

    it('debería validar datos requeridos en múltiples endpoints', async () => {
      // Test de validación para crear batalla sin datos
      const battleResponse = await request(app)
        .post('/api/classic/start')
        .send({});

      expect(battleResponse.status).toBe(500); // Tu implementación actual

      // Test de validación para login sin datos
      const loginResponse = await request(app)
        .post('/api/login')
        .send({});

      expect(loginResponse.status).toBe(500); // Tu implementación actual
    });
  });

  describe('Tests de rendimiento básico', () => {
    it('debería responder en tiempo razonable', async () => {
      mockDb.query.mockResolvedValue({ rows: [] });

      const start = Date.now();
      
      await request(app)
        .get('/api/FetchBulletQuestion');

      const duration = Date.now() - start;
      
      // Debería responder en menos de 1 segundo
      expect(duration).toBeLessThan(1000);
    });

    it('debería manejar múltiples requests concurrentes', async () => {
      mockDb.query.mockResolvedValue({ rows: [mockData.users[0]] });

      const requests = Array(5).fill().map(() => 
        request(app)
          .post('/api/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          })
      );

      const responses = await Promise.all(requests);
      
      // Todas las respuestas deberían ser exitosas
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});
