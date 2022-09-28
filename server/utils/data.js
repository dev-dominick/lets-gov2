const cities = ["New York", "Philadelphia", "Washington D.C.", "Seattle", "Atlanta"];

const activities = ["Hiking", "Dinner", "Clubbing", "Movies", "Workout"];

const adjectives = ["Go Go", "Super", "Send it", "Poppin'", "Vibing"];

// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Gets a random combination of activity & city
const getActivityCityCombo = () => `${getRandomArrItem(cities)},${getRandomArrItem(activities)},${getRandomArrItem(adjectives)}`;

// Export the functions for use in seed.js
module.exports = { getActivityCityCombo };
