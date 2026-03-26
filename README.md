# Stash - Expense Tracker

Stash is a modern, lightweight, and powerful expense tracking application tailored for mobile devices. Built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**, and wrapped as a native Android APK using **Capacitor**.

## 🌟 Features

- **Term & Budget Management**: Create custom budget periods (terms) with specific start dates and budget goals.
- **Detailed Expense Tracking**: Easily log expenses, categorize them, and track your remaining budget in real-time.
- **Multi-Currency Support**: Switch between multiple global currencies at any time to match your location or preference.
- **Custom Categories**: Manage and personalize your expense categories to fit your lifestyle (add, edit, or delete).
- **Interactive Dashboard**: View visual analytics of your spending and budget limits.
- **Past Budgets History**: Access and review your completed past budget terms and historical spending data.
- **Mobile First**: Fully optimized UI with hamburger menus, dropdowns, and bottom-safe-area padding, ensuring a smooth experience when used as an Android APK.

## 🚀 Technologies Used

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite
- **Mobile Packaging**: Capacitor (Android)

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- Android Studio (for running/building the APK)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server (web):
   ```bash
   npm run dev
   ```

3. Build the project:
   ```bash
   npm run build
   ```

### Building the Android APK

Since this project uses Capacitor to generate an APK, first ensure your web assets are built:
```bash
npm run build
```

Then sync and open the project in Android Studio:
```bash
npx cap sync android
npx cap open android
```
From Android Studio, you can run the app on an emulator or build the final APK for your physical device.
