import emailjs from "@emailjs/browser";
import React, { useRef } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@material-ui/core/styles";
import "./assets/css/ContactSupport.css";

export default function Contact() {
    // const styles = {
    //     formStyle: {
    //       justifyContent: 'center',
    //       color: 'white',
    //       textAlign: 'center'
    //     },
    //   };

    const form = useRef();

    const sendEmail = (e) => {
        // e.preventDefault();

        emailjs.sendForm("service_3bsgvam", "template_xd4v0m1", e.target, "uXqGyr9ayTDBeBgC9").then(
            (result) => {
                console.log(result.text);
            },
            (error) => {
                console.log(error.text);
            }
        );
    };

    // npm install @material-ui/core --save
    const useStyles = makeStyles((theme) => ({
        root: {
            "& .MuiFilledInput-root": {
                background: "rgb(232, 241, 250)",
            },
        },
    }));

    const classes = useStyles();

    return (
        <form ref={form} onSubmit={sendEmail}>
            <div className="formContainer">
                <h1 className="inputs">Contact Us</h1>
                <div className="inputsOne">
                    <TextField className={classes.root} id="filled-basic" label="Name" variant="filled" name="name" />
                </div>
                <br />
                <div className="inputsOne">
                    <TextField className={classes.root} id="filled-basic" label="Email" variant="filled" name="email" />
                </div>
                <div className="inputs">
                    <TextField className={classes.root} id="filled-multiline-static" label="Message" multiline style={{ width: 350 }} rows={6} placeholder="Message" variant="filled" name="message" />
                </div>
                <div className="button">
                    <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                        Send
                    </Button>
                </div>
            </div>
        </form>
    );
}
