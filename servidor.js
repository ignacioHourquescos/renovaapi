//paquetes necesarios para el proyecto
var express = require('express');
var PORT =process.env.PORT || 5000;
var con = require('./conexionbd');
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
app.get('/ofertasVinto',                  controller.obtenerVinto);
app.get('/ventasPorAgrupacion/',          controller.ventasPorAgrupacion);
app.get('/ventasGenerales',               controller.ventasGenerales);     
app.get('/obtenerStockArticulo',          controller.obtenerStockArticulo);       
app.get('/obtenerAgrupacionDeArticulo',   controller.obtenerAgrupacionDeArticulo);       
app.get('/remateMercaderia',              controller.remateMercaderia);    
app.get('/clientesPorVendedor',           controller.clientesPorVendedor);
app.get('/getExpenses/:mes',              controller.getExpenses); 
app.get('/stockNegativo',                 controller.stockNegativo); 
app.post('/validateUser',                 controller.validateUser);
app.get('/ultimasVentas',                 controller.ultimasVentas);
app.get('/obtenerArticulo/:id',     controller.obtenerArticulo);
app.get('/obtenerListadoArticulos',     controller.obtenerListadoArticulos);
app.get('/ofertasPuma',     controller.ofertasPuma);
app.get('/listadoClientes',               controller.listadoClientes)
//app.use('/clientes' , clientesRouter);npo

 app.get('/ventasTotales/:id-:mes', (req, res, next) =>{
   var id=req.params.id;
   var mes = req.params.mes; 
   var year = new Date().getFullYear();
   var days = daysInMonth(mes,year);
  

   var sql = `factu_venta_arti_lista '${year}${mes}01', '${year}${mes}${days}', @agru_1=${id}`;
   con.query(sql, function(error,result,fields){
      let data=result.recordsets[0];
      const canti = data.reduce(
         (acumulator, current) => {return acumulator + current.canti_kilos;},  0).toFixed(0);
      const impor = data.reduce(
         (acumulator, current) => {return acumulator + current.impor;},        0).toFixed(0);
      const costo = data.reduce(
         (acumulator, current) => {return acumulator + current.costo;},        0).toFixed(0);
      const consolidatedData={canti, impor, costo}
      // res.send(`<h1>${canti}</h1><h1>${impor}</h1><h1>${costo}</h1><h1>${impor-costo}</h1>`);
      // res.send(`<h1>${canti}</h1><h1>${impor}</h1><h1>${costo}</h1><h1>${impor-costo}</h1>`);
      res.send(JSON.stringify(consolidatedData));
   });
 }
 )






 app.get('/ventasHistoricasPorAgrupacion/:id&:mes&:anio', (req, res, next) =>{
   var id=req.params.id;
   var mes = req.params.mes; 
   var anio= req.params.anio;
   var days = daysInMonth(mes,anio);

   var sql = `factu_venta_arti_lista '${anio}${mes}01', '${anio}${mes}${days}', @agru_1=${id}`;
   con.query(sql, function(error,result,fields){
      let data=result.recordsets[0];
      const canti = data.reduce(
         (acumulator, current) => {return acumulator + current.canti_kilos;},  0).toFixed(0);
      const impor = data.reduce(
         (acumulator, current) => {return acumulator + current.impor;},        0).toFixed(0);
      const costo = data.reduce(
         (acumulator, current) => {return acumulator + current.costo;},        0).toFixed(0);
      const consolidatedData={canti, impor, costo}
      // res.send(`<h1>${canti}</h1><h1>${impor}</h1><h1>${costo}</h1><h1>${impor-costo}</h1>`);
      // res.send(`<h1>${canti}</h1><h1>${impor}</h1><h1>${costo}</h1><h1>${impor-costo}</h1>`);
      res.send(JSON.stringify(consolidatedData));
   });
 }
 )



 
 app.get('/ventasTotalesGeneral/:mes', (req, res, next) =>{
   var mes = req.params.mes; 
   var days = daysInMonth(mes,2021); 
   var sql = `factu_venta_arti_lista '2021${mes}01', '2021${mes}${days}'`;
    con.query(sql, function(error,result,fields){
      let data=result.recordsets[0];
      const canti = data.reduce((acumulator, current) => {return acumulator + current.canti_kilos;}, 0).toFixed(0);
      const impor = data.reduce((acumulator, current) => {return acumulator + current.impor;}, 0).toFixed(0);
      const costo = data.reduce((acumulator, current) => {return acumulator + current.costo;}, 0).toFixed(0);
      const consolidatedData={canti, impor, costo}
      res.send(JSON.stringify(consolidatedData));

    });
 }
 )



 


 //Auxiliar functions
 function daysInMonth (month, year) {
   return new Date(year, month, 0).getDate();
}




app.listen(PORT, function () {
  console.log( "Escuchando en el puerto " + PORT );
})
 
