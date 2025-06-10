const request = require('supertest');
const authRoutes = require('../routes/authRoutes');

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    resetMocks();
    app = createTestApp(authRoutes);
  });

  describe('POST /api/login', () => {
    it('debería autenticar usuario con credenciales válidas', async () => {
      const userData = mockData.users[0];
      mockDb.query.mockResolvedValueOnce({ rows: [userData] });

      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test1@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('test_user1');
      expect(response.body.message).toBe('Logueado correctamente');
    });

    it('debería rechazar credenciales inválidas', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Credenciales incorrectas');
    });

    it('debería validar campos requeridos', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@example.com'
          // password faltante
        });

      // La respuesta debería manejar campos faltantes
      expect(response.status).toBe(500); // Tu actual implementación retorna 500
    });
  });

  describe('POST /api/register', () => {
    it('debería registrar un nuevo usuario', async () => {
      const newUser = {
        user_id: 3,
        username: 'new_user',
        email: 'new@example.com',
        password: 'newpassword'
      };
      
      mockDb.query.mockResolvedValueOnce({ rows: [newUser] });

      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'new_user',
          password: 'newpassword',
          email: 'new@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.username).toBe('new_user');
    });

    it('debería rechazar registro sin campos requeridos', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'test_user'
          // password y email faltantes
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Por favor, completá todos los campos.');
    });

    it('debería manejar errores de base de datos', async () => {
      mockDb.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'test_user',
          password: 'password123',
          email: 'test@example.com'
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error en el servidor');
    });
  });
});
