import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AddUserInfoForm from "./users/currentUser/AddUserInfoForm/AddUserInfoForm";
import NotFind from "../app/NotFind";
import Home from "./Home/Home";
import Chat from "./messages/Chat/Chat";

function Main() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/userinfo">
        <AddUserInfoForm />
      </Route>
      <Route exact path="/chat/:userId">
        <Chat />
      </Route>
      <Route exact path="/notfind">
        <NotFind />
      </Route>
      <Route>
        <Redirect to="/notfind" />
      </Route>
    </Switch>
  );
}

export default Main;
