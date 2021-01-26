import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Result, List, Button, Modal } from "antd-mobile";
import { selectCurrentUser, logout } from "../currentUserSlice";
import { usersReset } from "../../usersSlice";
import { messageReset } from "../../../messages/messagesSlice";
import io from 'socket.io-client';

import "./UserInfo.less";

function UserInfo() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = Modal.alert;
  const myImg = (src) => <img src={src} className="user-avatar" alt="" />;

  const header = user.type === "recruiter" ? "Job Offered" : "Job Expected";

  const onButtonClick = () => {
    const alertInstance = alert("Log Out", "Are you sure?", [
      {
        text: "Cancel",
        style: "default",
      },
      {
        text: "OK",
        onPress: () => {
          dispatch(logout()); // clear current user in redux
          dispatch(usersReset([]));
          dispatch(messageReset([]));
          io.socket.close();
          io.socket = undefined;
          history.push("/login");
        },
      },
    ]);
    setTimeout(() => {
      // 可以调用close方法以在外部close
      console.log("auto close");
      alertInstance.close();
    }, 500000);
  };

  const onEditClick = () => {
    history.push('/userinfo');
  }

  return (
    <div className="user-info">
      <Result
        img={myImg(user.avatar)}
        title={user.username}
        message={user.company}
      />
      <List renderHeader={() => header}>
        <List.Item multipleLine>
          {user.title ? (
            <List.Item.Brief>Title: {user.title}</List.Item.Brief>
          ) : null}
          {user.salary ? (
            <List.Item.Brief>Salary: {user.salary}</List.Item.Brief>
          ) : null}
          <List.Item.Brief>Info: {user.info}</List.Item.Brief>
        </List.Item>
      </List>
      <Button onClick={onEditClick}>Edit</Button>
      <Button type="warning" onClick={onButtonClick}>
        Log Out
      </Button>
    </div>
  );
}

export default UserInfo;
