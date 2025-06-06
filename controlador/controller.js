var con = require("../conexionbd");
const constantes = require("../constantes");
const fetch = require("node-fetch");

function obtenerListas(req, res) {
	res.send(JSON.stringify(constantes.listas));
}

function obtenerListaDetalle(req, res) {
	var id = req.params.id;
	var sql =
		"select a.cod_articulo as id, a.descrip_arti as d, precio_vta as p, descrip_agru as r, a.cant_stock as s \
      from articulos a \
      join agrupaciones ag\
      on a.agru_2=ag.codi_agru \
      join listas_items i \
      on a.cod_articulo=i.articulo\
      and a.agru_1=" +
		id +
		"and activo='S' \
      and i.lista_codi='2'\
      and ag.descrip_agru<>'AGRUPACION PRUEBA'\
      and ag.descrip_agru<>'OFERTAS FRAM'\
      order by r ASC, id ASC";

	for (var i = 0; i < constantes.listas.length; i++) {
		if (constantes.listas[i].codigo == id) {
			var agrupacion = constantes.listas[i].descripcion;
			var descuento = constantes.listas[i].descuento;
		}
	}
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log(error);
			console.log("Hubo un error en la consulta", error.message);
			console.log(error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		var response = {
			agrupacion: agrupacion,
			descuento: descuento,
			resultado: resultado.recordsets[0],
		};
		res.send(JSON.stringify(response));
	});
}
function obtenerOfertasKits(req, res) {
	var sql =
		"select cod_articulo as id, descrip_arti as d, precio_vta as p, web_imagen as img  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='16' and activo='S' and web_publi='S'";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}
function obtenerOfertasFram(req, res) {
	var sql =
		"select cod_articulo as id, descrip_ARTI_WEB as d, precio_vta as p, web_imagen as img  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='23' and activo='S'";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}
function obtenerOfertasMensuales(req, res) {
	var sql =
		"select cod_articulo as id, , descrip_ARTI_WEB as d, precio_vta p, web_imagen as img  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='25' and activo='S'";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}

function remateMercaderia(req, res) {
	var sql =
		"select cod_articulo as id,  precio_vta as p, web_imagen as img, descrip_ARTI_WEB as web \
    from articulos a, listas_items i \
    where a.cod_articulo=i.articulo \
    and activo='S'\
    and (cod_articulo='GNC/1' \
    or cod_articulo='EVO500N/20W50/1'\
    or cod_articulo='7000N/1'\
    or cod_articulo='EVO700N/10W40/1') order BY ID desc";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}

function stockNegativo(req, res) {
	var sql =
		"select cod_articulo as id, descrip_arti as d, UM, cant_stock as s from articulos a, listas_items i where cant_stock<0 and a.cod_articulo=i.articulo and i.lista_codi='2' and activo='S'";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta sql", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		var response = resultado.recordsets[0];
		res.send(JSON.stringify(response));
	});
}

function inventoryByUM(req, res) {
	var um = req.params.um;
	var sql = `select cod_articulo as id, a.desc_adicional AS da, descrip_arti as d, UM, cant_stock as s from articulos a, listas_items i where UM='${um}' and a.cod_articulo=i.articulo and i.lista_codi='2' and activo='S'`;
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta sql", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		var response = resultado.recordsets[0];
		res.send(JSON.stringify(response));
	});
}

function negativeStockByUm(req, res) {
	var um = req.query.um;
	var sql = `select cod_articulo as id, descrip_arti as d, UM, cant_stock as s from articulos a, listas_items i where cant_stock<0 and a.UM='${um}' and a.cod_articulo=i.articulo and i.lista_codi='2' and activo='S'`;
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta sql", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		var response = resultado.recordsets[0];
		res.send(JSON.stringify(response));
	});
}
function detailedUm(req, res) {
	var um = req.query.um; // Use req.params to get the value of 'um' from the URL parameters
	console.log("UM", um);
	var sql = `SELECT
      a.UM as id,
      COUNT(*) AS total_items,
      SUM(CASE WHEN cant_stock < 0 THEN 1 ELSE 0 END) AS negative_items
  FROM
      articulos a
  JOIN
      listas_items i ON a.cod_articulo = i.articulo
  WHERE
      i.lista_codi='2'
      AND a.activo='S'
      AND a.UM='C11'`; // Add a WHERE clause to filter by the 'um' parameter

	con.query(sql, [um], function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta sql", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		var response = resultado.recordsets[0];
		res.send(JSON.stringify(response));
	});
}

