import { useState } from "react";
import Logo from "../components/LogoIesb";
import LogoBayArea from "../components/LogoBayArea";
import loginMicrosoft from "../assets/Images/loginMicrosoft.png";
import loginGoogle from "../assets/Images/loginGoogle.png";
import ilustracaoLogin from "../assets/Images/ilustracaoLogin.png";
import "../styles/login.css";

const Login = () => {
  // Estados para armazenar os valores dos inputs
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Função que trata o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    // Verifica se os dois campos estão preenchidos
    if (email && senha) {
      alert("Login realizado com sucesso!");
    } else {
      alert("Preencha todos os campos obrigatórios.");
    }
  };

  return (
    <div className="containerLogin">
      {/* formulário - Lado Esquerdo */}
      <form className="formLogin" onSubmit={handleSubmit}>
        <div className="logoIesbLogin">
          <Logo />
        </div>
        <h2 className="titleLogin">ACESSE SUA CONTA</h2>

        <input
          type="text"
          placeholder="Nome do usuário ou email*"
          className="inputLogin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Digite sua senha*"
          className="inputLogin"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <div className="options">
          <label>
            <input type="checkbox" /> Continuar conectado
          </label>
          <p className="text">
            Esqueceu sua senha?{" "}
            <a href="/recuperar-senha" className="linkPassword">
              Clique Aqui
            </a>
          </p>
        </div>

        <button className="btnEntrar" type="submit">
          Entrar
        </button>
        <button className="btnCadastro" type="button">
          Cadastrar
        </button>

        <p className="text">Fazer login com:</p>
        <div className="loginExternos">
          <a href="#">
            <img src={loginGoogle} alt="Login com Google" />
          </a>
          <a href="#">
            <img src={loginMicrosoft} alt="Login com Microsoft" />
          </a>
        </div>
        <div className="logoBayAreaLogin">
          <LogoBayArea />
        </div>
      </form>

      {/* Lado Direito - Ilustração */}
      <div className="infoLogin">
        <div className="infoImage">
          <img
            src={ilustracaoLogin}
            alt="ilustração agenda"
            className="imgLogin"
          />
        </div>
        <center>
          <p className="description">
            Crie agendamentos, gerencie suas consultas e faça parte do{" "}
            <span className="destaqueLogin">IESB em Ação</span>
          </p>
        </center>
      </div>
    </div>
  );
};

export default Login;
