const express = require('express');
const router = express.Router();
const db = require('../database'); // Importar tu conexión de base de datos

// Endpoint para generar código de invitación
router.post('/generate', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Se requiere un usuario para generar invitación'
            });
        }

        // Generar código único de 6 caracteres
        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Insertar invitación en la tabla
        const insertInviteQuery = `
            INSERT INTO invitations (invite_code, creator_id, status)
            VALUES ($1, $2, 'pending')
            RETURNING id
        `;

        await db.query(insertInviteQuery, [inviteCode, userId]);

        res.json({
            success: true,
            inviteCode
        });

    } catch (error) {
        console.error('Error generando invitación:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// unirse con código de invitación
router.post('/join', async (req, res) => {
    try {
        const { inviteCode, userId } = req.body;
        const parsedUserId = parseInt(userId);

        if (!inviteCode || !parsedUserId) {
            return res.status(400).json({
                success: false,
                error: 'Código de invitación y usuario requeridos'
            });
        }

        // Buscar invitación válida
        const findInviteQuery = `
            SELECT * FROM invitations
            WHERE invite_code = $1
              AND status = 'pending'
              AND expires_at > NOW()
        `;

        const inviteResult = await db.query(findInviteQuery, [inviteCode]);

        if (inviteResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Código de invitación inválido o expirado'
            });
        }

        const invite = inviteResult.rows[0];
        const creatorId = parseInt(invite.creator_id);

        if (creatorId === parsedUserId) {
            return res.status(400).json({
                success: false,
                error: 'No puedes unirte a tu propia partida'
            });
        }

        // Crear nueva batalla
        const createBattleQuery = `
            INSERT INTO battle (user_id1, user_id2, status, date, whos_next)
            VALUES ($1::INTEGER, $2::INTEGER, 'ongoing', NOW(), $1::INTEGER)
            RETURNING battle_id
        `;

        const battleResult = await db.query(createBattleQuery, [creatorId, parsedUserId]);
        const battleId = parseInt(battleResult.rows[0].battle_id);

        // Inicializar categorías para ambos usuarios
        const initCategoriesQuery = `
            INSERT INTO battle_categories (battle_id, user_id, category_id, completed)
            SELECT $1::INTEGER, $2::INTEGER, category_id, false FROM category
            UNION ALL
            SELECT $1::INTEGER, $3::INTEGER, category_id, false FROM category
        `;

        await db.query(initCategoriesQuery, [battleId, creatorId, parsedUserId]);

        // Marcar invitación como usada
        const updateInviteQuery = `
            UPDATE invitations
            SET status = 'used', battle_id = $1::INTEGER
            WHERE id = $2::INTEGER
        `;

        const inviteId = parseInt(invite.id);
        await db.query(updateInviteQuery, [battleId, inviteId]);

        res.json({
            success: true,
            battleId
        });

    } catch (error) {
        console.error('Error uniéndose a partida:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Endpoint para verificar invitaciones usadas
router.get('/check-used-invitations', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Se requiere ID de usuario'
            });
        }

        // Buscar invitaciones recientes que fueron usadas
        const usedInvitationsQuery = `
            SELECT i.*, b.battle_id
            FROM invitations i
            JOIN battle b ON i.battle_id = b.battle_id
            WHERE i.creator_id = $1
            AND i.status = 'used'
            AND i.created_at > NOW() - INTERVAL '1 hour'
            AND b.status = 'ongoing'
        `;

        const result = await db.query(usedInvitationsQuery, [userId]);

        const newBattles = result.rows.map(row => ({
            battleId: row.battle_id,
            inviteCode: row.invite_code,
            createdAt: row.created_at
        }));

        res.json({
            success: true,
            newBattles
        });

    } catch (error) {
        console.error('Error verificando invitaciones usadas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router;