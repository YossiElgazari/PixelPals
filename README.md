Sure, here is the complete README.md for PixelPals:

---

# PixelPals

PixelPals is a social media platform designed for gamers, offering a unique space to share gaming experiences, follow friends, and engage with the gaming community.

## Features

- **User Profiles**: Customize your profile with a photo, bio, and photos from games.
- **Content Sharing**: Upload screenshots, game photos, and more.
- **Social Interaction**: Follow other users, like posts, and explore.
- **Discover**: Find new gamers and content with search functionality.

## Focus on Authentication

PixelPals prioritizes user security and seamless access through robust authentication mechanisms:
- Secure login and registration with encrypted passwords
- JWT (JSON Web Tokens) for session management
- OAuth integration for Google Sign-In

## Screenshot Login Screen
![image](https://github.com/YossiElgazari/PixelPals/assets/93935281/89ea7cae-b142-4489-81c1-68844f7ab096)

## Technologies Used

- **Frontend**: TypeScript, React Native, CSS, Expo
- **Backend**: Node.js, Express, MongoDB

## Installation

### Frontend

1. **Install Dependencies**:
   ```sh
   cd frontend
   npm install
   ```

2. **Run the Application on Android**:
   ```sh
   npm run android
   ```

3. **Additional Frontend Packages**:
   - `@react-native-google-signin/google-signin` for Google authentication.
   - `axios` for making HTTP requests.

4. **Google Auth Setup**:
   Follow the [guide](https://dev.to/suyashdev/google-authsignin-in-react-native-without-firebase-43n) to set up Google Sign-In without Firebase. Here is a brief summary:
   - Install the necessary packages:
     ```sh
     npm install @react-native-google-signin/google-signin
     ```
   - Configure Google Sign-In in your project:
     ```javascript
     import { GoogleSignin } from '@react-native-google-signin/google-signin';

     GoogleSignin.configure({
       webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // From Google Cloud Console
     });
     ```

### Backend

1. **Install Dependencies**:
   ```sh
   cd backend
   npm install
   ```

2. **Run the Application**:
   ```sh
   npm run dev
   ```

3. **Environment Variables**:
   - Create a `.env` file in the root of the backend directory.
   - Add the necessary environment variables. Below is an example of what your `.env` file might look like:
     ```env
     MONGO_URI=mongodb://localhost:27017/pixelpals
     JWT_SECRET=your_jwt_secret_key
     GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```

### Demo Video

Check out our demo video showcasing the key features of PixelPals:

https://github.com/YossiElgazari/PixelPals/assets/93935281/ad59c4d8-238c-45d3-9dfa-ccd321e86d63

