const bcrypt = require('bcryptjs');
bcrypt.hash('Admin2026!', 10).then(hash => console.log(hash));
