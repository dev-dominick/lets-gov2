const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(email);
};


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trip: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validateEmail, "Must use a valid email address"],
        },
        password: {
            type: String,
            required: true,
        },
        shortBio: {
            type: String,
        },
        homeCity: {
            type: String,
        },
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        activities: [
            {
                type: Schema.Types.ObjectId,
                ref: "Activity",
            },
        ],
    },

    // Set this to use virtual below
    {
        toJSON: {
            virtuals: true,
        },
    }
);

// Hash user password with bcrypt
userSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("password")) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    // Middleware to continue on to the next part of the execution.
    next();
});

// Custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// When we query a user, we'll also get another field called `friendCount` with the number of friends the user has
userSchema.virtual("friendCount").get(function () {
    return this.friends.length;
});

// Initialize the `User` model
const User = model("User", userSchema);

module.exports = User;