function stockByUm(req, res) {
	var um = req.query.um;
	var sql = `SELECT
  a.UM as id,
  COUNT(*) AS total_items,
  SUM(CASE WHEN cant_stock < 0 THEN 1 ELSE 0 END) AS negative_items
FROM
  articulos a
JOIN
  listas_items i ON a.cod_articulo = i.articulo
WHERE
  i.lista_codi = '2'
  AND a.activo = 'S'
GROUP BY
  a.UM`;
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta sql", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		var response = resultado.recordsets[0];
		res.send(JSON.stringify(response));
	});
}

function obtenerStockCritico(req, res) {
	var sqlComprobanteMespasado =
		"select NUM, TIPO from comp_emitidos where FECHA >= getdate()-30 AND TIPO='FEA' ORDER BY NUM asc";
	con.query(sqlComprobanteMespasado, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta sql1", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}

		var ultimaFacturaTreintaDias = JSON.stringify(
			resultado.recordsets[0][0].NUM
		);
		var sqlArticulosCriticos =
			"select articulo,descrip_arti,UM,unidades,cant_stock, cant_stock-unidades as stockCritico from  \
                  (select COD_ARTICULO AS ARTICULO, DESCRIP_ARTI, UM, CANT_STOCK, \
                  isnull((select COUNT(CANT)  \
                  from reng_fac r  \
                  where TIPO_FACT='FEA'  \
                  AND NUM_FACT >=" +
			ultimaFacturaTreintaDias +
			"AND r.articulo=a.cod_articulo \
                  GROUP BY ARTICULO),0) as unidades \
            from articulos a \
            where cant_stock BETWEEN -100 and 50  \
            AND len(UM) >2) D  \
            ORDER BY 6 ASC, CANT_STOCK ASC";

		con.query(sqlArticulosCriticos, function (error, response, fields) {
			if (error) {
				console.log("Hubo un error en la consulta sql2", error.message);
				return res.status(500).send("Hubo un error en la consulta");
			}
			res.send(JSON.stringify(response.recordsets[0]));
		});
	});
}

function clientesPorVendedor(req, res) {
	var sql =
		"select razon from clientes WHERE CODI_VENDE='7' ORDER BY razon ASC;";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta sql", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		var response = resultado.recordsets[0];
		res.send(JSON.stringify(response));
	});
}

function informacionPedidos(req, res) {
	var sql =
		"select cod_articulo as id, descrip_arti as d, UM, cant_stock as s, precio_vta as p from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and activo='S'";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta sql", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		var response = resultado.recordsets[0];
		res.send(JSON.stringify(response));
	});
}
function informacionPedidosFecha(req, res) {
	var fecha = req.params.fecha;

	var sql =
		"select cod_articulo as id, descrip_arti as d, UM, cant_stock as s, precio_vta as p, i.fecha_modi as fm \
      from articulos a, listas_items i \
      where a.cod_articulo=i.articulo and i.lista_codi='2' and activo='S' and i.fecha_modi>=" +
		"'" +
		fecha +
		"'";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta sql", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		var response = resultado.recordsets[0];
		res.send(JSON.stringify(response));
	});
}
function ofertasValvoline(req, res) {
	var sql =
		"select cod_articulo as id, descrip_ARTI_WEB as d, precio_vta as p, web_imagen as img  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='3' and activo='S' and web_publi='S'";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}

function ofertasValvolineVarios(req, res) {
	var sql =
		"select cod_articulo as id, precio_vta as p, web_imagen as img, descrip_ARTI_WEB as web \
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
      or cod_articulo='06VA299'\
      or cod_articulo='06PA512') ORDER BY id DESC";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}
