# 🍔 Foodgo - Mobile Food Delivery Application 🍔

A modern, full-featured cross-platform mobile application for food ordering and delivery built with React Native and TypeScript.

## 🚀 Project Overview

FoodGo is a comprehensive and cross-platform food delivery platform that enables users to browse food items, place orders, track deliveries, and manage their preferences. The app features secure authentication, real-time notifications, personalized experiences, and seamless order management—all designed with a modular, reusable component architecture.

---

## ✨ Core Features

### 📌 Authentication & Security
- **Multi-Provider Login**: Google Sign-In, Facebook Login, and email-based authentication
- **Secure Credentials**: Biometric authentication (Face/Touch ID) via `react-native-biometrics`
- **App Lock**: Optional app-level security with biometric or PIN protection (as fallback)
- **User Profile Management**: Edit profile information and delivery addresses

### 📌 Order Management
- **Browse Restaurants**: Explore food items
- **Advanced Filtering**: Filter products by category, price, ratings, preference or search by name
- **Order Placement**: Multiple payment methods (simulation only)
- **Order History**: Track past orders with detailed information
- **Order Status Tracking**: Real-time order status updates with delivery tracking (simulation only)

### 📌 Personalization & Preferences
- **Favorites System**: Save preferred food items for quick access
- **Theme Support**: Dark/Light mode toggle for comfortable viewing
- **Location Management**: Save and manage multiple delivery addresses(OpenStreetMap-based maps)
- **Preferences Persistence**: All user preferences stored locally with AsyncStorage

### 📌 Communication & Support
- **In-App Chat**: Customer support messaging (simulation only)
- **Push Notifications**: Real-time promotional notifications via Firebase Cloud Messaging
- **Notification Service**: Integrated notification handling for various app events

### 📌 Maps & Location
- **Location Services**: Built-in geolocation support via `react-native-community/geolocation`
- **Google Places Autocomplete**: Address lookup and suggestions
- **Map Integration**: Visual representation of delivery areas and routes

---

## 🏗️ Architecture & Project Structure

```
src/
├── screens/                      # Screen components
│   ├── splashscreen.tsx         # App startup splash screen
│   ├── loginscreen.tsx          # User login interface
│   ├── registerscreen.tsx       # User registration interface
│   ├── applockscreen.tsx        # Biometric/PIN app lock screen
│   ├── homeStack/               # Home navigation stack
│   │   ├── homescreen.tsx       # Food item listing
│   │   ├── productdetailsscreen.tsx  # Selected food item details
│   │   ├── filterScreen.tsx     # Product filtering
│   │   ├── orderscreen.tsx      # Shopping cart & checkout
│   │   ├── paymentsucessModal.tsx   # Payment confirmation
│   │   └── Settings/
│   ├── profileStack/            # Profile navigation stack
│   │   ├── profilescreen.tsx    # User profile display
│   │   └── selectLocationScreen.tsx  # Address management
│   └── tabs/                    # Bottom tab screens
│       ├── favourites.tsx       # Saved items
│       └── customersupport.tsx  # Customer support chat
│
├── components/                   # Reusable UI components
│   ├── card.tsx                 # Generic card component
│   ├── customDetail.tsx         # Detail display component
│   ├── custominput.tsx          # Styled input field
│   ├── custommodal.tsx          # Modal wrapper
│   ├── customOrderCard.tsx      # Order display card
│   ├── customtabbar.tsx         # Custom tab bar navigation
│   ├── google.tsx               # Google Sign-In button
│   └── facebook.tsx             # Facebook Login button
│
├── contexts/                     # Global state management (React Context)
│   ├── AuthContext.tsx          # User authentication state
│   ├── applockContext.tsx       # App lock state
│   ├── chatContext.tsx          # Chat messages state
│   ├── favouritesContext.tsx    # Saved items/restaurants
│   ├── orderContext.tsx         # Order history & cart
│   ├── tabBarAnimationContext.tsx   # Tab bar animations
│   └── themeContext.tsx         # Theme (dark/light mode)
│
├── navigation/                   # Navigation configuration
│   ├── mainTabNavigation.tsx    # Bottom tab navigator
│   ├── homeStackNavigation.tsx  # Home stack navigator
│   ├── profileStackNavigation.tsx   # Profile stack navigator
│   └── types.tsx                # Navigation type definitions
│
├── services/                     # Backend integrations
│   └── notificationService.ts   # Firebase notification handling
│
├── assets/                       # Static resources
│   ├── images/                  # Image assets
│   ├── fonts/                   # Custom fonts
│   ├── privacy-policy.html      # Legal documents
│   └── Assets.xcassets/         # iOS assets
│
├── data/                         # Static data
│   └── carddata.json            # Mock data for testing
│
└── firebaseConfig.ts            # Firebase configuration
```

