const mongoose = require('mongoose');
<<<<<<< HEAD

=======
mongoose.connect('mongodb://localhost:27017/nyc_outward');
>>>>>>> tests
const Schema = mongoose.Schema;

const School = new Schema({
  name: String
});
<<<<<<< HEAD

module.exports = mongoose.model('School', School);
=======
SchoolM = mongoose.model('School', School);

var record = [{
  name: 'Baldwin'
},
  {
    name: 'BCS'
  },
  {
    name: 'Channel View'
  },
  {
    name: 'Hahn'
  },
  {
    name: 'Leaders'
  },
  {
    name: 'McCown'
  },
  {
    name: 'MELS'
  },
  {
    name: 'WHEELS'
  },
  {
    name: 'Network'
  }];

record.forEach(function(el, index) {
  SchoolM.create(el, function(err, data) {
    console.log(data);
  });
});
>>>>>>> tests