function ofertasMotul(req, res) {
	var sql =
		"select cod_articulo as id, descrip_ARTI_WEB  as d, precio_vta as p, web_imagen as img \
      from articulos a, listas_items i \
      where a.cod_articulo=i.articulo \
      and i.lista_codi='2' \
and activo='S'\
      and (cod_articulo='8100/5' \
      or cod_articulo='4100/5'\
      or cod_articulo='4100/4'\
      or cod_articulo='8100/ECO/5'\
      or cod_articulo='8100/XPOWER/5'\
      or cod_articulo='8100/ECOLITE/5'\
      or cod_articulo='SPE/5w40/5'\
      or cod_articulo='SPE/5W30/5'\
      or cod_articulo='4100/15W50/4')";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}
function ofertasTotal(req, res) {
	var sql =
		"select cod_articulo as id, descrip_ARTI_WEB  as d, precio_vta as p, web_imagen as img \
      from articulos a, listas_items i \
      where a.cod_articulo=i.articulo \
      and i.lista_codi='2' \
      and activo='S'\
      and (cod_articulo='7000N/4' \
      or cod_articulo='EVO700N/10W40/4'\
      or cod_articulo='9000/4'\
      or cod_articulo='INEOFIRST4'\
      or cod_articulo='EVO500D/15W40/4'\
      or cod_articulo='GEAR8/75W80/1'\
      or cod_articulo='GLACELF/AMA/1'\
      or cod_articulo='GLACELF/ROJO/1')";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}
function ofertasSelenia(req, res) {
	var sql =
		"select cod_articulo as id, descrip_ARTI_WEB  as d, precio_vta as p, web_imagen as img \
      from articulos a, listas_items i \
      where a.cod_articulo=i.articulo \
      and i.lista_codi='2' \
      and activo='S'\
      and (cod_articulo='SYNTIUM/1000/10W40/4' \
      or cod_articulo='SELENIA/K/15W40/4'\
      or cod_articulo='SELENIA/5W30/4'\
      or cod_articulo='SELENIA/5W40/4'\
      or cod_articulo='PARAFLU/ROJO'\
      or cod_articulo='PARAFLU/VERDE'\
      or cod_articulo='TAMBOR/MACH5/15W40'\
      or cod_articulo='BALDE/MACH5/20W50')";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}

// function ofertasPuma(req,res){
//    var sql="select cod_articulo as id, descrip_ARTI_WEB  as d, precio_vta as p, web_imagen as img \
//    from articulos a, listas_items i \
//    where a.cod_articulo=i.articulo \
//    and i.lista_codi='2' \
//    and activo='S'\
//    and (cod_articulo='PE/15W40/4' \
//    or cod_articulo='PE/20W50/4'\
//    or cod_articulo='PE/10W40/4'\
//    or cod_articulo='PE/5W40/4'\
//    or cod_articulo='PE/5W40/4'\
//    or cod_articulo='PARAFLU/VERDE'\
//    or cod_articulo='TAMBOR/MACH5/15W40'\
//    or cod_articulo='BALDE/MACH5/20W50')"
//    con.query(sql,function(error,resultado,fields){
//          if (error) {
//                console.log("Hubo un error en la consulta", error.message);
//                return res.status(500).send("Hubo un error en la consulta");
//          }
//          res.send(JSON.stringify(resultado.recordsets[0]));
//      });
// }

function ofertasPuma(req, res) {
	var sql =
		"select cod_articulo as id, descrip_ARTI_WEB  as d, cant_stock as stock, precio_vta as p, web_imagen as img  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='27' and web_publi='S' and activo='S'";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}

function ofertasVarios(req, res) {
	var sql =
		"select cod_articulo as id, descrip_ARTI_WEB  as web, precio_vta as p, web_imagen as img \
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
      or cod_articulo='LOCXCM')";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}
function obtenerVinto(req, res) {
	var sql =
		"select cod_articulo as id, descrip_ARTI_WEB  as web, cant_stock as stock, precio_vta as p, web_imagen as img  from articulos a, listas_items i where a.cod_articulo=i.articulo and i.lista_codi='2' and a.agru_1='33' and web_publi='S' and activo='S'";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}
function ventasPorAgrupacion(req, res) {
	var id = req.query.id;
	var fechaDesde = req.query.fechaDesde;
	var fechaHasta = req.query.fechaHasta;
	var sql = `factu_venta_arti_lista '${fechaDesde}', '${fechaHasta}', @agru_1=${id}`;
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}
function ventasGenerales(req, res) {
	var fechaDesde = req.query.fechaDesde;
	var fechaHasta = req.query.fechaHasta;
	var sql = `factu_venta_arti_lista '${fechaDesde}', '${fechaHasta}'`;
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}

