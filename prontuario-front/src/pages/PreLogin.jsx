import LogoBayArea from "../components/LogoBayArea";
import Logo from "../components/LogoIesb";
import "../styles/background.css";
import "../styles/prelogin.css";

const Home = () => {
  return (
    <div className="container">
      <div className="logoIesb">
        <Logo /> {/* Logo Iesb */}
      </div>
      <div className="box">
        <h2>ESCOLHA UMA OPÇÃO</h2>
        <button className="btn">SOU BENEFICIÁRIO</button>
        <button className="btn">NOVO BENEFICIÁRIO</button>
      </div>

      <button className="but">EQUIPE IESB</button>
      <div className="logoBayArea">
        <LogoBayArea />
      </div>
    </div>
  );
};

export default Home;
