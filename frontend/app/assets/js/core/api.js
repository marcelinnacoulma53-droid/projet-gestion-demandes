const API_BASE = window.API_BASE || 'https://projet-gestion-demandes-backend.onrender.com/api';

function getAuthToken() {
  return sessionStorage.getItem('token') || '';
}

function setAuthSession(token, user) {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user || {}));
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function clearAuthSession() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function getStoredUser() {
  try {
    const val = sessionStorage.getItem('user');
    if (!val) return {};
    const parsed = JSON.parse(val);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch(e) {
    return {};
  }
}

async function parseApiResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json()
    : { message: await res.text() };

  if (!res.ok) {
    return {
      success: false,
      status: res.status,
      message: data.message || 'Erreur serveur'
    };
  }

  return data;
}

function authHeaders(includeJson = false) {
  const token = getAuthToken();
  return {
    ...(includeJson && { 'Content-Type': 'application/json' }),
    ...(token && { 'Authorization': 'Bearer ' + token })
  };
}

const api = {
  async post(endpoint, data) {
    const res = await fetch(API_BASE + endpoint, {
      method: 'POST',
      headers: authHeaders(true),
      body: JSON.stringify(data)
    });
    return parseApiResponse(res);
  },

  async get(endpoint) {
    const res = await fetch(API_BASE + endpoint, {
      headers: authHeaders()
    });
    return parseApiResponse(res);
  },

  async put(endpoint, data) {
    const res = await fetch(API_BASE + endpoint, {
      method: 'PUT',
      headers: authHeaders(true),
      body: JSON.stringify(data)
    });
    return parseApiResponse(res);
  },

  async del(endpoint) {
    const res = await fetch(API_BASE + endpoint, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return parseApiResponse(res);
  }
};

const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout', {}),
  getMe: () => api.get('/auth/me'),
  changerIdentifiants: (data) => api.post('/auth/changer-identifiants', data)
};

const demandesAPI = {
  getMesDemandes: () => api.get('/demandes/mes-demandes'),
  creerDemande: (data) => api.post('/demandes', data),
  getDemandeById: (id) => api.get('/demandes/' + id),
  soumettreDemande: (id) => api.post('/demandes/' + id + '/soumettre', {}),
  updateBrouillon: (id, data) => api.put('/demandes/' + id + '/brouillon', data)
};

const workflowAPI = {
  valider: (id, data) => api.post('/workflow/' + id + '/valider', data),
  rejeter: (id, data) => api.post('/workflow/' + id + '/rejeter', data),
  getHistorique: (id) => api.get('/workflow/' + id + '/historique')
};

const notificationsAPI = {
  getMesNotifications: () => api.get('/notifications'),
  marquerLu: (id) => api.put('/notifications/' + id + '/lu', {}),
  toutMarquerLu: () => api.put('/notifications/lire-tout', {}),
  supprimer: (id) => api.del('/notifications/' + id)
};

const documentsAPI = {
  telecharger: (id) => api.get('/documents/' + id),
  supprimer: (id) => api.del('/documents/' + id)
};
