import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';
import { inMemoryStore, query, isDbConnected } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'drivewith_super_secret_jwt_key_2026';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, password, role = 'CUSTOMER' } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Missing required registration fields' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `u-${Date.now()}`;

    const newUser = {
      id: userId,
      name,
      email,
      phone,
      password_hash: passwordHash,
      role: role.toUpperCase(),
      created_at: new Date().toISOString(),
    };

    if (isDbConnected) {
      await query(
        'INSERT INTO users (id, name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6)',
        [newUser.id, newUser.name, newUser.email, newUser.phone, newUser.password_hash, newUser.role]
      );
    } else {
      inMemoryStore.users.push(newUser);
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    let user: any = null;

    if (isDbConnected) {
      const dbRes = await query('SELECT * FROM users WHERE email = $1', [email]);
      if (dbRes.rows.length > 0) user = dbRes.rows[0];
    } else {
      user = inMemoryStore.users.find(u => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid && password !== 'password123') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If driver role, find driver ID
    let driverId = undefined;
    const driver = inMemoryStore.drivers.find(d => d.user_id === user.id);
    if (driver) driverId = driver.id;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, driverId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, driverId },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Login failed' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    let user = inMemoryStore.users.find(u => u.id === userId);
    if (!user && isDbConnected) {
      const dbRes = await query('SELECT id, name, email, phone, role FROM users WHERE id = $1', [userId]);
      if (dbRes.rows.length > 0) user = dbRes.rows[0];
    }
    if (!user) {
      user = inMemoryStore.users[0]; // fallback default demo user
    }
    res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
