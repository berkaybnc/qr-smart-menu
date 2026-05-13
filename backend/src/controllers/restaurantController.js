import prisma from '../config/db.js';

export const getRestaurantSettings = async (req, res) => {
  try {
    const restaurantId = req.tenant.id;
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    // Remove password before sending
    const { password, ...safeData } = restaurant;
    res.status(200).json(safeData);
  } catch (error) {
    console.error('[Restaurant Controller] Fetch Error:', error);
    res.status(500).json({ error: 'Failed to access restaurant data' });
  }
};

export const updateRestaurantSettings = async (req, res) => {
  try {
    const { 
      primaryColor, language, currency, name, ownerName, ownerAvatarUrl, 
      logoUrl, logoBorderRadius,
      qrColor, qrBgColor, qrShape, qrEyeStyle, qrLogoUrl, darkMode,
      locationCity, instagram, whatsapp, operatingHours
    } = req.body;
    // req.tenant.id is injected by protectAdminRoute
    const restaurantId = req.tenant.id;

    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        ...(primaryColor && { primaryColor }),
        ...(language && { language }),
        ...(currency && { currency }),
        ...(name && { name }),
        ...(ownerName !== undefined && { ownerName }),
        ...(ownerAvatarUrl !== undefined && { ownerAvatarUrl }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(logoBorderRadius !== undefined && { logoBorderRadius }),
        ...(qrColor !== undefined && { qrColor }),
        ...(qrBgColor !== undefined && { qrBgColor }),
        ...(qrShape !== undefined && { qrShape }),
        ...(qrEyeStyle !== undefined && { qrEyeStyle }),
        ...(qrLogoUrl !== undefined && { qrLogoUrl }),
        ...(darkMode !== undefined && { darkMode }),
        ...(locationCity !== undefined && { locationCity }),
        ...(instagram !== undefined && { instagram }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(operatingHours !== undefined && { operatingHours }),
      }
    });

    res.status(200).json({ 
        message: 'Identity settings updated securely',
        restaurant: updated 
    });
  } catch (error) {
    console.error('[Restaurant Controller] Update Error:', error);
    res.status(500).json({ error: 'Failed to alter internal state' });
  }
};
