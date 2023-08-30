import "./styles/login.scss";
import back from "./assets/imgs/back.avif";
import top from "./assets/imgs/top.avif";
import register from "./assets/imgs/register.avif"
import google from "./assets/imgs/google.svg";
import face from "./assets/imgs/face.svg";

export default function Login() {
  return (
    <section className="login" style={{ backgroundImage: `url(${back})` }}>
      {/* <section className="login__wrapper">
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
            <input type="text" />
          </div>

          <div
            className="login__input-wrapper"
            style={{ marginBlockStart: "1.12rem" }}
          >
            <span>Senha</span>
            <input type="password" />
          </div>

          <button className="login__button">Entrar</button>
          <span className="login__not-account">
            Não possui uma conta ? <a>Cadastre-se</a>
          </span>
        </form>
      </section> */}

      <section className="register__wrapper">
        <img src={register} />

        <div className="register__content-wrapper">
            <div className="register__title">

                <div className="register__user">
                    <img className="register__avatar-img" src={back} />
                </div>

                <div>
                    <h1 className="register__create-account">Crie sua conta</h1>
                    <span className="register__login">Ja possui uma conta ? <a>Login</a></span>
                </div>
            </div>

            <div className="register__inputs">
                <div className="register__input-wrapper" style={{marginBlockStart: "0"}}>
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
                        <input type="file" name="arquivo" id="arquivo" />
                    </label>
                    <span className="register__file">Nenhum arquivo selecionado</span>    
                </div>


                <button className="register__button">Crie sua conta</button>

            </div>

        </div>



      </section>




    </section>

  );
}
