var express = require('express');
const axios = require('axios');
var firebase = require('firebase-admin');
var firebaseCert = require('./firebaseCredential.json');
var bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');

let app = express();
let port = 8010;
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.listen(port, () => console.log(`Server listening on port ${port}!`));
var composerEndpoint = 'http://13.59.25.151';

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseCert),
  databaseURL: 'https://is4302-62afd.firebaseio.com'
});
var db = firebase.database();

app.post('/login', async function (req, res) {
  var ref = db.ref('Account');
  var snapshot = await ref.once("value");
  var data = null;
  snapshot.forEach(function(snap) {
    if(snap && snap.child('Username').val() === req.body.username && snap.child('Password').val() === req.body.password) {
      data = {
        "username": snap.child('Username').val(),
        "role": snap.child('Role').val().toUpperCase(),
        "port": snap.child('Port').val()
      };
    }
  });
  if (data) {
    res.json({
      data: data
    });
  } else {
    res.status(500).json({
      data: {
        error: 'Unauthorized'
      }
    });
  }

});

app.get('/goods', function (req, res) {
  // Promise to get goods
  axios.get(composerEndpoint + ':' + req.headers.port + '/api/Goods') //NOTE: e.g. port 3000 in postman
  .then(function(response) {
    res.json({data: response.data});
  }).catch((error) => errorHandling(error));
});

app.post('/order/:id', function (req, res) {
  // Promise to get goods
  axios.all([
      axios.post(composerEndpoint + '/api/ViewOrder',
      {
    "$class": "org.onlineshopping.basic.ViewOrder",
    "order": "resource:org.onlineshopping.basic.Order#" + req.params.id
      }),
      axios.get(composerEndpoint + '/api/Order/' + req.params.id)
]).then(axios.spread(function (response, response2) {
    // res.send("check");
    console.log(response.data)
    console.log(response2.data)
    var data = response.data;
    var data2 = response2.data;
    res.send({
          orderInfo: {
            orderId: data2.orderId,
            orderState: data2.orderState,
            totalPrice: data2.totalPrice
          },
          goodsId: data.goodsId,
          goodsName: data.goodsName,
          price: data.price,
          type: data.type,
          quantity: data.quantity
        });
  })).catch((error) => errorHandling(error));     
});

app.get('/orders', function (req, res) {
  // Promise to get goods
  axios.get(composerEndpoint + ':' + req.headers.port + '/api/Order')
  .then(function(response) {
    res.json({data: response.data});
  }).catch((error) => errorHandling(error));
});

app.get('/good/:id', function (req, res) {
  // Promise to get goods
  axios.get(composerEndpoint + ':' + req.headers.port + '/api/Goods/'+ req.params.id)
  .then(function(response) {
    res.json({data: response.data});
  });
});

app.post('/makeOrder', function(req, res) {
  var input = req.body;
  Object.keys(input).map(supplierId => {
    var goods = [];
    var quantity = [];
    let goodPrefix = "resource:org.onlineshopping.basic.Goods#";
    Object.keys(input[supplierId]).map(productId => {
      goods.push(goodPrefix + productId);
      quantity.push(input[supplierId][productId].quantity);
    })
    axios.post(composerEndpoint + ':' + req.headers.port + '/api/MakeOrder', {
      "$class": "org.onlineshopping.basic.MakeOrder",
      "orderId": uuidv1(),
      "quantity": quantity,
      "goods": goods,
      "supplier": supplierId, 
    }).then(function(response) {
       res.send('Successfully posted the makeOrder!');
    }).catch((error) => errorHandling(error));
  });
})

//Start

//Start for get shipment

app.get('/shipments', function (req, res) {
  axios.get(composerEndpoint + ':' + req.headers.port + '/api/Shipment')
  .then(function(response) {
    res.json({data: response.data});
  }).catch((error) => errorHandling(error));
});

app.get('/shipment/:id', function (req, res) {
  // Promise to get goods
  axios.get(composerEndpoint + ':' + req.headers.port + '/api/Shipment/' + req.params.id)
  .then(function(response) {
    res.json({data: response.data});
  }).catch((error) => errorHandling(error));
});


