import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Firebase configuration (you'll need to add your config)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.addScope('email');
googleProvider.addScope('profile');

class AuthService {
  constructor() {
    this.auth = auth;
    this.db = db;
    this.provider = googleProvider;
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.provider);
      const user = result.user;
      
      // Create or update user profile in Firestore
      await this.createOrUpdateUserProfile(user);
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  async signOutUser() {
    try {
      await signOut(this.auth);
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  // Create or update user profile in Firestore
  async createOrUpdateUserProfile(user) {
    try {
      const userRef = doc(this.db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const userData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (!userSnap.exists()) {
        // Create new user profile
        userData.createdAt = serverTimestamp();
        userData.farmerProfile = {
          location: 'Karnataka',
          farmSize: 'small',
          crops: ['mixed'],
          experience: '',
          category: 'general',
          language: 'en'
        };
        await setDoc(userRef, userData);
      } else {
        // Update existing user
        await updateDoc(userRef, userData);
      }

      return userData;
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  }

  // Get user profile from Firestore
  async getUserProfile(uid) {
    try {
      const userRef = doc(this.db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update farmer profile
  async updateFarmerProfile(uid, profileData) {
    try {
      const userRef = doc(this.db, 'users', uid);
      await updateDoc(userRef, {
        farmerProfile: profileData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating farmer profile:', error);
      throw error;
    }
  }

  // Save crop diagnosis result
  async saveDiagnosisResult(uid, diagnosisData) {
    try {
      const diagnosisRef = doc(this.db, 'diagnoses', `${uid}_${Date.now()}`);
      await setDoc(diagnosisRef, {
        userId: uid,
        ...diagnosisData,
        createdAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error saving diagnosis result:', error);
      throw error;
    }
  }

  // Monitor authentication state
  onAuthStateChange(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Helper method to get user-friendly error messages
  getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing sign-in';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by your browser';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled';
      case 'auth/network-request-failed':
        return 'Network error occurred. Please check your connection';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'An error occurred during sign-in. Please try again';
    }
  }
}

const authService = new AuthService();
export default authService;