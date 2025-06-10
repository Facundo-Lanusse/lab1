const { validateBattleExists, validateUserTurn, validateFriendship } = require('../middleware/battleMiddleware');

describe('Battle Middlewares', () => {
  let req, res, next;

  beforeEach(() => {
    resetMocks();
    req = {
      params: {},
      body: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('validateBattleExists', () => {
    it('debería pasar cuando la batalla existe y está en curso', async () => {
      req.params.battleId = '1';
      mockDb.query.mockResolvedValueOnce({
        rows: [{ ...mockData.battle, status: 'ongoing' }]
      });

      await validateBattleExists(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.battle).toBeDefined();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('debería fallar cuando no se proporciona battleId', async () => {
      await validateBattleExists(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'ID de batalla requerido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería fallar cuando la batalla no existe', async () => {
      req.params.battleId = '999';
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      await validateBattleExists(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Batalla no encontrada'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería fallar cuando la batalla ya terminó', async () => {
      req.params.battleId = '1';
      mockDb.query.mockResolvedValueOnce({
        rows: [{ ...mockData.battle, status: 'completed' }]
      });

      await validateBattleExists(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Esta batalla ya ha finalizado'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería manejar errores de base de datos', async () => {
      req.params.battleId = '1';
      mockDb.query.mockRejectedValueOnce(new Error('Database error'));

      await validateBattleExists(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al verificar la batalla'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateUserTurn', () => {
    beforeEach(() => {
      req.battle = { ...mockData.battle, whos_next: 1 };
    });

    it('debería pasar cuando es el turno del usuario', () => {
      req.body.userId = '1';

      validateUserTurn(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('debería fallar cuando no es el turno del usuario', () => {
      req.body.userId = '2';

      validateUserTurn(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No es tu turno'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería fallar cuando no se proporciona userId', () => {
      validateUserTurn(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'ID de usuario requerido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería fallar cuando no hay datos de batalla', () => {
      req.battle = null;
      req.body.userId = '1';

      validateUserTurn(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error interno: Datos de batalla no disponibles'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería manejar comparación de tipos correctamente', () => {
      req.body.userId = 1; // number
      req.battle.whos_next = '1'; // string

      validateUserTurn(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateFriendship', () => {
    it('debería pasar cuando los usuarios son amigos', async () => {
      req.body = { userId: 1, opponentId: 2 };
      mockDb.query.mockResolvedValueOnce({
        rows: [{ user_id: 1, friend_id: 2, state: 'accepted' }]
      });

      await validateFriendship(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('debería fallar cuando los usuarios no son amigos', async () => {
      req.body = { userId: 1, opponentId: 3 };
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      await validateFriendship(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Solo puedes desafiar a usuarios que son tus amigos'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería fallar cuando faltan IDs', async () => {
      req.body = { userId: 1 }; // opponentId faltante

      await validateFriendship(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'IDs de usuario y oponente requeridos'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería manejar errores de base de datos', async () => {
      req.body = { userId: 1, opponentId: 2 };
      mockDb.query.mockRejectedValueOnce(new Error('Database error'));

      await validateFriendship(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al verificar la amistad entre usuarios'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
