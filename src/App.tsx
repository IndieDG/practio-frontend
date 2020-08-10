import React, { useState } from "react";
import { Login } from "./components/Login";
import { Popularity } from "./components/Popularity";

export const CLIENT_ID =
  "934347457891-2c5u5ao5vm0jt0c287c3c5f6get58oml.apps.googleusercontent.com";

export type User = {
  id: string;
  name: string;
};

export const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User>({ id: "", name: "" });

  const setUserLoggedIn = () => {
    setLoggedIn(true);
  };
  const setUserLoggedOut = () => {
    setLoggedIn(false);
    setUserInfo({ id: "", name: "" });
  };

  return (
    <div>
      {!loggedIn && (
        <Login setUser={setUserInfo} setUserLoggedIn={setUserLoggedIn} />
      )}
      {loggedIn && (
        <Popularity user={userInfo} setUserLoggedOut={setUserLoggedOut} />
      )}
    </div>
  );
};

export default App;
