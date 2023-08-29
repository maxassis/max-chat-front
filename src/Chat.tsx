import "./Chat.scss";
import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import classNames from 'classnames';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import i18n from "@emoji-mart/data/i18n/pt.json";
import ContentEditable, {ContentEditableEvent} from "react-controlled-contenteditable";

const socket = io("https://max-chat-f7uh.onrender.com");

const user = uuidv4();

type Msg = {
  user: string;
  message: string;
  name: string
};

export default function Chat() {
  const [error, setError] = useState(false);
  const [emojiShow, setEmojiShow] = useState(false);
  const [chat, setchat] = useState<Msg[]>([]);
  const [modalInput, setModalInput] = useState("");
  const [name, setName] = useState("");
  const [modal, setModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState('');

  const scrollToLast = () => {
    const lastChildElement = ref.current?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    function receivedMessage(message: Msg) {
      const newMessage: Msg = message;
     // console.log(newMessage);
      setchat([...chat, newMessage]);
      setTimeout(() => {
        scrollToLast()
      }, 300);    
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

  const emoji = classNames({
    'chat__emojis-wrapper--show': emojiShow,
    'chat__emojis-wrapper': true
  })

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

  function show({ native }: { native: string }) {
    setContent(`${content}<span style="font-size: 18px">${native}</span>`);
  }

  function close() {
    if(emojiShow) setEmojiShow(false);
  }

  const handleChange = (e: ContentEditableEvent) => {
		setContent(e.target.value);
   // console.log(content)
	};

  function sendMsg(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();

      if(content.trimStart() === "") return
      socket.emit("msgToServer", { user, name, message: content });
      // console.log({ user, name, content });
      
      setContent("")  
    }
  }

 function sendMsgButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if(content.trimStart() === "") return
      socket.emit("msgToServer", { user, name, message: content });
     // console.log({ user, name, content });
      setContent("") 
 }  

  return (
    <>
      <div className="external-container">
        <div className={modalShow}>
          <div className="chat__modal-content">
            <h3>Digite seu nome:</h3>
            <form>
              <input
                type="text"
                value={modalInput}
                onChange={(e) => setModalInput(e.target.value)}
              />
              <span className={modalSpan}>Nome e obrigatorio</span>
              {name}
              <button onClick={(e) => checkModalError(e)}>Enviar</button>
            </form>
          </div>
        </div>

        <div className="chat__container">
          <div className="chat__users">
            <h2 className="chat__name">Max Chat Beta</h2>
          </div>

          <div className="chat__messages">
            <div className="chat__messages-container" ref={ref}>
              {chat &&
                chat.map((item, index) => {
                  if (item.user === user) {
                    return (
                      <div className="chat__msg-send" key={index}>
                        <div className="chat__msg-send-wrapper">
                          <div className="chat__message-send">
                            <div style={{ textAlign: "right" }}>
                              <span className="chat__msg-hour">12:30h</span>{" "}
                              {user === item.user ? (
                                <span className="chat__msg-name">{name}</span>
                              ) : (
                                <span className="chat__msg-name">usuario</span>
                              )}
                            </div>
                            <p className="chat__msg-text" dangerouslySetInnerHTML={{ __html: item.message }} />
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
                            <p className="chat__msg-text" dangerouslySetInnerHTML={{ __html: item.message }} />
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
          </div>

          <form className="chat__form">
            <div className={emoji}>
              <Picker
                data={data}
                perLine="6"
                emojiSize="24"
                theme="light"
                previewPosition="none"
                onEmojiSelect={show}
                onClickOutside={close}
                i18n={i18n}
              />
            </div>

            <div
              style={{ cursor: "pointer" }}
              onClick={() => setEmojiShow(!emojiShow)}
            >
              <svg
                className="chat__smile"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
            </div>

            <div style={{maxInlineSize: "100%", inlineSize: "100%" }}>    
            <div>
              <ContentEditable
                onChange={handleChange}
                html={content}
                tagName="div"
                className="chat__input-editable"
                onKeyDown={(e) => sendMsg(e)}
              />
            </div>
            </div>

            <div className="chat__button-wrapper">
              <button className="chat__button" onClick={(e) => sendMsgButton(e)}>
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

