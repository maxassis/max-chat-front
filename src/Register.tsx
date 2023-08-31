import "./styles/login.scss";
import back from "./assets/imgs/back.avif";
import "./styles/login.scss";
import register from "./assets/imgs/register.avif";
import { useState } from "react";

export default function Register() {
  const [file, setFile] = useState("");
  const [name, setName] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files![0].name);
    setName(e.target.files![0].name);
    setFile(URL.createObjectURL(e.target.files![0]));
    // console.log("teste",file);
  }

  return (
    <section className="login" style={{ backgroundImage: `url(${back})` }}>
      <section className="register__wrapper">
        <img src={register} />

        <div className="register__content-wrapper">
          <div className="register__title">
            <div className="register__user">
              <img className="register__avatar-img" src={file} />
            </div>

            <div>
              <h1 className="register__create-account">Crie sua conta</h1>
              <span className="register__login">
                Ja possui uma conta ? <a>Login</a>
              </span>
            </div>
          </div>

          <form className="register__inputs">
            <div
              className="register__input-wrapper"
              style={{ marginBlockStart: "0" }}
            >
              <span>Nome</span>
              <input type="text" />
            </div>

            <div className="register__input-wrapper">
              <span>Senha</span>
              <input type="text" />
            </div>

            <div className="register__avatar-wrapper">
              <span className="register__avatar">Avatar</span>

              <label>
                <span>Escolher arquivo</span>
                <input
                  type="file"
                  name="arquivo"
                  id="arquivo"
                  onChange={handleChange}
                />
              </label>
              <span style={{ fontWeight: "bold" }} className="register__file">
                Arquivo :{" "}
                <span style={{ fontWeight: "normal" }}>
                  {name ? name : "Nenhum arquivo selecionado"}
                </span>
              </span>
            </div>

            <button className="register__button">Crie sua conta</button>
          </form>
        </div>
      </section>
    </section>
  );
}
