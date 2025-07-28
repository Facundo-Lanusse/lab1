// battleMiddleware.js - Middlewares para validación de batallas
const db = require("../database");

//Middleware para verificar si la batalla existe y está en curso
const validateBattleExists = async (req, res, next) => {
  const battleId =
    req.params.battleId || req.body.battleId || req.query.battleId;

  if (!battleId) {
    return res.status(400).json({
      success: false,
      message: "ID de batalla requerido",
    });
  }

  try {
    const battleQuery = `SELECT * FROM battle WHERE battle_id = $1`;
    const battleResult = await db.query(battleQuery, [battleId]);

    if (battleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Batalla no encontrada",
      });
    }

    // Verificamos si la batalla está en curso
    if (battleResult.rows[0].status !== "ongoing") {
      return res.status(403).json({
        success: false,
        message: "Esta batalla ya ha finalizado",
      });
    }

    // Guardamos los datos de la batalla en req para usarlos en las rutas
    req.battle = battleResult.rows[0];
    next();
  } catch (error) {
    console.error("Error al verificar batalla:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar la batalla",
    });
  }
};

//Middleware para verificar si la batalla existe (sin validar estado)
const validateBattleExistsOnly = async (req, res, next) => {
  const battleId =
    req.params.battleId || req.body.battleId || req.query.battleId;

  if (!battleId) {
    return res.status(400).json({
      success: false,
      message: "ID de batalla requerido",
    });
  }

  try {
    const battleQuery = `SELECT * FROM battle WHERE battle_id = $1`;
    const battleResult = await db.query(battleQuery, [battleId]);

    if (battleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Batalla no encontrada",
      });
    }

    // Guardamos los datos de la batalla en req para usarlos en las rutas
    req.battle = battleResult.rows[0];
    next();
  } catch (error) {
    console.error("Error al verificar batalla:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar la batalla",
    });
  }
};

//Middleware específico para guardar resultados (más permisivo)
const validateBattleForResult = async (req, res, next) => {
  const battleId =
    req.params.battleId || req.body.battleId || req.query.battleId;

  if (!battleId) {
    return res.status(400).json({
      success: false,
      message: "ID de batalla requerido",
    });
  }

  try {
    const battleQuery = `SELECT * FROM battle WHERE battle_id = $1`;
    const battleResult = await db.query(battleQuery, [battleId]);

    if (battleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Batalla no encontrada",
      });
    }

    const battle = battleResult.rows[0];

    // Verificar que la batalla no esté en un estado inválido
    if (battle.status !== "ongoing" && battle.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Estado de batalla inválido",
      });
    }

    // Guardamos los datos de la batalla en req para usarlos en las rutas
    req.battle = battle;
    next();
  } catch (error) {
    console.error("Error al verificar batalla para resultado:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar la batalla",
    });
  }
};

/**
 * Middleware para verificar si es el turno del usuario
 */
const validateUserTurn = (req, res, next) => {
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "ID de usuario requerido",
    });
  }

  if (!req.battle) {
    return res.status(500).json({
      success: false,
      message: "Error interno: Datos de batalla no disponibles",
    });
  }

  // Convertir ambos valores a números enteros para asegurar una comparación correcta
  const userIdNumber = parseInt(userId);
  const whosNextNumber = parseInt(req.battle.whos_next);

  console.log("Comparación de turnos:", {
    userId: userIdNumber,
    whosNext: whosNextNumber,
    tipoUserId: typeof userIdNumber,
    tipoWhosNext: typeof whosNextNumber,
    sonIguales: userIdNumber === whosNextNumber,
  });

  if (whosNextNumber !== userIdNumber) {
    return res.status(403).json({
      success: false,
      message: "No es tu turno",
    });
  }

  next();
};

/**
 * Middleware para verificar si dos usuarios son amigos
 */
const validateFriendship = async (req, res, next) => {
  const { userId, opponentId } = req.body;

  if (!userId || !opponentId) {
    return res.status(400).json({
      success: false,
      message: "IDs de usuario y oponente requeridos",
    });
  }

  try {
    const checkFriendshipQuery = `
        SELECT * 
        FROM friends 
        WHERE ((user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1))
        AND state = 'accepted'
        `;
    const friendshipResult = await db.query(checkFriendshipQuery, [
      userId,
      opponentId,
    ]);

    if (friendshipResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Solo puedes desafiar a usuarios que son tus amigos",
      });
    }

    next();
  } catch (error) {
    console.error("Error al verificar amistad:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar la amistad entre usuarios",
    });
  }
};

module.exports = {
  validateBattleExists,
  validateBattleExistsOnly,
  validateBattleForResult,
  validateUserTurn,
  validateFriendship,
};
