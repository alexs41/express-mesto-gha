// создадим express router
const router = require('express').Router();


router.get('/users/:id', (req, res) => {
  if (!users[req.params.id]) {
    res.send({ error: 'Такого пользователя нет' });
    return;
  }

  res.send(users[req.params.id]);

  // res.send(users);
});

// экспортируем его
module.exports = router;
