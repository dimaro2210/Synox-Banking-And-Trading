const fs = require('fs');
const content = fs.readFileSync('c:/Users/David/Desktop/Synox International Banking & Trade/synox-banking-react/src/pages/LandingPage.jsx', 'utf8');
const match = content.match(/src="(data:image\/png;base64,.*?)"/);
if (match) {
  fs.writeFileSync('c:/Users/David/Desktop/Synox International Banking & Trade/synox-banking-react/src/constants/logo_raw.txt', match[1]);
  console.log('Logo extracted successfully');
} else {
  console.log('Logo not found');
}
