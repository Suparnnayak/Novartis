// Mock data service for frontend-only development

// Generate mock trial updates
const generateMockUpdates = (clinicId, count = 10) => {
  const updates = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    updates.push({
      _id: `update_${clinicId}_${i}`,
      clinicId,
      timestamp: new Date(now - i * 24 * 60 * 60 * 1000),
      patientCount: 15 + Math.floor(Math.random() * 15),
      avgFever: 37.0 + Math.random() * 1.5,
      sideEffects: i % 3 === 0 ? ['nausea'] : i % 3 === 1 ? ['headache', 'dizziness'] : [],
      notes: `Daily update ${i + 1}`,
    });
  }
  
  return updates.reverse();
};

// Mock clinic status
const getMockStatus = (clinicId) => {
  const now = new Date();
  const hoursAgo = clinicId === 'clinic2' ? 30 : 12; // clinic2 is delayed
  
  return {
    _id: `status_${clinicId}`,
    clinicId,
    lastUpdateTime: new Date(now - hoursAgo * 60 * 60 * 1000),
    status: hoursAgo > 24 ? 'delayed' : 'on-time',
    riskLevel: clinicId === 'clinic2' ? 'medium' : 'low',
    isAbnormal: clinicId === 'clinic2',
    lastChecked: now,
  };
};

// Mock clinics list
const getMockClinics = () => {
  return [
    getMockStatus('clinic1'),
    getMockStatus('clinic2'),
    getMockStatus('clinic3'),
    getMockStatus('clinic4'),
    getMockStatus('clinic5'),
  ];
};

// Mock analytics
const getMockAnalytics = () => {
  const clinics = getMockClinics();
  const now = new Date();
  
  const delayData = clinics.map(clinic => {
    const hoursSinceUpdate = (now - new Date(clinic.lastUpdateTime)) / (1000 * 60 * 60);
    return {
      clinicId: clinic.clinicId,
      delayHours: Math.max(0, hoursSinceUpdate - 24),
    };
  });
  
  // Generate fever trends
  const feverTrends = {};
  clinics.forEach(clinic => {
    const trend = [];
    for (let i = 0; i < 7; i++) {
      trend.push({
        date: new Date(now - (6 - i) * 24 * 60 * 60 * 1000),
        fever: 37.0 + Math.random() * 1.5,
      });
    }
    feverTrends[clinic.clinicId] = trend;
  });
  
  const riskDistribution = {
    low: clinics.filter(c => c.riskLevel === 'low').length,
    medium: clinics.filter(c => c.riskLevel === 'medium').length,
    high: clinics.filter(c => c.riskLevel === 'high').length,
  };
  
  return {
    delayData,
    feverTrends,
    riskDistribution,
    globalAvgFever: 37.5,
    totalClinics: clinics.length,
    delayedClinics: clinics.filter(c => c.status === 'delayed').length,
  };
};

// Mock alerts
const getMockAlerts = () => {
  return [
    {
      _id: 'alert1',
      clinicId: 'clinic2',
      type: 'delayed',
      message: 'Clinic clinic2 has not submitted an update in over 24 hours',
      severity: 'high',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: false,
    },
    {
      _id: 'alert2',
      clinicId: 'clinic2',
      type: 'abnormal_symptoms',
      message: 'Clinic clinic2 shows abnormal symptom patterns (Fever: 38.5°C, Side Effects: 2)',
      severity: 'medium',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      resolved: false,
    },
  ];
};

// Mock authentication
const mockUsers = {
  clinic: {
    clinic1: { id: '1', clinicId: 'clinic1', email: 'clinic1@demo.com', role: 'clinic' },
    clinic2: { id: '2', clinicId: 'clinic2', email: 'clinic2@demo.com', role: 'clinic' },
  },
  manager: {
    'manager@demo.com': { id: '3', email: 'manager@demo.com', role: 'manager' },
  },
};

export const mockAuth = {
  login: async (data) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (data.role === 'clinic' && data.clinicId && data.password === 'password123') {
      const user = mockUsers.clinic[data.clinicId];
      if (user) {
        return {
          data: {
            token: `mock_token_${user.id}`,
            user,
          },
        };
      }
    } else if (data.role === 'manager' && data.email && data.password === 'manager123') {
      const user = mockUsers.manager[data.email];
      if (user) {
        return {
          data: {
            token: `mock_token_${user.id}`,
            user,
          },
        };
      }
    }
    
    throw { response: { data: { message: 'Invalid credentials' } } };
  },
};

export const mockClinicAPI = {
  submitUpdate: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        message: 'Update submitted successfully',
        update: {
          _id: `update_${Date.now()}`,
          ...data,
          timestamp: new Date(),
        },
      },
    };
  },
  
  getMyUpdates: async (clinicId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: generateMockUpdates(clinicId, 10),
    };
  },
  
  getMyStatus: async (clinicId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: getMockStatus(clinicId),
    };
  },
};

export const mockManagerAPI = {
  getAllClinics: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: getMockClinics(),
    };
  },
  
  getClinicData: async (clinicId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: {
        updates: generateMockUpdates(clinicId, 10),
        status: getMockStatus(clinicId),
      },
    };
  },
  
  getAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: getMockAnalytics(),
    };
  },
  
  getAlerts: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: getMockAlerts(),
    };
  },
  
  resolveAlert: async (alertId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: {
        message: 'Alert resolved',
        alert: { _id: alertId, resolved: true },
      },
    };
  },
};

