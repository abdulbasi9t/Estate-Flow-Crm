
import { useState, useEffect } from 'react';
import { Lead, UserProfile, LeadStatus } from '../types';

const STORAGE_KEY_USER = 'estate_flow_active_session';
const STORAGE_KEY_USER_REGISTRY = 'estate_flow_user_registry';

// Master Admin Credentials
const ADMIN_EMAIL = 'Admin123!@gmail.com';
const ADMIN_PWD = 'Admin123!';
const ADMIN_PIN = '8888'; // Secondary Security Layer

export const useCRM = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<(UserProfile & { password?: string })[]>([]);

  useEffect(() => {
    const registry = localStorage.getItem(STORAGE_KEY_USER_REGISTRY);
    const parsedRegistry = registry ? JSON.parse(registry) : [];
    setAllUsers(parsedRegistry);

    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as UserProfile;
      const freshUser = parsedRegistry.find((u: any) => u.id === parsedUser.id);
      if (freshUser) {
        setUser(freshUser);
        loadUserLeads(freshUser.id);
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    }
    setLoading(false);
  }, []);

  const loadUserLeads = (userId: string) => {
    const userLeadsKey = `estate_flow_leads_${userId}`;
    const storedLeads = localStorage.getItem(userLeadsKey);
    setLeads(storedLeads ? JSON.parse(storedLeads) : []);
  };

  const saveLeads = (newLeads: Lead[], userId: string) => {
    if (user && user.id === userId) {
      setLeads(newLeads);
    }
    localStorage.setItem(`estate_flow_leads_${userId}`, JSON.stringify(newLeads));
  };

  const signup = (email: string, password: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim();
    const currentRegistryStr = localStorage.getItem(STORAGE_KEY_USER_REGISTRY);
    const currentRegistry = currentRegistryStr ? JSON.parse(currentRegistryStr) : [];
    
    if (currentRegistry.find((u: any) => u.email.toLowerCase() === cleanEmail.toLowerCase())) {
      return { success: false, message: 'User already exists' };
    }

    const userId = btoa(cleanEmail + Date.now()).substring(0, 10);
    const isAdmin = cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PWD;
    
    const newUser: UserProfile & { password?: string } = { 
      id: userId, 
      email: cleanEmail, 
      password, 
      plan: isAdmin ? 'PRO' : 'FREE', 
      isAdmin 
    };
    
    const updatedRegistry = [...currentRegistry, newUser];
    setAllUsers(updatedRegistry);
    localStorage.setItem(STORAGE_KEY_USER_REGISTRY, JSON.stringify(updatedRegistry));
    
    const { password: _, ...userSession } = newUser;
    setUser(userSession);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userSession));
    loadUserLeads(userId);
    
    return { success: true, message: 'Account created' };
  };

  const login = (email: string, password: string, pin?: string): { success: boolean; message: string; requiresPin?: boolean } => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Master admin security check
    if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      if (password !== ADMIN_PWD) {
        return { success: false, message: 'Invalid credentials' };
      }
      
      // If no pin provided, prompt for one
      if (!pin) {
        return { success: false, message: 'PIN required for admin access', requiresPin: true };
      }

      if (pin !== ADMIN_PIN) {
        return { success: false, message: 'Invalid security PIN' };
      }

      const currentRegistryStr = localStorage.getItem(STORAGE_KEY_USER_REGISTRY);
      let registry = currentRegistryStr ? JSON.parse(currentRegistryStr) : [];
      let adminUser = registry.find((u: any) => u.email.toLowerCase() === cleanEmail);
      
      if (!adminUser) {
        adminUser = { id: 'admin-root-01', email: ADMIN_EMAIL, password: ADMIN_PWD, plan: 'PRO', isAdmin: true };
        registry.push(adminUser);
      } else {
        // Ensure admin flags are always up to date on login
        adminUser.isAdmin = true;
        adminUser.plan = 'PRO';
      }
      
      setAllUsers(registry);
      localStorage.setItem(STORAGE_KEY_USER_REGISTRY, JSON.stringify(registry));

      const { password: _, ...userSession } = adminUser;
      setUser(userSession);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userSession));
      loadUserLeads(adminUser.id);
      return { success: true, message: 'Admin authenticated' };
    }

    // Standard user login logic
    const currentRegistryStr = localStorage.getItem(STORAGE_KEY_USER_REGISTRY);
    const registry = currentRegistryStr ? JSON.parse(currentRegistryStr) : [];
    const foundUser = registry.find((u: any) => u.email.toLowerCase() === cleanEmail && u.password === password);
    
    if (!foundUser) {
      return { success: false, message: 'Invalid credentials' };
    }

    const { password: _, ...userSession } = foundUser;
    setUser(userSession);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userSession));
    loadUserLeads(foundUser.id);
    
    return { success: true, message: 'Logged in' };
  };

  const logout = () => {
    setUser(null);
    setLeads([]);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const updateUserPlan = (userId: string, plan: 'FREE' | 'PRO') => {
    const currentRegistryStr = localStorage.getItem(STORAGE_KEY_USER_REGISTRY);
    const registry = currentRegistryStr ? JSON.parse(currentRegistryStr) : [];
    const updatedRegistry = registry.map((u: any) => u.id === userId ? { ...u, plan } : u);
    
    setAllUsers(updatedRegistry);
    localStorage.setItem(STORAGE_KEY_USER_REGISTRY, JSON.stringify(updatedRegistry));
    
    if (user && user.id === userId) {
      const updatedUser = { ...user, plan };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    }
  };

  const getUserLeads = (userId: string): Lead[] => {
    const key = `estate_flow_leads_${userId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  };

  return {
    leads,
    user,
    loading,
    allUsers,
    login,
    signup,
    logout,
    addLead: (lead: any) => {
      if (!user) return;
      const newLead = { ...lead, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
      saveLeads([...leads, newLead], user.id);
    },
    updateLead: (id: string, updates: any) => {
      if (!user) return;
      saveLeads(leads.map(l => l.id === id ? { ...l, ...updates } : l), user.id);
    },
    deleteLead: (id: string) => {
      if (!user) return;
      saveLeads(leads.filter(l => l.id !== id), user.id);
    },
    updateStatus: (id: string, status: LeadStatus) => {
      if (!user) return;
      saveLeads(leads.map(l => l.id === id ? { ...l, status } : l), user.id);
    },
    setPlan: (plan: 'FREE' | 'PRO') => user && updateUserPlan(user.id, plan),
    updateUserPlan,
    canAddMore: user?.plan === 'PRO' || leads.length < 5,
    isPro: user?.plan === 'PRO',
    getUserLeads
  };
};
