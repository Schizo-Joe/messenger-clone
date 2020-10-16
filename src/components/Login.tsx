import React, { useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import "./Login.css";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const Login = () => {
  const { currentUser, loginGoogle } = useAuth();

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const history = useHistory();

  if (currentUser) {
    history.push("/");
  }

  const handleLoginGoogleClick = async (e: any) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    let isLoginSuccessful = false;

    try {
      await loginGoogle();
      isLoginSuccessful = true;
    } catch {
      setError("Google login unavailable. Please try again later.");
    }

    setLoading(false);

    if (isLoginSuccessful) {
      history.push("/");
    }
  };

  return (
    <>
      <Grid container alignItems="center" justify="center" style={{ minHeight: '100vh'}}>
        <Container>
          <div className="login__box" style={{ textAlign: 'center' }}>
            <h1>Messenger Clone</h1>
            {error && <span>{error}</span>}
            <Button
              className="login__GoogleLoginButton"
              type="button"
              onClick={handleLoginGoogleClick}
              disabled={loading}
              variant="contained"
              style={{ textTransform: 'none' }}
            >
              Sign in  with Google
            </Button>
          </div>
        </Container>
      </Grid>
    </>
  );
};

export default Login;
