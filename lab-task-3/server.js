const path = require('path');
const express = require('express');
const indexRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoutes);

app.use((req, res) => {
  res.status(404).render('index', {
    title: 'Not Found',
    description: 'The page you are looking for does not exist.'
  });
});

app.listen(PORT, () => {
  // Log friendly startup message for quick verification.
  console.log(`Server running at http://localhost:${PORT}`);
});

