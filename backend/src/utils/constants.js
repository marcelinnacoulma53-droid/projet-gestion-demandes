// ============================================================
// CONSTANTES GLOBALES (M3)
// Centralise tous les codes, libellés et configurations
// ============================================================

const ROLES = {
    ADMIN: 'admin',
    ETUDIANT: 'etudiant',
    SECRETAIRE: 'secretaire',
    SP: 'sp',
    DA: 'da',
    PROFESSEUR: 'professeur',
    DIRECTRICE: 'directrice',
    PRESIDENCE: 'presidence',
    SCOLARITE: 'scolarite'
};

const STATUT_DEMANDE = {
    BROUILLON: 'brouillon',
    SOUMISE: 'soumise',
    EN_COURS: 'en_cours',
    VALIDEE: 'validee',
    REJETEE: 'rejetee',
    CLOTUREE: 'cloturee'
};

const TYPE_DEMANDE = {
    RECLAMATION: 'reclamation',
    DEROGATION: 'derogation',
    DUPLICATA: 'duplicata',
    ATTESTATION: 'attestation'
};

const ETAPES_WORKFLOW = {
    SECRETAIRE: 'secretaire',
    SP: 'sp',
    DA: 'da',
    PROFESSEUR: 'professeur',
    DIRECTRICE: 'directrice',
    PRESIDENCE: 'presidence',
    SCOLARITE: 'scolarite'
};

const DECISIONS = {
    TRANSMIS: 'transmis',
    VALIDE: 'valide',
    REJETE: 'rejete',
    A_COMPLETER: 'a_completer',
    AVIS_FAVORABLE: 'avis_favorable',
    AVIS_DEFAVORABLE: 'avis_defavorable'
};

const TYPES_DOCUMENT = {
    LETTRE: 'lettre',
    QUITTANCE: 'quittance',
    COPIE_EXAMEN: 'copie_examen',
    RELEVE_NOTES: 'releve_notes',
    ATTESTATION: 'attestation'
};

const TYPES_ATTESTATION = {
    LICENCE_PROVISOIRE: 'licence_provisoire',
    MASTER_PROVISOIRE: 'master_provisoire'
};

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

const ERROR_MESSAGES = {
    NOT_FOUND: 'Ressource non trouvée',
    UNAUTHORIZED: 'Non authentifié',
    FORBIDDEN: 'Accès interdit',
    INVALID_DATA: 'Données invalides',
    INTERNAL_ERROR: 'Erreur interne du serveur',
    EMAIL_EXISTS: 'Cet email est déjà utilisé',
    MATRICULE_EXISTS: 'Ce matricule est déjà utilisé'
};

const UPLOAD_CONFIG = {
    MAX_SIZE: 5 * 1024 * 1024,
    ALLOWED_TYPES: [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
};

module.exports = {
    ROLES,
    STATUT_DEMANDE,
    TYPE_DEMANDE,
    ETAPES_WORKFLOW,
    DECISIONS,
    TYPES_DOCUMENT,
    TYPES_ATTESTATION,
    HTTP_STATUS,
    ERROR_MESSAGES,
    UPLOAD_CONFIG
};