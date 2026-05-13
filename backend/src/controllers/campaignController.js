import prisma from '../config/db.js';

export const getCampaigns = async (req, res) => {
  try {
    const now = new Date();
    await prisma.campaign.updateMany({
        where: { restaurantId: req.tenant.id, endDate: { lt: now }, isPopupActive: true },
        data: { isPopupActive: false }
    });

    const campaigns = await prisma.campaign.findMany({
      where: { restaurantId: req.tenant.id },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(campaigns);
  } catch (error) {
    console.error('[Campaign API] Fetch error:', error);
    res.status(500).json({ error: 'Failed to access campaigns matrix' });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const { title, description, price, imageUrl, popupDelay, activeDays } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Campaign title is strictly required' });
    }

    let endDate = null;
    if (activeDays) {
        endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(activeDays));
    }

    const campaign = await prisma.campaign.create({
      data: {
        title,
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(imageUrl && { imageUrl }),
        ...(popupDelay && { popupDelay }),
        ...(endDate && { endDate }),
        restaurantId: req.tenant.id
      }
    });
    
    res.status(201).json(campaign);
  } catch (error) {
    console.error('[Campaign API] Creation error:', error);
    res.status(500).json({ error: 'Failed to initialize campaign algorithm' });
  }
};

export const toggleCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ownership before altering
    const existing = await prisma.campaign.findFirst({
        where: { id, restaurantId: req.tenant.id }
    });

    if (!existing) return res.status(404).json({ error: 'Ghost artifact found. Campaign does not exist.' });

    const updated = await prisma.campaign.update({
        where: { id },
        data: { isPopupActive: !existing.isPopupActive }
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('[Campaign API] Toggle error:', error);
    res.status(500).json({ error: 'State manipulation failure' });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, imageUrl, popupDelay, activeDays } = req.body;
    
    const existing = await prisma.campaign.findFirst({
        where: { id, restaurantId: req.tenant.id }
    });

    if (!existing) return res.status(404).json({ error: 'Campaign does not exist.' });

    let endDate = undefined;
    if (activeDays) {
        endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(activeDays));
    }

    const updated = await prisma.campaign.update({
        where: { id },
        data: {
            ...(title && { title }),
            description: description || null,
            price: price ? parseFloat(price) : null,
            ...(imageUrl && { imageUrl }),
            ...(popupDelay && { popupDelay }),
            ...(endDate !== undefined && { endDate }),
        }
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('[Campaign API] Update error:', error);
    res.status(500).json({ error: 'Update manipulation failure' });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = await prisma.campaign.findFirst({
        where: { id, restaurantId: req.tenant.id }
    });

    if (!existing) return res.status(404).json({ error: 'Campaign already vanished.' });

    await prisma.campaign.delete({ where: { id } });

    res.status(200).json({ message: 'Campaign unlinked successfully.' });
  } catch (error) {
    console.error('[Campaign API] Deletion error:', error);
    res.status(500).json({ error: 'Permanent deletion procedure interrupted' });
  }
};
