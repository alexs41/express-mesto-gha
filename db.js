const db = require('mongoose');
db.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, err => {
  if(err) throw err;
  console.log('Connected to MongoDB!!!')
});

module.exports = db;