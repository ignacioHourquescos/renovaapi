var con = require("../conexionbd");

const comprobantesVencidosPorCliente = (req, res) => {
	let phoneNumber = req.query.phoneNumber;
	console.log("phoneNumber", phoneNumber);

	const sqlClient = `SELECT NUM_CLIENTE FROM CLIENTES WHERE TELEFONO='${phoneNumber}'`;
	con.query(sqlClient, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		} else {
			const clientNumber = resultado.recordsets[0][0]?.NUM_CLIENTE;
			var sqlGetBalance = `SELECT NUM, TIPO, FECHA, CLIENTE, TOTAL FROM COMP_EMITIDOS WHERE ESTADO='PEN' AND CLIENTE=${clientNumber} AND (TIPO='FEA' OR TIPO='FCN' OR TIPO='FEB') ORDER BY FECHA`;
			con.query(sqlGetBalance, function (error, resultado, fields) {
				if (error) {
					console.log("Hubo un error en la consulta", error.message);
					return res.status(500).send("Hubo un error en la consulta");
				}
				res.json(resultado.recordsets[0][0]);
			});
		}
	});
};

const getClientNumberByPhoneNumber = (req, res) => {
	let phoneNumber = req.query.phoneNumber;

	const sqlClient = `SELECT NUM_CLIENTE FROM CLIENTES WHERE TELEFONO='${phoneNumber}'`;
	con.query(sqlClient, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		} else {
			const clientNumber = resultado.recordsets[0][0]?.NUM_CLIENTE;
			res.json(clientNumber);
		}
	});
};

module.exports = {
	comprobantesVencidosPorCliente,
	getClientNumberByPhoneNumber,
};
