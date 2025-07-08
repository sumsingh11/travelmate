# Travel Mate 

## 🚀 Description:
Travel Mate is a powerful, intuitive trip planning application that allows users to seamlessly organize every aspect of their vacation. Whether you're traveling solo or with a group, Travel Mate helps manage key aspects like flights, accommodations, daily activities, budgets, and detailed itineraries. The application is built using React, ensuring a smooth and responsive user experience.

With its user-friendly interface and interactive features, such as a drag-and-drop itinerary builder, live budget tracking, and the ability to import/export your trip data in JSON format, Travel Mate makes it easier than ever to plan your dream vacation.

Travel Mate's key strength lies in its flexibility, enabling users to adjust their trip details on the fly while also storing everything in the browser for later reference. Whether you're planning a weekend getaway or an extended international adventure, Travel Mate is your ideal travel companion.

## 🛠️ Technologies Used:
**Stack:**  
- **Frontend:**  
  The application is built with **React** for the user interface, allowing for a dynamic, component-based architecture. It utilizes **React Router** for seamless navigation between different sections of the application. **Bootstrap 5** is used for styling, ensuring that the app is mobile-responsive and visually appealing across all devices.  

- **State Management:**  
  For now, **MongoDB Atlas** and **LocalStorage** are used to persist trip data in the user's browser. This allows the app to retain the trip details even after the user leaves or reloads the page. In the future, there are plans to integrate a backend database (MongoDB Atlas) to store and manage trip data online, providing more secure and scalable storage.

- **Styling:**  
  **Bootstrap 5** and **CSS** have been utilized for layout and styling. This ensures a modern, clean, and responsive interface that adapts well to various screen sizes.

- **Version Control:**  
  All code for the project is managed using **Git** for version control, with the repository hosted on **GitHub** for easy collaboration and management.

## 📚 Skills & Concepts Applied:
This project showcases a range of concepts and techniques that were applied to ensure the application's functionality and responsiveness:

- **React Component Architecture:**  
  The app is organized into modular, reusable components, which makes the codebase more maintainable and scalable. This also enhances code reusability and separation of concerns.

- **State Management with LocalStorage:**  
  MongoDB Atlas and LocalStorage are used to persist trip data in the user's browser. This allows the app to retain the trip details even after the user leaves or reloads the page. In the future, there are plans to integrate a backend database serves as a simple form of state management for the app. Trip details such as destination, duration, and traveler info are stored in the user's browser, allowing them to continue their trip planning without losing their progress.

- **React Hooks (useState, useEffect, useCallback):**  
  React hooks are used to manage the app's state and side effects. `useState` is used to store and update the state, while `useEffect` handles side effects like fetching data or syncing with LocalStorage. `useCallback` is used to memoize event handlers to prevent unnecessary re-renders.

- **Drag-and-Drop Functionality:**  
  The app features a drag-and-drop itinerary builder, allowing users to effortlessly organize and schedule their activities in a visual and interactive way.

- **Error Handling & Form Validation:**  
  To enhance the user experience, the app includes robust error handling for user inputs. Alerts are shown if the user attempts to submit incomplete or invalid data. This ensures that users are always informed of any issues.

## 📖 How to Use Travel Mate:
Using Travel Mate is easy and intuitive, whether you're creating a new trip from scratch or importing an existing plan.

### 1. **Set Up Your Trip:**
   Start by entering basic trip details such as your destination, the number of days you'll be traveling, and the number of travelers in your group. You can edit these details later through the "Edit Trip" section at any time.

### 2. **Manage Activities:**
   Add activities to your "Available Activities" pool. For each activity, you can include relevant details like the cost and the time required for the activity. Once the activities are added, you can use the drag-and-drop functionality to easily move them into the **Daily Itinerary**. You can also schedule the exact times for each activity, ensuring a structured and efficient trip.