---

## 🔄 State Management Flow

FoodGo uses **React Context API** for global state management, providing a clean separation of concerns:

### 🔍 Authentication Flow
```
AuthContext
├── User data (uid, email, name, profile picture)
├── Authentication methods (Google, Facebook, Email)
├── Login/Sign-up logic
└── Session persistence via AsyncStorage
```

### 🔍 Order Management Flow
```
OrderContext
├── Order history
├── Order metadata (status, pricing, delivery details)
├── Add order functionality
└── Persistence in AsyncStorage
```

### 🔍 User Preferences Flow
```
Multiple Contexts Working Together:
├── FavouritesContext → Saved items
├── ThemeContext → Dark/light mode preference
├── ChatContext → Message history
├── AppLockContext → Biometric security
└── TabBarAnimationContext → UI animations
```

🖌All contexts are integrated in `App.tsx` as providers wrapping the root navigation component.

---

## 📱 Key Components

### 📌 UI Components
- **Card**: Flexible card container for displaying food items
- **CustomInput**: Styled text input for forms and search
- **CustomModal**: Reusable modal wrapper for alert dialogs
- **CustomOrderCard**: Specialized card for ordered item display
- **CustomTabBar**: Custom bottom navigation bar with animations
- **AuthButtons**: Pre-built Google and Facebook login buttons

### 📌 Context Providers
All contexts are properly integrated and provide hooks for easy consumption:
- `useAuth()` - Access authentication state
- `useOrder()` - Manage orders
- `useFavourites()` - Manage saved items
- `useTheme()` - Control theme(light/dark)
- `useChat()` - Support Chat functionality
- `useAppLock()` - App security

---

## 📸 App Screenshots/Screen Recording

https://drive.google.com/file/d/1iqYQOJwWKClk5j9_rz406ZkU3-XOTgII/view?usp=drive_link
<div style="display: flex; gap: 15px; flex-wrap: wrap;">

  <img src="https://github.com/user-attachments/assets/9065f559-5266-48b3-83ad-21175c18c208"  width="200">
  <img src="https://github.com/user-attachments/assets/4ba28bce-292e-4600-bdfa-4cc874436350" width="200">
  <img src="https://github.com/user-attachments/assets/15077473-4b33-43b7-8a60-2fcf8a454eea"  width="200">
  <img src="https://github.com/user-attachments/assets/3065525b-0515-4e04-9427-819babbff2f2"  width="200">

  <img src="https://github.com/user-attachments/assets/3ddbdbea-9521-4ad8-8f24-3bda800583dd"  width="200">
  <img src="https://github.com/user-attachments/assets/45381bf8-c0e4-415d-aaf5-1c50020cc482"  width="200">
  <img src="https://github.com/user-attachments/assets/c1c50e0b-af5a-452b-b123-a909699be263"  width="200">
  <img src="https://github.com/user-attachments/assets/79383cdb-9dd1-4540-a3bf-ca91ad7da7b9" width="200">

  <img src="https://github.com/user-attachments/assets/c0c420b2-7097-4a1d-b778-ae69d35e6250" width="200">
  <img src="https://github.com/user-attachments/assets/7df2dd27-cd85-4b57-b8de-7dd6043684ef" width="200">
  <img src="https://github.com/user-attachments/assets/3b7a737c-c1a1-455b-bf83-3c75489494f4"  width="200">

