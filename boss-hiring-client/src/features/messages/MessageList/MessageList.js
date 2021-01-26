import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { List, Badge } from "antd-mobile";
import { selectCurrentUser } from "../../users/currentUser/currentUserSlice";
import { selectAllMessages } from "../messagesSlice";
import { selectUsersByIds } from "../../users/usersSlice";
import "./MessageList.less";

function MessageList({ setUnread }) {
  const history = useHistory();
  const currentUser = useSelector(selectCurrentUser);
  const messages = useSelector(selectAllMessages);

  let userCntMap = new Map(); // keeps item in order of insertion
  let userMsgMap = new Map();
  let totalCnt = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const otherId = msg.to === currentUser._id ? msg.from : msg.to;
    if (!userCntMap.has(otherId)) {
      userMsgMap.set(otherId, msg);
      userCntMap.set(otherId, 0);
    }
    // Count unread messages
    if (msg.to === currentUser._id && !msg.read) {
      userCntMap.set(msg.from, userCntMap.get(msg.from) + 1);
      totalCnt++;
    }
  }

  useEffect(() => {
    setUnread(totalCnt); // call the callback function to change the badge
  }, [setUnread, totalCnt]);

  // get user info corresponding to user_id
  const userInfoMap = useSelector((state) =>
    selectUsersByIds(state, userCntMap)
  );

  const onClick = (userId) => {
    history.push(`/chat/${userId}`);
  };

  return (
    <div>
      <List className="message-list">
        {Array.from(userMsgMap).map((entry) => {
          const userId = entry[0],
            msg = entry[1];
          const count = userCntMap.get(userId);
          const otherUser = userInfoMap.get(userId);
          return (
            <List.Item
              key={msg._id}
              extra={<Badge text={count} />}
              thumb={otherUser.avatar ? otherUser.avatar : null}
              arrow="horizontal"
              onClick={() => onClick(userId)}
            >
              {msg.content}
              <List.Item.Brief>{otherUser.username}</List.Item.Brief>
            </List.Item>
          );
        })}
      </List>
    </div>
  );
}

MessageList.propTypes = {
  setUnread: PropTypes.func.isRequired,
};

export default MessageList;
