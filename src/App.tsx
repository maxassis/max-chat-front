import "./App.scss";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import classNames from 'classnames';

const socket = io("http://localhost:3333");

const user = uuidv4();

type Msg = {
  user: string;
  message: string;
  name: string
};

function App() {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setchat] = useState<Msg[]>([]);
  const [modalInput, setModalInput] = useState("");
  const [name, setName] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    function receivedMessage(message: Msg) {
      const newMessage: Msg = message;
      console.log(newMessage);
      setchat([...chat, newMessage]);
      setMessage("");
    }

    socket.on("msgToClient", (message: Msg) => {
      receivedMessage(message);
    });
  }, [chat]);

  const modalSpan = classNames({
    'chat__modal-error' : true,
    'chat__modal-error--show' : error && !modalInput
  });

  const modalShow = classNames({
    'chat__modal' : true,
    'chat__modal--hidden' : modal
  })

  function sendMessage(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();    
    if(message.trim() === "") return
    socket.emit("msgToServer", { user, name, message });
  }

  function checkModalError(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    !modalInput ? setError(false) : setName(modalInput);
    
    if(!modalInput) {
      setError(false);
    } else {
      setName(modalInput)
      setModal(true);
    }
  }

  return (
    <>
      <div className="external-container">
        <div className={modalShow}>
            <div className="chat__modal-content">
              <h3>Digite seu nome:</h3>
              <form>
              <input type="text" value={modalInput} onChange={(e) => setModalInput(e.target.value)}/>
              <span className={modalSpan} >Nome e obrigatorio</span>
              {name}
              <button onClick={(e) => checkModalError(e)}>Enviar</button>
              </form>
            </div>
        </div>

        <div className="chat__container">
          <div className="chat__users">
            <h2 className="chat__name">{name}</h2>
          </div>

          <div className="chat__content-wrapper">
            <div style={{ inlineSize: "100%" }}>
              <div className="chat__messages-container">
                {chat &&
                  chat.map((item, index) => {
                    if (item.user === user) {
                      return (
                        <div className="chat__msg-send" key={index}>
                          <div className="chat__msg-send-wrapper">
                            <div className="chat__message-send">
                              <div style={{ textAlign: "right" }}>
                                <span className="chat__msg-hour">12:30h</span>{" "}
                                  {user === item.user ? <span className="chat__msg-name">{name}</span> : <span className="chat__msg-name">usuario</span>}
                              </div>
                              <p className="chat__msg-text">{item.message}</p>
                            </div>
                          </div>
                          <div className="chat__circle-send">
                            <div className="chat__avatar"></div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="chat__msg-received" key={index}>
                          <div className="chat__msg-wrapper">
                            <div className="chat__circle">
                              <div className="chat__avatar"></div>
                            </div>

                            <div className="chat__msg">
                              <span className="chat__msg-name">{item.name}</span>{" "}
                              <span className="chat__msg-hour">10:00h</span>
                              <p className="chat__msg-text">{item.message}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          </div>

          <form className="chat_form">
            <input
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className="chat__write-msg"
              placeholder="Escreva uma mensagem..."
            ></input>

            <div className="chat__button-wrapper">
              <button className="chat__button" onClick={(e) => sendMessage(e)}>
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