</div>


## 💻 Tech Stack

<div style="display: flex; align-items: flex-start;"><img src="https://techstack-generator.vercel.app/react-icon.svg" alt="icon" width="60" height="60" /><img src="https://techstack-generator.vercel.app/ts-icon.svg" alt="icon" width="60" height="60" /></div>

### 🔗 Core Framework
- **React Native** `0.82.1` - Cross-platform mobile development
- **React** `19.1.1` - UI component library
- **TypeScript** `^5.8.3` - Type-safe development

### 🚸 Navigation
- **React Navigation** `^7.1.19` - Navigation library
  - `@react-navigation/stack` - Stack navigation
  - `@react-navigation/bottom-tabs` - Tab-based navigation
  - `@react-navigation/native-stack` - Native stack implementation

### 🔐 Authentication & Security
- **Firebase** `^12.6.0` - Backend services
  - `@react-native-firebase/app` - Firebase core
  - `@react-native-firebase/messaging` - Push notifications
- **Google Sign-In** `@react-native-google-signin/google-signin` `^16.0.0`
- **Facebook SDK** `react-native-fbsdk-next` `^13.4.1`
- **React Native Biometrics** `^3.0.1` - Fingerprint/Face ID
- **React Native Keychain** `^10.0.0` - Secure credential storage

### 📍 Location & Maps
- **React Native Maps** `^1.26.20` - Map integration
- **Geolocation Services**
  - `@react-native-community/geolocation` `^3.4.0`
  - `react-native-geolocation-service` `^5.3.1`
- **Google Places Autocomplete** `react-native-google-places-autocomplete` `^2.6.3`

### 🎯 UI & Styling
- **React Native Linear Gradient** `^2.8.3` - Gradient backgrounds
- **React Native SVG** `^15.14.0` - SVG support
- **React Native Vector Icons** `^10.3.0` - Icon library
- **React Native Reanimated** `^4.2.1` - Advanced animations
- **React Native Modal** `^14.0.0-rc.1` - Modal dialogs
- **React Native Responsive Screen** `^1.4.2` - Responsive design
- **React Native Slider** `^0.11.0` - Slider component

### 📑 Forms & Validation
- **Formik** `^2.4.9` - Form state management
- **Yup** `^1.7.1` - Schema validation

### 📦 Storage & Data
- **AsyncStorage** `@react-native-async-storage/async-storage` `^2.2.0` - Local storage
- **React Native File System** `react-native-fs` `^2.20.0` - File operations

### Additional Libraries
- **React Native Gesture Handler** `^2.29.1` - Gesture support
- **React Native Safe Area Context** `^5.6.2` - Safe area handling
- **React Native Screens** `^4.18.0` - Screen management
- **React Native Tracking Transparency** `^0.1.2` - Privacy tracking
- **React Native WebView** `^13.16.0` - Web content display
- **React Native Image Picker** `^8.2.1` - Photo selection
- **React Native Community Slider** `@react-native-community/slider` `^5.1.1`

### Development Tools
- **Babel** `^7.25.2` - JavaScript transpiler
- **ESLint** `^8.19.0` - Code linting
- **Jest** `^29.6.3` - Testing framework
- **Prettier** `2.8.8` - Code formatting
- **React Native CLI** - Development tools

---

## 🔧 Setup & Installation

### 📌 Prerequisites
- Node.js `>=20`
- React Native CLI
- iOS: Xcode and CocoaPods
- Android: Android Studio and JDK

### 📌 Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foodgo-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Firebase**
   - Place `google-services.json` in `android/app/`
   - Place `GoogleService-Info.plist` in `ios/Foodgo/`

4. **Install pods (iOS)**
   ```bash
   cd ios
   pod install
   cd ..
   ```

5. **Run the app**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

6. **Start Metro Bundler (if not auto-started)**
   ```bash
   npm start
   ```

---


