import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import "./style.modules.css";

export default function Register() {
  const navigate = useNavigate();
  const [fullname, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (confirmEmail !== email) {
      setError("E-mails não coincidem");
      return;
    }
    if (confirmPassword !== password) {
      setError("Senhas não coincidem");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          userName,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(result.error || "Falha na autenticação");
      }
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao tentar fazer registro");
    }
  }

  if (isSuccess) {
    return (
      <div className="formContainer">
        <div className="successContainer">
          <div className="successIcon">
            <CheckCircle size={60} color="white" strokeWidth={3} />
          </div>
          <div className="successMessage">CONTA CRIADA COM SUCESSO!</div>
          <div className="successRedirect">
            <p>Aguarde!</p>
            <p>Estamos redirecionando você para sua conta!</p>
          </div>
        </div>
        <div className="footer">IESB - BAY AREA</div>
      </div>
    );
  }

  return (
    <div className="formContainer">
      <h1 className="title">CRIE UMA CONTA</h1>

      {error && <p className="error">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <input
            type="text"
            placeholder="NOME COMPLETO"
            className="input"
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="inputGroup">
          <input
            type="text"
            placeholder="NOME DE USUÁRIO"
            className="input"
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="inputGroup">
          <input
            type="email"
            placeholder="E-MAIL"
            className="input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="inputGroup">
          <input
            type="email"
            placeholder="CONFIRME SEU EMAIL"
            className="input"
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
          />
        </div>

        <div className="inputGroup">
          <input
            type="password"
            placeholder="SENHA"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="passwordInfo">
          <small>
            Combinação de 8 a 16 letras (maiúsculas/minúsculas), números e
            símbolos especiais.
          </small>
        </div>

        <div className="inputGroup">
          <input
            type="password"
            placeholder="CONFIRME A SENHA"
            className="input"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="checkboxContainer">
          <input type="checkbox" id="privacy" className="checkbox" required />
          <label htmlFor="privacy" className="checkboxLabel">
            Li e aceito os{" "}
            <a href="/privacy" className="link">
              Política de privacidade
            </a>
          </label>
        </div>

        <button type="submit" className="button">
          CRIAR CONTA
        </button>
      </form>

      <div className="footer">IESB - BAY AREA</div>
    </div>
  );
}
