import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_CASE_QUEUE, MOCK_MEDICATIONS } from '../data/mockData';

const AppContext = createContext(null);

const INITIAL_DOCTORS = [
  { id: 'DOC-001', name: 'Dr. Aisha Patel', license: 'MD-2019-4872', specialty: 'Internal Medicine', email: 'dr.smith@careconnect.ai', city: 'San Francisco' },
  { id: 'DOC-002', name: 'Dr. James Lee', license: 'MD-2015-3291', specialty: 'Cardiology', email: 'dr.lee@careconnect.ai', city: 'New York' },
  { id: 'DOC-003', name: 'Dr. Sara Rodriguez', license: 'MD-2020-8814', specialty: 'Neurology', email: 'dr.rodriguez@careconnect.ai', city: 'Miami' },
];

const INITIAL_HOSPITALS = [
  { id: 'HOSP-001', name: 'General Hospital', city: 'San Francisco', address: '100 Medical Plaza, San Francisco, CA' },
  { id: 'HOSP-002', name: 'City Cardiology Center', city: 'New York', address: '450 Lexington Ave, New York, NY' },
  { id: 'HOSP-003', name: 'Miami Neurological Institute', city: 'Miami', address: '880 Biscayne Blvd, Miami, FL' },
  { id: 'HOSP-004', name: 'Chicago Memorial Hospital', city: 'Chicago', address: '303 E Superior St, Chicago, IL' },
];

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const [caseQueue, setCaseQueue] = useState(INITIAL_CASE_QUEUE);
  const [medications, setMedications] = useState(MOCK_MEDICATIONS);
  const [notifications, setNotifications] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [patientDiagnosis, setPatientDiagnosis] = useState(null);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);

  const addCaseToQueue = useCallback((newCase) => {
    setCaseQueue(prev => [newCase, ...prev]);
    addNotification(`New case submitted by ${newCase.patientName}`, 'info');
  }, []);

  const updateCaseStatus = useCallback((caseId, status, decision) => {
    setCaseQueue(prev => prev.map(c =>
      c.id === caseId ? { ...c, status, doctorDecision: decision } : c
    ));
  }, []);

  const toggleMedication = useCallback((medId) => {
    setMedications(prev => prev.map(m =>
      m.id === medId ? { ...m, taken: !m.taken } : m
    ));
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, time: new Date().toLocaleTimeString() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const addDoctor = useCallback((doctorData) => {
    const newDoctor = {
      id: `DOC-${String(Date.now()).slice(-3)}`,
      name: doctorData.name,
      license: doctorData.license,
      specialty: doctorData.specialty,
      email: doctorData.email,
      city: doctorData.city,
    };
    setDoctors(prev => [...prev, newDoctor]);
    addNotification(`System Log: Dr. ${doctorData.name.replace(/^Dr\.\s*/i, '')} provisioned successfully with Vertex AI authorization tokens.`, 'success');
    return newDoctor;
  }, []);

  const addHospital = useCallback((hospitalData) => {
    const newHospital = {
      id: `HOSP-${String(Date.now()).slice(-3)}`,
      name: hospitalData.name,
      city: hospitalData.city,
      address: hospitalData.address,
    };
    setHospitals(prev => [...prev, newHospital]);
    addNotification(`System Log: Hospital ${hospitalData.name} provisioned successfully in ${hospitalData.city}.`, 'success');
    return newHospital;
  }, []);

  const addMedication = useCallback((medData) => {
    const newMed = {
      id: `MED-${String(Date.now()).slice(-3)}`,
      name: medData.name,
      schedule: medData.schedule || 'Daily',
      time: medData.time || '08:00 AM',
      taken: false,
    };
    setMedications(prev => [...prev, newMed]);
    addNotification(`Medication ${medData.name} added successfully`, 'success');
    return newMed;
  }, []);

  const deleteMedication = useCallback((medId) => {
    setMedications(prev => prev.filter(m => m.id !== medId));
    addNotification('Medication removed from tracker', 'info');
  }, []);

  const resetPatientData = useCallback(() => {
    setPatientDiagnosis(null);
    setSelectedCaseId(null);
    setMedications(MOCK_MEDICATIONS);
  }, []);

  const value = {
    darkMode, setDarkMode,
    caseQueue, setCaseQueue, addCaseToQueue, updateCaseStatus,
    medications, toggleMedication, addMedication, deleteMedication,
    notifications, addNotification,
    selectedCaseId, setSelectedCaseId,
    patientDiagnosis, setPatientDiagnosis,
    doctors, addDoctor,
    hospitals, addHospital,
    resetPatientData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
