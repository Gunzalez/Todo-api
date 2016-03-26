var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [];
var _ = require('underscore');
var db = require('./db.js');

app.use(bodyParser.json());

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


// get all todos, allows search on completed and q
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


// delete a todo
app.delete('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id);
    db.todo.destroy({ where : { id: todoId }}).then(function(deletedItems) {
        if(deletedItems > 0){
            //res.json({Massage: deletedItems + ' record(s) was deleted'});
            res.send(204);
        } else {
            res.status(400).json({error:'No todo with id of ' + todoId});
        }
    }).catch(function(error){
        res.status(500).json(error);
    });
});


// update a todo
app.put('/todos/:id', function(req, res){

	var body = _.pick(req.body, 'description', 'completed');
    var todoId = parseInt(req.params.id);
	var attributes = {};

	if(body.hasOwnProperty('completed')){
		attributes.completed = body.completed;
	}

	if(body.hasOwnProperty('description')){
		attributes.description = body.description
	}

    db.todo.findById(todoId).then(function(todo){
        if(todo){
            todo.update(attributes).then(function(todo){
                res.json(todo.toJSON());
            }, function(error){
                res.status(400).json(error);
            });
        } else {
            res.status(404).send();
        }
    }, function(){
        res.status(500).send();
    });
});

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