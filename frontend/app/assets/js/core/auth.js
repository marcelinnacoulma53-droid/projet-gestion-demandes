// Connexion
async function login(email, motDePasse) {
  try {
    const data = await authAPI.login({ email, mot_de_passe: motDePasse });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirection selon le rôle
      const role = data.user.role;
      if (role === 'etudiant') window.location.href = '../dashboard/etudiant.html';
      else if (role === 'secretaire') window.location.href = '../dashboard/staff.html?role=secretaire';
      else if (role === 'sp') window.location.href = '../dashboard/sp.html';
      else if (role === 'da') window.location.href = '../dashboard/staff.html?role=da';
      else if (role === 'enseignant') window.location.href = '../dashboard/enseignant.html';
      else if (role === 'directrice') window.location.href = '../dashboard/staff.html?role=directrice';
      else if (role === 'scolarite') window.location.href = '../dashboard/staff.html?role=scolarite';
      else if (role === 'admin') window.location.href = '../dashboard/admin.html';
    } else {
      document.getElementById('errorMsg').textContent = data.message || 'Identifiants incorrects.';
    }
  } catch(e) {
    document.getElementById('errorMsg').textContent = 'Erreur de connexion au serveur.';
  }
}

// Inscription
async function register(formData) {
  try {
    const data = await authAPI.register(formData);
    if (data.success) {
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Erreur lors de l\'inscription.');
    }
  } catch(e) {
    alert('Erreur de connexion au serveur.');
  }
}

// Déconnexion
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '../auth/login.html';
}

// Vérifier si connecté
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// Récupérer l'utilisateur connecté
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user') || '{}');
}