function obtenerStockArticulo(req, res) {
	var id = req.query.id;
	var sql =
		"select cod_articulo as id,  cant_stock as s from articulos WHERE cod_articulo=" +
		id;
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un erroraaa en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}

function obtenerListadoArticulosPorLista(req, res) {
	var sql = `
    SELECT
        a.cod_articulo AS id,
        a.agru_1 AS agru,
        a.descrip_arti AS d,
        a.desc_adicional AS da,
        a.FECHA_ULTIMO_MOV AS fum,
        a.cant_stock AS s,
        a.precio_uni AS p,
        a.um AS UM,
        i.lista_codi AS lista,
        i.precio_vta AS pr
    FROM
        articulos a
    JOIN
        listas_items i ON a.cod_articulo = i.articulo
    WHERE
        a.ACTIVO = 'S' AND
        a.FECHA_ULTIMO_MOV IS NOT NULL
    ORDER BY
        a.cod_articulo, i.lista_codi;
    `;

	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}

		// Procesar los resultados para agrupar precios por artículo
		const articulos = {};
		resultado.forEach((row) => {
			if (!articulos[row.id]) {
				articulos[row.id] = {
					id: row.id,
					agru: row.agru,
					d: row.d,
					da: row.da,
					fum: row.fum,
					s: row.s,
					p: row.p,
					UM: row.UM,
					precios: {},
				};
			}
			articulos[row.id].precios[row.lista] = row.pr;
		});

		res.send(JSON.stringify(Object.values(articulos)));
	});
}

function obtenerListadoArticulos(req, res) {
	// var sql= "select a.cod_articulo as id,  a.descrip_arti as d, a.desc_adicional as da, a.FECHA_ULTIMO_MOV as fum, a.cant_stock as s,  a.precio_uni as p, um as UM, i.precio_vta as pr from articulos  a join listas_items i on a.cod_articulo=i.articulo WHERE ACTIVO='S' AND FECHA_ULTIMO_MOV IS NOT NULL ORDER BY FECHA_ULTIMO_MOV DESC;";

	var sql = `SELECT
    a.cod_articulo AS id,
    a.agru_1 AS agru,
    a.descrip_arti AS d,
    a.desc_adicional AS da,
    a.FECHA_ULTIMO_MOV AS fum,
    a.cant_stock AS s,
    a.precio_uni AS p,
    a.um AS UM,
    i.precio_vta AS pr
FROM
    articulos a
JOIN
    listas_items i ON a.cod_articulo = i.articulo
WHERE
    a.ACTIVO = 'S' AND
    i.lista_codi = '2' 
ORDER BY
    id DESC;`;

	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un erroraaa en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}

function obtenerAgrupacionDeArticulo(req, res) {
	var sql =
		"select COD_ARTICULO as codigo, descrip_agru as agrupacion from ARTICULOS, Agrupaciones where Articulos.agru_1 =  Agrupaciones.codi_agru";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}

