const request = require('supertest');

// Mock de middlewares
jest.mock('../middleware/battleMiddleware', () => ({
  validateFriendship: (req, res, next) => {
    req.validFriendship = true;
    next();
  },
  validateBattleExists: (req, res, next) => {
    req.battle = mockData.battle;
    next();
  },
  validateUserTurn: (req, res, next) => {
    req.userTurn = true;
    next();
  }
}));

const classicRoutes = require('../routes/clsssicModeRoutes');

describe('Classic Mode Routes', () => {
  let app;

  beforeEach(() => {
    resetMocks();
    app = createTestApp(classicRoutes);
  });

  describe('POST /api/classic/start', () => {
    it('debería crear una nueva batalla exitosamente', async () => {
      const battle = { battle_id: 1 };
      mockDb.query
        .mockResolvedValueOnce({ rows: [battle] }) // Crear batalla
        .mockResolvedValueOnce({ rows: mockData.categories }) // Obtener categorías
        .mockResolvedValue({ rows: [] }); // Insertar categorías para cada usuario

      const response = await request(app)
        .post('/api/classic/start')
        .send({
          userId: 1,
          opponentId: 2
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.battleId).toBe(1);
      expect(response.body.message).toBe('Batalla creada con éxito');
    });

    it('debería manejar errores al crear batalla', async () => {
      mockDb.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/classic/start')
        .send({
          userId: 1,
          opponentId: 2
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error al crear la batalla');
    });
  });

  describe('GET /api/classic/battle/:battleId/state', () => {
    it('debería retornar el estado de la batalla', async () => {
      const categoriesData = [
        { user_id: 1, category_id: 1, completed: false, name: 'Ciencia' },
        { user_id: 1, category_id: 2, completed: true, name: 'Historia' },
        { user_id: 2, category_id: 1, completed: false, name: 'Ciencia' },
        { user_id: 2, category_id: 2, completed: false, name: 'Historia' }
      ];

      mockDb.query.mockResolvedValueOnce({ rows: categoriesData });

      const response = await request(app)
        .get('/api/classic/battle/1/state');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.battle).toHaveProperty('user1Categories');
      expect(response.body.battle).toHaveProperty('user2Categories');
      expect(response.body.battle.currentTurn).toBe(1);
      expect(response.body.battle.user1Categories).toHaveLength(2);
      expect(response.body.battle.user2Categories).toHaveLength(2);
    });
  });

  describe('GET /api/classic/battle/:battleId/questions', () => {
    it('debería retornar pregunta y respuestas para una categoría', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [mockData.questions[0]] }) // Pregunta
        .mockResolvedValueOnce({ rows: mockData.answers }); // Respuestas

      const response = await request(app)
        .get('/api/classic/battle/1/questions?categoryId=1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.question).toHaveProperty('question_id');
      expect(response.body.answers).toHaveLength(2);
    });

    it('debería manejar categoría sin preguntas', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/classic/battle/1/questions?categoryId=999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No hay preguntas disponibles para esta categoría');
    });
  });

  describe('POST /api/classic/battle/:battleId/answer', () => {
    it('debería procesar respuesta correcta y permitir selección de categoría', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ is_correct: true }] }) // Verificar respuesta
        .mockResolvedValueOnce({ rows: [] }) // Verificar respuesta existente
        .mockResolvedValueOnce({ rows: [{}] }) // Insertar respuesta
        .mockResolvedValueOnce({ rows: [{ count: '3' }] }); // Contar respuestas correctas

      const response = await request(app)
        .post('/api/classic/battle/1/answer')
        .send({
          questionId: 1,
          answerId: 1,
          userId: 1
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.correct).toBe(true);
      expect(response.body.canSelectCategory).toBe(true);
    });

    it('debería cambiar turno en respuesta incorrecta', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ is_correct: false }] }) // Verificar respuesta
        .mockResolvedValueOnce({ rows: [] }) // Verificar respuesta existente
        .mockResolvedValueOnce({ rows: [{}] }) // Insertar respuesta
        .mockResolvedValueOnce({ rows: [{}] }); // Actualizar turno

      const response = await request(app)
        .post('/api/classic/battle/1/answer')
        .send({
          questionId: 1,
          answerId: 2,
          userId: 1
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.correct).toBe(false);
      expect(response.body.nextPlayer).toBe(2);
    });
  });

  describe('POST /api/classic/battle/:battleId/select-category', () => {
    it('debería marcar categoría como completada y cambiar turno', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ category_id: 1 }] }) // Marcar categoría
        .mockResolvedValueOnce({ rows: [{}] }); // Cambiar turno

      const response = await request(app)
        .post('/api/classic/battle/1/select-category')
        .send({
          categoryId: 1,
          userId: 1
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Categoría seleccionada correctamente');
      expect(response.body.nextPlayer).toBe(2);
    });
  });

  describe('GET /api/classic/battles', () => {
    it('debería retornar batallas activas del usuario', async () => {
      const battlesData = [
        {
          battle_id: 1,
          opponent_name: 'test_user2',
          whos_next: 1,
          date: new Date(),
          mycompletedcategories: '2',
          opponentcompletedcategories: '1'
        }
      ];

      mockDb.query.mockResolvedValueOnce({ rows: battlesData });

      const response = await request(app)
        .get('/api/classic/battles?userId=1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.battles).toHaveLength(1);
      expect(response.body.battles[0]).toHaveProperty('battle_id');
      expect(response.body.battles[0]).toHaveProperty('opponent_name');
    });

    it('debería requerir userId', async () => {
      const response = await request(app)
        .get('/api/classic/battles');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Se requiere el ID del usuario');
    });
  });
});
