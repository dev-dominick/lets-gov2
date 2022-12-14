const jwt = require("jsonwebtoken");
// require("dotenv").config();
require('dotenv').config({ path: './../.env' })
console.log(process.env.SECRET);
// The `process` variable capture (hijack the process environment) and use `dotenv` to store.
// NOTE: if the .env file cannot be found, then possibly need to add the `path` option.
// const secret = process.env.SECRET;
const secret = 'mysecret';

// set token expiration date
const expiration = "2h";

module.exports = {
    // function for our authenticated routes
    authMiddleware: function ({ req }) {
        // allows token to be sent via  req.query or headers
        // let token = req.body.token || req.query.token || req.headers.authorization;
        let token = req.query.token || req.headers.authorization;

        // ["Bearer", "<tokenvalue>"]
        if (req.headers.authorization) {
            token = token.split(" ").pop().trim();
        }

        // If there is no token, then continue with the resolvers and not adding any context
        if (!token) {
            return req;
        }

        // verify token and get user data out of it
        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            // Attach a user to the request
            req.user = data;
        } catch {
            console.log("Invalid token");
        }

        return req;
    },
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};
