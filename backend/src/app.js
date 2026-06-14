const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();

/*
========================
MIDDLEWARES
========================
*/
app.use(express.json());
app.use(cors());

/*
========================
ROUTE TEST
========================
*/
app.get('/', (req, res) => {
    res.json({
        message: "API Gestion des demandes fonctionne ✅"
    });
});

/*
========================
DEMARRAGE SERVEUR
========================
*/

db.query('SELECT NOW()')
.then(result => {
    console.log("Connexion PostgreSQL réussie :", result.rows[0]);
})
.catch(error => {
    console.error("Erreur PostgreSQL :", error);
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT} `);
});
