import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Preset demo credentials for hackathon judges
const PRESET_CREDENTIALS = [
  {
    email: 'admin@careconnect.ai',
    password: 'admin123',
    role: 'admin',
    name: 'System Administrator',
    avatar: '🛠️',
  },
  {
    email: 'dr.smith@careconnect.ai',
    password: 'doc123',
    role: 'doctor',
    name: 'Dr. Aisha Patel',
    avatar: '🩺',
  },
  {
    email: 'student@medu.edu',
    password: 'student123',
    role: 'student',
    name: 'Alex Rivera',
    avatar: '🎓',
  },
  {
    email: 'jane.doe@gmail.com',
    password: 'patient123',
    role: 'patient',
    name: 'Jane Doe',
    avatar: '👤',
  },
];

function generateToken(role) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: `careconnect-${role}-${Date.now()}`,
    role,
    iss: 'careconnect-ai',
    exp: Date.now() + 86400000,
  }));
  const sig = btoa(`${role}-${Math.random().toString(36).slice(2, 10)}`);
  return `${header}.${payload}.${sig}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('careconnect_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [registeredPatients, setRegisteredPatients] = useState(() => {
    try {
      const saved = localStorage.getItem('careconnect_patients');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist user session to localStorage
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('careconnect_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('careconnect_user');
    }
  }, [user]);

  // Persist registered patients to localStorage
  React.useEffect(() => {
    localStorage.setItem('careconnect_patients', JSON.stringify(registeredPatients));
  }, [registeredPatients]);

  const isAuthenticated = !!user;

  const login = useCallback((email, password) => {
    // Check preset credentials
    const preset = PRESET_CREDENTIALS.find(
      c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    if (preset) {
      setUser({
        email: preset.email,
        name: preset.name,
        role: preset.role,
        avatar: preset.avatar,
        token: generateToken(preset.role),
      });
      return { success: true };
    }

    // Check dynamically registered patients
    const registered = registeredPatients.find(
      p => p.email.toLowerCase() === email.toLowerCase() && p.password === password
    );
    if (registered) {
      setUser({
        email: registered.email,
        name: registered.name,
        role: 'patient',
        avatar: '👤',
        token: generateToken('patient'),
        dob: registered.dob,
        allergies: registered.allergies,
        city: registered.city,
      });
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password. Please check your credentials.' };
  }, [registeredPatients]);

  const signup = useCallback((patientData) => {
    // Check for duplicate email
    const allEmails = [
      ...PRESET_CREDENTIALS.map(c => c.email.toLowerCase()),
      ...registeredPatients.map(p => p.email.toLowerCase()),
    ];
    if (allEmails.includes(patientData.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newPatient = {
      id: `PAT-${Date.now().toString().slice(-6)}`,
      name: patientData.name,
      email: patientData.email,
      password: patientData.password,
      dob: patientData.dob,
      allergies: patientData.allergies || [],
      city: patientData.city,
    };

    setRegisteredPatients(prev => [...prev, newPatient]);

    // Auto-login
    setUser({
      email: newPatient.email,
      name: newPatient.name,
      role: 'patient',
      avatar: '👤',
      token: generateToken('patient'),
      dob: newPatient.dob,
      allergies: newPatient.allergies,
      patientId: newPatient.id,
      city: newPatient.city,
    });

    return { success: true };
  }, [registeredPatients]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // Judge escape hatch — instant role switch
  const switchRole = useCallback((role) => {
    const preset = PRESET_CREDENTIALS.find(c => c.role === role);
    if (preset) {
      setUser({
        email: preset.email,
        name: preset.name,
        role: preset.role,
        avatar: preset.avatar,
        token: generateToken(preset.role),
      });
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    switchRole,
    registeredPatients,
    PRESET_CREDENTIALS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { PRESET_CREDENTIALS };
