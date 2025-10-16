import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { apiService } from "../services/apiService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  

  // 🔹 Cerrar sesión (sin dependencias) - segundo
  const logout = useCallback(() => {
    console.log("Cerrando sesión");
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  }, [setUser, setToken]);

  // 🔹 Validar token usando API real
  const validateToken = useCallback(async (tokenToValidate) => {
    try {
      setLoading(true);

      // Temporal: guardar token en sessionStorage para que el interceptor lo use
      const oldToken = sessionStorage.getItem('token');
      sessionStorage.setItem('token', tokenToValidate);

      try {
        const response = await apiService.getUserData();
        
        // Si llegamos aquí, el token es válido
        setToken(tokenToValidate);
        setUser(response);
        sessionStorage.setItem("user", JSON.stringify(response));
      } catch (error) {
        // Restaurar token anterior si falló
        if (oldToken) {
          sessionStorage.setItem('token', oldToken);
        } else {
          sessionStorage.removeItem('token');
        }
        throw error;
      }
    } catch (err) {
      console.error("Error validando token:", err);
      logout();
      throw err;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // 🔹 Punto de entrada para token externo (depende de validateToken) - cuarto
  const setExternalToken = useCallback(async (externalToken) => {
    await validateToken(externalToken);
  }, [validateToken]);

  // 🔹 Login con email y password usando API real
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      
      // Llamar al API de login (o loginMock para desarrollo)
      const response = await apiService.login(email, password); // Cambiar a apiService.login en producción
      
      if (response.token) {
        // Guardar token y validar
        sessionStorage.setItem("token", response.token);
        if (response.user) {
          setUser(response.user);
          setToken(response.token);
          sessionStorage.setItem("user", JSON.stringify(response.user));
        } else {
          await validateToken(response.token);
        }
        return { success: true };
      } else {
        throw new Error('Login fallido');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [validateToken]);
  
  // 🔹 Al iniciar, intenta cargar token y validar
  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");
    if (savedToken) {
      if(savedUser) {
        setUser(JSON.parse(savedUser));
      }
      validateToken(savedToken);
    } else {
      setLoading(false);
    }
  }, [validateToken]);

  // 🔹 Escuchar eventos de logout desde apiService
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('Token expirado o inválido - cerrando sesión automáticamente');
      logout();
    };

    // Agregar listener para eventos de unauthorized
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    // Cleanup
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  // 🔹 Valor computado para autenticación
  const isAuthenticated = useMemo(() => !!user, [user]);

  // 🔹 Objeto value memoizado para evitar re-renders
  const contextValue = useMemo(() => ({
    user,
    token,
    isAuthenticated,
    loading,
    login,
    setExternalToken,
    logout
  }), [user, token, isAuthenticated, loading, login, setExternalToken, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
