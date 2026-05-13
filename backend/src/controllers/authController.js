import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

export const registerRootTenant = async (req, res) => {
  try {
    const { name, email, password, slug } = req.body;

    if (!name || !email || !password || !slug) {
        return res.status(400).json({ error: 'Missing critical registration data.' });
    }

    const existingTenant = await prisma.restaurant.findFirst({
      where: { OR: [{ email }, { slug }] }
    });

    if (existingTenant) {
      return res.status(409).json({ error: 'Tenant identity collision detected. Email or slug already bound.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // High-grade salt

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        email,
        slug,
        password: hashedPassword,
        // Inherits native schema.prisma defaults (e.g. primaryColor: #a93702)
      }
    });

    res.status(201).json({ 
        message: 'Master Tenant created successfully',
        tenantId: restaurant.id,
        slug: restaurant.slug
    });
  } catch (error) {
    console.error('[Auth Registration Exception]', error);
    res.status(500).json({ error: 'Internal system architecture error during tenant binding.' });
  }
};

import jwt from 'jsonwebtoken';

export const loginRootTenant = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { email }
    });

    if (!restaurant) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isValidPassword = await bcrypt.compare(password, restaurant.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // JWT expires in 24 hours
    const token = jwt.sign(
      { id: restaurant.id, slug: restaurant.slug }, 
      process.env.JWT_SECRET || 'fallback_gastronomic_secret',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Authentication successful',
      token,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        primaryColor: restaurant.primaryColor,
        logoUrl: restaurant.logoUrl,
        currency: restaurant.currency,
        language: restaurant.language
      }
    });

  } catch (error) {
    console.error('[Auth Login Exception]', error);
    res.status(500).json({ error: 'Authentication processing failed.' });
  }
};
