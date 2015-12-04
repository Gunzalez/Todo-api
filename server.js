var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [];
var _ = require('underscore');

app.use(bodyParser.json());

// list of todos
// var todos = [{
// 	id: 1,
// 	description: "Learn Node.js",
// 	completed: false
// }, {
// 	id: 2,
// 	description: "Scratch ass",
// 	completed: false
// }, {
// 	id: 3,
// 	description: "Watch new movie",
// 	completed: true
// }]

app.post('/todos', function(req, res){

	var body = req.body;
	var todo = _.pick(body, 'description', 'completed');
	todo.description = todo.description.trim();

	if(!_.isBoolean(todo.completed) || !_.isString(todo.description) || todo.description.trim().length === 0){
		res.status(400).send();
	} else {
		todo.id = todoNextId;
		todos.push(todo);
		todoNextId++;

		res.json(todos);
	}
});


// just checking the root works
app.get('/', function(req, res){
	res.send('TODO App ROOT')
});

// api - gets all todos aka collection
app.get('/todos', function(req, res){	
	res.json(todos);
});

// api - gets one todo item aka model
app.get('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo){
		res.status(404).send();
	} else {
		res.json(matchedTodo);
	}
});

// api - gets one todo item aka model
app.delete('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo){
		res.status(404).json({"error":"No Todo found with id: " + todoId});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
	
});


// listening port
app.listen(PORT, function () {
	console.log('Express server started on port: '+PORT);
})