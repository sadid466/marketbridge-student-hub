# 🛒 MarketBridge DIU — Campus Escrow Marketplace

MarketBridge is a student-to-student campus marketplace built for Daffodil International University (DIU). It eliminates peer-to-peer transaction risks using a **OneCard digital escrow system** and **camera-based QR handover verification**.

---

## Key Features

* **Student Authentication:** Secure registration and login restricted to DIU credentials with NextAuth JWT sessions and password hashing (bcryptjs).
* **OneCard Escrow Protection:** When a purchase is initiated, the buyer's funds are moved from their available balance to an escrow lock state—funds are never sent directly to the seller before physical inspection.
* **Handover Verification (QR Code + PIN):**
  * The buyer receives a secure, uniquely generated 6-digit PIN and dynamic QR code voucher upon escrow initiation.
  * The seller scans the buyer's QR code using their device camera or manually inputs the PIN at handover.
  * Verifying releases the locked funds directly into the seller's OneCard balance.
* **Product Catalog & Management:** Browse, search, filter by category, and post new listings with image uploads.
* **Personalized Dashboard:** Track active listings, view pending purchases, monitor OneCard balances, and review escrow transaction history.

---

## Tech Stack & Architecture

* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Next.js Route Handlers (Serverless APIs)
* **Database & ODM:** MongoDB Atlas, Mongoose
* **Authentication:** NextAuth.js (Credentials Provider, JWT Strategy)
* **Hardware/Media Integration:** `@yudiel/react-qr-scanner` (WebRTC camera stream integration)
* **QR Generation:** `qrcode.react`
* **Email Service:** Nodemailer (Password resets and alerts)

---

## Escrow Handover Lifecycle

```text
[Buyer: Clicks Buy]
       │
       ▼
[Balance Locked in Escrow] ───► Generates 6-digit PIN & QR Code
       │
       ▼
[Physical Campus Meeting] ────► Buyer inspects item
       │
       ▼
[Seller Scans QR Code] ───────► Triggers POST /api/escrow/verify
       │
       ▼
[Atomic Database Update]
 ├── Buyer: Escrow In Hold  -> -৳ Amount
 ├── Seller: 1Card Balance -> +৳ Amount
 ├── Trade Status: 'Completed'
 └── Product Status: 'Sold'


 ## Directory Structure

 marketbridge-student-hub/
├── app/
│   ├── api/
│   │   ├── auth/              # NextAuth & registration endpoints
│   │   ├── escrow/            # Escrow creation & verification API
│   │   ├── items/             # Product query and update routes
│   │   └── upload/            # Image upload handler
│   ├── dashboard/             # Profile, balances, and scanner modal
│   ├── escrow/                # Buyer QR voucher & PIN display
│   ├── items/[id]/            # Item details & escrow purchase action
│   ├── login/ & register/     # Authentication screens
│   ├── sell/                  # Post new listing form
│   └── page.js                # Marketplace homepage
├── lib/
│   └── database.js            # Cached global Mongoose connection
├── models/
│   ├── User.js                # User & OneCard balance schema
│   ├── Product.js             # Listing schema
│   └── EscrowTrade.js         # Escrow transaction & PIN schema
└── public/                    # Static assets
```

## Getting Started
1. Clone the Repository
```text
Bash
git clone [https://github.com/sadid466/marketbridge-student-hub.git](https://github.com/sadid466/marketbridge-student-hub.git)
cd marketbridge-student-hub
```
2. Install Dependencies
```text
Bash
npm install
```
3. Configure Environment Variables
Create a .env.local file in the root directory:
```text
Code snippet
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_jwt_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```
4. Run the Development Server
```text
Bash
npm run dev
```
Open http://localhost:3000 in your browser.
