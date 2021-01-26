import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, selectLoadingStatus } from "./../currentUserSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { NavBar, WingBlank, List, InputItem, Button, Toast } from "antd-mobile";
import Logo from "../../../../app/logo/logo";
import "./auth.less";

const ListItem = List.Item;

function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();

  let history = useHistory(); // use history hooks
  const dispatch = useDispatch();

  const loadingStatus = useSelector(selectLoadingStatus);

  const onUsernameChange = (val) => setUserName(val);
  const onPasswordChange = (val) => setPassword(val);

  const canLogin =
    [username, password].every(Boolean) && loadingStatus === "idle";

  const onLoginClick = async () => {
    // since we use rejectWithValue, we don't need to unwarp the result
    const resultAction = await dispatch(login({ username, password }));
    if (login.fulfilled.match(resultAction)) {
      // succeed
      const user = unwrapResult(resultAction);
      const path = getRedirectPath(user);
      let { from } =
        path === "/"
          ? location.state || { from: { pathname: path } }
          : { from: { pathname: path } };
      history.replace(from);
    } else {
      if (resultAction.payload) {
        Toast.fail(resultAction.payload.message, 1.5);
      } else {
        Toast.fail(resultAction.error.message, 1.5);
      }
    }
  };

  const getRedirectPath = (user) => {
    let path;
    if (Object.keys(user).filter((key) => user[key]).length <= 3) {
      path = "/userinfo"; // fill out info form
    } else {
      path = "/";
    }
    return path;
  };

  const toRegisterClick = () => {
    history.push("/register");
  };

  return (
    <div>
      <NavBar>BOSS HIRING</NavBar>
      <Logo />
      <WingBlank className="login-list">
        <List>
          <ListItem>
            <InputItem
              placeholder={"Enter your user name"}
              onChange={onUsernameChange}
            >
              Username
            </InputItem>
          </ListItem>
          <ListItem>
            <InputItem
              type="password"
              placeholder={"Enter your password"}
              onChange={onPasswordChange}
            >
              Password
            </InputItem>
          </ListItem>
          <ListItem>
            <Button type="primary" onClick={onLoginClick} disabled={!canLogin}>
              Sign In
            </Button>
          </ListItem>
          <ListItem>
            <Button onClick={toRegisterClick}>Don't have an Account</Button>
          </ListItem>
        </List>
      </WingBlank>
    </div>
  );
}

export default Login;
