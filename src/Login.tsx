import "./styles/login.scss";
import back from "./assets/imgs/back2.avif";
import top from "./assets/imgs/top.avif";
import google from "./assets/imgs/google.svg";
import face from "./assets/imgs/face.svg";
import { Link } from "react-router-dom"
import { useLocalStorage } from 'react-use';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const schema = z.object({
  name: z.string().nonempty("Campo obrigatorio").transform((name) => name.toLowerCase().trim()),
  password: z.string().min(3, "Mínimo de 3 caracteres").transform((password) => password.trim()),
});

type LoginSchema = z.infer<typeof schema>

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [, setValue] = useLocalStorage('max-token', '');
  const { register, handleSubmit, formState: { errors }} = useForm<LoginSchema>({ resolver: zodResolver(schema) });
  const navigate = useNavigate();

 
  function onSubmit(dt: {name: string, password: string} ) {      
    setLoading(true)
    setValue('')
    fetch("http://localhost:3333/auth/login", {
      method: "POST",
      body: JSON.stringify(dt),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((json) => {
        if(!json.token) {
          alert("erro")
          return
        }
          
        setValue(json.token)
        return 
      })
      .then(() => {
        navigate('/')})
      .catch((err) => {
        setLoading(false)
        console.log(err)});  
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="login__input-wrapper">
            <span>Nome</span>
            <input {...register("name")} type="text" />
            {errors.password && <h6 className="login__error">{errors.name?.message}</h6>}
          </div>

          <div
            className="login__input-wrapper"
            style={{ marginBlockStart: "1.12rem" }}
          >
            <span>Senha</span>
            <input type="password" {...register("password")} />
            {errors.password && <h6 className="login__error">{errors.password?.message}</h6>}
          </div>

          <button type="submit" className="login__button">{loading ? "Carregando..." : "Entrar"}</button>
          <span className="login__not-account">
            Não possui uma conta ? <Link to="/register">Cadastre-se</Link>
          </span>
        </form>
      </section>
    </section>
  );
}
