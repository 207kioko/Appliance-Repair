const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Appliance Repair.html'));
});

async function ensureContactsFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(CONTACTS_FILE);
  } catch (err) {
    await fs.writeFile(CONTACTS_FILE, '[]', 'utf8');
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.post('/api/contact', async (req, res) => {
  const { name, phone, email, appliance, message } = req.body;
  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: 'Name, phone, email, and message are required.' });
  }

  const newEntry = {
    id: Date.now(),
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    appliance: appliance?.trim() || 'General appliance inquiry',
    message: message.trim(),
    receivedAt: new Date().toISOString()
  };

  try {
    await ensureContactsFile();
    const raw = await fs.readFile(CONTACTS_FILE, 'utf8');
    const list = JSON.parse(raw || '[]');
    list.push(newEntry);
    await fs.writeFile(CONTACTS_FILE, JSON.stringify(list, null, 2), 'utf8');
    return res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    console.error('Failed to save contact form data:', error);
    return res.status(500).json({ error: 'Unable to save contact data at this time.' });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    await ensureContactsFile();
    const raw = await fs.readFile(CONTACTS_FILE, 'utf8');
    return res.json(JSON.parse(raw || '[]'));
  } catch (error) {
    console.error('Failed to read contacts:', error);
    return res.status(500).json({ error: 'Unable to read contact data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