### 3. **Track Budgets & Costs:**
   The application provides real-time budget tracking, allowing users to see a breakdown of trip expenses. You can add flights, stays, and additional expenses in the **Trip Overview** section, and the app will automatically calculate how much you’ve spent or are expected to spend.

### 4. **Save, Export, & Share Your Trip:**
   Travel Mate automatically saves your trip details in **LocalStorage** to ensure that you don’t lose your progress. If you'd like to share your trip or back it up, you can export the trip plan as a **JSON file**. This allows you to save or share the file with others, and you can also import the file at any time to resume planning.

## 📊 Features:
The Travel Mate app comes with a variety of features that help you plan your trip in a more structured, efficient, and fun way:

### 🔥 **Core Features:**
- **User Authentication:**  
  A secure login system will be added, enabling users to save and manage their trips across different devices.

- **Import/Export Functionality:**  
  Import and export your trip data using **JSON files**, making it easy to share your plans or resume where you left off.

- **Mobile-Friendly:**  
  Travel Mate is optimized for both desktop and mobile use, ensuring that you can plan your trip anytime, anywhere.

- **Cloud Database Integration:**  
  Cloud database MongoDB Atlas is used to store and manage trip data online, providing more secure and scalable storage. for more secure, scalable data storage. This will allow users to store trip details online and access them from anywhere. 

- **Trip Overview:**  
  View your entire trip in one place. The **Trip Overview** section includes flights, accommodations, additional expenses, and your overall budget, helping you manage everything efficiently.

- **Activity Management:**  
  Add, edit, and remove activities from your trip. This feature allows you to manage your daily schedule and ensure everything runs smoothly.

- **Daily Itineraries:**  
  The app offers a **calendar-style planner** where you can schedule your activities, visualize your itinerary, and ensure your trip remains organized.

- **Drag & Drop Functionality:**  
  Easily rearrange activities in your itinerary using the drag-and-drop feature. This lets you plan your day without any hassle.

- **Budget Tracking:**  
  Track expenses for individual travelers or for the group as a whole. The app automatically calculates expenses and updates the budget as new items are added.

- **To-Do List:**  
  Create and track travel-related tasks, helping you stay organized before and during your trip.

- **Real-Time Data Saving:**  
  Your trip data is saved instantly, so no progress is ever lost. Whether you’re planning on the go or revisiting the app later, your data is always up-to-date.


## 🏗 **Future Enhancements:**
While Travel Mate currently provides excellent trip planning features, there are some exciting features planned for future releases:

- **Trip Collaboration:**  
  Users will be able to collaborate on trips with friends or family in real-time, allowing multiple people to work together on the same trip plan.

- **Flight & Hotel API Integration:**  
  Real-time travel data (flights, hotels, etc.) will be fetched from APIs, providing up-to-date pricing, availability, and other travel information.

- **AI-Powered Recommendations:**  
  The app will offer AI-driven suggestions for activities, budget optimizations, and the most efficient schedule based on user preferences and trip data from Home page.

- **Expense Splitting:**  
  A new feature will allow users to split trip costs among travelers, making it easier to manage expenses during the trip.

## 🏃 **How to Run the Project Locally:**
To get started with Travel Mate locally, follow below steps:

1. **Clone the Repository:**  
   Clone the Travel Mate repository to your local machine:
   ```bash
   git clone https://github.com/sumsingh11/Travel-Mate.git

2. **Install Dependencies:**  
   Navigate to the project directory and install the required dependencies for both **Client** and **Server**:
   ```bash
   cd Travel Mate
   npm install
   ```
3. **Start the Development Server:**  
   Start the development server to run the application:
   ```bash
   npm run start
   ```
4. **Open the Application:**  
   Open your web browser and navigate to `http://localhost:3000`/ `http://localhost:3001` or change accordingly in the **ENV** files to access the Travel Mate application.
   If the application is not running, please check the logs for any errors and ensure that the dependencies are installed correctly.
