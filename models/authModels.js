const { default: mongoose } = require("mongoose");

class AuthModels {
  static userSchema() {
    return (
      mongoose.models.users ||
      mongoose.model(
        "users",
        new mongoose.Schema(
          {
            name: {
              type: String,
              required: true,
            },
            email: {
              type: String,
              required: true,
              unique: true,
            },
            password: {
              type: String,
              required: true,
            },
            role: {
              type: String,
              enum: ["admin", "user"],
              default: "user",
            },
            tokens: [],
          },
          { timestamps: true }
        )
      )
    );
  }
}
module.exports = AuthModels;
