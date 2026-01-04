const User = require('../models/User');
const Product = require('../models/Product');

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');

    res.json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Use atomic operation to prevent race conditions
    const user = await User.findOneAndUpdate(
      { 
        _id: req.user.id,
        'cart.product': { $ne: productId } // Item not in cart
      },
      {
        $push: { cart: { product: productId, quantity } } // Add new item
      },
      { new: true }
    );

    // If item already exists in cart, increment quantity
    if (!user) {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: req.user.id,
          'cart.product': productId // Item exists in cart
        },
        {
          $inc: { 'cart.$.quantity': quantity } // Atomic increment
        },
        { new: true }
      );
      
      await updatedUser.populate('cart.product');
      
      return res.json({
        success: true,
        cart: updatedUser.cart
      });
    }

    await user.populate('cart.product');

    res.json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Use atomic operation to update cart item quantity
    const user = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        'cart.product': productId
      },
      {
        $set: { 'cart.$.quantity': quantity } // Atomic update
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Item not in cart'
      });
    }

    await user.populate('cart.product');

    res.json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Use atomic operation to remove cart item
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { cart: { product: productId } } // Atomic removal
      },
      { new: true }
    );

    await user.populate('cart.product');

    res.json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    // Use atomic operation to clear cart
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: { cart: [] } // Atomic clear
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
