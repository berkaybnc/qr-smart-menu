import jwt from 'jsonwebtoken';

export const protectAdminRoute = (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, payload token strictly required.' });
  }

  try {
    // Decodes { id, slug } mapped by authController logic
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_gastronomic_secret');
    req.tenant = decoded; 
    next();
  } catch (error) {
    console.error('[Auth Middleware Exception]', error);
    res.status(401).json({ error: 'Not authorized, secure token compromised or expired.' });
  }
};
