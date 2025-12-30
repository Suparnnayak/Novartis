// Using mock data for frontend-only development
import { mockAuth, mockClinicAPI, mockManagerAPI } from './mockData';

// Auth API
export const authAPI = {
  register: async (data) => {
    // Mock registration - just return success
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { message: 'Registration successful' } };
  },
  login: mockAuth.login,
};

// Clinic API
export const clinicAPI = {
  submitUpdate: async (data) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return mockClinicAPI.submitUpdate({ ...data, clinicId: user.clinicId });
  },
  getMyUpdates: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return mockClinicAPI.getMyUpdates(user.clinicId);
  },
  getMyStatus: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return mockClinicAPI.getMyStatus(user.clinicId);
  },
};

// Manager API
export const managerAPI = {
  getAllClinics: mockManagerAPI.getAllClinics,
  getClinicData: mockManagerAPI.getClinicData,
  getAnalytics: mockManagerAPI.getAnalytics,
  getAlerts: mockManagerAPI.getAlerts,
  resolveAlert: mockManagerAPI.resolveAlert,
};