function getExpenses(req, res) {
	let agrupation = 4;
	let concept = 0;
	var array = [];
	var mes = req.params.mes;

	//     'https://spreadsheets.google.com/feeds/list/'+worksheet_id+'/'+tab_id+'/public/values?alt=json'
	//  'https://sheets.googleapis.com/v4/spreadsheets/'+worksheet_id+'/values/'+tab_name+'?alt=json&key='+key-value'

	//    fetch('https://spreadsheets.google.com/feeds/list/1fs4IueRVxWYz_pFKiE-hEpMJmvFdfaMxxJP8bSpkmAg/' + agrupation + '/public/full?alt=json')AIzaSyC4qg3Mvjc5kFuVenzqV4aLnXBuBFwWLTM
	fetch(
		"https://sheets.googleapis.com/v4/spreadsheets/1fs4IueRVxWYz_pFKiE-hEpMJmvFdfaMxxJP8bSpkmAg/values/Resumen?alt=json&key=AIzaSyC4qg3Mvjc5kFuVenzqV4aLnXBuBFwWLTM"
	)
		.then((response) => response.json())

		.then((data) => {
			console.log(data);

			if (mes == "01") {
				console.log("aca esta el mes");
				array.push({
					salarios: data.values[1][1],
					fijos: data.values[2][1],
					extraordinarios: data.values[3][1],
					total: data.values[4][1],
				});
			} else if (mes == "02") {
				array.push({
					salarios: data.values[1][2],
					fijos: data.values[2][2],
					extraordinarios: data.values[3][2],
					total: data.values[4][2],
				});
			} else if (mes == "03") {
				array.push({
					salarios: data.values[1][3],
					fijos: data.values[2][3],
					extraordinarios: data.values[3][3],
					total: data.values[4][3],
				});
			} else if (mes == "04") {
				array.push({
					salarios: data.values[1][4],
					fijos: data.values[2][4],
					extraordinarios: data.values[3][4],
					total: data.values[4][4],
				});
			} else if (mes == "05") {
				array.push({
					salarios: data.values[1][5],
					fijos: data.values[2][5],
					extraordinarios: data.values[3][5],
					total: data.values[4][5],
				});
			} else if (mes == "06") {
				array.push({
					salarios: data.values[1][6],
					fijos: data.values[2][6],
					extraordinarios: data.values[3][6],
					total: data.values[4][6],
				});
			} else if (mes == "07") {
				array.push({
					salarios: data.values[1][7],
					fijos: data.values[2][7],
					extraordinarios: data.values[3][7],
					total: data.values[4][7],
				});
			} else if (mes == "08") {
				array.push({
					salarios: data.values[1][8],
					fijos: data.values[2][8],
					extraordinarios: data.values[3][8],
					total: data.values[4][8],
				});
			} else if (mes == "09") {
				array.push({
					salarios: data.values[1][9],
					fijos: data.values[2][9],
					extraordinarios: data.values[3][9],
					total: data.values[4][9],
				});
			} else if (mes == "10") {
				array.push({
					salarios: data.values[1][10],
					fijos: data.values[2][10],
					extraordinarios: data.values[3][10],
					total: data.values[4][10],
				});
			} else if (mes == "11") {
				array.push({
					salarios: data.values[1][11],
					fijos: data.values[2][11],
					extraordinarios: data.values[3][11],
					total: data.values[4][11],
				});
			} else if (mes == "12") {
				array.push({
					salarios: data.values[1][12],
					fijos: data.values[2][12],
					extraordinarios: data.values[3][12],
					total: data.values[4][12],
				});
			}
			res.send(JSON.stringify(array));
		});
	console.log(array);
}

function validateUser(req, res) {
	let password = req.query.password;
	console.log(password);

	if (password == "4963") {
		res
			.status(201)
			.json({ message: "Validated user", status: 201, type: "internal" });
	} else if (password == "311") {
		res.status(201).json({
			message: "Validated user",
			status: 201,
			type: "client",
			clientName: "ELIAS YANI S.R.L.",
		});
	} else {
		res
			.status(422)
			.json({ message: "invalid password", status: 422, type: false });
	}
}

