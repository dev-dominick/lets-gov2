// Import React framework components
import React, { useState } from "react";

// Import Material UI components
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";

import { Link } from "react-router-dom";

// Import components
import LoginSignupTabs from "./LoginSignupTabs";
import Auth from "../utils/auth";

const Navbar = () => {
    // Set modal display state
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Let's Go!
                        </Typography>
                        {Auth.loggedIn() ? (
                            <Button onClick={Auth.logout} color="inherit">
                                Log Out
                            </Button>
                        ) : (
                            <Button onClick={() => setShowModal(true)} color="inherit">
                                Login/Sign Up
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>

            {/* Set modal data up */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={showModal}
                onClose={() => setShowModal(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                {/* Wrapping in a second div solves the issue of refs */}
                <>
                    <LoginSignupTabs />
                </>
            </Modal>
        </div>
    );
};

export default Navbar;
