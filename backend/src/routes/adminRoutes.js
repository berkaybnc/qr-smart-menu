import express from 'express';
import { protectAdminRoute } from '../middlewares/authMiddleware.js';

// Controller Matrix Binding
import { 
  createCategory, getCategories, updateCategory, deleteCategory, updateCategoryOrder 
} from '../controllers/categoryController.js';
import { 
  createProduct, getProducts, updateProduct, deleteProduct, toggleProductStatus, updateProductOrder 
} from '../controllers/productController.js';
import { updateRestaurantSettings, getRestaurantSettings } from '../controllers/restaurantController.js';
import { 
  getCampaigns, createCampaign, toggleCampaign, deleteCampaign, updateCampaign
} from '../controllers/campaignController.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { processProductImage } from '../controllers/uploadController.js';

const router = express.Router();

// Establish protected backend space for current tenant
router.use(protectAdminRoute);

// Tenant Global Logic
router.route('/restaurant')
  .get(getRestaurantSettings)
  .put(updateRestaurantSettings);

// Image uploading logic
router.post('/upload', upload.single('image'), processProductImage);

// Campaigns Logic
router.route('/campaigns')
  .get(getCampaigns)
  .post(createCampaign);
router.route('/campaigns/:id')
  .delete(deleteCampaign)
  .put(updateCampaign);
router.patch('/campaigns/:id/toggle', toggleCampaign);

// Category logic matrix
router.route('/categories')
  .post(createCategory)
  .get(getCategories);
router.route('/categories/:id')
  .put(updateCategory)
  .delete(deleteCategory);
router.post('/categories/reorder', updateCategoryOrder);

// Product logic matrix
router.route('/products')
  .post(createProduct)
  .get(getProducts);
router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);
router.patch('/products/:id/toggle', toggleProductStatus);
router.post('/products/reorder', updateProductOrder);

export default router;
