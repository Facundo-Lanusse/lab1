const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Configurar variables de entorno para tests
process.env.SECRET_JWT_KEY = 'test_secret_key_for_testing_only';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';
process.env.DB_NAME = 'test_db';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';

// Mock de la base de datos para tests
const mockDb = {
  query: jest.fn(),
  connect: jest.fn().mockResolvedValue(),
  end: jest.fn()
};

// Configurar mocks globales
jest.mock('../database', () => mockDb);

// Helper para crear app de prueba
global.createTestApp = (router) => {
  const app = express();
  app.use(bodyParser.json());
  app.use('/api', router);
  return app;
};

// Helper para reset de mocks
global.resetMocks = () => {
  jest.clearAllMocks();
};

// Mock data común para tests
global.mockData = {
  users: [
    { user_id: 1, username: 'test_user1', email: 'test1@example.com', password: 'password123' },
    { user_id: 2, username: 'test_user2', email: 'test2@example.com', password: 'password456' }
  ],
  categories: [
    { category_id: 1, name: 'Ciencia' },
    { category_id: 2, name: 'Historia' },
    { category_id: 3, name: 'Geografía' },
    { category_id: 4, name: 'Entretenimiento' }
  ],
  battle: {
    battle_id: 1,
    user_id1: 1,
    user_id2: 2,
    status: 'ongoing',
    whos_next: 1,
    date: new Date()
  },
  questions: [
    {
      question_id: 1,
      questiontext: '¿Cuál es el planeta más grande?',
      category_id: 1,
      alreadypicked: false
    }
  ],
  answers: [
    { answer_id: 1, question_id: 1, text: 'Júpiter', is_correct: true },
    { answer_id: 2, question_id: 1, text: 'Saturno', is_correct: false }
  ]
};

global.mockDb = mockDb;
