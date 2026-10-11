const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

function readContacts() {
  try {
    if (!fs.existsSync(CONTACTS_FILE)) return [];
    const contents = fs.readFileSync(CONTACTS_FILE, 'utf8');
    const parsed = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeContacts(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(data, null, 2));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'HomePage.html'));
});

app.get('/api/contact', (req, res) => {
  const contacts = readContacts();
  res.json({ success: true, data: contacts });
});

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and phone are required.'
    });
  }

  const contact = {
    id: Date.now(),
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    message: String(message || '').trim(),
    createdAt: new Date().toISOString()
  };

  const contacts = readContacts();
  contacts.push(contact);
  writeContacts(contacts);

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been sent successfully.'
  });
});

app.listen(PORT, () => {
  console.log(`Shree Interior server is running at http://localhost:${PORT}`);
});
