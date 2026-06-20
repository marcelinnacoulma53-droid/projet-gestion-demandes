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
  },

  async put(endpoint, data) {
    const token = localStorage.getItem('token');
    const res = await fetch(API_BASE + endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': 'Bearer ' + token })
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async del(endpoint) {
    const token = localStorage.getItem('token');
    const res = await fetch(API_BASE + endpoint, {
      method: 'DELETE',
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
  getMe: () => api.get('/auth/me'),
  changerIdentifiants: (data) => api.post('/auth/changer-identifiants', data)   // ✅ ajouté
};

// DEMANDES
const demandesAPI = {
  getMesDemandes: () => api.get('/demandes/mes-demandes'),
  creerDemande: (data) => api.post('/demandes', data),
  getDemandeById: (id) => api.get('/demandes/' + id),
  soumettreDemande: (id) => api.post('/demandes/' + id + '/soumettre', {}),
  updateBrouillon: (id, data) => api.put('/demandes/' + id + '/brouillon', data)
};

// WORKFLOW
const workflowAPI = {
  valider: (id, data) => api.post('/workflow/' + id + '/valider', data),
  rejeter: (id, data) => api.post('/workflow/' + id + '/rejeter', data),
  getHistorique: (id) => api.get('/workflow/' + id + '/historique')
};

// NOTIFICATIONS
const notificationsAPI = {
  getMesNotifications: () => api.get('/notifications'),
  marquerLu: (id) => api.put('/notifications/' + id + '/lu', {}),
  toutMarquerLu: () => api.put('/notifications/lire-tout', {}),
  supprimer: (id) => api.del('/notifications/' + id)
};

// DOCUMENTS
const documentsAPI = {
  telecharger: (id) => api.get('/documents/' + id),
  supprimer: (id) => api.del('/documents/' + id)
};
