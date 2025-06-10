import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Home from '../pages/Home';

// Mocks
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to}></div>,
  Link: ({ to, children, className, ...props }) => (
    <a href={to} className={className} {...props}>{children}</a>
  ),
  useNavigate: () => jest.fn()
}));

jest.mock('../components/BurgerMenu', () => ({
  BurgerMenu: () => <div data-testid="burger-menu">Burger Menu</div>
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, ...props }) => (
      <div className={className} onClick={onClick} {...props}>{children}</div>
    )
  }
}));

const mockAxios = axios;

describe('Dashboard/Home Component', () => {
  const mockUser = {
    user_id: 1,
    username: 'testuser',
    email: 'test@example.com'
  };

  const mockActiveBattles = [
    {
      battle_id: 1,
      opponent_name: 'Rival1',
      currentTurn: 1,
      myCompletedCategories: 2,
      opponentCompletedCategories: 1,
      date: '2024-01-15T10:30:00Z'
    },
    {
      battle_id: 2,
      opponent_name: 'Rival2',
      currentTurn: 2,
      myCompletedCategories: 1,
      opponentCompletedCategories: 3,
      date: '2024-01-14T15:45:00Z'
    }
  ];

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    localStorage.setItem('user', JSON.stringify(mockUser));
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  describe('Authentication and Access Control', () => {
    test('redirects to login when user is not authenticated', () => {
      localStorage.clear();
      renderDashboard();
      
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
    });

    test('renders dashboard when user is authenticated', async () => {
      // Configurar axios mock ANTES de renderizar
      mockAxios.get.mockResolvedValue({ data: { battles: [] } });
      
      // Asegurar que el usuario está en localStorage
      const mockUser = { user_id: 1, username: 'testuser', email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      await act(async () => {
        renderDashboard();
      });
      
      // El componente debe renderizar, no redireccionar
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
      
      // Buscar texto más específico
      await waitFor(() => {
        expect(screen.getByText(/testuser/)).toBeInTheDocument();
      });
    });
  });

  describe('Dashboard Rendering and UI Elements', () => {
    beforeEach(() => {
      mockAxios.get.mockResolvedValue({ data: { battles: [] } });
    });

    test('renders all main dashboard sections', async () => {
      await act(async () => {
        renderDashboard();
      });
      
      expect(screen.getByTestId('burger-menu')).toBeInTheDocument();
      expect(screen.getByText('Tus partidas en curso')).toBeInTheDocument();
      expect(screen.getByText('Acciones rápidas')).toBeInTheDocument();
      expect(screen.getByText('Consejo del día')).toBeInTheDocument();
    });

    test('renders user welcome message with correct username', async () => {
      await act(async () => {
        renderDashboard();
      });
      
      const welcomeTitle = screen.getByText(`¡Hola, ${mockUser.username}!`);
      expect(welcomeTitle).toBeInTheDocument();
    });

    test('renders quick action buttons with correct links', async () => {
      await act(async () => {
        renderDashboard();
      });
      
      expect(screen.getByRole('link', { name: /Jugar/i })).toHaveAttribute('href', '/Play');
      expect(screen.getByRole('link', { name: /Amigos/i })).toHaveAttribute('href', '/Friends');
      expect(screen.getByRole('link', { name: /Perfil/i })).toHaveAttribute('href', '/Profile');
      expect(screen.getByRole('link', { name: /Comunidad/i })).toHaveAttribute('href', '/Communities');
    });

    test('renders new game button', async () => {
      await act(async () => {
        renderDashboard();
      });
      
      const newGameButton = screen.getByRole('link', { name: /Nueva partida/i });
      expect(newGameButton).toBeInTheDocument();
      expect(newGameButton).toHaveAttribute('href', '/Play');
    });
  });

  describe('Active Battles Loading and Display', () => {
    test('shows loading state while fetching battles', async () => {
      mockAxios.get.mockImplementation(() => new Promise(() => {}));
      
      await act(async () => {
        renderDashboard();
      });
      
      expect(screen.getByText('Cargando tus partidas...')).toBeInTheDocument();
    });

    test('displays active battles when available', async () => {
      mockAxios.get.mockResolvedValue({ data: { battles: mockActiveBattles } });
      
      await act(async () => {
        renderDashboard();
      });
      
      await waitFor(() => {
        expect(screen.getByText('VS Rival1')).toBeInTheDocument();
        expect(screen.getByText('VS Rival2')).toBeInTheDocument();
      });
    });

    test('shows empty state when no active battles', async () => {
      mockAxios.get.mockResolvedValue({ data: { battles: [] } });
      
      await act(async () => {
        renderDashboard();
      });
      
      await waitFor(() => {
        expect(screen.getByText('No tienes partidas activas')).toBeInTheDocument();
        expect(screen.getByText('Desafía a tus amigos para empezar a jugar')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Iniciar una partida/i })).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling and Network Issues', () => {
    test('displays error message when battle fetching fails', async () => {
      mockAxios.get.mockRejectedValue(new Error('Network error'));
      
      await act(async () => {
        renderDashboard();
      });
      
      await waitFor(() => {
        expect(screen.getByText('No se pudieron cargar las partidas activas')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Reintentar/i })).toBeInTheDocument();
      });
    });

    test('retry button refetches battles', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Network error'))
                 .mockResolvedValueOnce({ data: { battles: mockActiveBattles } });
      
      await act(async () => {
        renderDashboard();
      });
      
      await waitFor(() => {
        expect(screen.getByText('No se pudieron cargar las partidas activas')).toBeInTheDocument();
      });
      
      const retryButton = screen.getByRole('button', { name: /Reintentar/i });
      
      await act(async () => {
        fireEvent.click(retryButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('VS Rival1')).toBeInTheDocument();
      });
      
      expect(mockAxios.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Navigation and Interaction', () => {
    test('makes correct API call to fetch user battles', async () => {
      mockAxios.get.mockResolvedValue({ data: { battles: [] } });
      
      await act(async () => {
        renderDashboard();
      });
      
      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalledWith(
          'http://localhost:3000/api/classic/battles',
          { params: { userId: mockUser.user_id } }
        );
      });
    });

    test('renders tip content for user guidance', async () => {
      mockAxios.get.mockResolvedValue({ data: { battles: [] } });
      
      await act(async () => {
        renderDashboard();
      });
      
      expect(screen.getByText('Consejo del día')).toBeInTheDocument();
      expect(screen.getByText(/Responde 3 preguntas correctamente/)).toBeInTheDocument();
    });
  });
});