function ultimasVentas(req, res) {
	var numCliente = req.query.numCliente;

	var clientArray;
	let clietnes = `select RAZON, CUIT, LUGAR_ENTREGA, LOCALIDAD, PROVINCIA, DOMICILIO, CP from clientes where NUM_CLIENTE='${numCliente}';`;

	con.query(clietnes, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}
		if (resultado.recordsets[0][0].PROVINCIA == "CF") {
			resultado.recordsets[0][0].PROVINCIA = "CAPITAL FEDERAL";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "BA") {
			resultado.recordsets[0][0].PROVINCIA = "BUENOS AIRES";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "CA") {
			resultado.recordsets[0][0].PROVINCIA = "CAAMARCA";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "CHA") {
			resultado.recordsets[0][0].PROVINCIA = "CHACO";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "CHU") {
			resultado.recordsets[0][0].PROVINCIA = "CHUBUT";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "COR") {
			resultado.recordsets[0][0].PROVINCIA = "CORDOBA";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "CO") {
			resultado.recordsets[0][0].PROVINCIA = "CORRIENTES";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "ER") {
			resultado.recordsets[0][0].PROVINCIA = "ENTRE RIOS";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "FO") {
			resultado.recordsets[0][0].PROVINCIA = "FORMOSA";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "JU") {
			resultado.recordsets[0][0].PROVINCIA = "JUJUY";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "LP") {
			resultado.recordsets[0][0].PROVINCIA = "LA PAMPA";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "LR") {
			resultado.recordsets[0][0].PROVINCIA = "LA RIOJA";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "ME") {
			resultado.recordsets[0][0].PROVINCIA = "MENDOZA";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "MI") {
			resultado.recordsets[0][0].PROVINCIA = "MISIONES";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "NE") {
			resultado.recordsets[0][0].PROVINCIA = "NEUQUEN";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "RN") {
			resultado.recordsets[0][0].PROVINCIA = "RIO NEGRO";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "SA") {
			resultado.recordsets[0][0].PROVINCIA = "SALTA";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "SJ") {
			resultado.recordsets[0][0].PROVINCIA = "SAN JUAN";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "SL") {
			resultado.recordsets[0][0].PROVINCIA = "SAN LUIS";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "SC") {
			resultado.recordsets[0][0].PROVINCIA = "SANTA CRUZ";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "SF") {
			resultado.recordsets[0][0].PROVINCIA = "SANTA FE";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "SE") {
			resultado.recordsets[0][0].PROVINCIA = "SANTIDO DEL ESTERO";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "TF") {
			resultado.recordsets[0][0].PROVINCIA = "TIERRA DEL FUEGO";
		}
		if (resultado.recordsets[0][0].PROVINCIA == "TUC") {
			resultado.recordsets[0][0].PROVINCIA = "TUCUMAN";
		}

		console.log(resultado.recordsets[0][0]);
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}

function obtenerArticulo(req, res) {
	var id = req.params.id;
	var sql =
		"select * from articulos WHERE cod_articulo LIKE '%" +
		id +
		"%' OR DESCRIP_ARTI LIKE  '%" +
		id +
		"%' OR DESC_ADICIONAL LIKE  '%" +
		id +
		"%'";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un erroraaa en la consulta");
		}
		console.log(resultado);
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
}

const listadoClientes = (req, res) => {
	var sql =
		"select num_cliente as n, lugar_entrega as le, gln as t, razon as id, GLN as observacionPedido from clientes";
	// "select *GLN  from clientes";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un erroraaa en la consulta");
		}
		console.log(resultado);
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
};

const comprobantesVencidos = (req, res) => {
	var nroCliente = req.params.nroCliente;
	var sql = `SELECT * FROM COMP_EMITIDOS  WHERE ESTADO='PEN' AND CLIENTE='${nroCliente}' AND (TIPO='FEA'  OR TIPO='FCN' OR TIPO='FEB')  ORDER BY FECHA`;
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un erroraaa en la consultaaa");
		}
		const filteredResult = console.log(resultado);
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
};

const getSpecificArticle = (req, res) => {
	let article = req.query.article;
	console.log(article);
	var sql =
		" SELECT \
  a.cod_articulo AS id, \
  a.descrip_arti AS d, \
  i.precio_vta AS p, \
  a.cant_stock AS s \
FROM articulos a \
JOIN listas_items i ON a.cod_articulo = i.articulo \
WHERE a.cod_articulo = '" +
		article +
		"' \
  AND a.activo = 'S' \
  AND i.lista_codi = '2' \
ORDER BY id ASC;";
	// var sql = "SELECT * FROM articulos WHERE cod_articulo = '" + article + "'";

	// var sql =
	// "select * from articulos WHERE cod_articulo LIKE '%" +
	// article +
	// "%' OR DESCRIP_ARTI LIKE  '%" +
	// article +
	// "%' OR DESC_ADICIONAL LIKE  '%" +
	// article +
	// "%'";
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un erroraaa en la consultaaa");
		}
		const filteredResult = console.log(resultado);
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
};

