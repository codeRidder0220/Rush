
"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import Session from "../app/models/session.js";
import bcrypt from "bcryptjs";
import connectDB from "../lib/mongodb.js";
import User from "../app/models/User.js";


//signup -->
export async function signup(formData) {
  try {
    //Form se values lena
    const username = formData.get("username")?.trim();
    const email = formData.get("email")?.trim().toLowerCase();
    const password = formData.get("password");

    //Basic validation
    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username ||
      !email ||
      !password
    ) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters",
      };
    }

    //Database connection
    await connectDB();

    // Check duplicate email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        success: false,
        message: "Email is already registered",
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Save user
    const user = await User.create({
      username,
      email,
      passwordHash,
    });

    // Create session token
    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    // Save session in database
    await Session.create({
      user: user._id,
      tokenHash,
      expiresAt,
    });

    // Set login cookie
    const cookieStore = await cookies();

    cookieStore.set("rush_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return {
      success: true,
      message: "Account created successfully",
      role: user.role,
    };
  } catch (error) {
    console.error("Signup error:", error.message);

    return {
      success: false,
      message: "Unable to create account",
    };
  }
}

//login -->

export async function login(formData) {
  try {
    const email = formData.get("email")?.trim().toLowerCase();
    const password = formData.get("password");

    // Validate input
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password
    ) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    //Find user in MongoDB
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    //Verify password against stored password hash
    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Generate a random session token
    const token = crypto.randomBytes(32).toString("hex");

    // Store only the token hash in MongoDB
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");


    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await Session.create({
      user: user._id,
      tokenHash,
      expiresAt,
    });

    // 6. Set the original token in an HttpOnly cookie
    const cookieStore = await cookies();

    cookieStore.set("rush_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return {
      success: true,
      message: "Login successful",
      role: user.role,
    };
  } catch (error) {
    console.error("Login error:", error.message);

    return {
      success: false,
      message: "Unable to log in. Please try again.",
    };
  }
}

//logout -->

export async function logout() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("rush_session")?.value;

    if (token) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      await connectDB();
      await Session.deleteOne({ tokenHash });
    }

    cookieStore.delete("rush_session");

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error.message);
    return {
      success: false,
      message: "Logout failed. Please try again.",
    };
  }
}
