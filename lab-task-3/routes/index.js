const { Router } = require('express');

const router = Router();

const pages = [
  { path: '/', view: 'index' },
  { path: '/restaurant', view: 'restaurant' },
  { path: '/menu', view: 'menu' },
  { path: '/join', view: 'join' },
  { path: '/locations', view: 'locations' },
  { path: '/buy', view: 'buy' },
  { path: '/checkout', view: 'checkout' },
  { path: '/thankyou', view: 'thankyou' },
  { path: '/api-page', view: 'api-page' }
];

pages.forEach(({ path, view }) => {
  router.get(path, (req, res) => res.render(view));
});

router.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = router;

