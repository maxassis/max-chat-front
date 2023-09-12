import "./styles/Chat.scss";
import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import back from "./assets/imgs/back2.avif";
import noImg from "./assets/imgs/noimg.png";
import classNames from 'classnames';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import i18n from "@emoji-mart/data/i18n/pt.json";
import ContentEditable, {ContentEditableEvent} from "react-controlled-contenteditable";
import { useLocalStorage } from 'react-use';

// const socket = io("https://max-chat-f7uh.onrender.com");
const socket = io("http://localhost:3333");
//const user = uuidv4();

const decode = (token: string): string =>
    decodeURIComponent(
        atob(token.split('.')[1].replace('-', '+').replace('_', '/'))
            .split('')
            .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join('')
    );

type Msg = {
  user: string
  message: string
  name: string
  avatar: string | null
};

export default function Chat() {
  const [emojiShow, setEmojiShow] = useState(false);
  const [chat, setchat] = useState<Msg[]>([]);
  const ref = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState('');
  const [ tk ] = useLocalStorage('max-token', '');

  const userTk = JSON.parse(decode(tk!))  
   //console.log(userTk);
  
  const scrollToLast = () => {
    const lastChildElement = ref.current?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    function receivedMessage(message: Msg) {
      const newMessage: Msg = message;
      
      setchat([...chat, newMessage]);      
      setTimeout(() => {
        scrollToLast()
      }, 300);    
    }

    socket.on("msgToClient", (message: Msg) => {   
      receivedMessage(message);
    });
  }, [chat]);

  const emoji = classNames({
    'chat__emojis-wrapper--show': emojiShow,
    'chat__emojis-wrapper': true
  })

  
  function show({ native }: { native: string }) {
    setContent(`${content}${native}`);
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
      socket.emit("msgToServer", { user: userTk.sub, name: userTk.name, avatar: userTk.avatar, message: content });
      console.log({ user: userTk.sub, name: userTk.name, avatar: userTk.avatar, message: content });
      
      setContent("")  
    }
  }

 function sendMsgButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if(content.trimStart() === "") return
      socket.emit("msgToServer", { user: userTk.sub, name: userTk.name, avatar: userTk.avatar, message: content });
      console.log({ user: userTk.sub, name: userTk.name, avatar: userTk.avatar, message: content });
      setContent("") 
 }  

  return (
    <>
      <div className="external-container" style={{ backgroundImage: `url(${back})` }}>
        <div className="chat__container">
          <div className="chat__users">
            <h2 className="chat__name">Max Chat</h2>
          </div>

          <div className="chat__messages">
            <div className="chat__messages-container" ref={ref}>
              {chat &&
                chat.map((item, index) => {
                  if (item.user === userTk.sub) {
                    return (
                      <div className="chat__msg-send" key={index}>
                        <div className="chat__msg-send-wrapper">
                          <div className="chat__message-send">
                            <div style={{ textAlign: "right" }}>
                              <span className="chat__msg-hour">12:30h</span>{" "}
                                <span className="chat__msg-name">{userTk.name}</span>                              
                            </div>
                            <p className="chat__msg-text" dangerouslySetInnerHTML={{ __html: item.message }} />
                          </div>
                        </div>
                        <div className="chat__circle-send">
                            {!userTk.avatar ? 
                              <div className="chat__avatar" style={{backgroundImage: `url(${noImg})`}}></div>
                              :
                              <div className="chat__avatar" style={{backgroundImage: `url(https://cscsxpbybtxuhdnsnkou.supabase.co/storage/v1/object/public/chats-files/${item.avatar})`}}></div>
                           }
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="chat__msg-received" key={index}>
                        <div className="chat__msg-wrapper">
                          <div className="chat__circle">
                          {!item.avatar ? 
                              <div className="chat__avatar" style={{backgroundImage: `url(${noImg})`}}></div>
                              :
                              <div className="chat__avatar" style={{backgroundImage: `url(https://cscsxpbybtxuhdnsnkou.supabase.co/storage/v1/object/public/chats-files/${item.avatar})`}}></div>
                           }
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

