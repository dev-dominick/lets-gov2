const { Schema, model } = require("mongoose");

const activitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    lng: {
        type: Number,
    },
    lat: {
        type: Number,
    },
    description: {
        type: String,
        required: true,
    },
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
});

const Activity = model("Activity", activitySchema);

module.exports = Activity;