const generalValidateUser = async (req, res) => {
	let password = req.body.password;
	let numCliente = req.body.numCliente;
	console.log("PASSWORD", password);
	console.log("NUM CLIENTE", numCliente);
	const sql = `select RAZON, CUIT, NUM_CLIENTE, GLN, LUGAR_ENTREGA, LOCALIDAD, TELEFONO, PROVINCIA, DOMICILIO, CP from clientes where NUM_CLIENTE='${numCliente}';`;

	try {
		const resultado = await new Promise((resolve, reject) => {
			con.query(sql, function (error, resultado, fields) {
				if (error) {
					console.log("Hubo un error en la consulta", error.message);
					reject(error);
				} else {
					resolve(resultado.recordsets[0][0]);
				}
			});
		});

		console.log("CUIT", resultado.CUIT.toString());
		if (
			password.replace(/[^0-9]/g, "") ==
			resultado.CUIT.toString().replace(/[^0-9]/g, "")
		) {
			res.status(201).json({
				status: 201,
				type: "client",
				name: resultado.RAZON,
				fiscalValue: resultado.CUIT,
				address: resultado?.DOMICILIO,
				city: resultado.LOCALIDAD,
				phone: resultado.TELEFONO,
				clientId: resultado.NUM_CLIENTE,
				preference: resultado.GLN,
			});
		} else {
			res.status(401).send("Invalid password");
		}
	} catch (error) {
		console.log("Hubo un error en la consulta", error.message);
		res.status(500).send("Hubo un error en la consulta");
	}
};

const getClient = async (req, res) => {
	let clientId = req.query.clientId;
	console.log("Client ID", clientId);
	const sql = `select * from clientes where NUM_CLIENTE='${clientId}';`;

	try {
		const resultado = await new Promise((resolve, reject) => {
			con.query(sql, function (error, resultado, fields) {
				if (error) {
					console.log("Hubo un error en la consulta", error.message);
					reject(error);
				} else {
					resolve(resultado.recordsets[0][0]);
					res.status(200).json(resultado.recordsets[0][0]);
				}
			});
		});
	} catch (error) {
		console.log("Hubo un error en la consulta", error.message);
		res.status(500).send("Hubo un error en la consulta");
	}
};

const getClientVouchers = (req, res) => {
	let clientId = req.query.clientId;
	var sql = `SELECT *
  FROM COMP_EMITIDOS
  WHERE CLIENTE='${clientId}'
      AND (TIPO='FEA' OR TIPO='FCN' OR TIPO='FEB' OR TIPO='CEA')
      AND FECHA >= DATEADD(DAY, -365, GETDATE())

  ORDER BY FECHA;`;
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un erroraaa en la consultaaa");
		}
		const filteredResult = console.log(resultado);
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
};

module.exports = {
	obtenerListas: obtenerListas,
	obtenerListaDetalle: obtenerListaDetalle,
	obtenerOfertasFram: obtenerOfertasFram,
	obtenerOfertasKits: obtenerOfertasKits,
	obtenerOfertasMensuales: obtenerOfertasMensuales,
	obtenerStockCritico: obtenerStockCritico,
	informacionPedidos: informacionPedidos,
	informacionPedidosFecha: informacionPedidosFecha,
	ofertasValvoline: ofertasValvoline,
	ofertasMotul: ofertasMotul,
	ofertasTotal: ofertasTotal,
	ofertasSelenia: ofertasSelenia,
	ofertasValvolineVarios: ofertasValvolineVarios,
	ofertasVarios: ofertasVarios,
	obtenerVinto: obtenerVinto,
	ventasPorAgrupacion: ventasPorAgrupacion,
	ventasGenerales: ventasGenerales,
	obtenerStockArticulo: obtenerStockArticulo,
	obtenerAgrupacionDeArticulo: obtenerAgrupacionDeArticulo,
	remateMercaderia: remateMercaderia,
	clientesPorVendedor: clientesPorVendedor,
	getExpenses: getExpenses,
	validateUser: validateUser,
	stockNegativo: stockNegativo,
	ultimasVentas: ultimasVentas,
	obtenerArticulo: obtenerArticulo,
	obtenerListadoArticulos: obtenerListadoArticulos,
	ofertasPuma: ofertasPuma,
	listadoClientes: listadoClientes,
	comprobantesVencidos: comprobantesVencidos,
	generalValidateUser: generalValidateUser,
	validateUser: validateUser,
	getClient: getClient,
	getClientVouchers: getClientVouchers,
	getSpecificArticle: getSpecificArticle,
	stockByUm: stockByUm,
	detailedUm: detailedUm,
	inventoryByUM: inventoryByUM,
	obtenerListadoArticulosPorLista: obtenerListadoArticulosPorLista,
};
