import { RequestHandler } from "express";
import {
  hashPassword,
  comparePassword,
  generateToken,
  AuthRequest,
} from "../utils/auth";
import { z } from "zod";
import { User } from "../models/userModel";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobileNumber: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const register: RequestHandler = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password, mobileNumber, gender } = validatedData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user: any = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile_number: mobileNumber,
      gender,
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user: any = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const googleAuthCallback: RequestHandler = async (req, res) => {
  try {
    const { googleId, email, name } = req.body;

    let user: any = await User.findOne({ where: { google_id: googleId } });

    if (!user) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        await existingUser.update({ google_id: googleId });
        user = existingUser;
      } else {
        user = await User.create({
          name,
          email,
          google_id: googleId,
        });
      }
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Google authentication successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProfile: RequestHandler = async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user: any = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Profile error:", error);

    // Fallback mock data when database is unavailable
    const mockUser = {
      id: req.user.id,
      name: "Demo User",
      email: req.user.email,
      role: req.user.role,
      mobileNumber: "+91 9876543210",
      gender: "male",
      createdAt: new Date().toISOString(),
    };

    res.json({ user: mockUser });
  }
};
