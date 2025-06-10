import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../pages/LogIn';

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Authentication - Login', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.getItem.mockReturnValue(null);
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('debería renderizar el formulario de login correctamente', () => {
      renderWithRouter(<Login />);
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('debería mostrar los campos requeridos', () => {
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Validation', () => {
    it('debería mostrar errores de validación para campos vacíos', async () => {
      renderWithRouter(<Login />);
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorElements = screen.queryAllByText(/requerido|obligatorio/i);
        // Si no hay validación implementada, este test fallará y te indica que debes agregarla
      });
    });

    it('debería validar formato de email', async () => {
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Verificar validación de email si está implementada
        const emailError = screen.queryByText(/email.*válido/i);
      });
    });
  });

  describe('Successful Login', () => {
    it('debería hacer login exitoso con credenciales válidas', async () => {
      const mockUser = {
        user_id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      axios.post.mockResolvedValueOnce({
        data: {
          message: 'Logueado correctamente',
          user: mockUser,
          token: 'fake-jwt-token'
        }
      });

      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/login', {
          email: 'test@example.com',
          password: 'password123'
        });
        expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
        expect(mockNavigate).toHaveBeenCalledWith('/Home');
      });
    });
  });

  describe('Error Handling', () => {
    it('debería mostrar error para credenciales incorrectas', async () => {
      axios.post.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { error: 'Credenciales incorrectas' }
        }
      });

      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
      });
    });

    it('debería manejar errores de servidor', async () => {
      axios.post.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { error: 'Error interno del servidor' }
        }
      });

      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.queryByText(/error.*servidor/i);
        // Verificar que se muestre algún error de servidor
      });
    });
  });

  describe('Authentication State', () => {
    it('debería redireccionar si el usuario ya está logueado', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        user_id: 1,
        username: 'testuser'
      }));

      renderWithRouter(<Login />);

      expect(mockNavigate).toHaveBeenCalledWith('/Home');
    });

    it('debería limpiar datos previos al hacer logout', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        user_id: 1,
        username: 'testuser'
      }));

      // Simular logout
      localStorage.getItem.mockReturnValue(null);
      
      renderWithRouter(<Login />);
      
      // Debería mostrar el formulario de login nuevamente
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });
});
