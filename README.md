# medTrack - Medication Tracking App

A mobile application built with React Native and Expo that helps patients track their medication intake. This app was developed as part of the Ngoane Health Tech internship application process.

## Features

- **User Authentication**: Sign up, login, and logout functionality
- **Medication Management**: Add, view, and delete medications
- **Medication Tracking**: Mark medications as taken or skipped for different times of day
- **Medication History**: View historical records of medication intake
- **Offline Support**: All data is stored locally on the device
- **Clean UI/UX**: Intuitive interface with visual cues for medication status

## Technical Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform for React Native
- **TypeScript**: Type-safe JavaScript
- **NativeWind**: Tailwind CSS for React Native
- **React Navigation**: Navigation library for React Native
- **React Native Paper**: Material Design components
- **AsyncStorage**: Local storage solution
- **React Hook Form**: Form handling library
- **Date-fns**: JavaScript date utility library

## Design Decisions

1. **Folder Structure**: Organized by feature and type for better scalability
   - `src/components`: Reusable UI components
   - `src/screens`: App screens and pages
   - `src/contexts`: React context providers
   - `src/hooks`: Custom React hooks
   - `src/utils`: Utility functions
   - `src/types`: TypeScript type definitions

2. **State Management**: Used React Context API for authentication state and local storage (AsyncStorage) for persistent data

3. **Styling**: Utilized NativeWind (Tailwind CSS for React Native) for consistent styling and faster development

4. **User Experience**:
   - Color-coded status indicators
   - Intuitive navigation flow
   - Form validation with clear error messages
   - Loading states and empty states
   - Pull-to-refresh functionality

## How to Run

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd medTrack
   ```

2. **Install dependencies**:
   ```
   bun install
   # or
   npm install
   ```

3. **Start the development server**:
   ```
   bun start
   # or
   npm start
   ```

4. **Run on a device or emulator**:
   - Scan the QR code with the Expo Go app on your device
   - Press 'a' to run on an Android emulator
   - Press 'i' to run on iOS simulator (Mac only)
   - Press 'w' to run in web browser

## Future Enhancements

- Push notifications for medication reminders
- Medication adherence analytics and visualizations
- Barcode scanning for adding medications
- Multi-language support
- Cloud sync across devices
- Healthcare provider integration

## License

This project is for demonstration purposes as part of the Ngoane Health Tech internship application.
