const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render("room");
});

router.get('/join', (req, res) => {
  res.render("join");
});

router.get('/:id',(req, res) => {
  res.render("id", {id: req.params.id});
});

router.get('/:id/play',(req, res) => {
  res.render('double', {id: req.params.id});
});

router.get('/:id/error',(req, res) => {
  res.render('error');
});

module.exports = router;