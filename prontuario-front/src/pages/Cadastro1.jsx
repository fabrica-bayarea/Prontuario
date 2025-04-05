import { useState } from "react";
import Logo from "../components/LogoIesb";
import LogoBayArea from "../components/LogoBayArea";
import cadastro from "../assets/Images/cadastro.png";
import "../styles/cadastro1.css";

function Cadastro1() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    nascimento: '',
    cpf: '',
    genero: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados enviados:', form);
  };

  return (
    <div className="conteinerCadastro1">
      {/* Lado esquerdo com imagem e logos */}
      <div className="infocadastro1">
        <div className="logoIesbLogin">
          <Logo />
        </div>
        <div className="description1">
          <p className="subtitulo">Prontuário</p>
          <h1 className="h1">
          <span>Crie sua conta de</span><br />
          <span className="destaquecadastro">Forma fácil!</span>
          </h1>
        </div>
        <div className="infoImage1">
          <img src={cadastro} alt="ilustração cadastro" className="imgcadastro" />
        </div>
        <div className="logoBayAreaLogin">
          <LogoBayArea />
        </div>
      </div>

      {/* Lado direito com o formulário */}
      <form className="formcadastro" onSubmit={handleSubmit}>
        <h2 className="titlecadastro">Cadastro Beneficiário</h2>
        <p className="etapaCadastro">[Etapa 1 de 2]</p>

        <label>Nome completo*</label><br />
        <input
          type="text"
          name="nome"
          placeholder="Nome completo*"
          className="inputcadastro"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <label>E-mail*</label><br />
        <input
          type="email"
          name="email"
          placeholder="E-mail*"
          className="inputcadastro"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Telefone (DDD + número)*</label><br />
        <input
          type="tel"
          name="telefone"
          placeholder="Telefone (DDD + número)*"
          className="inputcadastro"
          value={form.telefone}
          onChange={handleChange}
          required
        />

        <label>Data de nascimento*</label><br />
        <input
          type="date"
          name="nascimento"
          placeholder="Data de nascimento*"
          className="inputcadastro"
          value={form.nascimento}
          onChange={handleChange}
          required
        />

        <label>CPF*</label><br />
        <input
          type="text"
          name="cpf"
          placeholder="CPF*"
          className="inputcadastro"
          value={form.cpf}
          onChange={handleChange}
          required
        />

        <label className="label">Gênero*</label><br />
        <select
          name="genero"
          className="inputcadastro"
          value={form.genero}
          onChange={handleChange}
          required
        >
          <option value="">Gênero*</option>
          <option value="feminino">Feminino</option>
          <option value="masculino">Masculino</option>
          <option value="prefiro_nao_dizer">Prefiro não dizer</option>
        </select>

        <button className="btnContinuar" type="submit">Continuar</button>
        <p className="text">
          Já tem uma conta?{" "}
          <a href="/recuperar-senha" className="linkPassword">Entrar</a>
        </p>
        <p className="campo">Campos obrigatórios*</p>
      </form>
    </div>
  );
}

export default Cadastro1;
