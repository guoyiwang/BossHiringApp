import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { NavBar, List, Icon, InputItem } from "antd-mobile";
import { selectMessagesByUser, readAllMessages } from "../messagesSlice";
import { sendMessage } from "../../../web/socketio";
import { selectCurrentUser } from "../../users/currentUser/currentUserSlice";
import { selectUserById } from "../../users/usersSlice";
import ChatItem from "./ChatItem";
import QueueAnim from "rc-queue-anim";
import "./Chat.less";

function Chat() {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  let { userId: otherUserId } = useParams();
  const otherUser = useSelector((state) => selectUserById(state, otherUserId));
  const [content, setContent] = useState("");
  const messages = useSelector((state) =>
    selectMessagesByUser(state, otherUserId)
  );
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const otherMessages = messages.filter(
      (msg) => msg.from === otherUserId && msg.read === false
    );
    if (otherMessages.length > 0) {
      dispatch(readAllMessages(otherMessages));
    }
  }, [messages, otherUserId, dispatch]);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavier: "smooth" });
  });

  const onLeftClick = () => {
    history.goBack();
  };

  const onSendClick = () => {
    const to = otherUserId;
    const from = currentUser._id;
    const contentSend = content.trim();
    if (contentSend) {
      const msg = { to, from, content: contentSend };
      sendMessage(msg);
    }
    setContent("");
  };

  // wrong url
  if (!otherUser) {
    history.replace("/notfind");
    return null;
  }

  return (
    <div className="chat-page">
      <NavBar
        icon={<Icon type="left" />}
        className="sticky-header"
        onLeftClick={onLeftClick}
      >
        {otherUser.username}
      </NavBar>
      <List className="chat-list">
        <QueueAnim type="alpha">
          {messages.map((msg) => {
            // if this msg is from other user to me
            if (otherUser._id === msg.from) {
              return (
                <ChatItem
                  key={msg._id}
                  avatar={otherUser.avatar}
                  isMe={false}
                  content={msg.content}
                />
              );
            } else {
              return (
                <ChatItem
                  key={msg._id}
                  avatar={currentUser.avatar}
                  isMe={true}
                  content={msg.content}
                />
              );
            }
          })}
          <div ref={messagesEndRef}></div>
        </QueueAnim>
      </List>

      <div className="send-bar">
        <InputItem
          value={content}
          onChange={(val) => setContent(val)}
          extra={
            <span>
              <span onClick={onSendClick}>Send</span>
            </span>
          }
        />
      </div>
    </div>
  );
}

export default Chat;
