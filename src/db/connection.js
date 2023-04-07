const mongoose = require('mongoose');

// let url = "mongodb://localhost:27017/chat-app?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
let url = "mongodb+srv://prod:prod@cluster1.rc7kh6n.mongodb.net/?retryWrites=true&w=majority";

(async () => {
  try {
    await mongoose.connect(
      url,
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
