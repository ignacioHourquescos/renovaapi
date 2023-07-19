var con = require("../conexionbd");
const constantes = require("../constantes");
const fetch = require("node-fetch");

const generalValidateUser = async (req, res) => {
	let password = req.query.password;
	let numCliente = req.query.numCliente;
	console.log("PASSWORD", password);
	const sql = `select RAZON, CUIT, LUGAR_ENTREGA, LOCALIDAD, PROVINCIA, DOMICILIO, CP from clientes where NUM_CLIENTE='${numCliente}';`;

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

		if (password == resultado.CUIT) {
			res.status(201).json({
				message: "Validated user",
				status: 201,
				type: "client",
				name: "ELIAS YANI S.R.L.",
				id: resultado.CUIT,
			});
			res.send(JSON.stringify(resultado));
		} else {
			res.status(401).send("Invalid password");
		}
	} catch (error) {
		console.log("Hubo un error en la consulta", error.message);
		res.status(500).send("Hubo un error en la consulta");
	}
};

module.exports = {
	generalValidateUser: generalValidateUser,
};
