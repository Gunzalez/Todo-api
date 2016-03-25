var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': 'basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync({
    // force: true
}).then(function(){
    console.log('Everything is synced');

    Todo.findById(6).then(function(todo){
        if(todo){
            console.log(todo.toJSON());
        } else {
            console.log('Does not exist')
        }
    });








    //console.log('1');
    //Todo.create({
    //    description: 'Wash those dishes please'
    //}).then(function(){
    //    console.log('2');
    //    Todo.create({
    //        description: 'Clean your room please'
    //    });
    //}).then(function(){
    //    console.log('3');
    //    Todo.create({
    //        description: 'Added a third'
    //    });
    //}).then(function(){
    //    console.log('Finished!');
    //    //return Todo.findById(1);
    //    return Todo.findAll({
    //        where: {
    //            description: {
    //                $like: '%o%'
    //            }
    //        }
    //    })
    //}).then(function(todos){
    //    if(todos){
    //        todos.forEach(function(todo){
    //            console.log(todo.toJSON());
    //        })
    //    } else {
    //        console.log('No todo found')
    //    }
    //}).catch(function(error){
    //    console.log(error);
    //})

    //console.log('1');
    //Todo.create({
    //    description: 'Wash those dishes'
    //}).then(function(){
    //    console.log('2');
    //    Todo.create({
    //        description: 'Clean your room'
    //    }).then(function(){
    //        console.log('3');
    //        Todo.create({
    //            description: 'Added a third'
    //        }).then(function(){
    //            console.log('Finished');
    //            return Todo.findById(1)
    //
    //        })
    //})
    //}).catch(function(error){
    //    console.log(error);
    //})

});