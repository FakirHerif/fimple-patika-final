const { generateUIKey } = require('./utils');

// generateUIKey fonksiyonunu çağırarak bir anahtar oluşturun
const key = generateUIKey();

// Oluşturulan anahtarı ekrana yazdırın
console.log('Generated UI Key:', key);
