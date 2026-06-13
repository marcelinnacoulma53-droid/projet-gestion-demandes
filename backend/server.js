const app = require('./src/app');      // ← J'importe l'application
const config = require('./src/config/env');  // ← Je récupère la config

app.listen(config.port, () => {
    console.log(`Serveur démarré sur http://localhost:${config.port}`);
});