/// <reference path='..\types\DefinitelyTyped\node\node.d.ts'/>
	/// <reference path='..\types\DefinitelyTyped\express\express.d.ts'/>
	
interface UserInterface {
	getName(): string;
	getEmail(): string;
}

class User implements UserInterface {
	private name : string;
	private email: string;
	constructor(name: string, email: string) {
		this.name = name;
		this.email = email;
	}
	getName() {
		return this.name;
	}
	getEmail() {
		return this.email;
	}
}

class Router {
	constructor() {
		var express = require('express');
		var router = express.Router();

		/* GET home page. */
		router.get('/', function(req, res, next) {
			res.render('index', { title: 'Express' });
		});

		/* GET Hello World page. */
		router.get('/helloworld', function(req, res) {
		  res.render('helloworld', { title: 'Hello, World!' });
		});
		
		/* GET altered Hello World page. */
		router.get('/harroworld', function(req, res) {
		  res.render('helloworld', { title: 'harro brandon.' });
		});

		/* Get the Userlist page. */
		router.get('/userlist', function(req, res) {
			var db = req.db;
			var collection = db.get('usercollection');
			collection.find({}, {}, function(e, docs) {
				res.render('userlist', {
					'userlist': docs
			});
			});
		});

		/* Get the new user page. */
		router.get('/newuser', function(req, res) {
			res.render('newuser', {title : 'Add New User'})
		});

		/* POST to Add User Service */
		router.post('/adduser', function(req, res) {

			// Set our internal DB variable
			var db = req.db;
			
			// Create a new user
			var newUser = new User(req.body.username, req.body.useremail);

			// Set our collection
			var collection = db.get('usercollection');

			// Insert the user to the DB
			collection.insert({
				"username" : newUser.getName(),
				"email" : newUser.getEmail()
			}, function (err, doc) {
				if (err) {
					// If it failed, return error
					res.send("There was a problem adding the information to the database.");
				}
				else {
					// And forward to success page
					res.redirect("userlist");
				}
			});
		});
		module.exports = router;
	}
}

var router = new Router()

