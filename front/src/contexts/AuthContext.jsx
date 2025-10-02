import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Al iniciar, intenta cargar token y validar
  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    if (savedToken) {
      validateToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // 🔹 Validar token con backend y setear user/token solo si es válido
  const validateToken = async (tokenToValidate) => {
    try {
      const res = await fetch("http://localhost:4000/api/validate-token", {
        headers: { Authorization: `Bearer ${tokenToValidate}` }
      });

      if (!res.ok) throw new Error("Token inválido");

      const userData = await res.json();

      // Guardar token y user solo después de validar
      setToken(tokenToValidate);
      setUser(userData);

      sessionStorage.setItem("token", tokenToValidate);
      sessionStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.error("Error validando token:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Punto de entrada si recibís un token desde otro módulo de login
  const setExternalToken = (externalToken) => {
    validateToken(externalToken);
  };

  // 🔹 Cerrar sesión
  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user, // ✅ logueado solo si hay usuario validado
        loading,
        setExternalToken,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
