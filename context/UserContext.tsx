"use client"; 
import  { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserAPi } from "@/api-endpoints/authendication";

interface UserContextType {
  user: any; 
  isAuthenticated: boolean; 
  isLoading: boolean; 
  error: any; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["gerUserData",userId],
    queryFn: () => getUserAPi(`${userId}`),
    enabled:!!userId
  });

  if(data){
    if (typeof window !== 'undefined') {
        localStorage.setItem('userName', data?.data?.name);
        localStorage.setItem('email', data?.data?.email);
    }
  }

  return (
    <UserContext.Provider
      value={{
        user: data || [],
        isAuthenticated: !!data,
        isLoading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
