const mongoose = require("mongoose");

const uri =
  "mongodb+srv://dhanush:a4BwFcIPNYjaQWGE@restapi.3xgvyxl.mongodb.net/users?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true, // No effect in Mongoose 6+, kept for compatibility
      useUnifiedTopology: true, // No effect in Mongoose 6+, kept for compatibility
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
