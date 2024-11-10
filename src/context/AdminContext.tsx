import React, { createContext, useContext, useReducer } from 'react';
import { NewsSource } from '../types';

interface AdminState {
  isAuthenticated: boolean;
  sources: NewsSource[];
}

interface AdminContextType {
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
}

type AdminAction =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'ADD_SOURCE'; payload: NewsSource }
  | { type: 'REMOVE_SOURCE'; payload: string };

const initialState: AdminState = {
  isAuthenticated: false,
  sources: [
    {
      id: 'artificialintelligence-news',
      url: 'https://www.artificialintelligence-news.com/',
      type: 'website',
      selectors: {
        title: 'article h2',
        description: 'article .entry-content p:first-of-type',
        date: 'article .entry-date',
        image: 'article .post-thumbnail img'
      }
    }
  ]
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    case 'ADD_SOURCE':
      return { ...state, sources: [...state.sources, action.payload] };
    case 'REMOVE_SOURCE':
      return {
        ...state,
        sources: state.sources.filter(source => source.id !== action.payload)
      };
    default:
      return state;
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  return (
    <AdminContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}