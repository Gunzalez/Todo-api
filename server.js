var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: "Learn Node.js",
	completed: false
}, {
	id: 2,
	description: "Scratch ass",
	completed: false
}, {
	id: 3,
	description: "Watch new movie",
	completed: true
}]

app.get('/', function(req, res){
	res.send('TODO App ROOT')
});

app.get('/todos', function(req, res){	
	res.json(todos);
});

app.get('/todos/:id', function(req, res){
	var todoId = req.params.id;
	var matchedTodo = false;
	todos.forEach(function (todo) {
		if (todo.id === parseInt(todoId, 10)){
			matchedTodo = todo;
		}
	});
	if(!matchedTodo){
		res.status(404).send();
	} else {
		res.json(matchedTodo);
	}
});

app.listen(PORT, function () {
	console.log('Express server started on port: '+PORT);
})