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
function obtenerOfertasKits(req,res){
      var sql="select cod_articulo as id, descrip_arti as d, precio_vta as p, web_imagen as img  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='16' and activo='S'";
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado.recordsets[0]));
        });
}
function obtenerOfertasFram(req,res){
      var sql="select cod_articulo as id, descrip_ARTI_WEB as d, precio_vta as p, web_imagen as img  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='23' and activo='S'";
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado.recordsets[0]));
        });
}
function obtenerOfertasMensuales(req,res){
      var sql="select cod_articulo as id, , descrip_ARTI_WEB as d, precio_vta p, web_imagen as img  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='25' and activo='S'";
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
      var sql="select cod_articulo as id,  precio_vta as p, web_imagen as img, descrip_ARTI_WEB as web \
      from articulos a, listas_items i \
      where a.cod_articulo=i.articulo \
      and i.lista_codi='2' \
      and activo='S'\
      and (cod_articulo='03VA779' \
      or cod_articulo='04VA153'\
      or cod_articulo='04VA2296'\
      or cod_articulo='03VA567'\
      or cod_articulo='01VA150'\
      or cod_articulo='01VA156'\
      or cod_articulo='01VA173'\
      or cod_articulo='01VA174') order BY ID desc"
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado.recordsets[0]));
        });
}
function ofertasValvolineVarios(req,res){
      var sql="select cod_articulo as id, precio_vta as p, web_imagen as img, descrip_ARTI_WEB as web \
      from articulos a, listas_items i \
      where a.cod_articulo=i.articulo \
      and i.lista_codi='2' \
      and activo='S'\
      and (cod_articulo='06VA153' \
      or cod_articulo='06VA348'\
      or cod_articulo='06VA345'\
      or cod_articulo='06VA405'\
      or cod_articulo='06VA246'\
      or cod_articulo='06ZX040'\
      or cod_articulo='06ZX030'\
      or cod_articulo='06PA512') ORDER BY id DESC"
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado.recordsets[0]));
        });
}
function ofertasMotul(req,res){
      var sql="select cod_articulo as id, descrip_ARTI_WEB  as d, precio_vta as p, web_imagen as img \
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
      var sql="select cod_articulo as id, descrip_ARTI_WEB  as d, precio_vta as p, web_imagen as img \
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
      var sql="select cod_articulo as id, descrip_ARTI_WEB  as d, precio_vta as p, web_imagen as img \
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
function ofertasVarios(req,res){

      var sql="select cod_articulo as id, descrip_ARTI_WEB  as web, precio_vta as p, web_imagen as img \
      from articulos a, listas_items i \
      where a.cod_articulo=i.articulo \
      and i.lista_codi='2' \
      and activo='S'\
      and (cod_articulo='WLDOT3 1000' \
      or cod_articulo='WLDOT3 500' \
      or cod_articulo='WLDOT3 200'\
      or cod_articulo='WLDOT4 1000'\
      or cod_articulo='WLDOT4 200'\
      or cod_articulo='LOCXCM'\
      or cod_articulo='LOCXW7'\
      or cod_articulo='LOCXLC'\
      or cod_articulo='LOCXLM'\
      or cod_articulo='Limpiamanos'\
      or cod_articulo='LOCXAA'\
      or cod_articulo='LOCXBC'\
      or cod_articulo='LOCXCM')"
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado.recordsets[0]));
        });
}
function obtenerVinto(req,res){
      var sql="select cod_articulo as id, descrip_ARTI_WEB  as web, precio_vta as p, web_imagen as img  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='33' and web_publi='S' and activo='S'";
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado.recordsets[0]));
        });
}
function ventasPorAgrupacion(req,res){
      var id=req.query.id; 
      var fechaDesde= req.query.fechaDesde;
      var fechaHasta=req.query.fechaHasta;
      var sql = `factu_venta_arti_lista '${fechaDesde}', '${fechaHasta}', @agru_1=${id}`;
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
    obtenerOfertasKits:obtenerOfertasKits,
    obtenerOfertasMensuales:obtenerOfertasMensuales,
    obtenerStockCritico:obtenerStockCritico,
    informacionPedidos:informacionPedidos,
    informacionPedidosFecha:informacionPedidosFecha,
    ofertasValvoline:ofertasValvoline,
    ofertasMotul:ofertasMotul,
    ofertasTotal:ofertasTotal,
    ofertasSelenia:ofertasSelenia,
    ofertasValvolineVarios:ofertasValvolineVarios,
    ofertasVarios:ofertasVarios,
    obtenerVinto:obtenerVinto,
    ventasPorAgrupacion:ventasPorAgrupacion,
}