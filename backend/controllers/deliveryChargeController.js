const DeliveryCharge = require('../models/DeliveryCharge');

// Get all delivery charges
exports.getDeliveryCharges = async (req, res) => {
  try {
    const { active } = req.query;
    const query = {};
    
    if (active !== undefined) {
      query.active = active === 'true';
    }

    const deliveryCharges = await DeliveryCharge.find(query).sort('city');

    res.json({
      success: true,
      deliveryCharges
    });
  } catch (error) {
    console.error('Get delivery charges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get delivery charges',
      error: error.message
    });
  }
};

// Get delivery charge by city
exports.getDeliveryChargeByCity = async (req, res) => {
  try {
    const { city } = req.params;
    
    const charge = await DeliveryCharge.findOne({
      city: new RegExp(`^${city}$`, 'i'),
      active: true
    });

    if (!charge) {
      return res.status(404).json({
        success: false,
        message: 'Delivery charge not found for this city'
      });
    }

    res.json({
      success: true,
      charge
    });
  } catch (error) {
    console.error('Get delivery charge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get delivery charge',
      error: error.message
    });
  }
};

// Create delivery charge (Admin only)
exports.createDeliveryCharge = async (req, res) => {
  try {
    console.log('=== CREATE DELIVERY CHARGE REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user ? { id: req.user._id, role: req.user.role } : 'No user');
    
    const { city, charge, estimatedDays, active } = req.body;

    console.log('Extracted values:', { city, charge, estimatedDays, active });
    console.log('Types:', { 
      city: typeof city, 
      charge: typeof charge, 
      estimatedDays: typeof estimatedDays, 
      active: typeof active 
    });

    if (!city || charge === undefined || charge === null || charge === '') {
      console.log('Validation failed: Missing city or charge');
      return res.status(400).json({
        success: false,
        message: 'City and charge are required'
      });
    }

    console.log('Checking for existing city...');
    // Check if city already exists
    const existing = await DeliveryCharge.findOne({
      city: new RegExp(`^${city}$`, 'i')
    });

    if (existing) {
      console.log('City already exists:', existing);
      return res.status(400).json({
        success: false,
        message: 'Delivery charge for this city already exists'
      });
    }

    console.log('Creating new delivery charge...');
    
    // Parse and validate numbers
    const parsedCharge = parseFloat(charge);
    const parsedDays = estimatedDays ? parseInt(estimatedDays, 10) : 3;
    
    console.log('Parsed values:', { parsedCharge, parsedDays });
    
    if (isNaN(parsedCharge) || parsedCharge < 0) {
      console.log('Invalid charge value');
      return res.status(400).json({
        success: false,
        message: 'Invalid charge value'
      });
    }
    
    if (isNaN(parsedDays) || parsedDays < 1) {
      console.log('Invalid estimatedDays value, using default');
      parsedDays = 3;
    }
    
    const deliveryChargeData = {
      city: city.trim(),
      charge: parsedCharge,
      estimatedDays: parsedDays,
      active: active !== undefined ? Boolean(active) : true
    };
    console.log('Data to create:', deliveryChargeData);

    const deliveryCharge = await DeliveryCharge.create(deliveryChargeData);
    console.log('Successfully created:', deliveryCharge);

    res.status(201).json({
      success: true,
      message: 'Delivery charge created successfully',
      deliveryCharge
    });
  } catch (error) {
    console.error('=== CREATE DELIVERY CHARGE ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Failed to create delivery charge',
      error: error.message,
      details: error.toString()
    });
  }
};

// Update delivery charge (Admin only)
exports.updateDeliveryCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { city, charge, estimatedDays, active } = req.body;

    const deliveryCharge = await DeliveryCharge.findById(id);

    if (!deliveryCharge) {
      return res.status(404).json({
        success: false,
        message: 'Delivery charge not found'
      });
    }

    // Check if new city name conflicts with existing
    if (city && city !== deliveryCharge.city) {
      const existing = await DeliveryCharge.findOne({
        city: new RegExp(`^${city}$`, 'i'),
        _id: { $ne: id }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Delivery charge for this city already exists'
        });
      }
    }

    if (city) deliveryCharge.city = city;
    if (charge !== undefined) deliveryCharge.charge = Number(charge);
    if (estimatedDays !== undefined) deliveryCharge.estimatedDays = Number(estimatedDays);
    if (active !== undefined) deliveryCharge.active = active;

    await deliveryCharge.save();

    res.json({
      success: true,
      message: 'Delivery charge updated successfully',
      deliveryCharge
    });
  } catch (error) {
    console.error('Update delivery charge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update delivery charge',
      error: error.message
    });
  }
};

// Delete delivery charge (Admin only)
exports.deleteDeliveryCharge = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryCharge = await DeliveryCharge.findById(id);

    if (!deliveryCharge) {
      return res.status(404).json({
        success: false,
        message: 'Delivery charge not found'
      });
    }

    await deliveryCharge.deleteOne();

    res.json({
      success: true,
      message: 'Delivery charge deleted successfully'
    });
  } catch (error) {
    console.error('Delete delivery charge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete delivery charge',
      error: error.message
    });
  }
};
