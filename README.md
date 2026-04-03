# 🍽️ iMaker Restro

### Enterprise Restaurant POS, Inventory & Operations Management System

---

## 📌 Overview

**iMaker Restro** is a comprehensive, real-time **Restaurant POS and Operations Management System** built to streamline and digitize every aspect of restaurant operations.

It provides a unified platform for managing:

* Staff & roles
* Orders & kitchen workflows
* Billing & payments
* Inventory & procurement
* Recipes & costing
* Analytics & reporting

The system is designed for **high performance, scalability, and operational clarity**, making it suitable for everything from small cafés to multi-outlet restaurant chains.

---

## 🚀 Key Capabilities

* ⚡ Real-time order processing & live kitchen updates
* 🔐 Role-based access control (RBAC)
* 🪑 Multi-floor & table management
* 🍳 Smart kitchen/bar routing system
* 💳 Flexible billing & payment handling
* 📦 Advanced inventory & recipe automation
* 📊 Data-driven reports & analytics

---

## 🛠️ Technology Stack

| Layer       | Technology     |
| ----------- | -------------- |
| Frontend    | React JS (18+) |
| Styling     | Tailwind CSS   |
| Icons       | Lucide React   |
| Build Tool  | Vite           |
| HTTP Client | Axios          |
| Routing     | React Router   |

---

## ⚙️ Getting Started

### Prerequisites

* Node.js (v18+)
* npm / yarn

### Installation

```bash id="3pk2h1"
git clone https://github.com/imaker-dev/restro-pos.git
cd restro-pos
npm install
```

### Development

```bash id="a6h7r9"
npm run dev
```

### Production Build

```bash id="m91k2s"
npm run build
```

---

# 🏗️ System Architecture Overview

```id="f0k3d2"
Frontend (React)
    ↓
API Layer (Axios)
    ↓
Backend Services
    ↓
Database
```

---

# 🔄 End-to-End Operational Workflow

```id="v82kd1"
Setup → Inventory → Ingredients → Recipes → Menu → Orders → Billing → Reports
```

---

# 👥 1. Staff Management

A secure and scalable **Role-Based Access Control (RBAC)** system.

### Supported Roles

* Super Admin
* Admin
* Manager
* Captain
* Kitchen Staff
* Bartender
* Cashier

### Features

* Unique login credentials
* PIN-based quick POS login
* Role-based module visibility
* Activity tracking & audit logs

---

# 🍳 2. Station Configuration

Defines how orders are routed within the restaurant.

### Station Types

* Kitchen Station
* Bar Station
* Custom Stations

### Capabilities

* Automatic KOT/BOT generation
* Printer integration
* Staff-to-station mapping
* Real-time order display

---

# 🪑 3. Floor, Section & Table Management

Digitally represents restaurant layout.

### Floor Management

* Unlimited floors
* Custom naming & layout

### Section Management

* AC / Non-AC / Family / VIP / Smoking

### Table Management

* Table capacity & shape
* Merge/split tables
* Live status (Available / Occupied / Reserved)

---

# 💰 4. Tax Configuration

Flexible tax engine for compliance.

* GST (5%, 12%, 18%, 28%)
* VAT & service charges
* Auto CGST/SGST splitting
* Inclusive/exclusive pricing

---

# 🍔 5. Menu & Product Management

### Features

* Category-based organization
* Product variants (size, portion)
* Veg / Non-Veg classification
* Add-on linking
* Station assignment

---

# ➕ 6. Add-On Management

* Customizable add-on groups
* Multi-select / single-select options
* Individual pricing control

---

# 🧾 7. Order Management

## 🔄 Order Lifecycle

```id="x9d2k1"
Order Placed → Validation → Inventory Check → Deduction → Routing → Preparation → Serving
```

### Features

* Multi-station routing
* Live order tracking
* Order modification
* Cancellation with stock reversal

---

# 💳 8. Billing & Checkout

### Payment Methods

* Cash
* Card
* UPI / QR
* Credit

### Features

