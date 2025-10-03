import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Mock función (sin dependencias) - debe estar primero
  const mockValidateToken = useCallback(async (tokenToValidate) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (tokenToValidate === "valid-token") {
          resolve({ name: "Juan Pérez", email: "juan.perez@example.com" });
        } else {
          reject(new Error("Token inválido"));
        }
      }, 1000);
    });
  }, []);

  // 🔹 Cerrar sesión (sin dependencias) - segundo
  const logout = useCallback(() => {
    console.log("Cerrando sesión");
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  }, [setUser, setToken]);

  // 🔹 Validar token (depende de mockValidateToken y logout) - tercero
  const validateToken = useCallback(async (tokenToValidate) => {
    try {
      //const res = await fetch("http://localhost:4000/api/validate-token", {
      //  headers: { Authorization: `Bearer ${tokenToValidate}` }
      //});
      setLoading(true);

      // Mock de validación
      const response = await mockValidateToken(tokenToValidate);

      if (!response) throw new Error("Token inválido");

      // Guardar token y user solo después de validar
      setToken(tokenToValidate);
      setUser(response);

      sessionStorage.setItem("token", tokenToValidate);
      sessionStorage.setItem("user", JSON.stringify(response));
    } catch (err) {
      console.error("Error validando token:", err);
      logout();
      throw err;
      
    } finally {
      setLoading(false);
    }
  }, [mockValidateToken, logout]);

  // 🔹 Punto de entrada para token externo (depende de validateToken) - cuarto
  const setExternalToken = useCallback(async (externalToken) => {
    await validateToken(externalToken);
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

  // 🔹 Valor computado para autenticación
  const isAuthenticated = useMemo(() => !!user, [user]);

  // 🔹 Objeto value memoizado para evitar re-renders
  const contextValue = useMemo(() => ({
    user,
    token,
    isAuthenticated,
    loading,
    setExternalToken,
    logout
  }), [user, token, isAuthenticated, loading, setExternalToken, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
