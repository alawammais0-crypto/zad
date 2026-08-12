# ZAD — Food Delivery Application

[![React Native](https://img.shields.io/badge/React_Native-v0.81-blue?logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-v54.0-black?logo=expo)](https://expo.dev)
[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.3-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

ZAD is a full-stack food delivery application built for Suwayda, Syria. It combines a React Native cross-platform mobile frontend with an ASP.NET Core 10 Web API backend. The system supports multi-category restaurant discovery, interactive cart calculations, real-time order status tracking, digital wallet top-ups, and a loyalty points system.

---

## Application Screenshots & Interface Breakdown

![ZAD Mobile Application Screens](./assets/docs/app_preview.svg)

### Complete Screen Architecture

| # | Screen | Description | Path |
| :-: | :--- | :--- | :--- |
| **1** | **Splash & Onboarding** | Animated entrance screen featuring a pulsing halo rotation, floating brand emblem, and smooth onboarding redirect. | `src/app/index.tsx`<br>`src/app/(onboarding)/welcome.tsx` |
| **2** | **Home & Discovery** | Main feed displaying delivery location, search bar, active category chips, promotional banner slideshow, and top-rated restaurant listings. | `src/app/(tabs)/home.tsx` |
| **3** | **Food Categories** | Categorized listings for Pizza, Shawarma, Burgers, Broasted Chicken, Grills, Desserts, and Drinks. | `src/app/category/index.tsx`<br>`src/app/category/[id].tsx` |
| **4** | **Restaurant & Menu** | Detailed restaurant page showcasing ratings, delivery times, category tab filters, and menu items with quick add-to-cart buttons. | `src/app/restaurant/[id].tsx` |
| **5** | **Cart & Checkout** | Interactive shopping cart supporting item quantity adjustments, delivery address confirmation, subtotal/fee breakdown, and cash/wallet payment selection. | `src/app/cart.tsx` |
| **6** | **Live Order Tracking** | Active order dashboard with a step-by-step progress indicator (`Order Received` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`), direct driver hotline, and order history. | `src/app/(tabs)/orders.tsx` |
| **7** | **Offers & Discounts** | Dedicated promotions feed displaying active coupons, percentage discounts, and free delivery vouchers. | `src/app/(tabs)/offers.tsx` |
| **8** | **Account & Profile** | User dashboard presenting total points, completed orders, and digital wallet balance. | `src/app/(tabs)/profile.tsx` |
| **9** | **Profile Modals** | Slide-up modals for Edit Profile, Address Management, Payment & Wallet Top-up, Favorite Restaurants, Rewards, and Help Center. | `src/features/profile/*.tsx` |

---

## Interactive Features & Modals

### 1. Edit Profile Modal (`EditProfileModal.tsx`)
- Form inputs for user full name, email address, and mobile phone number.
- Avatar preset selector with immediate synchronization across global state.

### 2. Delivery Address Manager (`AddressesModal.tsx`)
- Address list view distinguishing default and secondary delivery locations.
- Form to add new addresses with region name, street address, building floor, and delivery instructions.
- One-tap default address toggle and deletion options.

### 3. Payment Methods & Digital Wallet (`PaymentMethodsModal.tsx`)
- Payment selector supporting Cash on Delivery (COD), ZAD Wallet Balance, Syriatel Cash, and Bank Cards.
- Wallet top-up controls with quick recharge presets (+10,000, +25,000, +50,000 SYP).

### 4. Loyalty Rewards Program (`RewardsModal.tsx`)
- Points balance tracker earning 10 points for every 1,000 SYP spent.
- Redemption mechanism converting 1,000 points into a 10,000 SYP wallet credit.
- Gold Member perks overview (free delivery on eligible orders, priority preparation).

### 5. Help Center & FAQs (`HelpCenterModal.tsx`)
- Instant search filter for support topics.
- Expandable accordion views covering order tracking, local payment options, order cancellation, and rewards.

### 6. Customer Support (`ContactUsModal.tsx`)
- Quick action buttons for direct phone support (`+963 999 000 111`) and WhatsApp chat (`+963 988 111 222`).
- Feedback and inquiry form submission.

---

## System Architecture

```text
zad/
├── assets/                         # SVG graphics and UI previews
│   └── docs/app_preview.svg
│
├── backend/                        # ASP.NET Core 10 Web API
│   ├── YallaFood.Api/              # API Controllers, Middlewares, Program.cs
│   ├── YallaFood.Application/      # Application Services, Interfaces, DTOs
│   ├── YallaFood.Domain/           # Entities (User, Order, Restaurant, Product)
│   ├── YallaFood.Infrastructure/   # DbContext, Migrations, Initial Seed
│   └── YallaFood.slnx              # Solution Manifest
│
└── zad-app/                        # React Native Mobile App
    ├── src/
    │   ├── app/                    # File-based routes (Tabs, Cart, Onboarding)
    │   ├── components/             # Reusable UI cards, badges, and headers
    │   ├── features/               # Feature-specific modals and components
    │   ├── store/                  # Zustand stores (Auth, Cart, Orders, Favorites)
    │   └── theme/                  # Design tokens (Colors, Typography, Spacing)
    └── package.json
```

---

## Tech Stack

### Mobile Frontend
- **Framework**: [Expo](https://expo.dev) (v54) with **React Native** (v0.81)
- **Routing**: **Expo Router** (File-based navigation)
- **State Management**: **Zustand**
- **Animations**: **React Native Reanimated 4**
- **Type Checking**: **TypeScript**

### Backend API
- **Framework**: **ASP.NET Core 10 Web API**
- **Database ORM**: **Entity Framework Core 10** with **SQL Server**
- **Architecture**: **Clean Architecture**
- **Logging**: **Serilog**
- **Documentation**: **Swagger / OpenAPI**

---

## API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user and return JWT bearer token |
| `GET` | `/api/v1/restaurants` | Retrieve active restaurant listings with rating filters |
| `GET` | `/api/v1/products/category/{id}` | Fetch menu products by category ID |
| `POST` | `/api/v1/orders` | Submit a new order |
| `GET` | `/api/v1/orders/user/{id}` | List user active orders and past history |
| `PUT` | `/api/v1/user/profile` | Update profile information and delivery addresses |

---

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- .NET 10 SDK
- SQL Server LocalDB

### 1. Run Backend Web API

```bash
cd backend/YallaFood.Api
dotnet run
```
The Web API server runs at `http://localhost:5086` with Swagger available at `http://localhost:5086/swagger`.

### 2. Run Mobile App

```bash
cd zad-app
npm install
npx expo start
```
Press `w` to open in browser, `a` for Android Emulator, or scan the QR code using Expo Go on a mobile device.

---

## Author

Developed by **Mais Alawam** ([@alawammais0-crypto](https://github.com/alawammais0-crypto)).

---

## License

This project is licensed under the [MIT License](LICENSE).
