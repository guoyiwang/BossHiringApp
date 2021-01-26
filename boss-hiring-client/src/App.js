import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./features/users/currentUser/Auth/Login";
import Register from "./features/users/currentUser/Auth/Register";
import Main from "./features/main";
import AuthenticateRoute from "./app/AuthenticateRoute";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <AuthenticateRoute>     {/* default route */}
          <Main />
        </AuthenticateRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
