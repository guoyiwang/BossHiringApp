import React, { useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Toast, ActivityIndicator } from "antd-mobile";
import {
  selectCurrentUser,
  fetchCurrentUser,
  selectPrepareStatus,
  selectLoggedInStatus,
} from "../features/users/currentUser/currentUserSlice";
import prepareLogin from "../features/users/currentUser/Auth/prepare";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export default function AuthenticateRoute({ children, ...rest }) {
  const isLoggedIn = useSelector(selectLoggedInStatus);
  const user = useSelector(selectCurrentUser);
  const prepareStatus = useSelector(selectPrepareStatus);
  const dispatch = useDispatch();
  const histroy = useHistory();

  useEffect(() => {
    if (!isLoggedIn) {
      Toast.fail("Your login cession has expired, please login again");
    }
    const fetchUser = async () => {
      console.log("Fetching current user...");
      const resultAction = await dispatch(fetchCurrentUser());
      if (fetchCurrentUser.fulfilled.match(resultAction)) {
      } else {
        if (resultAction.payload) {
          Toast.fail(resultAction.payload.message, 1.5);
        } else {
          Toast.fail(resultAction.error.message, 1.5);
        }
        histroy.push("/login");
      }
    };
    // if we have userId in cookies but redux doesn't have current user
    if (isLoggedIn && !user) {
      fetchUser(); // after fetching user, this component will re-render
    }
  }, [user, isLoggedIn, dispatch, histroy]);

  useEffect(() => {
    if (!prepareStatus && user) {
      prepareLogin(user);
    }
  }, [prepareStatus, user]);

  // stop rendering and wait for async result !!!!!!!

  if (isLoggedIn && !user) {
    console.log("Auth accetps but user doesn't exist in Redux");
    return <ActivityIndicator toast text="Loading..." animating={true} />;
  }

  // if users haven't been loaded, stop rendering and wait
  if (isLoggedIn && !prepareStatus) {
    console.log("Preparing...");
    return <ActivityIndicator toast text="Loading..." animating={true} />;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
