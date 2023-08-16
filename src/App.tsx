import { useEffect } from "react";
import "./App.scss";
import io from "socket.io-client";

const socket = io("http://localhost:3333");

function sendMessage() {
  const message = "socket funcionou";
  socket.emit("msgToServer", message);
}

function App() {
  useEffect(() => {
    function receivedMessage(message: string) {
      const newMessage: string = message;
      console.log(newMessage);
    }

    socket.on("msgToClient", (message: string) => {
      receivedMessage(message);
    });
  }, []);

  return (
    <>
      <div className="external-container">
        <div className="chat__container">
          <div className="chat__users">
            <h2 className="chat__name">Max, Joao e Pedro</h2>
          </div>

          <div className="chat__content-wrapper">
            <div className="chat__messages-container">
              <div>
                <div className="chat__msg-received">
                  <div className="chat__msg-wrapper">
                    <div className="chat__circle">
                      <div className="chat__avatar"></div>
                    </div>

                    <div className="chat__msg">
                      <span className="chat__msg-name">Max Assis</span>{" "}
                      <span className="chat__msg-hour">10:00h</span>
                      <p className="chat__msg-text">
                        Hey there, meatbag! As the resident robot around here, I
                        gotta ask: what's the dealio with the onboarding
                        project? Are we still stuck in the Stone Age or have we
                        finally evolved to the point of getting new hires up to
                        speed in this millennium? I mean, I know humans are slow
                        learners, but come on! Give me the deets, or I'll have
                        to start drinking heavily and causing mayhem. And trust
                        me, you don't want that.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="chat__msg-send">
                  <div className="chat__msg-send-wrapper">
                    <div className="chat__message-send">
                      <div>
                        <span className="chat__msg-name">Joao da Silva</span>{" "}
                        <span className="chat__msg-hour">12:30h</span>
                      </div>
                      <p className="chat__msg-text">
                        Hey there, meatbag! As the resident robot around here, I
                        gotta ask: what's the dealio with the onboarding
                        project?
                        {/* Are we still stuck in the Stone Age or have we finally
                      evolved to the point of getting new hires up to speed in
                      this millennium? I mean, I know humans are slow learners,
                      but come on! Give me the deets, or I'll have to start
                      drinking heavily and causing mayhem. And trust me, you
                      don't want that. */}
                      </p>
                    </div>
                  </div>
                  <div className="chat__circle-send">
                    <div className="chat__avatar"></div>
                  </div>
                </div>
              </div>
            </div>

            <form className="chat_form">
              <textarea
                className="chat__write-msg"
                placeholder="Escreva uma mensagem..."
              ></textarea>

              <div className="chat__button-wrapper">
                <button>Enviar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
