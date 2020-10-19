//paquetes necesarios para el proyecto
var express = require('express');
var PORT =process.env.PORT || 5000;
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
var controller=require('./controlador/controller');
var clientesRouter= require('./Routes/clientesRouter');

var app = express();
app.set("view engine")

app.use(cors());


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(express.static('/views/js'))
// view engine setup

app.set('view engine', "jade");
app.use(express.static(path.join(__dirname,"views")));


//app.get('/', function (req, res)            {res.sendFile(path.join(__dirname + '/views/html/index.html'));});
//app.get('/faq', function (req, res)         {res.sendFile(path.join(__dirname + '/views/html/faq.html'));})
app.get('/listas',                        controller.obtenerListas);
app.get('/listas/:id' ,                   controller.obtenerListaDetalle);
app.get('/ofertasFram',                   controller.obtenerOfertasFram);
app.get('/ofertasKits',                   controller.obtenerOfertasKits);
app.get('/ofertasMensuales',              controller.obtenerOfertasMensuales);
app.get('/stock',                         controller.obtenerStockCritico);
app.get('/listadoSistemaPedidos/',        controller.informacionPedidos);
app.get('/listadoSistemaPedidos/:fecha',  controller.informacionPedidosFecha);
app.get('/ofertasValvoline',              controller.ofertasValvoline);
app.get('/ofertasMotul',                  controller.ofertasMotul);
app.get('/ofertasTotal',                  controller.ofertasTotal);
app.get('/ofertasSelenia',                controller.ofertasSelenia);
app.get('/ofertasValvolineVarios',        controller.ofertasValvolineVarios);
app.get('/ofertasVarias',                 controller.ofertasVarios);

//app.use('/clientes' , clientesRouter);






app.listen(PORT, function () {
  console.log( "Escuchando en el puerto " + PORT );
})
 