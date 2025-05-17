import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../forgot-password/password.css";
import "../../auth/style.modules.css";
import { forgotPassword } from "../../../../actions/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const result = await forgotPassword(email);
      console.log(result);
      if (result.success) {
        navigate("/auth/login");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="formContainer">
      <h1 className="title">ESQUECEU SUA SENHA?</h1>

      <div className="forgotPasswordText">
        <p>
          Para redefinir sua senha, insira seu e-mail cadastrado e clique em
          Enviar e-mail. Você receberá um e-mail com instruções para a
          redefinição.
        </p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <div className="inputWithIcon">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Insira o seu email"
              className="input input-with-icon-padding"
              required
            />
          </div>
        </div>

        <button type="submit" className="button forgot-password-button">
          ENVIAR E-MAIL
        </button>
      </form>

      <div className="footer">IESB - BAY AREA</div>
    </div>
  );
}
