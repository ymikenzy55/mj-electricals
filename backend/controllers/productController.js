const Product = require('../models/Product');

// Get all products with filters
exports.getProducts = async (req, res) => {
  try {
    const { category, minWattage, maxWattage, minPrice, maxPrice, search, status, page = 1, limit = 12 } = req.query;

    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (minWattage || maxWattage) {
      query.wattage = {};
      if (minWattage) query.wattage.$gte = Number(minWattage);
      if (maxWattage) query.wattage.$lte = Number(maxWattage);
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { productId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const productId = await Product.generateProductId();
    
    const product = await Product.create({
      ...req.body,
      productId
    });

    // Emit real-time event
    req.io.emit('product:created', product);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    // Prevent productId modification
    delete req.body.productId;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Emit real-time event
    req.io.emit('product:updated', product);

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Emit real-time event
    req.io.emit('product:deleted', { id: req.params.id });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get related products (same category, exclude current product)
exports.getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    // Get the current product to find its category
    const currentProduct = await Product.findById(id);
    
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find products in the same category, excluding the current product
    const relatedProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: id }, // Exclude current product
      status: 'active' // Only show active products
    })
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products: relatedProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
