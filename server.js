var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [];
var _ = require('underscore');
var db = require('./db.js');

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

// add a todo
app.post('/todos', function(req, res){

	var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }).catch(function(error){
        console.log(error);
    });
});


// gets a todo
app.get('/todos/:id', function(req, res){

    var todoId = parseInt(req.params.id);
    db.todo.findById(todoId).then(function(todo){
        if(!!todo){
            res.json(todo);
        } else {
            res.status(404).json({"error":"No Todo found with id: " + todoId});
        }
    }).catch(function(error){
        res.status(500).json(error);
    });

});


// get all todos, search todos
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

// ============================================================

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

// api - gets all todos aka collection
app.get('/todos', function(req, res){

    var query = req.query,
        criteria = {};

    if (query.hasOwnProperty('completed') && query.completed === 'true'){
        criteria.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false'){
        criteria.completed = false;
    }

    if (query.hasOwnProperty('q') && _.isString(query.q) && query.q.trim().length > 0){
        criteria.description = {
            $like: '%'+query.q+'%'
        }
    }

    db.todo.findAll({ where: criteria }).then(function(todos){
        res.json(todos);
    }).catch(function (error) {
        res.status(500).json(error);
    });

});

// ============================================================

// just checking the root works
app.get('/', function(req, res){
    res.send('TODO App ROOT')
});

db.sequelize.sync().then(function(){
    // listening port
    app.listen(PORT, function () {
        console.log('Express server started on port: '+PORT);
    });
});