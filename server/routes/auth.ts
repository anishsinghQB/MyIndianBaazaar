import { RequestHandler } from "express";
import { pool } from "../database/config";
import {
  hashPassword,
  comparePassword,
  generateToken,
  AuthRequest,
} from "../utils/auth";
import { z } from "zod";

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

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, mobile_number, gender) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role`,
      [name, email, hashedPassword, mobileNumber, gender],
    );

    const user = result.rows[0];

    // Generate token
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

    // Find user
    const result = await pool.query(
      "SELECT id, name, email, password, role FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
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

export const getProfile: RequestHandler = async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const result = await pool.query(
      "SELECT id, name, email, mobile_number, gender, role, created_at FROM users WHERE id = $1",
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobile_number,
        gender: user.gender,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const googleAuthCallback: RequestHandler = async (req, res) => {
  try {
    const { googleId, email, name } = req.body;

    // Check if user exists with Google ID
    let result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE google_id = $1",
      [googleId],
    );

    let user;

    if (result.rows.length === 0) {
      // Check if user exists with email
      const emailResult = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email],
      );

      if (emailResult.rows.length > 0) {
        // Update existing user with Google ID
        const updateResult = await pool.query(
          "UPDATE users SET google_id = $1 WHERE email = $2 RETURNING id, name, email, role",
          [googleId, email],
        );
        user = updateResult.rows[0];
      } else {
        // Create new user
        const createResult = await pool.query(
          "INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING id, name, email, role",
          [name, email, googleId],
        );
        user = createResult.rows[0];
      }
    } else {
      user = result.rows[0];
    }

    // Generate token
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
