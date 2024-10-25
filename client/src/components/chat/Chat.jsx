import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";

export default function Chat({ chats }) {
  console.log(chats);
  const [chat, setChat] = useState(null);
  const { currentUser, updateUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  console.log(chat);

  async function handleOpenChat(id, reciever) {
    try {
      const response = await axios.get(`http://localhost:1200/api/chat/${id}`, {
        withCredentials: true,
      });
      setChat({ response: response.data, reciever });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) {
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:1200/api/messages/${chat.response.id}`,
        {
          text: text,
        },
        {
          withCredentials: true,
        }
      );

      setChat({
        response: {
          id: chat.response.id,
          seenBy: chat.response.seenBy,
          createdAt: chat.response.createdAt,
          lastMessage: chat.response.createdAt,
          users: [
            {
              userId: chat.response.userId,
              chatId: chat.response.chatId,
              userIds: chat.response.userIds,
            },
          ],
          messages: [...chat.response.messages, response.data],
        },
        reciever: {
          id: chat.reciever.id,
          username: chat.reciever.username,
          avatar: chat.reciever.avatar,
        },
      });
      console.log(chat.reciever.id);
      e.target.reset();
      socket.emit("sendMessage", {
        recieverId: chat?.reciever.id,
        data: response.data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function read() {
      console.log(chat.response.id);
      try {
        await axios.put(
          `http://localhost:1200/api/chat/read/${chat.response.id}`,
          {},
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.response.id === data.chatId) {
          console.log(data);
          setChat({
            response: {
              id: chat.response.id,
              seenBy: chat.response.seenBy,
              createdAt: chat.response.createdAt,
              lastMessage: chat.response.createdAt,
              users: [
                {
                  userId: chat.response.users[0].userId,
                  chatId: chat.response.users[0].chatId,
                  userIds: chat.response.users[0].userids,
                },
              ],
              messages: [...chat.response.messages, data],
            },
            reciever: {
              id: chat.reciever.id,
              username: chat.reciever.username,
              avatar: chat.reciever.avatar,
            },
          });
        }
      });
      read();
    }
    console.log(chat);
  }, [chat]);

  const messageEndRef = useRef();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const message = chat?.response.messages;
  console.log(chats);
  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats.map((chat) => (
          <div
            key={chat.chatId}
            className="message"
            style={{
              backgroundColor: chat.chats.seenBy.includes(currentUser.id)
                ? "white"
                : "yellow",
            }}
            onClick={() => handleOpenChat(chat.chatId, chat.reciever)}
          >
            <img src={chat.reciever.avatar || "/noavatar.jpeg"} alt="" />
            <span>{chat.reciever.username}</span>
            <p>{chat.chats.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.reciever.avatar || "/noavatar.jpeg"} alt="" />
              {chat.reciever.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {message.map((singleMessage) => (
              <div
                className="chatMessage"
                key={singleMessage.id}
                style={{
                  alignSelf:
                    singleMessage.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    singleMessage.userId === currentUser.id ? "right" : "left",
                }}
              >
                <p>{singleMessage.text}</p>
                <span>
                  <div ref={messageEndRef}></div>
                  {format(singleMessage.createdAt)}
                </span>
              </div>
            ))}
            <div></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
