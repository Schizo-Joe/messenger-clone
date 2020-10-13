import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import './Login.css';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const { currentUser, loginGoogle } = useAuth();

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const history = useHistory();
    
    if (currentUser) {
        history.push('/');
    }
    
    const handleLoginGoogleClick = async (e: any) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        let isLoginSuccessful = false;

        try {
            await loginGoogle();
            isLoginSuccessful = true;
        }
        catch {
            setError('Google login unavailable. Please try again later.');
        }

        setLoading(false);

        if (isLoginSuccessful) {
            history.push('/');
        }
    };

    return (
        <>
            <Container fixed>
                <div className="login__box">
                    <h1>Login</h1>
                    { error && <span>{ error }</span> }
                    <button className="googleBtn" type="button" onClick={ handleLoginGoogleClick } disabled={ loading }>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                            alt="logo"
                        />
                        Login With Google
                    </button>
                </div>
            </Container>
        </>
    );
};

export default Login;
