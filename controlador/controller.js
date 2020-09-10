var con = require('../conexionbd');
const constantes = require('../constantes');


function obtenerListas(req,res){
      res.send(JSON.stringify(constantes.listas));
};

function obtenerListaDetalle(req,res){
      var id=req.params.id;
      var sql="select cod_articulo, descrip_arti, precio_vta  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1="+id+"and activo='S' order by cod_articulo ASC";
      for(var i=0;i<constantes.listas.length;i++){
            if (constantes.listas[i].codigo==id){
                  var agrupacion=constantes.listas[i].descripcion;
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
                resultado:resultado
          }
          res.send(JSON.stringify(response));
      })

}


function obtenerOfertas(req,res){
      var sql="select cod_articulo, descrip_arti, precio_vta, web_imagen  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='23' and activo='S'";
      con.query(sql,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado));
        });
}


function obtenerStockCritico(req,res){
      var sqlComprobanteMespasado="select NUM, TIPO from comp_emitidos where FECHA >= getdate()-30 AND TIPO='FEA' ORDER BY NUM asc";
      con.query(sqlComprobanteMespasado,function(error,resultado,fields){
            if (error) {
                  console.log("Hubo un error en la consulta sql1", error.message);
                  return res.status(500).send("Hubo un error en la consulta");
            }
            
            var ultimaFactura = JSON.stringify(resultado.recordsets[0][0].NUM);
            console.log(ultimaFactura);
            var sqlArticulosCriticos="select articulo,descrip_arti,UM,unidades,cant_stock, cant_stock-unidades as stockCritico from  \
                  (select COD_ARTICULO AS ARTICULO, DESCRIP_ARTI, UM, CANT_STOCK, \
                  isnull((select COUNT(CANT)  \
                  from reng_fac r  \
                  where TIPO_FACT='FEA'  \
                  AND NUM_FACT >="+ ultimaFactura+
            "AND r.articulo=a.cod_articulo \
            GROUP BY ARTICULO),0) as unidades \
            from articulos a \
            where cant_stock BETWEEN -100 and 80  \
            AND len(UM) >2) D  \
            ORDER BY 4 DESC, CANT_STOCK ASC" 
            
           con.query(sqlArticulosCriticos,function(error,response,fields){
                  if (error) {
                        console.log("Hubo un error en la consulta sql2", error.message);
                        return res.status(500).send("Hubo un error en la consulta");
                  }            
                  res.send(JSON.stringify(response));
              })
        });
  

      }


module.exports ={
    obtenerListas:obtenerListas,
    obtenerListaDetalle:obtenerListaDetalle,
    obtenerOfertas:obtenerOfertas,
    obtenerStockCritico:obtenerStockCritico
}