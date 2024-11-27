import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser);
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getUserProfile = async (firebaseUser: User): Promise<UserProfile> => {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: userDoc.exists() ? userDoc.data().displayName : firebaseUser.displayName,
      emailVerified: firebaseUser.emailVerified,
    };
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send verification email
      await sendEmailVerification(firebaseUser);
      
      // Update Firebase Auth profile
      await firebaseUpdateProfile(firebaseUser, { displayName });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email,
        displayName,
        createdAt: new Date().toISOString(),
      });
      
      const userProfile = await getUserProfile(firebaseUser);
      setUser(userProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await getUserProfile(firebaseUser);
      setUser(userProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      throw err;
    }
  };

  const updateProfile = async (displayName: string) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
      await firebaseUpdateProfile(auth.currentUser, { displayName });
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { displayName });
      
      setUser(prev => prev ? { ...prev, displayName } : null);
    } catch (err) {
      throw new Error('Failed to update profile');
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email) throw new Error('Not authenticated');
    
    try {
      // Re-authenticate user before password change
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await firebaseUpdatePassword(auth.currentUser, newPassword);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('auth/wrong-password')) {
          throw new Error('Current password is incorrect');
        }
      }
      throw new Error('Failed to update password');
    }
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (err) {
      throw new Error('Failed to send verification email');
    }
  };

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    const userProfile = await getUserProfile(auth.currentUser);
    setUser(userProfile);
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updatePassword,
    sendVerificationEmail,
    refreshUser,
  };
}