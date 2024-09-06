const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const db = knex({
	client: 'pg',
	connection:{
		host: '127.0.0.1',
		user: 'postgres',
		password: '12',
		database: 'family_connect'
	}
})
db.select('*').from('login').then(data => {
	console.log(data);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());
const Database = {
	Users: [
		{
			id:'123',
			name: 'michael',
			email: 'okidi.michael@gmail.com',
			password: 'okm',
			rank: 0,
			Joined: new Date()
		},
		{
			id: '124',
			name: 'ocen',
			email: 'ogen@gmail.com',
			password: 'ogen',
			rank: 0,
			Joined: new Date()
		},

		{
			id: '125',
			name: 'apio',
			email: 'apio@gmail.com',
			password: 'apio',
			rank: 0,
			Joined: new Date()
		}
	]
}

app.post('/Signin', (req, res) =>{

			/*if(req.body.email===Database.Users[0].email && req.body.password===Database.Users[0].password){
				res.json('Success');
				Database.Users[0].rank++;
			} else{
				res.status(404).json('Incorrect username and password  match')
				}*/
db.select('email', 'has').from('login')
.where('email', '=', req.body.email)
.then(data => {
	const isValid = bcrypt.compareSync(req.body.password, data[0].has)
	if (isValid){
		res.json('Success')
		 db.select('*').from('users').where('email', '=', req.body.email)
		.increment('rank', 1)
		.returning ('rank')
		.then(response =>{
		console.log(response[0]);
			})
		return db.select('*').from('users').where('email', '=', req.body.email)
		.returning ('users')
		.then(data =>{
	console.log(data[0]);
	    })
	}else {
		res.status(404).json("Wrong Credentials")
	}
}).catch(err => { res.status(404).json('Error logging in')})


	});

app.post('/register', (req, res) =>{
	const {name, email, password} = req.body
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			has: hash,
			email: email
		}).into('login')
		.returning('email')
		.then(loginEmail => {
				return trx('users')
				.returning('*')
				.insert({
					email: email,
					name: name,
					joined: new Date()
				}).then(user =>{
				res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	
	.catch(err => { res.status(404).json("Unable to register")})
})

app.get('/Users', (req, res) =>{
	/*res.json(Database.Users[Database.Users.length-1]);*/
	res.json(Database.Users);
})
app.get('/Profile/:id', (req, res) =>{
	const { id } = req.body;
	let found = false;
	Database.Users.forEach(user =>{
		if (Users.id === id){
			found = true;
		return res.json(Users);	
	}

	})
	if(!found){
		res.json('User not found')
	/*else{
	res.json('No user found');
	}*/
	
	}
})

app.post('/rankk', (req, res) =>{
	const { id } = req.body;
	let found = false;
	Database.Users.forEach(user =>{
		if (user.id === id){
			found = true;
			user.rank++
		return res.json(user);	
	}

	})
	if(!found){
		res.json('User not found')
	/*else{
	res.json('No user found');
	}*/
	
	}
})

app.put('/ChangePass', (req, res) =>{
/*for(var i=0; i<Database.Users.length; i++){*/

			if(req.body.name===Database.Users[0].name && req.body.email===Database.Users[0].email){
				res.json(Database.Users[0]);
				
			} else{
				res.status(404).json('User not found')
				}
/*}*/	});

app.listen(3003, () => {
	console.log('app is running on port 3003');
})