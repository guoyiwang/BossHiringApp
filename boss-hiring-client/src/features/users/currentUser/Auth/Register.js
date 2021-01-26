import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  Button,
  Flex,
  Toast,
} from "antd-mobile";
import { register, selectLoadingStatus } from "./../currentUserSlice";
import Logo from "../../../../app/logo/logo";
import "./auth.less";

const ListItem = List.Item;
const FlexItem = Flex.Item;

function Register() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("recruiter");
  const [typeStyle1, setTypeStyle1] = useState("primary");
  const [typeStyle2, setTypeStyle2] = useState("");

  let history = useHistory(); // use history hooks
  const location = useLocation();
  const dispatch = useDispatch();

  const loadingStatus = useSelector(selectLoadingStatus);

  const onUsernameChange = (val) => setUserName(val);
  const onPasswordChange = (val) => setPassword(val);

  const onTypeStyleClick1 = () => {
    setType("recruiter");
    if (typeStyle1 !== "primary") {
      setTypeStyle1("primary");
      setTypeStyle2("");
    }
  };
  const onTypeStyleClick2 = () => {
    setType("jobseeker");
    if (typeStyle2 !== "primary") {
      setTypeStyle2("primary");
      setTypeStyle1("");
    }
  };

  const canLogin =
    [username, password].every(Boolean) && loadingStatus === "idle";

  const onRegisterClick = async () => {
    // since we use rejectWithValue, we don't need to unwarp the result
    const resultAction = await dispatch(register({ username, password, type }));
    if (register.fulfilled.match(resultAction)) {
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

  const toLoginClick = () => {
    history.push("/login");
  };

  return (
    <div>
      <NavBar>BOSS HIRING</NavBar>
      <Logo />
      <WingBlank className="login-list" size="lg">
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
            <Flex>
              <FlexItem>
                <Button type={typeStyle1} onClick={onTypeStyleClick1}>
                  I'm a Recruiter
                </Button>
              </FlexItem>
              <FlexItem>
                <Button type={typeStyle2} onClick={onTypeStyleClick2}>
                  I'm a Job Seeker
                </Button>
              </FlexItem>
            </Flex>
          </ListItem>

          <ListItem>
            <Button
              type="primary"
              onClick={onRegisterClick}
              disabled={!canLogin}
            >
              Sign Up
            </Button>
          </ListItem>
          <ListItem>
            <Button onClick={toLoginClick}>Already Has an Account</Button>
          </ListItem>
        </List>
      </WingBlank>
    </div>
  );
}

export default Register;
