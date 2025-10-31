const mongoose = require("mongoose");

// mongodb+srv://linkedIn_clone_db_user:linkedInClone@cluster0.fxeep9t.mongodb.net/

mongoose
  .connect(
    "mongodb+srv://linkedIn_clone_db_user:linkedInClone@cluster0.fxeep9t.mongodb.net/linkedInClone"
  )
  .then((res) => {
    console.log("Database has been connected successfully");
  })
  .catch((error) => {
    console.log("Error in database connection :", error.message);
  });
