// Import React framework and destructure `useState`
import React, { useState } from "react";

// Import the `useMutation()` hook from Apollo Client
import { useMutation } from "@apollo/client";

// Import Material UI components
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { Alert } from "@mui/material";

// Reference required mutation for logging in a user
import { LOGIN_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const style = {
    display: "flex",
    alignItems: "center",
    "& > :not(style)": { m: 1 },
};

const LoginForm = () => {
    const [userFormData, setUserFormData] = useState({ username: "", password: "" });
    // const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    // Assign the LOGIN_USER mutation to `loginUser` and capture any errors returned
    const [loginUser, { error }] = useMutation(LOGIN_USER);

    // Handling state change of login form
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        // console.log(`Name: ${name} and Value: ${value}`);
        setUserFormData({ ...userFormData, [name]: value });
    };

    let handleSubmit = async (event) => {
        event.preventDefault();

        // Check if form has everything
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            // Spread `userFormData` into `loginUser` and return context data about the user for the subsequent login function
            const { data } = await loginUser({ variables: { ...userFormData } });
            console.log(data);

            // Store the token to local storage. (`login` refers to the typesDefs mutation)
            Auth.login(data.login.token);
        } catch (err) {
            console.error(err);
            // If error in login, then show alert
            setShowAlert(true);
        }

        setUserFormData({
            username: "",
            email: "",
            password: "",
        });
    };

    return (
        <>
            <Stack component="form" onSubmit={handleSubmit} sx={style}>
                <TextField type="text" placeholder="Your username" name="username" value={userFormData.username} onChange={handleInputChange} required />

                <TextField type="password" placeholder="Your password" name="password" value={userFormData.password} onChange={handleInputChange} required />

                <Button variant="outlined" type="submit">
                    Log In
                </Button>

                {showAlert ? (
                    <Alert onClose={() => setShowAlert(false)} variant="filled" severity="error">
                        Wrong username or password or create an account
                    </Alert>
                ) : (
                    <></>
                )}
            </Stack>
            {error && <div>Something went wrong...</div>}
        </>
    );
};

export default LoginForm;
