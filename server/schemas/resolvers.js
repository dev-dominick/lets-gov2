// Import Signing & Authentication libraries
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

// Import Mongoose data model imports
const { User, Activity } = require("../models");
// const User  = require("../models/User");
// const Activity = require("../models/Activities");

const resolvers = {
    Query: {
        // Find a single or multiple users
        users: async (parent, { userId }, context) => {
            if (context.user) {
                const params = userId ? { _id: userId } : {};
                return await User.find(params);
            }
            throw new AuthenticationError("You need to be logged in to use this feature.");
        },

        // Get the profile of the logged in user and populate savedBooks
        me: async (parent, args, context) => {
            if (context.user) {
                return await User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError("You need to be logged in to use this feature.");
        },

        // Get the profile of the logged in user and populate savedBooks
        activities: async (parent, { activityId }, context) => {
            if (context.user) {
                const params = activityId ? { _id: activityId } : {};
                return await Activity.find(params);
            }
            throw new AuthenticationError("You need to be logged in to use this feature.");
        },

        // Get the profile of the logged in user and populate savedBooks
        activitiesByActivityCity: async (parent, { activity, city }, context) => {
            if (context.user) {
                const params = { activity, city };
                return await Activity.find(params);
            }
            throw new AuthenticationError("You need to be logged in to use this feature.");
        },
    },

    Mutation: {
        // Login a user with username or email and password (required) and and return the user obj and token
        login: async (parent, { username, email, password }) => {
            const user = await User.findOne({ $or: [{ username }, { email }] });

            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Wrong password!");
            }

            const token = signToken(user);
            return { token, user };
        },

        // Create a new user based upon 3 required fields and return the user obj and token
        createUser: async (parent, { username, email, password, shortBio, homeCity }) => {
            const user = await User.create({ username, email, password, shortBio, homeCity });
            const token = signToken(user);
            return { token, user };
        },

        // Edit a user's non required fields (`args`) and return an updated user
        editUser: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    // Spreads the inbound args and matches to the field.
                    { $set: { ...args } },
                    { new: true }
                );
                console.log(user);
                return user;
            }
            throw new AuthenticationError("You need to be logged in to use this feature.");
        },

        // Add a friend to a user and return an updated user
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                console.log(`Adding friend ${friendId} to user ${context.user._id}`);
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    // `addToSet` only adds to the array if it does not exist
                    { $addToSet: { friends: friendId } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("You need to be logged in to use this feature.");
        },

        // Remove a friend to a user and return an updated user
        removeFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                console.log(`Removing friend ${friendId} from user ${context.user._id}`);
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    // `addToSet` only adds to the array if it does not exist
                    { $pull: { friends: friendId } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("You need to be logged in to use this feature.");
        },

        // Add an activity to a user and return an updated user
        addActivity: async (parent, { activityId }, context) => {
            if (context.user) {
                console.log(`Adding user ${context.user._id} to activity ${activityId}`);
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    // `addToSet` only adds to the array if it does not exist
                    { $addToSet: { activities: activityId } },
                    { new: true }
                );

                await Activity.findOneAndUpdate(
                    { _id: activityId },
                    // `addToSet` only adds to the array if it does not exist
                    { $addToSet: { participants: context.user._id } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("You need to be logged in to use this feature.");
        },

        // Remove an activity to a user and return an updated user
        removeActivity: async (parent, { activityId }, context) => {
            if (context.user) {
                console.log(`Removing user ${context.user._id} from activity ${activityId}`);
                const updatedUser = await User.findOneAndUpdate(
                    // Equivalent to a where clause in SQL
                    { _id: context.user._id },
                    // `pull` only adds to the array if it does not exist
                    { $pull: { activities: activityId } },
                    { new: true }
                );

                await Activity.findOneAndUpdate(
                    { _id: activityId },
                    // `pull` to remove user
                    { $pull: { participants: context.user._id } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("You need to be logged in to use this feature.");
        },

        // Creates a new activity and returns the activity object
        createActivity: async (parent, { name, location, city, lng, lat, description }) => {
            const activity = await Activity.create({ name, location, lng, lat, city, description });
            return activity;
        },

        // Adds the participant/user to an activity
        addParticipant: async (parent, { activityId }, context) => {
            if (context.user) {
                console.log(`Adding user ${context.user._id} to activity ${activityId}`);
                const updatedActivity = await Activity.findOneAndUpdate(
                    { _id: activityId },
                    // `addToSet` only adds to the array if it does not exist
                    { $addToSet: { participants: context.user._id } },
                    { new: true }
                );

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    // `addToSet` only adds to the array if it does not exist
                    { $addToSet: { activities: activityId } },
                    { new: true }
                );

                return updatedActivity;
            }
            throw new AuthenticationError("You need to be logged in to use this feature.");
        },

        // removes participant/user from an activity
        removeParticipant: async (parent, { activityId }, context) => {
            if (context.user) {
                console.log(`Removing user ${context.user._id} from activity  ${activityId}`);
                const updatedActivity = await Activity.findOneAndUpdate(
                    { _id: activityId },
                    // `pull` to remove user
                    { $pull: { participants: context.user._id } },
                    { new: true }
                );

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    // `pull` only adds to the array if it does not exist
                    { $pull: { activities: activityId } },
                    { new: true }
                );

                return updatedActivity;
            }
            throw new AuthenticationError("You need to be logged in to use this feature.");
        },
    },
    
};

module.exports = resolvers;
