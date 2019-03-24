var express = require('express');
const axios = require('axios');
var firebase = require('firebase-admin');
var firebaseCert = require('./firebaseCredential.json');
var bodyParser = require('body-parser');

let app = express();
let port = 8010;
app.use(bodyParser.json());
app.listen(port, () => console.log(`Server listening on port ${port}!`));
var composerEndpoint = 'http://18.220.99.175:3000';

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseCert),
  databaseURL: 'https://is4302-62afd.firebaseio.com'
});
var db = firebase.database();

app.post('/login', function (req, res) {
  var ref = db.ref('Account');
  ref.orderByChild('Username').equalTo(req.body.username).once("value", function(snapshot) {
    snapshot.forEach(function(snap) {
      if(snap && snap.child('Password').val() === req.body.password) {
        console.log('found')
        res.json({
          username: snap.child('Username').val(),
          role: snap.child('Role').val().toUpperCase()
        });
      }
    })

  });
});

app.get('/goods', function (req, res) {
  // Promise to get goods
  axios.get(composerEndpoint + '/api/Goods')
  .then(function(response) {
    res.json({data: response.data});
  });
});

app.post('/good', function (req, res) {
  axios.post(composerEndpoint + '/api/CreateGoods',
  {
    "$class": "org.onlineshopping.basic.CreateGoods",
    "goodsId": "2",
    "supplier": "resource:org.onlineshopping.basic.Supplier#1",
    "name": "iPhone SE",
    "type": "Electronic",
    "quantity": 100,
    "price": 600
  })
  .then(function(response) {
    res.send('')
  });
});
