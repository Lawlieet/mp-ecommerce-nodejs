//dotenv para las variables de entorno
require("dotenv").config();

var express = require('express');
var exphbs  = require('express-handlebars');

//Requerir mercado pago
var mercadopago = require("mercadopago");

var app = express();



app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get("/detail", function(req, res) {
    const { title, price, unit, img } = req.query;

    mercadopago.configure({
      access_token: process.env.PROD_ACCESS_TOKEN
    });
    let preference = {
      items: [
        {
          title: title,
          quantity: Number(unit),
          unit_price: Number(price),          
          pictures_url: img
        }
      ]
    };
    mercadopago.preferences
      .create(preference)
      .then(resp => {
        global.init_point = resp.body.init_point;
        res.render("detail", {
          title,
          unit, 
          price, 
          img,
          id_preference: resp.body.id
        });
      })
      .catch(err => console.log(err));
  });


app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(3000);