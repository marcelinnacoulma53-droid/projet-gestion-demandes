// ============================================================
// GÉNÉRATION DE RÉFÉRENCE (M3)
// Crée un identifiant unique pour chaque demande
// ============================================================

const generateReference = (typeDemande) => {
    const prefixes = {
        reclamation: 'REC',
        derogation: 'DER',
        duplicata: 'DUP',
        attestation: 'ATT'
    };
    
    const prefix = prefixes[typeDemande] || 'DEM';
    
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    
    const unique = String(Date.now()).slice(-4);
    
    return `${prefix}-${dateStr}-${unique}`;
};

const generateSimpleReference = () => {
    return `DEM-${Date.now()}`;
};

module.exports = { generateReference, generateSimpleReference };