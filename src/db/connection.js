const mongoose = require('mongoose');

// local database connection string
// mongodb://localhost:27017/bus-booking-app?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false

(async () => {
  try {
    await mongoose.connect(
      // "mongodb+srv://vinayak:vinayak@cluster0.mjwtrzs.mongodb.net/bus-booking-app?retryWrites=true&w=majority",
      "mongodb://localhost:27017/bus-booking-app?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (e) {
    console.log(`connection error ${e}`);
  }
})();

const db = mongoose.connection;

db.once("open", async () => {
  console.log(`✔ Successfully connected to mongodb database`);
});
db.on("error", () => {
  console.log(`connection error while connection at ${URL}`);
});
