const levenshtein = require("fastest-levenshtein");
var con = require("../conexionbd");

function getXrefList(req, res) {
	var array = [];
	let shareCode = "15LE40PKCjaXieNVO4MVby8cIaLjCvyEz8uA4Z7ZR3J0";
	let API_KEY = "AIzaSyBf70CQRaHfuWQXBn66jNwB7Gh01L-yXrw";
	let sheetName = "XREF";

	// let param = req.params.param; // Extract the parameter from the URL
	let article = req.query.article;
	fetch(
		`https://sheets.googleapis.com/v4/spreadsheets/${shareCode}/values/${sheetName}?alt=json&key=${API_KEY}`
	)
		.then((data) => data.json())
		.then((data) => {
			console.log(data);

			let suggestions = [];

			for (var i = 1; i < data.values.length; i++) {
				// Check if the parameter matches exactly
				if (
					data.values[i].some(
						(value) => value.toLowerCase() === article.toLowerCase()
					)
				) {
					array.push({
						fram: data.values[i][0],
						tecfil: data.values[i][1],
						wega: data.values[i][2],
						mann: data.values[i][3],
						Mahle: data.values[i][4],
						Wix: data.values[i][5],
					});
				} else {
					// If not an exact match, calculate Levenshtein distance and convert to similarity score
					let distances = data.values[i].map((value) =>
						levenshtein.distance(article, value)
					);
					let minDistance = Math.min(...distances);

					// You may want to adjust a threshold for what you consider a good match
					if (minDistance <= 1.5) {
						// Add only the codes that are similar
						let similarCodes = data.values[i].filter((value) => {
							return levenshtein.distance(article, value) <= 1.5;
						});
						suggestions.push(...similarCodes);
					}
				}
			}

			res.send(JSON.stringify({ results: array, suggestions }));
		})
		.catch((error) => {
			console.error("Error fetching data:", error);
			res.status(500).send("Internal Server Error");
		});
}

const getSpecificArticle = (req, res) => {
	let article = req.query.article;
	console.log(article);

	// Try to find an exact match based on a.cod_articulo
	var sqlExact = `SELECT
        a.cod_articulo AS id,
        a.descrip_arti AS d,
        i.precio_vta AS p,
        ag.codi_agru AS r,
        a.cant_stock AS s
      FROM articulos a
      JOIN agrupaciones ag ON a.agru_2 = ag.codi_agru
      JOIN listas_items i ON a.cod_articulo = i.articulo
      WHERE a.cod_articulo = '${article}'
        AND a.activo = 'S'
        AND i.lista_codi = '2'
        AND ag.descrip_agru <> 'AGRUPACION PRUEBA'
        AND ag.descrip_agru <> 'OFERTAS FRAM'
      ORDER BY r ASC, id ASC;`;

	con.query(sqlExact, function (error, exactResult, fields) {
		if (error) {
			console.log("Hubo un error en la consulta (exact match)", error.message);
			return res.status(500).send("Hubo un error en la consulta");
		}

		// If there's an exact match, send only that result
		if (exactResult.length > 0) {
			return res.send(JSON.stringify(exactResult));
		}

		// If no exact match, try a similar match based on a.cod_articulo and a.descrip_arti
		var sqlSimilar = `SELECT
            a.cod_articulo AS id,
            a.descrip_arti AS d,
            i.precio_vta AS p,
            ag.codi_agru AS r,
            a.cant_stock AS s
          FROM articulos a
          JOIN agrupaciones ag ON a.agru_2 = ag.codi_agru
          JOIN listas_items i ON a.cod_articulo = i.articulo
          WHERE (a.cod_articulo LIKE '%${article}%' OR
                 a.descrip_arti LIKE '%${article}%')
            AND a.activo = 'S'
            AND i.lista_codi = '2'
            AND ag.descrip_agru <> 'AGRUPACION PRUEBA'
            AND ag.descrip_agru <> 'OFERTAS FRAM'
          ORDER BY r ASC, id ASC;`;

		// ...

		con.query(sqlSimilar, function (error, similarResult, fields) {
			if (error) {
				console.log(
					"Hubo un error en la consulta (similar match)",
					error.message
				);
				return res.status(500).send("Hubo un error en la consulta");
			}

			// Extract and send only the relevant data from the first recordset
			const responseData =
				similarResult &&
				similarResult.recordsets &&
				similarResult.recordsets[0];

			if (responseData && responseData.length > 0) {
				res.send(JSON.stringify(responseData));
			} else {
				res.send(JSON.stringify([])); // Send an empty array if no results found
			}
		});

		// Send the result of the similar match
	});
};

module.exports = {
	getSpecificArticle: getSpecificArticle,
	getXrefList: getXrefList,
};
