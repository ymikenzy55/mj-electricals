const Category = require('../models/Category');
const Product = require('../models/Product');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    // Set a timeout for the entire operation
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout')), 25000)
    );

    const queryPromise = (async () => {
      // Parallel queries for better performance
      const [categories, productCounts] = await Promise.all([
        Category.find({ isActive: true }).sort({ name: 1 }).lean().maxTimeMS(10000),
        Product.aggregate([
          { $match: { status: 'active' } },
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ]).maxTimeMS(10000)
      ]);

      // Create a map for quick lookup
      const countMap = {};
      productCounts.forEach(item => {
        countMap[item._id] = item.count;
      });

      // Add product count to each category
      const categoriesWithCount = categories.map(category => ({
        ...category,
        productCount: countMap[category.name] || 0
      }));

      return categoriesWithCount;
    })();

    const categoriesWithCount = await Promise.race([queryPromise, timeoutPromise]);

    res.json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error('Category fetch error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories'
    });
  }
};

// Create category (Admin only)
exports.createCategory = async (req, res) => {
  try {
    // Check if category already exists (case-insensitive)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: `Category "${req.body.name}" already exists`
      });
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update category (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete category (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
