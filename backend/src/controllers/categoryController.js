import prisma from '../config/db.js';

export const createCategory = async (req, res) => {
  try {
    const { name_tr, name_en, name_ar, orderIndex } = req.body;
    
    if (!name_tr) return res.status(400).json({ error: 'Türkçe isim girmek zorunludur.' });

    const category = await prisma.category.create({
      data: { 
        name_tr, name_en, name_ar, 
        orderIndex: orderIndex || 0, 
        restaurantId: req.tenant.id 
      }
    });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Category structural generation failed' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { restaurantId: req.tenant.id },
      orderBy: { orderIndex: 'asc' }
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Fetch logic heavily interrupted' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_tr, name_en, name_ar } = req.body;
    
    // Validate ownership before mutate
    const existing = await prisma.category.findFirst({ where: { id, restaurantId: req.tenant.id }});
    if (!existing) return res.status(404).json({ error: 'Permission isolated' });

    const updated = await prisma.category.update({
      where: { id },
      data: { name_tr, name_en, name_ar }
    });
    res.status(200).json(updated);
  } catch (error) { res.status(500).json({ error: 'Update pipeline crashed' }); }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = await prisma.category.findFirst({ where: { id, restaurantId: req.tenant.id }});
    if (!existing) return res.status(404).json({ error: 'Permission isolated' });

    await prisma.category.delete({ where: { id } });
    res.status(200).json({ message: 'Category expunged securely' });
  } catch (error) { res.status(500).json({ error: 'Delete pipeline crashed' }); }
};

export const updateCategoryOrder = async (req, res) => {
  try {
    const { items } = req.body; 
    
    const transactionOperations = items.map(item => 
      prisma.category.updateMany({
        where: { id: item.id, restaurantId: req.tenant.id },
        data: { orderIndex: item.orderIndex }
      })
    );
    
    await prisma.$transaction(transactionOperations);
    res.status(200).json({ message: 'Category taxonomy successfully re-indexed.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bulk restructuring failed execution.' });
  }
};
