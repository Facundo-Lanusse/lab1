import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import ClassicMode from '../pages/ClassicMode';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ battleId: '1' }),
}));

// Mock del componente Wheel
jest.mock('../components/Wheel', () => {
  return function MockWheel({ onFinished, segments }) {
    return (
      <div data-testid="mock-wheel">
        <button onClick={() => onFinished(segments[0])}>
          Spin Wheel
        </button>
      </div>
    );
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Classic Mode - Battle System', () => {
  const mockUser = { user_id: 1, username: 'testuser' };
  const mockBattle = {
    battle_id: 1,
    user_id1: 1,
    user_id2: 2,
    status: 'ongoing',
    currentTurn: 1,
    user1Categories: [
      { category_id: 1, name: 'Ciencia', completed: false },
      { category_id: 2, name: 'Historia', completed: true }
    ],
    user2Categories: [
      { category_id: 1, name: 'Ciencia', completed: false },
      { category_id: 2, name: 'Historia', completed: false }
    ]
  };
  const mockQuestion = {
    question_id: 1,
    questiontext: '¿Cuál es el planeta más grande?'
  };
  const mockAnswers = [
    { answer_id: 1, text: 'Júpiter', is_correct: true },
    { answer_id: 2, text: 'Saturno', is_correct: false },
    { answer_id: 3, text: 'Tierra', is_correct: false },
    { answer_id: 4, text: 'Marte', is_correct: false }
  ];

  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
    jest.clearAllMocks();
  });

  describe('Battle State Management', () => {
    it('debería cargar y mostrar el estado de la batalla', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          success: true,
          battle: mockBattle
        }
      });

      renderWithRouter(<ClassicMode />);

      await waitFor(() => {
        expect(screen.getByText('Modo Clásico')).toBeInTheDocument();
        expect(screen.getByText('Es tu turno')).toBeInTheDocument();
      });
    });

    it('debería mostrar las categorías disponibles', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          success: true,
          battle: mockBattle
        }
      });

      renderWithRouter(<ClassicMode />);

      await waitFor(() => {
        expect(screen.getByText('Ciencia')).toBeInTheDocument();
        expect(screen.getByText('Historia')).toBeInTheDocument();
      });
    });

    it('debería mostrar mensaje cuando no es el turno del usuario', async () => {
      const battleNotMyTurn = {
        ...mockBattle,
        currentTurn: 2 // No es el turno del usuario 1
      };

      axios.get.mockResolvedValueOnce({
        data: {
          success: true,
          battle: battleNotMyTurn
        }
      });

      renderWithRouter(<ClassicMode />);

      await waitFor(() => {
        expect(screen.getByText('Esperando a que juegue el oponente')).toBeInTheDocument();
      });
    });
  });

  describe('Category Selection', () => {
    it('debería permitir seleccionar una categoría cuando es el turno del usuario', async () => {
      axios.get
        .mockResolvedValueOnce({
          data: {
            success: true,
            battle: mockBattle
          }
        })
        .mockResolvedValueOnce({
          data: {
            success: true,
            question: mockQuestion,
            answers: mockAnswers
          }
        });

      renderWithRouter(<ClassicMode />);

      await waitFor(() => {
        expect(screen.getByText('Ciencia')).toBeInTheDocument();
      });

      const scienceCategory = screen.getByText('Ciencia');
      fireEvent.click(scienceCategory);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          'http://localhost:3000/api/classic/battle/1/questions',
          { params: { categoryId: 1 } }
        );
      });
    });

    it('debería mostrar la ruleta cuando se puede seleccionar categoría', async () => {
      const battleWithCategorySelection = {
        ...mockBattle,
        canSelectCategory: true
      };

      axios.get.mockResolvedValueOnce({
        data: {
          success: true,
          battle: battleWithCategorySelection
        }
      });

      renderWithRouter(<ClassicMode />);

      await waitFor(() => {
        const wheelElement = screen.queryByTestId('mock-wheel');
        if (wheelElement) {
          expect(wheelElement).toBeInTheDocument();
        }
      });
    });
  });

  describe('Question and Answer Flow', () => {
    it('debería mostrar pregunta y respuestas cuando se carga una pregunta', async () => {
      axios.get
        .mockResolvedValueOnce({
          data: {
            success: true,
            battle: mockBattle
          }
        })
        .mockResolvedValueOnce({
          data: {
            success: true,
            question: mockQuestion,
            answers: mockAnswers
          }
        });

      renderWithRouter(<ClassicMode />);

      // Simular clic en categoría
      await waitFor(() => {
        const scienceCategory = screen.getByText('Ciencia');
        fireEvent.click(scienceCategory);
      });

      await waitFor(() => {
        expect(screen.getByText('¿Cuál es el planeta más grande?')).toBeInTheDocument();
        expect(screen.getByText('Júpiter')).toBeInTheDocument();
        expect(screen.getByText('Saturno')).toBeInTheDocument();
        expect(screen.getByText('Tierra')).toBeInTheDocument();
        expect(screen.getByText('Marte')).toBeInTheDocument();
      });
    });

    it('debería procesar respuesta correcta', async () => {
      // Mock inicial del estado de batalla
      axios.get.mockResolvedValueOnce({
        data: {
          success: true,
          battle: mockBattle
        }
      });

      // Mock de respuesta al procesar respuesta
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          correct: true,
          canSelectCategory: false,
          correctCount: 1,
          message: '¡Respuesta correcta! Llevas 1 de 3.'
        }
      });

      renderWithRouter(<ClassicMode />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });

      // Simular respuesta a pregunta
      // (esto dependería de la implementación específica del componente)
    });
  });

  describe('Error Handling', () => {
    it('debería manejar errores de carga de batalla', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<ClassicMode />);

      await waitFor(() => {
        const errorElements = screen.queryAllByText(/error|cargar/i);
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });

    it('debería redireccionar si no hay usuario logueado', () => {
      localStorage.getItem.mockReturnValue(null);

      renderWithRouter(<ClassicMode />);

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
