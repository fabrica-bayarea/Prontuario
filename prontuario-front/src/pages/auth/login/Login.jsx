import { useState } from "react";
import "../../auth/style.modules.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  async function login(email, password, rememberMe) {
    try {
      const response = await fetch("http://localhost:3000/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // para cookies/sessão se necessário
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || "Erro ao autenticar" };
      }

      const data = await response.json();
      return { success: true, ...data };
    } catch (err) {
      console.error(err);
      return { success: false, error: "Erro de conexão com o servidor" };
    }
  }

  function redirectToDashboard() {
    navigate("/dashboard/administrador");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); // Limpa o erro antes de tentar login

    try {
      const result = await login(email, password, rememberMe);

      if (result.success) {
        redirectToDashboard();
      } else {
        setError(result.error || "Falha na autenticação");
      }
    } catch (err) {
      console.error(err); // Mostra o erro no console para debug
      setError("Ocorreu um erro ao tentar fazer login");
    }
  }

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  return (
    <div className="formContainer">
      <h1 className="title">ACESSE SUA CONTA</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Nome de usuário ou e-mail"
            className="input"
            value={email}
            required // evita enviar vazio
          />
        </div>

        <div className="inputGroup">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Digite sua senha"
            className="input"
            value={password}
            required
          />
        </div>

        <div className="checkboxContainer">
          <input
            type="checkbox"
            id="remember"
            className="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember" className="checkboxLabel">
            Continuar conectado
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="button">
          ENTRAR
        </button>

        <div className="forgotPassword">
          <span>Esqueceu sua senha?</span>
          <a href="/auth/forgot-password" className="link">
            Clique aqui!
          </a>
        </div>
      </form>

      <div className="divider">
        <span>Conecte-se também com</span>
      </div>

      <div className="socialLogin">
        <a href={`${apiBaseUrl}/v1/auth/google`} className="socialButton">
          <img src="/images/iesb-logo.png" alt="IESB" width="24" height="24" />
        </a>
        <a href={`${apiBaseUrl}/v1/auth/google`} className="socialButton">
          <img
            src="/images/google-icon.png"
            alt="Google"
            width="24"
            height="24"
          />
        </a>
        <a href={`${apiBaseUrl}/v1/auth/microsoft`} className="socialButton">
          <img
            src="/images/microsoft-icon.png"
            alt="Microsoft"
            width="24"
            height="24"
          />
        </a>
      </div>

      <div className="createAccount">
        <a href="/auth/register" className="createAccountButton">
          Clique aqui para criar uma conta
        </a>
      </div>

      <div className="footer">IESB - BAY AREA</div>
    </div>
  );
}
