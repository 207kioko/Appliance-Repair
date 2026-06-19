const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;
const dataPath = path.join(__dirname, 'bookings.json');

app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.static(path.join(__dirname)));

function readBookings() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function writeBookings(bookings) {
  fs.writeFileSync(dataPath, JSON.stringify(bookings, null, 2), 'utf8');
}

app.get('/api/bookings', (req, res) => {
  const bookings = readBookings();
  res.json({ bookings });
});

app.post('/api/bookings', (req, res) => {
  const { breed, service, petName, date, estimated } = req.body;

  if (!breed || !service || !petName || !date) {
    return res.status(400).json({ error: 'Missing required booking fields.' });
  }

  const booking = {
    id: Date.now().toString(),
    breed,
    service,
    petName,
    date,
    estimated: estimated || null,
    createdAt: new Date().toISOString()
  };

  const bookings = readBookings();
  bookings.push(booking);
  writeBookings(bookings);

  res.status(201).json({ booking });
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Golden Paw backend running at http://localhost:${port}`);
});