//Start for ShippingPartnerEndorseHandover
app.post('/ShippingPartnerEndorseHandover', function(req,res) {
  
  var input = req.body;

  axios.post(composerEndpoint + ':' + req.headers.port + '/api/ShippingPartnerEndorseHandover',
  {

    "$class": "org.onlineshopping.basic.ShippingPartnerEndorseHandover",
    "shipment": "resource:org.onlineshopping.basic.Shipment#" + input['shipmentId']
})
  .then(function(response) {
    res.send('Shipment handover is endorsed by shipping partner.');
  }).catch((error) => errorHandling(error));
})

//Start for ShippingPartnerDelivery
app.post('/ShippingPartnerDelivery', function(req,res) {
  
  var input = req.body;

  axios.post(composerEndpoint + ':' + req.headers.port + '/api/ShippingPartnerDelivery',
  {

    "$class": "org.onlineshopping.basic.ShippingPartnerDelivery",
    "shipment": "resource:org.onlineshopping.basic.Shipment#" + input['shipmentId']
})
  .then(function(response) {
    res.send('Shipment delivery is endorsed by shipping partner.');
  }).catch((error) => errorHandling(error));
})

// Start for ConsumerEndorseDelivery

app.post('/ConsumerEndorseDelivery', function(req,res) {
  
  var input = req.body;

  axios.post(composerEndpoint + ':' + req.headers.port + '/api/ConsumerEndorseDelivery',
  {

    "$class": "org.onlineshopping.basic.ConsumerEndorseDelivery",
    "shipment": "resource:org.onlineshopping.basic.Shipment#" + input['shipmentId']
})
  .then(function(response) {
    res.send('Shipment delivery is endorsed by consumer.');
  }).catch((error) => errorHandling(error));
})


// Start for SupplierHandover

app.post('/SupplierHandover', function(req,res) {
  
  var input = req.body;

  axios.post(composerEndpoint + ':' + req.headers.port + '/api/SupplierHandover',
  {
     "$class": "org.onlineshopping.basic.SupplierHandover",
     "shipmentId": input['shipmentId'],
     "shippingPartner": "resource:org.onlineshopping.basic.ShippingPartner#" + input['shippingPartnerId'],
     "order": "resource:org.onlineshopping.basic.Order#" + input['orderId'],
     "size": input['size'],
     "weight": input['weight']
  })
  .then(function(response) {
    res.send('Supplier handover order to shipping partner.');
  }).catch((error) => errorHandling(error));
})

//End


function errorHandling(error){
 if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
}

//app.post('/good', function (req, res) {
  //axios.post(composerEndpoint + '/api/CreateGoods',
  //{
    //"$class": "org.onlineshopping.basic.CreateGoods",
    //"goodsId": "2",
    //"supplier": "resource:org.onlineshopping.basic.Supplier#1",
    //"name": "iPhone SE",
    //"type": "Electronic",
    //"quantity": 100,
    //"price": 600
  //})
  //.then(function(response) {
    //res.send('')
  //}).catch((error) => errorHandling(error));
//});
  
//
app.post('/importGoods',function(req,res){
  var input = req.body;
  axios.post(composerEndpoint + ':' + req.headers.port + '/api/ImportGoods',
  {
    "$class": "org.onlineshopping.basic.ImportGoods",
    "good": "resource:org.onlineshopping.basic.Goods#" + input['goodsId'],
    "quantity": input['quantity']
    //"supplier": {}
  })
  .then(function(response) {
    res.send('')
  }).catch((error) => errorHandling(error));
})

app.post('/closeOrder',function(req,res){
  var input = req.body;
  axios.post(composerEndpoint + ':' + req.headers.port + '/api/CloseOrder',{
    "$class": "org.onlineshopping.basic.CloseOrder",
    "order": "resource:org.onlineshopping.basic.Order#" + input['orderId'],
    "shipment": "resource:org.onlineshopping.basic.Shipment#" + input['shipmentId']
  })
  .then(function(response) {
    res.send('')
  }).catch((error) => errorHandling(error));
})

async function test(){

