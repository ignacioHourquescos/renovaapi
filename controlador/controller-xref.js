function getXrefList(req, res) {
	var array = [];
	let shareCode = "15LE40PKCjaXieNVO4MVby8cIaLjCvyEz8uA4Z7ZR3J0";
	let API_KEY = "AIzaSyBf70CQRaHfuWQXBn66jNwB7Gh01L-yXrw";
	let sheetName = "XREF";

	let param = req.params.param; // Extract the parameter from the URL

	fetch(
		`https://sheets.googleapis.com/v4/spreadsheets/${shareCode}/values/${sheetName}?alt=json&key=${API_KEY}`
	)
		.then((data) => data.json())
		.then((data) => {
			console.log(data);

			for (var i = 1; i < data.values.length; i++) {
				// Check if the parameter matches any value in the row
				if (
					data.values[i].some((value) =>
						value.toLowerCase().includes(param.toLowerCase())
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
				}
			}

			res.send(JSON.stringify(array));
		})
		.catch((error) => {
			console.error("Error fetching data:", error);
			res.status(500).send("Internal Server Error");
		});
}

module.exports = {
	getXrefList: getXrefList,
};
