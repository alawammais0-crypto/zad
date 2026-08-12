# ZAD — Food Delivery Application

[![React Native](https://img.shields.io/badge/React_Native-v0.81-blue?logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-v54.0-black?logo=expo)](https://expo.dev)
[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.3-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

ZAD is a full-stack food delivery application built for Suwayda, Syria. It combines a React Native cross-platform mobile frontend with an ASP.NET Core 10 Web API backend. The system supports multi-category restaurant discovery, interactive cart calculations, real-time order status tracking, digital wallet top-ups, and a loyalty points system.

---

## 📱 Real Application Interfaces

![ZAD Mobile Application Screens](./assets/docs/app_preview.svg)

---

## 🚀 Screen-by-Screen Breakdown

### 1. Animated Splash & Onboarding (`src/app/index.tsx`, `welcome.tsx`)
- Rotational and scale animations using Reanimated 4.
- Delayed entrance effects for action buttons and tagline text.
- Direct redirection to the onboarding walkthrough or home screen.

### 2. Home Feed & Category Discovery (`src/app/(tabs)/home.tsx`)
- Quick category filters: Pizza, Shawarma, Burgers, Broasted Chicken, Grills, Sweets, and Drinks.
- Interactive promotional discount banners.
- Restaurant cards with ratings, cuisine tags, distance indicators, and free delivery markers.

### 3. Restaurant Details & Menu (`src/app/restaurant/[id].tsx`)
- Header banner showing restaurant rating, review count, average delivery duration, and minimum order requirements.
- Category tab bar filters.
- Item list with pricing, descriptions, images, and add-to-cart buttons.

### 4. Shopping Cart & Checkout (`src/app/cart.tsx`)
- Dynamic item quantity adjustment.
- Confirmed delivery address preview.
- Invoice itemization (subtotal, delivery fee, grand total).
- One-tap checkout action triggering order submission, cart reset, points accumulation, and redirection to live tracking.

### 5. Real-Time Order Tracking (`src/app/(tabs)/orders.tsx`)
- Live status workflow (`Preparing 👨‍🍳` ➔ `Out for Delivery 🛵` ➔ `Delivered 🎉`).
- Estimated arrival countdown timer and progress indicator.
- Direct driver phone call trigger (`📞 Call Delivery Driver`).
- One-tap re-order button to repopulate the cart with items from previous orders.

### 6. Account, Wallet & Profile Modals (`src/app/(tabs)/profile.tsx`)
- **Edit Profile**: Modify user full name, email, phone number, and avatar presets with instant store updates.
- **Address Manager**: Manage default and additional delivery addresses.
- **Payment & Wallet**: Choose payment method (Cash on Delivery, Syriatel Cash, Card) and recharge wallet balance (+10,000, +25,000, +50,000 SYP).
- **Golden Rewards**: Earn 10 points per 1,000 SYP spent and convert 1,000 points into a 10,000 SYP wallet discount.
- **Support & FAQs**: Searchable accordion view covering frequent questions and direct support channels (WhatsApp & Phone).

---

## 🏗️ System Architecture

```text
zad/
├── assets/                         # Documentation graphics & screen SVG previews
│   └── docs/
│       ├── app_preview.svg         # Real UI 6-screen banner
│       ├── screen_splash.svg       # Splash screen graphic
│       ├── screen_home.svg         # Home feed graphic
│       ├── screen_menu.svg         # Restaurant menu graphic
│       ├── screen_cart.svg         # Cart & invoice graphic
│       ├── screen_orders.svg       # Order tracking graphic
│       └── screen_profile.svg      # Account & modal graphic
│
├── backend/                        # ASP.NET Core 10 Web API
│   ├── YallaFood.Api/              # Controllers, Middlewares, Program.cs
│   ├── YallaFood.Application/      # Application Services, Interfaces, DTOs
│   ├── YallaFood.Domain/           # Core Entities (User, Order, Restaurant, Product)
│   ├── YallaFood.Infrastructure/   # DbContext, Migrations, Seed Data
│   └── YallaFood.slnx              # Solution file
│
└── zad-app/                        # React Native Mobile App
    ├── src/
    │   ├── app/                    # Expo Router file-based pages
    │   ├── components/             # Reusable UI elements
    │   ├── features/               # Modals & feature modules
    │   ├── store/                  # Zustand stores (Auth, Cart, Orders, Favorites)
    │   └── theme/                  # Design tokens (Colors, Typography, Spacing)
    └── package.json
```

---

## ⚙️ Tech Stack

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

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user and return JWT bearer token |
| `GET` | `/api/v1/restaurants` | Retrieve active restaurant listings with rating filters |
| `GET` | `/api/v1/products/category/{id}` | Fetch menu products by category ID |
| `POST` | `/api/v1/orders` | Submit a new order |
| `GET` | `/api/v1/orders/user/{id}` | List user active orders and past history |
| `PUT` | `/api/v1/user/profile` | Update profile information and delivery addresses |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+)
- .NET 10 SDK
- SQL Server LocalDB

### 1. Run Backend Web API

```bash
cd backend/YallaFood.Api
dotnet run
```
The API server runs at `http://localhost:5086` with Swagger available at `http://localhost:5086/swagger`.

### 2. Run Mobile App

```bash
cd zad-app
npm install
npx expo start
```
Press `w` to open in browser, `a` for Android Emulator, or scan the QR code using Expo Go on a mobile device.

---

## 👤 Author

Developed by **Mais Alawam** ([@alawammais0-crypto](https://github.com/alawammais0-crypto)).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
