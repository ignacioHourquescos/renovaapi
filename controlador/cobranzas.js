var con = require("../conexionbd");
const constantes = require("../constantes");
const fetch = require("node-fetch");
const dayjs = require("dayjs");

const comprobantesVencidosPorCliente = (req, res) => {
	var nroCliente = req.params.nroCliente;
	var sql = `SELECT NUM, TIPO, FECHA, CLIENTE, TOTAL FROM COMP_EMITIDOS  WHERE ESTADO='PEN' AND CLIENTE='${nroCliente}' AND (TIPO='FEA'  OR TIPO='FCN' OR TIPO='FEB')  ORDER BY FECHA`;
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un erroraaa en la consultaaa");
		}
		const filteredResult = console.log(resultado);
		res.send(JSON.stringify(resultado.recordsets[0]));
	});
};

const comprobantesVencidos = (req, res) => {
	var sql = `SELECT NUM, TIPO, FECHA, CLIENTE, TOTAL FROM COMP_EMITIDOS  WHERE ESTADO='PEN' AND (TIPO='FEA'  OR TIPO='FCN' OR TIPO='FEB')  ORDER BY FECHA`;
	con.query(sql, function (error, resultado, fields) {
		if (error) {
			console.log("Hubo un error en la consulta", error.message);
			return res.status(500).send("Hubo un erroraaa en la consultaaa");
		}

		const currentDate = dayjs();
		const filteredResult = resultado.recordsets[0].filter((item) => {
			const fecha = dayjs(item.FECHA);
			return (
				currentDate.diff(fecha, "days") > 30 &&
				currentDate.diff(fecha, "days") < 90
			);
		});

		res.send(JSON.stringify(filteredResult));
		// res.send(JSON.stringify(resultado.recordsets[0]));
	});
};

module.exports = {
	comprobantesVencidosPorCliente: comprobantesVencidosPorCliente,
	comprobantesVencidos: comprobantesVencidos,
};
