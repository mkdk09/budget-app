import React, { useContext } from "react";
import { Route } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import Login from "./Login";

const PrivateRoute = ({ component, ...rest}) => {
  //AuthContextからcurrentUserを受け取る
  const { currentUser } = useContext(AuthContext);

  //currentUserがtrueの場合component＝Home、falseならLoginコンポーネントにroute
  const Component = currentUser ? component : Login;

  return <Route {...rest} component={Component} />;
};

export default PrivateRoute;