const connection = require("../config/connection");
const { Activity } = require("../models");
const { getActivityCityCombo } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
    console.log("connected");

    // Drop existing courses
    await Activity.deleteMany({});

    // Create empty array to hold the activities
    const activities = [];

    // Loop 20 times -- add students to the students array
    for (let i = 0; i < 150; i++) {
        // Get some random activity objects using a helper function that is imported from ./data
        const assignments = getActivityCityCombo(150);

        const activityCombo = getActivityCityCombo();
        const city = activityCombo.split(",")[0];
        const activity = activityCombo.split(",")[1];
        const adjective = activityCombo.split(",")[2];
        const name = `${adjective} ${activity}`;
        const description = `Let's have a ${adjective} time ${activity} in ${city}`;

        activities.push({
            name,
            activity,
            city,
            location: city,
            description,
        });
    }

    // Add students to the collection and await the results
    await Activity.collection.insertMany(activities);

    // Log out the seed data to indicate what should appear in the database
    console.table(activities);
    console.info("Seeding complete! 🌱");
    process.exit(0);
});
