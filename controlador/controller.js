var con = require('../conexionbd');
const constantes = require('../constantes');


function obtenerListas(req,res){
      res.send(JSON.stringify(constantes.listas));
};
function obtenerListaDetalle(req,res){
      var id=req.params.id;       
      var sql="select a.cod_articulo as id, a.descrip_arti as d, precio_vta as p, descrip_agru as r, a.cant_stock as s \
      from articulos a \
      join agrupaciones ag\
      on a.agru_2=ag.codi_agru \
      join listas_items i \
      on a.cod_articulo=i.articulo\
      and a.agru_1="+id+
      "and activo='S' \
      and i.lista_codi='2'\
      AND ag.descrip_agru<>'AGRUPACION PRUEBA'\
      order by r ASC, id ASC"
      
      for(var i=0;i<constantes.listas.length;i++){
            if (constantes.listas[i].codigo==id){
                  var agrupacion=constantes.listas[i].descripcion;
                  var descuento=constantes.listas[i].descuento;
            }
      }
      con.query(sql,function(error,resultado,fields){
          if (error) {
                console.log(sql);
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
          }
          var response ={
                  agrupacion:agrupacion,
                  descuento:descuento,
                  resultado:resultado.recordsets[0]
          }
          res.send(JSON.stringify(response));
      })

}
function obtenerOfertasFram(req,res){
      var sql="select cod_articulo as id, descrip_arti as d, precio_vta as p, web_imagen as img  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='16' and activo='S'";
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado.recordsets[0]));
        });
}
function obtenerOfertasMensuales(req,res){
      var sql="select cod_articulo as id, descrip_arti as d, precio_vta p, web_imagen as img  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='25' and activo='S'";
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado.recordsets[0]));
        });
}
function obtenerStockCritico(req,res){
      var sqlComprobanteMespasado="select NUM, TIPO from comp_emitidos where FECHA >= getdate()-30 AND TIPO='FEA' ORDER BY NUM asc";
      con.query(sqlComprobanteMespasado,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta sql1", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            
            var ultimaFacturaTreintaDias = JSON.stringify(resultado.recordsets[0][0].NUM);
            var sqlArticulosCriticos="select articulo,descrip_arti,UM,unidades,cant_stock, cant_stock-unidades as stockCritico from  \
                  (select COD_ARTICULO AS ARTICULO, DESCRIP_ARTI, UM, CANT_STOCK, \
                  isnull((select COUNT(CANT)  \
                  from reng_fac r  \
                  where TIPO_FACT='FEA'  \
                  AND NUM_FACT >="+ ultimaFacturaTreintaDias+
                  "AND r.articulo=a.cod_articulo \
                  GROUP BY ARTICULO),0) as unidades \
            from articulos a \
            where cant_stock BETWEEN -100 and 50  \
            AND len(UM) >2) D  \
            ORDER BY 6 ASC, CANT_STOCK ASC" 
            
           con.query(sqlArticulosCriticos,function(error,response,fields){
                  if (error) {
                        console.log("Hubo un error en la consulta sql2", error.message);
                        return res.status(500).send("Hubo un error en la consulta");
                  }            
                  res.send(JSON.stringify(response.recordsets[0]));
              })
        });
  

}
function informacionPedidos(req,res){
      var sql="select cod_articulo as id, descrip_arti as d, UM, cant_stock as s, precio_vta as p from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and activo='S'"
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta sql", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            var response=resultado.recordsets[0];
            res.send(JSON.stringify(response));
      })
}
function informacionPedidosFecha(req,res){
      var fecha=req.params.fecha;
      
      var sql="select cod_articulo as id, descrip_arti as d, UM, cant_stock as s, precio_vta as p, i.fecha_modi as fm \
      from articulos a, listas_items i \
      where a.cod_articulo=i.articulo and i.lista_codi='2' and activo='S' and i.fecha_modi>="+"'"+fecha+"'"; 
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta sql", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            var response=resultado.recordsets[0];
            res.send(JSON.stringify(response));
      })
}
function ofertasValvoline(req,res){
      var sql="select cod_articulo as id, descrip_arti as d, precio_vta as p, web_imagen as img \
      from articulos a, listas_items i \
      where a.cod_articulo=i.articulo \
      and i.lista_codi='2' \
      and activo='S'\
      and (cod_articulo='03VA779' \
      or cod_articulo='03VA147'\
      or cod_articulo='03VA381'\
      or cod_articulo='06VA381'\
      or cod_articulo='03VA339'\
      or cod_articulo='03VA601'\
      or cod_articulo='06VA153'\
      or cod_articulo='04VA407'\
      or cod_articulo='06ZX040'\
      or cod_articulo='06ZX030')"
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado.recordsets[0]));
        });
}
function ofertasMotul(req,res){
      var sql="select cod_articulo as id, descrip_arti as d, precio_vta as p, web_imagen as img \
      from articulos a, listas_items i \
      where a.cod_articulo=i.articulo \
      and i.lista_codi='2' \
      and activo='S'\
      and (cod_articulo='8100/5' \
      or cod_articulo='4100/5'\
      or cod_articulo='4100/4'\
      or cod_articulo='8100/ECO/5'\
      or cod_articulo='8100/XPOWER/5'\
      or cod_articulo='8100/ECOLITE/4'\
      or cod_articulo='6100/5'\
      or cod_articulo='SPE/5W30/5'\
      or cod_articulo='4100/15W50/4')"
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado.recordsets[0]));
        });
}
function ofertasTotal(req,res){
      var sql="select cod_articulo as id, descrip_arti as d, precio_vta as p, web_imagen as img \
      from articulos a, listas_items i \
      where a.cod_articulo=i.articulo \
      and i.lista_codi='2' \
      and activo='S'\
      and (cod_articulo='7000N/4' \
      or cod_articulo='EVO700N/10W40/4'\
      or cod_articulo='9000/4'\
      or cod_articulo='INEOFIRST4'\
      or cod_articulo='EVO500D/15W40/4'\
      or cod_articulo='GLACELF/ROJO/1'\)"
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado.recordsets[0]));
        });
}
function ofertasSelenia(req,res){
      var sql="select cod_articulo as id, descrip_arti as d, precio_vta as p, web_imagen as img \
      from articulos a, listas_items i \
      where a.cod_articulo=i.articulo \
      and i.lista_codi='2' \
      and activo='S'\
      and (cod_articulo='SYNTIUM/1000/10W40/4' \
      or cod_articulo='SELENIA/K/15W40/4'\
      or cod_articulo='SELENIA/5W30/4'\
      or cod_articulo='SELENIA/5W40/4'\
      or cod_articulo='PARAFLU/ROJO'\
      or cod_articulo='PARAFLU/VERDE')"
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado.recordsets[0]));
        });
}


module.exports ={
    obtenerListas:obtenerListas,
    obtenerListaDetalle:obtenerListaDetalle,
    obtenerOfertasFram:obtenerOfertasFram,
    obtenerOfertasMensuales:obtenerOfertasMensuales,
    obtenerStockCritico:obtenerStockCritico,
    informacionPedidos:informacionPedidos,
    informacionPedidosFecha:informacionPedidosFecha,
    ofertasValvoline:ofertasValvoline,
    ofertasMotul:ofertasMotul,
    ofertasTotal:ofertasTotal,
    ofertasSelenia:ofertasSelenia
}