import "./styles/login.scss";
import back from "./assets/imgs/back2.avif";
import "./styles/login.scss";
import  userImg from "./assets/imgs/register.avif";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom'
import { z } from "zod"
import noImg from "./assets/imgs/noimg.png";


const schema = z.object({
  name: z.string().nonempty("Campo obrigatorio").transform((name) => name.toLowerCase().trim()),
  password: z.string().min(3, "Mínimo de 3 caracteres").transform((password) => password.trim()),
});

type RegisterSchema = z.infer<typeof schema>

export default function Register() {
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values = useRef<any>(File);
  const { register, handleSubmit, formState: { errors }} = useForm<RegisterSchema>({ resolver: zodResolver(schema) });
  const navigate = useNavigate();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      values.current.file = e.target.files[0];
  }
  setFile(URL.createObjectURL(e.target.files![0]));
  setName(e.target.files![0].name);
}

  function onSubmit(dt: {name: string, password: string} ) {
    setLoading(true)
    fetch("https://max-chat-oudo.onrender.com/auth/register", {
      method: "POST",
      body: JSON.stringify(dt),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((r) => {
        const user = r.id;
        // console.log(r);
        
        if(r.statusCode === 400) {
          setLoading(false)
          alert(r.message);
          return
        }

        if(values.current.file) {     
          uploadAvatar(user)
          return
         }

         navigate('/login')
      })
      .catch((err) => console.log(err))
  }

  const uploadAvatar = async (id: string) => {
  
    const formData = new FormData();
    formData.append('file', values.current.file);
       
    try {
      const response = await fetch(`https://max-chat-oudo.onrender.com/users/upload/${id}`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        setLoading(false)
        throw new Error(response.statusText);
      }
      console.log(response);
      navigate('/')
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
            {file ?
            (<div className="register__user" style={{ backgroundImage: `url(${file})` }}>
              <img className="register__avatar-img" src={file} />
            </div>) 
            :
            (<div className="register__user" style={{ backgroundImage: `url(${noImg})` }}>
               <img className="register__avatar-img" src={noImg} />
             </div>
            )
          }

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
              {loading ? "Carregando..." : "Crie sua conta"}
            </button>
          </form>
        </div>
      </section>
    </section>
  );
}

