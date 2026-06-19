const API_BASE = 'https://projet-gestion-demandes-backend.onrender.com/api';

const api = {
  async post(endpoint, data) {
    const token = localStorage.getItem('token');
    const res = await fetch(API_BASE + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': 'Bearer ' + token })
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async get(endpoint) {
    const token = localStorage.getItem('token');
    const res = await fetch(API_BASE + endpoint, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    return res.json();
  }
};

// AUTH
const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout', {}),
  getMe: () => api.get('/auth/me')
};

// DEMANDES
const demandesAPI = {
  getMesDemandes: () => api.get('/demandes/mes-demandes'),
  creerDemande: (data) => api.post('/demandes', data),
  getDemandeById: (id) => api.get('/demandes/' + id),
  soumettreDemande: (id) => api.post('/demandes/' + id + '/soumettre', {})
};
