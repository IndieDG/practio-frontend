import React from "react";
import styled from "styled-components";
import GoogleLogin from "react-google-login";
import { User, CLIENT_ID } from "../App";

const Container = styled.div`
  text-align: center;
`;

type LoginProps = {
  setUser: (user: User) => void;
  setUserLoggedIn: () => void;
};

export const Login: React.FC<LoginProps> = ({ setUser, setUserLoggedIn }) => {
  const successfulLogin = (response: any) => {
    setUser({ id: response.googleId, name: response.Ot.Cd });
    setUserLoggedIn();
  };
  const failedLogin = (response: any) => console.log("FAILED", response);
  return (
    <>
      <Container>
        <h1>Popularity Trends</h1>
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="Login"
          onSuccess={successfulLogin}
          onFailure={failedLogin}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
      </Container>
    </>
  );
};
