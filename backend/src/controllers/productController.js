import prisma from '../config/db.js';

export const createProduct = async (req, res) => {
  try {
    const { 
        categoryId, 
        name_tr, name_en, name_ar,
        desc_tr, desc_en, desc_ar,
        price, imageUrl, orderIndex 
    } = req.body;
    
    if (!name_tr) return res.status(400).json({ error: 'Türkçe ürün ismi zorunludur.' });

    // Verify category belongs to tenant globally
    const category = await prisma.category.findFirst({ 
      where: { id: categoryId, restaurantId: req.tenant.id }
    });
    if (!category) return res.status(404).json({ error: 'Invalid category mapping restricted.' });

    const product = await prisma.product.create({
      data: { 
        categoryId, 
        name_tr, name_en, name_ar,
        desc_tr, desc_en, desc_ar,
        price: parseFloat(price), 
        imageUrl, 
        orderIndex: orderIndex || 0 
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Product compilation failed' });
  }
};

export const getProducts = async (req, res) => {
  try {
    // We navigate downward from tenant -> category -> product
    const products = await prisma.product.findMany({
      where: {
        category: { restaurantId: req.tenant.id }
      },
      orderBy: { orderIndex: 'asc' }
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Fetch logic heavily interrupted' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
        name_tr, name_en, name_ar,
        desc_tr, desc_en, desc_ar, 
        price, imageUrl 
    } = req.body;
    
    const existing = await prisma.product.findFirst({ 
        where: { id, category: { restaurantId: req.tenant.id } }
    });
    if (!existing) return res.status(404).json({ error: 'Permission isolated' });

    const updated = await prisma.product.update({
      where: { id },
      data: { 
          name_tr, name_en, name_ar,
          desc_tr, desc_en, desc_ar, 
          price: parseFloat(price), imageUrl 
      }
    });
    res.status(200).json(updated);
  } catch (error) { res.status(500).json({ error: 'Update pipeline crashed' }); }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = await prisma.product.findFirst({ 
        where: { id, category: { restaurantId: req.tenant.id } }
    });
    if (!existing) return res.status(404).json({ error: 'Permission isolated' });

    await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: 'Product expunged securely' });
  } catch (error) { res.status(500).json({ error: 'Delete pipeline crashed' }); }
};

export const toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findFirst({ 
        where: { id, category: { restaurantId: req.tenant.id } }
    });
    if (!existing) return res.status(404).json({ error: 'Permission isolated' });

    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: !existing.isActive }
    });
    res.status(200).json(updated);
  } catch (error) { res.status(500).json({ error: 'Status toggling offset error' }); }
};

export const updateProductOrder = async (req, res) => {
  try {
    const { items } = req.body; 
    
    const transactionOperations = items.map(item => 
      prisma.product.update({
        where: { id: item.id },
        data: { orderIndex: item.orderIndex }
      })
    );
    
    await prisma.$transaction(transactionOperations);
    res.status(200).json({ message: 'Product stack taxonomy successfully re-indexed.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bulk restructuring failed execution.' });
  }
};
