import prisma from '../config/db.js';

export const getPublicMenu = async (req, res) => {
  try {
    const { slug } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        campaigns: {
          where: { isPopupActive: true }
        },
        categories: {
          orderBy: { orderIndex: 'asc' },
          include: {
            products: {
              where: { isActive: true }, // Respects public frontend hiding logic
              orderBy: { orderIndex: 'asc' }
            }
          }
        }
      }
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Gastronomic identity not located.' });
    }

    // Strip sensitive master tenant data prior to shipping memory to client DOM
    const { password, email, ...safeRestaurantData } = restaurant;

    res.status(200).json(safeRestaurantData);
  } catch (error) {
    console.error('[Menu API Gateway Error]', error);
    res.status(500).json({ error: 'Menu rendering sequence heavily interrupted.' });
  }
};
