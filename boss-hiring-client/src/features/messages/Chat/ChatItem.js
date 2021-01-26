import React from "react";
import PropTypes from "prop-types";
import { Flex } from "antd-mobile";

const myImg = (src) => <img src={src} className="chat-avatar" alt="" />;

function ChatItem({ avatar, isMe, content }) {
  return (
    <div>
      {isMe ? (
        <Flex id="chat-me">
          <Flex.Item className="chat-content">{content}</Flex.Item>
          <div>{myImg(avatar)}</div>
        </Flex>
      ) : (
        <Flex>
          <div>{myImg(avatar)}</div>
          <Flex.Item className="chat-content">{content}</Flex.Item>
        </Flex>
      )}
    </div>
  );
}

ChatItem.propTypes = {
  avatar: PropTypes.string.isRequired,
  isMe: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
};

export default ChatItem;
