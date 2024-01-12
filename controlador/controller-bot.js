var con = require("../conexionbd");

const comprobantesVencidosPorCliente = (req, res) => {
	let phoneNumber = req.body.phoneNumber;
	console.log("phoneNumber", phoneNumber);
	// const sqlClient = `select * from clientes where NUM_CLIENTE='${clientId}';`;

	const sqlClient = `SELECT NUM_CLIENTE FROM CLIENTES WHERE TELEFONO='${phoneNumber}'`;
	con.query(sqlClient, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		} else {
			const clientNumber = resultado.recordsets[0][0]?.NUM_CLIENTE;
			console.log(clientNumber);
			var sqlGetBalance = `SELECT NUM, TIPO, FECHA, CLIENTE, TOTAL FROM COMP_EMITIDOS WHERE ESTADO='PEN' AND CLIENTE=${clientNumber} AND (TIPO='FEA' OR TIPO='FCN' OR TIPO='FEB') ORDER BY FECHA`;
			// Assuming you want to send the results as JSON
			con.query(sqlGetBalance, function (error, resultado, fields) {
				if (error) {
					console.log("Hubo un error en la consulta", error.message);
					return res.status(500).send("Hubo un error en la consulta");
				}
				res.json(resultado.recordsets[0][0]);
			});
		}
	});

	// var nroCliente = req.body.nroCliente;
	// var sql = `SELECT NUM, TIPO, FECHA, CLIENTE, TOTAL FROM COMP_EMITIDOS WHERE ESTADO='PEN' AND CLIENTE=${nroCliente} AND (TIPO='FEA' OR TIPO='FCN' OR TIPO='FEB') ORDER BY FECHA`;

	// con.query(sql, function (error, resultado, fields) {
	// 	if (error) {
	// 		console.log("Hubo un error en la consulta", error.message);
	// 		return res.status(500).send("Hubo un error en la consulta");
	// 	}
	// 	// Assuming you want to send the results as JSON
	// 	res.json(resultado);
	// });
};

module.exports = {
	comprobantesVencidosPorCliente: comprobantesVencidosPorCliente,
};