* Split billing
* Discounts & coupons
* Tax invoice generation
* Auto table reset

---

# 🛍️ 9. Takeaway & Quick Orders

* Counter-based flow
* No table dependency
* Fast billing cycle

---

# 📦 10. Inventory & Recipe Management (Core System)

A fully integrated system ensuring **stock accuracy, cost control, and operational efficiency**.

---

## 🔄 Complete Inventory Workflow

```id="p0d3k9"
Raw Items → Vendors → Units → Purchase Orders → Ingredients → Recipes → Orders → Stock Deduction → Logs & Reports
```

---

## 🔹 10.1 Raw Inventory Items

Define all purchasable materials:

* Onion, Tomato, Cheese, Oil, etc.

### Features

* SKU management
* Cost tracking
* Minimum stock alerts

---

## 🔹 10.2 Vendor Management

* Supplier details
* Contact & GST info
* Purchase history
* Payment terms

---

## 🔹 10.3 Unit Management

Custom measurement units:

| Type     | Examples   |
| -------- | ---------- |
| Weight   | kg, gram   |
| Volume   | liter, ml  |
| Quantity | piece, box |

---

## 🔹 10.4 Purchase Orders

### Workflow

1. Select vendor
2. Add items & quantities
3. Define purchase price
4. Approve order
5. Stock auto-added

---

## 🔹 10.5 Ingredient Management

Convert raw materials into usable ingredients.

### Example

* Raw: Onion (1 kg)
* Ingredient: Chopped Onion
* Yield: 90% usable, 10% waste

### Benefits

* Accurate cost calculation
* Waste tracking
* Real usable quantity

---

## 🔹 10.6 Recipe Management

Create standardized recipes.

### Capabilities

* Multiple ingredients per recipe
* Exact quantity mapping (g/ml/kg)
* Auto cost calculation
* Menu linkage

---

## 🔹 10.7 Prep Recipes (Semi-Finished Goods)

Create reusable intermediate items:

* Sauces
* Gravies
* Marinades

### Workflow

```id="z82kdl"
Raw Items → Ingredients → Prep Recipe → Final Recipe → Menu Item
```

### Benefits

* Faster preparation
* Consistent taste
* Better stock tracking

---

## 🔹 10.8 Automatic Inventory Deduction

When an order is placed:

* Recipe is triggered
* Ingredients deducted automatically
* Real-time stock update

---

## 🔹 10.9 Inventory Logs

Track every movement:

* Purchases
* Consumption
* Wastage
* Adjustments
* Transfers

---

## 🔹 10.10 Stock Dashboard

Real-time monitoring:

* Current stock levels
* Low stock alerts
* Fast/slow moving items
* Inventory valuation

---

# 📊 11. Reports & Analytics

### Sales Reports

* Daily sales
* Item performance
* Category revenue

### Financial Reports

* Tax reports
* Payment breakdown
* Discounts

### Inventory Reports

* Stock valuation
* Usage tracking
* Wastage analysis

### Operational Reports

* Staff performance
* Shift history
* Order cancellations

---

# ⚙️ 12. System Settings

* Outlet configuration
* Role permissions
* Printer setup
* Integrations

---

# 🎯 Target Users

* Restaurants
* Cafés
* Bars
* Multi-floor dining
* Cloud kitchens
* QSR chains

---

# 💡 Business Benefits

## For Owners

* Cost control via inventory tracking
* Profit visibility via recipe costing
* Data-driven decision making

## For Managers

* Real-time operational visibility
* Staff performance monitoring
* Inventory alerts

## For Kitchen Staff

* Clear order instructions
* Faster preparation
* Reduced errors

---

## 🤝 Maintained By

**iMaker Technology Pvt. Ltd.**

---

## 📄 License

This project is **proprietary and confidential**. Unauthorized use is strictly prohibited.

---

## ⭐ Conclusion

iMaker Restro delivers a **complete digital ecosystem for restaurant operations**, combining POS, inventory, and analytics into a single intelligent platform.
