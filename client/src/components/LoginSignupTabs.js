// Import React framework components
import React, { useState } from "react";

// Import Material UI components
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Container } from "@mui/material";

import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

function TabPanel(props) {
    const { children, value, index, classes, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Container>
                    <Box>{children}</Box>
                </Container>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Fade in={true}>
                <Box sx={style}>
                    <h3>Welcome To Let's Go</h3>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Login" {...a11yProps(0)} />
                            <Tab label="Sign Up" {...a11yProps(1)} />
                        </Tabs>
                    </Box>

                    <TabPanel value={value} index={0}>
                        <>
                            <LoginForm />
                        </>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <>
                            <SignupForm />
                        </>
                    </TabPanel>
                </Box>
            </Fade>
        </>
    );
}
