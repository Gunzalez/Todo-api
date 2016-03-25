var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [];
var _ = require('underscore');

app.use(bodyParser.json());

// list of todos
//var todos = [{
//	id: 1,
//	description: "Learn Node.js",
//	completed: false
//}, {
//	id: 2,
//	description: "Scratch ass",
//	completed: false
//}, {
//	id: 3,
//	description: "Watch new movie",
//	completed: true
//}]

app.post('/todos', function(req, res){

	var body = req.body;
	var todo = _.pick(body, 'description', 'completed');
	todo.description = todo.description.trim();

	if(!_.isBoolean(todo.completed) || !_.isString(todo.description) || todo.description.trim().length === 0){
		res.status(400).send();
	} else {
		todo.id = todoNextId; //
		todos.push(todo);
		todoNextId++;

		res.json(todos);
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

// api - updates one todo item, model
app.put('/todos/:id', function(req, res){

	var body = req.body;
	var todo = _.pick(body, 'description', 'completed');
	var validAttributes = {};
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo){
		return res.status(404).json({"error":"No Todo found with id: " + todoId});
	}

	if(todo.hasOwnProperty('completed') && _.isBoolean(todo.completed)){
		validAttributes.completed = todo.completed;
	} else if (todo.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if(todo.hasOwnProperty('description') && _.isString(todo.description) && todo.description.trim().length > 0){
		validAttributes.description = todo.description
	} else if(todo.hasOwnProperty('description')){
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);	

});

// just checking the root works
app.get('/', function(req, res){
	res.send('TODO App ROOT')
});

// api - gets all todos aka collection
app.get('/todos', function(req, res){

    var queryParams = req.query,
        filteredTodos = todos;

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
        filteredTodos = _.where(filteredTodos, { "completed": true });
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
        filteredTodos = _.where(filteredTodos, { "completed": false });
    }

    if (queryParams.hasOwnProperty('q') && _.isString(queryParams.q) && queryParams.q.trim().length > 0){
        filteredTodos = _.filter(filteredTodos, function(todo){
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });
    }

    res.json(filteredTodos);

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


// listening port
app.listen(PORT, function () {
	console.log('Express server started on port: '+PORT);
})