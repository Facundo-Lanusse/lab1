import '@testing-library/jest-dom';

// Polyfills para el entorno de testing
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock de localStorage con funciones jest
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true
});

// Mock de fetch
global.fetch = jest.fn();

// Mock de window.alert y window.confirm
global.alert = jest.fn();
global.confirm = jest.fn();

// Mock de axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Mock de framer-motion para evitar problemas de animación
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    img: 'img',
    h1: 'h1',
    p: 'p',
  },
  AnimatePresence: ({ children }) => children,
}));
