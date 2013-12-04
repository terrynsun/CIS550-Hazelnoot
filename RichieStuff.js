var http = require('http'),
    mysql = require('db-mysql');

var database = new mysql.Database({
	hostname: 'localhost',
	user: 'loginTest',
	password: 'loginTestPassword',
	database: 'loginTest'
});

var rtn;
database.connect(function(error) {
	if (error) {
		return console.log('CONNECTION error: ' + error);
	}
	this.query('SELECT * FROM ' + this.name('ConnectionTest') + ' WHERE ' + this.name('number') + ' = ' + this.escape('3')).
		execute(function(error, rows, cols) {
			if (error) {
				console.log('ERROR: ' + error);
			}
			rtn = rows;
			rtn = rtn[0];
			console.log(rtn);
		});
});


//Insert (3, 'third column') into ConnectionTest
/*
database.connect(function(error) {
	if (error) {
		return console.log('CONNECTION error: ' + error);
	}
	this.query().
		insert('ConnectionTest',
			['number', 'string'], ['3', 'third row']
		).
		execute(function(error, result){
			if(error){
				console.log('ERROR: ' + error);
				return;
			}
			console.log('GENERATED id: ' + result.id);
		});
});
*/

var server = http.createServer(function (request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Number: " + rtn.number + "\nString: " + rtn.string);
	response.end();
});

server.listen(8000);

console.log("Server tunning at http://127.0.0.1:8000/");
