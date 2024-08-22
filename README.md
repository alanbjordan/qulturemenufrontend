# Digital Menu Application

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Components](#components)
- [Session Management](#session-management)
- [Contributing](#contributing)
- [License](#license)

## Introduction
The Digital Menu application is a React-based web app designed to provide an interactive menu experience for users. It includes various sections like breakfast, bakery, coffee, and more. Users can browse items, add them to their cart, and enjoy a seamless browsing experience.

## Features
- Interactive digital menu with various categories
- Add items to the cart
- Session management with local storage
- User inactivity timeout for session control
- Responsive design with Bootstrap

## Installation
To get started with the Digital Menu application, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/digital-menu.git
   ```

2. **Navigate to the project directory:**
   ```sh
   cd digital-menu
   ```

3. **Install the dependencies:**
   ```sh
   npm install
   ```

4. **Start the development server:**
   ```sh
   npm start
   ```

## Usage
Once the development server is running, you can access the application at `http://localhost:3000`. The menu allows you to browse different categories and add items to your cart. The session data is persisted in local storage and includes a timeout mechanism to clear the session after a period of inactivity.

## Project Structure
```
digital-menu/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── BakeryItems.js
│   │   ├── BreakfastItems.js
│   │   ├── BrunchItems.js
│   │   ├── Cart.js
│   │   ├── ColdPressItems.js
│   │   ├── CoffeeItems.js
│   │   ├── CreatePass.js
│   │   ├── ItalianSodaSoftDrinkItems.js
│   │   ├── Login.js
│   │   ├── SaturdaySpecialItems.js
│   │   ├── SmoothieItems.js
│   │   ├── StaffDashboard.js
│   │   ├── StaffOrders.js
│   │   ├── TeaItems.js
│   │   ├── BackToTopButton.js
│   │   └── ...
│   ├── contexts/
│   │   ├── SessionContext.js
│   ├── images/
│   │   ├── bakery.png
│   │   ├── breakfastPhoto.png
│   │   ├── brunch.png
│   │   ├── coffee.png
│   │   ├── coldpress.png
│   │   ├── italianSoda.png
│   │   ├── menuHeader.png
│   │   ├── saturdaySpecial.png
│   │   ├── smoothie.png
│   │   ├── tea.png
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   └── ...
├── package.json
└── README.md
```

## Components
- **BakeryItems.js:** Displays bakery items.
- **BreakfastItems.js:** Displays breakfast items.
- **BrunchItems.js:** Displays brunch items.
- **Cart.js:** Manages cart items and displays the cart.
- **ColdPressItems.js:** Displays cold press items.
- **CoffeeItems.js:** Displays coffee items.
- **CreatePass.js:** Manages the creation of a pass.
- **ItalianSodaSoftDrinkItems.js:** Displays Italian soda and soft drink items.
- **Login.js:** Manages staff login.
- **SaturdaySpecialItems.js:** Displays Saturday special items.
- **SmoothieItems.js:** Displays smoothie items.
- **StaffDashboard.js:** Staff dashboard component.
- **StaffOrders.js:** Displays staff orders.
- **TeaItems.js:** Displays tea items.
- **BackToTopButton.js:** A button to scroll back to the top.

## Session Management
Session management is handled using React's Context API and local storage. The session data includes cart items and is persisted across page reloads. A timeout mechanism clears the session after 15 minutes of inactivity.

### Context and Provider
The `SessionContext` is created to manage session state globally. The `SessionProvider` initializes session state from local storage and updates it whenever the state changes.

### Timeout Mechanism
A timeout mechanism is implemented to clear the session after a period of inactivity. The timeout is reset on user interactions such as clicks and key presses.

```

