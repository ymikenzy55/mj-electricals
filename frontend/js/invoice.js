// Invoice Generation Utility
class InvoiceGenerator {
  constructor() {
    this.logoPath = '../mj-images/mj-logo.gif';
  }

  async generateInvoice(orderId) {
    try {
      // Fetch order details
      const response = await api.request(`/orders/${orderId}`);
      const order = response.order;
      const user = response.user || {};

      // Create invoice HTML
      const invoiceHTML = this.createInvoiceHTML(order, user);

      // Open in new window for printing
      const printWindow = window.open('', '_blank');
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();

      // Auto print dialog
      setTimeout(() => {
        printWindow.print();
      }, 500);

      return true;
    } catch (error) {
      console.error('Invoice generation error:', error);
      throw error;
    }
  }

  async downloadInvoice(orderId) {
    try {
      // Fetch order details
      const response = await api.request(`/orders/${orderId}`);
      const order = response.order;
      const user = response.user || {};

      // Create invoice HTML
      const invoiceHTML = this.createInvoiceHTML(order, user);

      // Create blob and download
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MJE-Invoice-${order._id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Invoice download error:', error);
      throw error;
    }
  }

  createInvoiceHTML(order, user) {
    const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-GB');
    const orderDate = new Date(order.createdAt).toLocaleString('en-GB');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${order._id}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Arial', sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #ff6600;
    }
    .company-info {
      flex: 1;
    }
    .company-logo {
      width: 120px;
      height: auto;
      margin-bottom: 15px;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #000;
      margin-bottom: 5px;
    }
    .company-tagline {
      color: #666;
      font-size: 14px;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h1 {
      font-size: 36px;
      color: #ff6600;
      margin-bottom: 10px;
    }
    .invoice-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }
    .meta-section h3 {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 10px;
      letter-spacing: 1px;
    }
    .meta-section p {
      margin: 5px 0;
      color: #333;
      line-height: 1.6;
    }
    .meta-section strong {
      color: #000;
    }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .invoice-table thead {
      background: #f8f8f8;
    }
    .invoice-table th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #ddd;
    }
    .invoice-table td {
      padding: 12px;
      border-bottom: 1px solid #eee;
      color: #555;
    }
    .invoice-table tbody tr:hover {
      background: #fafafa;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .invoice-summary {
      margin-left: auto;
      width: 300px;
      margin-top: 20px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    .summary-row.total {
      border-top: 2px solid #333;
      border-bottom: 3px double #333;
      font-size: 18px;
      font-weight: bold;
      color: #ff6600;
      margin-top: 10px;
      padding-top: 15px;
    }
    .payment-status {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .payment-status.paid {
      background: #d4edda;
      color: #155724;
    }
    .payment-status.pending {
      background: #fff3cd;
      color: #856404;
    }
    .invoice-footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #eee;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .invoice-footer p {
      margin: 5px 0;
    }
    .thank-you {
      text-align: center;
      margin: 30px 0;
      font-size: 18px;
      color: #ff6600;
      font-weight: bold;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .invoice-container {
        box-shadow: none;
        padding: 20px;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="invoice-header">
      <div class="company-info">
        <img src="${this.logoPath}" alt="MJE Logo" class="company-logo" onerror="this.style.display='none'">
        <div class="company-name">MJE E-Commerce</div>
        <div class="company-tagline">Quality Products, Delivered</div>
      </div>
      <div class="invoice-title">
        <h1>INVOICE</h1>
        <p><strong>Invoice #:</strong> ${order._id.slice(-8).toUpperCase()}</p>
        <p><strong>Date:</strong> ${invoiceDate}</p>
      </div>
    </div>

    <!-- Invoice Meta -->
    <div class="invoice-meta">
      <div class="meta-section">
        <h3>Bill To:</h3>
        <p><strong>${user.name || 'Customer'}</strong></p>
        <p>${user.email || ''}</p>
        ${order.shippingAddress ? `
          <p>${order.shippingAddress.street || ''}</p>
          <p>${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''}</p>
          <p>${order.shippingAddress.zipCode || ''}</p>
          <p>${order.shippingAddress.country || ''}</p>
        ` : ''}
      </div>
      <div class="meta-section">
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Order Date:</strong> ${orderDate}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Payment:</strong> <span class="payment-status ${order.paymentStatus}">${order.paymentStatus}</span></p>
        ${order.paymentReference ? `<p><strong>Payment Ref:</strong> ${order.paymentReference}</p>` : ''}
      </div>
    </div>

    <!-- Items Table -->
    <table class="invoice-table">
      <thead>
        <tr>
          <th>Item</th>
          <th class="text-center">Quantity</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td>
              <strong>${item.name}</strong><br>
              <small style="color: #999;">ID: ${item.productId}</small>
            </td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">GH₵ ${item.price.toFixed(2)}</td>
            <td class="text-right">GH₵ ${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Summary -->
    <div class="invoice-summary">
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>GH₵ ${order.subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Delivery Charge:</span>
        <span>GH₵ ${order.deliveryCharge.toFixed(2)}</span>
      </div>
      <div class="summary-row total">
        <span>Total Amount:</span>
        <span>GH₵ ${order.totalAmount.toFixed(2)}</span>
      </div>
    </div>

    <!-- Thank You -->
    <div class="thank-you">
      Thank you for your business!
    </div>

    <!-- Footer -->
    <div class="invoice-footer">
      <p><strong>MJE E-Commerce</strong></p>
      <p>Email: support@mje.com | Phone: +233 XX XXX XXXX</p>
      <p>Website: www.mje.com</p>
      <p style="margin-top: 15px; font-size: 11px;">
        This is a computer-generated invoice and does not require a signature.
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

// Create global instance
const invoiceGenerator = new InvoiceGenerator();
