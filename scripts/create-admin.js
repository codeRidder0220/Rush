
import bcrypt from "bcryptjs";
import connectDB from "../lib/mongodb.js";
import User from "../app/models/User.js";

async function createAdmin() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !email || !password) {
    throw new Error(
      "Set ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD first."
    );
  }

  if (password.length < 12) {
    throw new Error("Admin password must be at least 12 characters.");
  }

  await connectDB();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.role === "admin") {
      console.log("This account is already an admin.");
      return;
    }

    throw new Error(
      "This email already belongs to a normal user. Use a new admin email."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await User.create({
    username,
    email,
    passwordHash,
    role: "admin",
  });

  console.log("Admin account created successfully.");
}

createAdmin()
  .catch((error) => {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect();
  });
