import LogoBayArea from "../components/LogoBayArea";
import Logo from "../components/LogoIesb";
import "../styles/background.css";
import "../styles/prelogin.css";

const Home = () => {
  return (
    <div className="container">
      <Logo /> {/* Logo Iesb */}
      <div className="box">
        <h2>ESCOLHA UMA OPÇÃO</h2>
        <button className="btn">SOU BENEFICIÁRIO</button>
        <button className="btn">NOVO BENEFICIÁRIO</button>
      </div>
      <div className="teamButton">
        <button className="but">EQUIPE IESB</button>
      </div>
      <LogoBayArea />
    </div>
  );
};

export default Home;
