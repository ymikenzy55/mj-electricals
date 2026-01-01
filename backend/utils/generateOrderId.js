// Generate unique MJE order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `MJE-${timestamp.slice(-6)}${random}`;
};

module.exports = generateOrderId;
