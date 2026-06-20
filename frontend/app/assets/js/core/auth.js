// Connexion
async function login(email, motDePasse) {
  try {
    const data = await authAPI.login({ email: email, mot_de_passe: motDePasse });
    // ou en raccourci ES6 :
    //const data = await authAPI.login({ email, mot_de_passe: motDePasse });
    if (data.token) {
      setAuthSession(data.token, data.user);

      const role = data.user.role.toLowerCase();

      // ✅ Vérifier premiere_connexion (dans data OU dans data.user)
      if (data.premiere_connexion === true || data.user.premiere_connexion === true) {
        window.location.href = 'first-login.html?role=' + role;
        return;
      }

      redirectByRole(role);

    } else {
      document.getElementById('errorMsg').textContent = data.message || 'Identifiants incorrects.';
    }
  } catch(e) {
    clearAuthSession();
    document.getElementById('errorMsg').textContent = 'Erreur de connexion au serveur.';
  }
}

function redirectByRole(role) {
  const r = role.toLowerCase();
  if (r === 'etudiant') window.location.href = '../dashboard/etudiant.html';
  else if (r === 'secretaire') window.location.href = '../dashboard/staff.html?role=secretaire';
  else if (r === 'sp') window.location.href = '../dashboard/sp.html';
  else if (r === 'da') window.location.href = '../dashboard/staff.html?role=da';
  else if (r === 'professeur') window.location.href = '../dashboard/enseignant.html';
  else if (r === 'directrice') window.location.href = '../dashboard/staff.html?role=directrice';
  else if (r === 'presidence') window.location.href = '../dashboard/staff.html?role=presidence';
  else if (r === 'scolarite') window.location.href = '../dashboard/staff.html?role=scolarite';
  else if (r === 'administrateur') window.location.href = '../dashboard/admin.html';
}

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

function logout() {
  clearAuthSession();
  window.location.href = '../auth/login.html';
}

function isAuthenticated() {
  return !!getAuthToken();
}

function getRoleFromToken() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch(e) {
    return null;
  }
}

function getCurrentUser() {
  return getStoredUser();
}

const ROLE_LABELS = {
  etudiant: '👤 Étudiant',
  secretaire: '👤 Secrétaire',
  sp: '👤 Secrétaire Permanent (SP)',
  da: '👤 Directeur Adjoint (DA)',
  professeur: '👨‍🏫 Professeur',
  enseignant: '👨‍🏫 Enseignant',
  directrice: '👤 Directrice',
  presidence: '👤 Présidence',
  scolarite: '👤 Chef de Scolarité',
  administrateur: '🛡️ Administrateur',
  admin: '🛡️ Administrateur'
};

function getRoleLabel(role) {
  if (!role) return '👤 Utilisateur';
  return ROLE_LABELS[role.toLowerCase()] || ('👤 ' + role);
}

function resolveCurrentRole() {
  const urlParams = new URLSearchParams(window.location.search);
  const roleFromUrl = urlParams.get('role');
  const role = roleFromUrl || getRoleFromToken();
  return role ? role.toLowerCase() : '';
}

function afficherRoleNavbar(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = getRoleLabel(resolveCurrentRole());
  }
}
