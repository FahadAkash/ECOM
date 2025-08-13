# Webhook Integration for Order Approvals

## Overview
This project now includes webhook integration that automatically sends order data to an external service at three different stages:
1. **User Order Placement** - When a user places an order
2. **Admin Approval** - When an admin approves a product order
3. **Admin Delivery Start** - When an admin starts a 10-minute delivery

## How It Works

### 1. User Order Placement Process
- When a user completes checkout and places an order
- Order status is set to 'pending'
- A webhook is automatically triggered with Role: "User"

### 2. Admin Approval Process
- When an admin clicks "Approve Order" in the Admin Order Management interface
- The order status changes from 'pending' to 'approved'
- A webhook is automatically triggered with Role: "Admin"

### 3. Delivery Start Process
- When an admin clicks "Start 10-min Delivery" button
- The order status changes to 'out_for_delivery'
- A third webhook is automatically triggered with Role: "Admin"

### 4. Webhook Endpoint
- **URL**: `https://ecomwebsite.app.n8n.cloud/webhook/headers-pricing`
- **Method**: POST
- **Content-Type**: application/json

### 5. Webhook Payload
The webhook sends the following data structure at all three stages:
```json
{
  "orderId": "ABC123",
  "quantity": 2,
  "price": "220$",
  "Role": "User"
}
```

**Role Values**:
- **"User"** - When user places the order
- **"Admin"** - When admin approves order or starts delivery

### 6. Webhook Features
- **Automatic Retry**: Up to 3 retry attempts with 2-second delays
- **Error Handling**: Comprehensive error logging and failure tracking
- **Persistence**: Webhook history stored in localStorage for debugging
- **Visual Indicators**: Admin interface shows webhook status for all three stages
- **Triple Triggers**: Webhooks fire at user order, admin approval, and delivery start

### 7. Implementation Details

#### Database Integration
- **User Order Webhook**: Triggered in the `createOrder` function when user places order
- **Approval Webhook**: Triggered in the `updateOrderStatus` function when status changes to 'approved'
- **Delivery Webhook**: Triggered in the `startExpressDelivery` function when 10-min delivery starts
- Only fires when appropriate actions occur (prevents duplicate calls)
- Integrated with existing order management workflow

#### Admin Interface Updates
- Added webhook status indicators for all three stages
- Shows "User Order Webhook Sent" badge (purple) for user orders
- Shows "Approval Webhook Sent" badge (blue) for approved orders
- Shows "Delivery Webhook Sent" badge (green) when delivery starts
- Visual feedback for successful webhook delivery at each stage

#### Error Handling
- Retry mechanism for failed webhook calls
- Detailed logging for debugging
- Graceful degradation if webhook service is unavailable
- Separate tracking for user, approval, and delivery webhooks

## Usage

### For Users
1. **Place Order**:
   - Add items to cart and checkout
   - Complete order form
   - Webhook automatically sends order data with Role: "User"

### For Admins
1. **Order Approval**:
   - Navigate to Admin Dashboard → Order Management
   - Find pending orders
   - Click "Approve Order" button
   - Webhook will automatically send order data with Role: "Admin"
   - Look for "Approval Webhook Sent" indicator to confirm delivery

2. **Delivery Start**:
   - For approved orders, click "Start 10-min Delivery"
   - Webhook will automatically send order data with Role: "Admin"
   - Look for "Delivery Webhook Sent" indicator to confirm delivery

### For Developers
The webhook system is implemented in:
- `src/lib/database.ts` - Core webhook logic (user, approval, and delivery)
- `src/components/Admin/AdminOrderManagement.tsx` - UI integration

## Testing
- Check browser console for webhook logs (all three stages)
- Monitor network tab for HTTP requests
- Verify webhook history in localStorage (`deshideal_webhook_history`)
- Look for all three webhook status indicators in admin interface

## Configuration
Currently hardcoded to the specified endpoint. To make it configurable, consider:
- Environment variables for webhook URL
- Configurable retry attempts and delays
- Enable/disable webhook functionality
- Separate endpoints for different webhook types

## Security Considerations
- Webhook endpoint should implement proper authentication
- Consider rate limiting for webhook calls
- Validate webhook responses for security
- Monitor for duplicate webhook calls
- Role-based access control for different webhook types
