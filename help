MongoDB

meteor mongo

db.tasks.insert({ text: "Hello world!", createdAt: new Date() });

db.tasks.find()
db.tasks.find({ text: "Hello world!"});
db.tasks.remove({ text: "Hello world!"});
db.foosrank1v1.find( { $or: [ { winner1: { $eq: "James" } }, { loser1: "James" } ] } )
db.foosrank1v1.find( { matchDate: { $regex: '2016-11-' }}  )

db.doubleplayers.find( { player1: "James", player2: "Tanya"}  )


db.foosrank1v1.find( { 
	$and: [ {winner1: { $eq: 'James' }}, {loser1: { $eq: 'Tanya' }} ]
} )

db.foosrank1v1.find( { 
	$and: [
		{matchDate: { $regex: '2016-11-' }},
		{ $or: [ { winner1: { $eq: "James" } }, { loser1: "James" } ] }
	]
} )

db.foosrank2v2.find( { 
	$or: [ 
			{ winner: {player1: "James", player2: "Tanya"} },
			{ loser: {player1: "James", player2: "Tanya"} } 
	]
} )

db.foosrank1v2.find(  {winner: {player1: "James"}} )
db.foosrank1v2.find({ $or: [ 
		{ winner: {player1: "James"}},
		{ loser: {player1: "James", player2: {$exists: false}}},
] })

db.tasks.update({text: "James Wang"}, { $set: { text: "Hello world!"}}, { multi: true });
db.singleplayers.update({name: "zzz"}, { $set: { name: "zzz"}}, { upsert: true });

//===========Stubs
db.singleplayers.remove({});
db.doubleplayers.remove({});
db.foosrank1v1.remove({});
db.foosrank1v2.remove({});
db.foosrank2v2.remove({});

db.singleplayers.insert({ name: "James"});
db.singleplayers.insert({ name: "Tanya"});
db.singleplayers.insert({ name: "Tom"});
db.singleplayers.insert({ name: "Cat"});

db.doubleplayers.insert({ player1: "James", player2: "Tanya"});
db.doubleplayers.insert({ player1: "Cat", player2: "Tom"});

db.foosrank1v1.insert({ winner1: "James", loser1: "Tanya", matchDate: "2016-11-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Tanya", matchDate: "2016-12-01"});
db.foosrank1v1.insert({ winner1: "Tanya", loser1: "James", matchDate: "2016-10-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Tanya", matchDate: "2016-11-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Tanya", matchDate: "2016-12-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Tanya", matchDate: "2016-12-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Tanya", matchDate: "2016-11-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Tom", matchDate: "2016-09-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Tanya", matchDate: "2016-08-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Tanya", matchDate: "2016-07-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Cat", matchDate: "2016-06-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Tanya", matchDate: "2016-05-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Cat", matchDate: "2016-04-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Cat", matchDate: "2016-03-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Tom", matchDate: "2016-02-01"});
db.foosrank1v1.insert({ winner1: "James", loser1: "Tanya", matchDate: "2016-01-01"});

db.foosrank1v1.insert({ winner1: "Tanya", loser1: "James", matchDate: "2016-11-01"});
db.foosrank1v1.insert({ winner1: "Tanya", loser1: "James", matchDate: "2016-11-01"});
db.foosrank1v1.insert({ winner1: "Tanya", loser1: "James", matchDate: "2016-04-01"});
db.foosrank1v1.insert({ winner1: "Tanya", loser1: "James", matchDate: "2016-03-01"});
db.foosrank1v1.insert({ winner1: "Tanya", loser1: "James", matchDate: "2016-10-01"});
db.foosrank1v1.insert({ winner1: "Tanya", loser1: "James", matchDate: "2016-12-01"});

db.foosrank1v1.insert({ winner1: "Cat", loser1: "James", matchDate: "2016-10-01"});
db.foosrank1v1.insert({ winner1: "Cat", loser1: "James", matchDate: "2016-04-01"});
db.foosrank1v1.insert({ winner1: "Cat", loser1: "James", matchDate: "2016-09-01"});
db.foosrank1v1.insert({ winner1: "Cat", loser1: "James", matchDate: "2016-12-01"});
db.foosrank1v1.insert({ winner1: "Cat", loser1: "James", matchDate: "2016-10-01"});


db.foosrank1v1.insert({ winner1: "Tom", loser1: "James", matchDate: "2016-11-01"});
db.foosrank1v1.insert({ winner1: "Tom", loser1: "James", matchDate: "2016-07-01"});
db.foosrank1v1.insert({ winner1: "Tom", loser1: "James", matchDate: "2016-04-01"});
db.foosrank1v1.insert({ winner1: "Tom", loser1: "James", matchDate: "2016-02-01"});
db.foosrank1v1.insert({ winner1: "Tom", loser1: "James", matchDate: "2016-11-01"});


db.foosrank2v2.insert({ 
	winner: {player1: "James", player2: "Tanya"},
	loser: {player1: "Cat", player2: "Tom"}, 
	matchDate: "2016-11-01"});



db.foosrank1v2.insert({ 
	winner: {player1: "James", player2: "Tanya"},
	loser: {player1: "Cat"}, 
	matchDate: "2016-10-01"});

db.foosrank1v2.insert({ 
	winner: {player1: "James"},
	loser: {player1: "Cat", player2: "Tom"}, 
	matchDate: "2016-11-01"});


