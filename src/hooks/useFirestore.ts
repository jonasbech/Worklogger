import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  where,
  onSnapshot,
  FirestoreError,
  getDoc
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AppState, Project, Tag, DayLog } from '../types';
import { initialState } from '../utils/constants';

export function useFirestore() {
  const [state, setState] = useState<AppState>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indexesBuilding, setIndexesBuilding] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribers: (() => void)[] = [];

    try {
      // Subscribe to projects
      const projectsQuery = query(
        collection(db, 'projects'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const projectsUnsubscribe = onSnapshot(projectsQuery, 
        (snapshot) => {
          const projects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Project));
          setState(prev => ({ ...prev, projects }));
        },
        (error: FirestoreError) => {
          if (error.code === 'failed-precondition') {
            setIndexesBuilding(true);
          } else {
            setError(error.message);
          }
        }
      );
      unsubscribers.push(projectsUnsubscribe);

      // Subscribe to tags
      const tagsQuery = query(
        collection(db, 'tags'),
        where('userId', '==', auth.currentUser.uid)
      );

      const tagsUnsubscribe = onSnapshot(tagsQuery, 
        (snapshot) => {
          const tags = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Tag));
          setState(prev => ({ ...prev, tags }));
        },
        (error: FirestoreError) => {
          setError(error.message);
        }
      );
      unsubscribers.push(tagsUnsubscribe);

      // Subscribe to logs
      const logsQuery = query(
        collection(db, 'logs'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('date', 'desc')
      );

      const logsUnsubscribe = onSnapshot(logsQuery, 
        (snapshot) => {
          const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as DayLog));
          setState(prev => ({ ...prev, logs }));
          setLoading(false);
        },
        (error: FirestoreError) => {
          if (error.code === 'failed-precondition') {
            setIndexesBuilding(true);
          } else {
            setError(error.message);
          }
        }
      );
      unsubscribers.push(logsUnsubscribe);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setLoading(false);
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [auth.currentUser]);

  const validateProject = async (projectId: string): Promise<boolean> => {
    if (!auth.currentUser) return false;
    
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) return false;
    return projectDoc.data().userId === auth.currentUser.uid;
  };

  const addProject = async (project: Omit<Project, 'id' | 'userId'>) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
      await addDoc(collection(db, 'projects'), {
        ...project,
        userId: auth.currentUser.uid,
      });
    } catch (err) {
      console.error('Failed to add project:', err);
      throw new Error('Failed to add project');
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Omit<Project, 'id' | 'userId'>>) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
      await updateDoc(doc(db, 'projects', projectId), updates);
    } catch (err) {
      console.error('Failed to update project:', err);
      throw new Error('Failed to update project');
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (err) {
      console.error('Failed to delete project:', err);
      throw new Error('Failed to delete project');
    }
  };

  const addTag = async (tag: Omit<Tag, 'id' | 'userId'>) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
      await addDoc(collection(db, 'tags'), {
        ...tag,
        userId: auth.currentUser.uid,
      });
    } catch (err) {
      console.error('Failed to add tag:', err);
      throw new Error('Failed to add tag');
    }
  };

  const deleteTag = async (tagId: string) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
      await deleteDoc(doc(db, 'tags', tagId));
    } catch (err) {
      console.error('Failed to delete tag:', err);
      throw new Error('Failed to delete tag');
    }
  };

  const updateTags = async (tags: Tag[]) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
      await Promise.all(
        tags.map(tag => 
          updateDoc(doc(db, 'tags', tag.id), {
            name: tag.name,
            color: tag.color,
          })
        )
      );
    } catch (err) {
      console.error('Failed to update tags:', err);
      throw new Error('Failed to update tags');
    }
  };

  const addLog = async (log: Omit<DayLog, 'id' | 'userId'>) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
      const isValidProject = await validateProject(log.projectId);
      if (!isValidProject) {
        throw new Error('Invalid project selected');
      }

      await addDoc(collection(db, 'logs'), {
        ...log,
        userId: auth.currentUser.uid,
      });
    } catch (err) {
      console.error('Failed to add log:', err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Failed to add log');
    }
  };

  const updateLog = async (logId: string, updates: Partial<Omit<DayLog, 'id' | 'userId'>>) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
      if (updates.projectId) {
        const isValidProject = await validateProject(updates.projectId);
        if (!isValidProject) {
          throw new Error('Invalid project selected');
        }
      }

      await updateDoc(doc(db, 'logs', logId), updates);
    } catch (err) {
      console.error('Failed to update log:', err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Failed to update log');
    }
  };

  const deleteLog = async (logId: string) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    try {
      await deleteDoc(doc(db, 'logs', logId));
    } catch (err) {
      console.error('Failed to delete log:', err);
      throw new Error('Failed to delete log');
    }
  };

  return {
    state,
    loading,
    error,
    indexesBuilding,
    addProject,
    updateProject,
    deleteProject,
    addTag,
    deleteTag,
    updateTags,
    addLog,
    updateLog,
    deleteLog,
  };
}