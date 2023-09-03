import "./styles/login.scss";
import back from "./assets/imgs/back.avif";
import top from "./assets/imgs/top.avif";
import google from "./assets/imgs/google.svg";
import face from "./assets/imgs/face.svg";
import { Link } from "react-router-dom"
import { useState } from "react";
import { useLocalStorage } from 'react-use';

export default function Login() {
  const [name, setName] = useState("")
  const [pass, setPass] = useState("")
  const [, setValue] = useLocalStorage('max-token', '');
 
  function send() {
   const data = {
    name,
    password: pass,
   }

    fetch("http://localhost:3333/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.text())
      .then((json) => {
        setValue(json)
      })
      .catch((err) => console.log(err));  
  }

  return (
    <section className="login" style={{ backgroundImage: `url(${back})` }}>
      <section className="login__wrapper">
        <img src={top} />

        <h1 className="login__title">Login</h1>

        <div className="login__google">
          <img src={google} />
          <h3>Continuar com Google</h3>
        </div>
        <div className="login__google">
          <img src={face} />
          <h3>Continuar com Facebook</h3>
        </div>

        <h3 className="login__OR">OU</h3>

        <form>
          <div className="login__input-wrapper">
            <span>Nome</span>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" />
          </div>

          <div
            className="login__input-wrapper"
            style={{ marginBlockStart: "1.12rem" }}
          >
            <span>Senha</span>
            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" />
          </div>

          <button type="button" className="login__button" onClick={() => send()}>Entrar</button>
          <span className="login__not-account">
            Não possui uma conta ? <Link to="/register">Cadastre-se</Link>
          </span>
        </form>
      </section>
    </section>
  );
}
