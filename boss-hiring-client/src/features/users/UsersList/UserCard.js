import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Card, WingBlank, WhiteSpace } from "antd-mobile";
import "./UserCard.less";

function UserCard(props) {
  const user = props.user;
  const history = useHistory();

  const onClick = () => {
    history.push(`/chat/${user._id}`);
  };

  return (
    <div className="user-card">
      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        <Card onClick={onClick}>
          <Card.Header
            // title={user.username}
            thumb={user.avatar}
            extra={user.username}
          />
          <Card.Body>
            <div>Job: {user.title}</div>
            {user.company ? <div>Company: {user.company}</div> : null}
            {user.salary ? <div>Salary: {user.salary}</div> : null}
            <div>Info: {user.info}</div>
          </Card.Body>
        </Card>
        <WhiteSpace size="lg" />
      </WingBlank>
    </div>
  );
}

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
};
export default UserCard;
