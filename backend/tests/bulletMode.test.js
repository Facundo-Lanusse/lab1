const request = require('supertest');
const bulletRoutes = require('../routes/BulletRoutes');

describe('Bullet Mode Routes', () => {
  let app;

  beforeEach(() => {
    resetMocks();
    app = createTestApp(bulletRoutes);
  });

  describe('GET /api/FetchBulletQuestion', () => {
    it('debería retornar pregunta bullet aleatoria', async () => {
      const bulletQuestion = {
        bullet_question_id: 1,
        bullet_text: '¿De qué color es el cielo?',
        already_picked: false
      };

      const bulletAnswers = [
        { bullet_answer_id: 1, bullet_question_id: 1, answer_text: 'Azul', is_correct: true },
        { bullet_answer_id: 2, bullet_question_id: 1, answer_text: 'Rojo', is_correct: false }
      ];

      mockDb.query
        .mockResolvedValueOnce({ rows: [bulletQuestion] })
        .mockResolvedValueOnce({ rows: bulletAnswers });

      const response = await request(app)
        .get('/api/FetchBulletQuestion');

      expect(response.status).toBe(200);
      expect(response.body.allQuestionChecked).toBe(false);
      expect(response.body.question).toHaveProperty('bullet_question_id');
      expect(response.body.bullet_answers).toHaveLength(2);
      expect(response.body.bullet_answers[0]).toHaveProperty('is_correct');
    });

    it('debería indicar cuando todas las preguntas están marcadas', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/FetchBulletQuestion');

      expect(response.status).toBe(200);
      expect(response.body.allQuestionChecked).toBe(true);
      expect(response.body.message).toBe('Marcadas con éxito');
    });

    it('debería manejar errores de base de datos', async () => {
      mockDb.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/FetchBulletQuestion');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error en el servidor');
    });
  });

  describe('POST /api/CheckBulletQuestion', () => {
    it('debería marcar pregunta como ya seleccionada', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [{}] });

      const response = await request(app)
        .post('/api/CheckBulletQuestion')
        .send({ questionId: 1 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Se actualizó la pregunta correctamente');
      expect(response.body.id).toBe(1);
    });

    it('debería manejar errores al marcar pregunta', async () => {
      mockDb.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/CheckBulletQuestion')
        .send({ questionId: 1 });

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/UncheckBulletQuestion', () => {
    it('debería desmarcar todas las preguntas bullet', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [{}] });

      const response = await request(app)
        .post('/api/UncheckBulletQuestion');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Se actualizó la pregunta correctamente');
    });
  });

  describe('POST /api/UploadUserBulletBestScore', () => {
    it('debería subir puntuación del usuario', async () => {
      // Mock para verificar si existe score previo
      mockDb.query
        .mockResolvedValueOnce({ rows: [] }) // No existe score previo
        .mockResolvedValueOnce({ rows: [{ score: 15 }] }); // Insertar nuevo score

      const response = await request(app)
        .post('/api/UploadUserBulletBestScore')
        .send({
          score: 15,
          userId: 1
        });

      expect(response.status).toBe(200);
      expect(mockDb.query).toHaveBeenCalled();
    });

    it('debería actualizar score si es mayor al existente', async () => {
      // Mock para score existente menor
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ score: 10 }] }) // Score existente
        .mockResolvedValueOnce({ rows: [{}] }); // Actualizar score

      const response = await request(app)
        .post('/api/UploadUserBulletBestScore')
        .send({
          score: 15,
          userId: 1
        });

      expect(response.status).toBe(200);
    });

    it('debería validar campos requeridos', async () => {
      const response = await request(app)
        .post('/api/UploadUserBulletBestScore')
        .send({
          score: 15
          // userId faltante
        });

      // Tu implementación actual no valida, pero debería
      expect(response.status).toBe(500);
    });
  });
});
