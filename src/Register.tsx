import "./styles/login.scss";
import back from "./assets/imgs/back.avif";
import "./styles/login.scss";
import register from "./assets/imgs/register.avif";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

// interface InternalValues {
//   file: any;
// }

export default function Register() {
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const values = useRef<any>(File);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      values.current.file = e.target.files[0];
  }
  setFile(URL.createObjectURL(e.target.files![0]));
  setName(e.target.files![0].name);
}

  const submitForm = async () => {
    if (!values.current.file) {
      return false;
    }

    console.log(values.current.file);
    

    const formData = new FormData();
    formData.append('file', values.current.file);
    
    try {
      const response = await fetch('http://localhost:3333/users/upload', {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJuYW1lIjoidGVzdGUxIiwiaWF0IjoxNjkzNTA3NTMxLCJleHAiOjE3MjUwNjUxMzF9.eOBxbP7BqC3QEYf1CuXrUPJimOhy5fz7S0VMUk54594"
        }
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

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
                Ja possui uma conta ? <Link to="/">Login</Link>
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
                  onChange={(e) => onFileChange(e)}
                />
              </label>
              <span style={{ fontWeight: "bold" }} className="register__file">
                Arquivo :{" "}
                <span style={{ fontWeight: "normal" }}>
                {name ? name : "Nenhum arquivo selecionado"}
                </span>
              </span>
            </div>

            <button type="button" className="register__button" onClick={() => submitForm()}>
              Crie sua conta
            </button>
          </form>
        </div>
      </section>
    </section>
  );
}

