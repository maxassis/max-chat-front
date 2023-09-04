import "./styles/login.scss";
import back from "./assets/imgs/back.avif";
import "./styles/login.scss";
import  userImg from "./assets/imgs/register.avif";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage } from 'react-use';
import { useNavigate } from 'react-router-dom'
import { z } from "zod"


const schema = z.object({
  name: z.string().nonempty("Campo obrigatorio").transform((name) => name.toLowerCase().trim()),
  password: z.string().min(3, "Mínimo de 3 caracteres").transform((password) => password.trim()),
});

type RegisterSchema = z.infer<typeof schema>

// const decode = (token: string) =>
//     decodeURIComponent(
//         atob(token.split('.')[1].replace('-', '+').replace('_', '/'))
//             .split('')
//             .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
//             .join('')
//     );

export default function Register() {
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values = useRef<any>(File);
  const { register, handleSubmit, formState: { errors }} = useForm<RegisterSchema>({ resolver: zodResolver(schema) });
  const [, setToken] = useLocalStorage('max-token', '');
  const navigate = useNavigate();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      values.current.file = e.target.files[0];
  }
  setFile(URL.createObjectURL(e.target.files![0]));
  setName(e.target.files![0].name);
}

  function onSubmit(dt: {name: string, password: string} ) {
    fetch("http://localhost:3333/auth/register", {
      method: "POST",
      body: JSON.stringify(dt),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((json) => {
        if(!json.token) {
          alert(json.message)
          return
        }

        setToken(json.token)
        const token = json.token

        if(values.current.file) {     
         uploadAvatar(token)
         return
        }

        navigate('/chat')
      })
      .catch((err) => console.log(err));
    
  }

  const uploadAvatar = async (tk: string) => {
    const formData = new FormData();
    formData.append('file', values.current.file);
    
    try {
      const response = await fetch('http://localhost:3333/users/upload', {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": "Bearer " + tk
        }
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log(response);
      navigate('/chat')
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="login" style={{ backgroundImage: `url(${back})` }}>
      <section className="register__wrapper">
        <img src={userImg} />

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

          <form className="register__inputs" onSubmit={handleSubmit(onSubmit)}>
            <div
              className="register__input-wrapper"
              style={{ marginBlockStart: "0" }}
            >
              <span>Nome</span>
              <input type="text" {...register("name")} />
              {errors.password && <h6 className="login__error">{errors.name?.message}</h6>}
            </div>

            <div className="register__input-wrapper">
              <span>Senha</span>
              <input type="password" {...register("password")} />
              {errors.password && <h6 className="login__error">{errors.password?.message}</h6>}
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

            <button className="register__button">
              Crie sua conta
            </button>
          </form>
        </div>
      </section>
    </section>
  );
}

