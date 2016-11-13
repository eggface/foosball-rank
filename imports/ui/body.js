import { Template } from 'meteor/templating';
import { FoosRank1v1 } from '../api/foosball_ranking_tables.js';
import { FoosRank1v2 } from '../api/foosball_ranking_tables.js';
import { FoosRank2v2 } from '../api/foosball_ranking_tables.js';
import { SinglePlayers } from '../api/foosball_ranking_tables.js';
import { DoublePlayers } from '../api/foosball_ranking_tables.js';
import './body.html';

var Highcharts = require('highcharts');

//Initial rates with  {wins:0, counts: 0}
const INIT_DATA = () => {let size = 12, rates = []; while(size--) rates.push({wins: 0, counts: 0}); return rates};

let addSinglePlayer = (player) => {
	console.log("Try to add single player:%s", player);
	//Insert data if not exist
	Meteor.call( 'addSinglePlayer', SinglePlayers.findOne({name: player}), {name: player}, function (error, result) {
		if (error) {
			console.log(error);
		} else {
			//console.log('Method result is: ' + result);
		}
	});
};

let addDoublePlayer = (player1, player2) => {
	console.log("Try to add double players:%s, %s", player1, player2);
	//Insert data if not exist
	Meteor.call( 'addDoublePlayer', DoublePlayers.findOne({player1: player1, player2: player2}), {player1: player1, player2: player2}, function (error, result) {
		if (error) {
			console.log(error);
		} else {
			//console.log('Method result is: ' + result);
		}
	});
};

// return rates array as [100, 50, ...]
let calcRate = (players, competitors) => {
	//console.log("In calcRate()", players, competitors);
	let matchResAll = INIT_DATA();
	let matchRes1v1 = INIT_DATA();
	let matchRes1v2 = INIT_DATA();
	let matchRes2v2 = INIT_DATA();

	//1 vs 1 case
	if(undefined !== players && players.length === 1 &&
		(undefined === competitors || competitors.length === 1)){
			//console.log("It is a single player.");
		matchRes1v1 = calcMatch1v1(players, competitors);
			//console.log("matchRes1v1: ", matchRes1v1);
	}else if(undefined !== players && players.length === 2 &&
		(undefined === competitors || competitors.length === 2)){
		//2 vs 2 case
		//console.log("It is a double players.");
		matchRes2v2 = calcMatch2v2(players, competitors);
		//console.log("matchRes2v2: ",  matchRes2v2);
	}	

	//Not 1v1 or 2v2
	if(undefined === competitors || 
		(undefined !== players && undefined !== competitors && players.length !== competitors.length)){
			//console.log("Check 1v2 collection.");
		matchRes1v2 = calcMatch1v2(players, competitors);
			//console.log("matchRes1v2: ", matchRes1v2);
	}

	//count all results into a new results
	let size = 12;
	while(size--) {
		matchResAll[size] = {
			wins: matchRes1v1[size].wins + matchRes1v2[size].wins + matchRes2v2[size].wins, 
			counts: matchRes1v1[size].counts + matchRes1v2[size].counts + matchRes2v2[size].counts
		};
	}
	//console.log("matchResAll", matchResAll);

	let rates = matchResAll.map(x => {
		return (x.counts > 0) ? parseInt(x.wins * 100 / x.counts) : null;	
	});
	return rates;
};

//match result for 1v1 as array with element {wins, counts}
let calcMatch1v1 = (players, competitors) => {
	let player = players[0];
	let player1v1 = (undefined === competitors) ?
		//All
		FoosRank1v1.find({ $or: [ { winner1: player }, { loser1: player } ] }).fetch():
		FoosRank1v1.find({ 
			$or: [ 
				{ $and: [{winner1: player }, { loser1: competitors[0] } ]},
				{ $and: [{winner1: competitors[0] }, { loser1: player } ]}
			]}).fetch(); 

	if(!player1v1 || player1v1.length === 0){
		console.log("No results");
		return INIT_DATA();
	}
	
	//console.log(player1v1);
	let matchRes = INIT_DATA();
	//console.log("Player is: " + player);
	//calc match results for individual month
	player1v1.map((item, index) => {
		//console.log(item);
		let date = item.matchDate;
		let month = parseInt(date.substr(5, 2));
		matchRes[month - 1].counts++;
		if (item.winner1 === player){
			matchRes[month - 1].wins++;
		}
	});
	return matchRes
};

let calcMatch2v2 = (players, competitors) => {
	//console.log("calcmatch2v2", players, competitors);
	//All matches?
	let collection = (undefined === competitors) ?
		FoosRank2v2.find({ $or: [ 
				{ winner: {player1: players[0], player2: players[1]} },
				{ loser: {player1: players[0], player2: players[1]} } 
		] }).fetch():
		FoosRank2v2.find({ 
			$or: [ 
					{ winner: {player1: players[0], player2: players[1]}, loser: {player1: competitors[0] , player2: competitors[1]} },
					{ loser: {player1: players[0], player2: players[1]}, winner: {player1: competitors[0] , player2: competitors[1]} },
			]}).fetch(); 

	if(!collection || collection.length === 0){
		console.log("No results");
		return INIT_DATA();
	}
	
	//console.log(collection);
	let matchRes = INIT_DATA();
	//console.log("Player is: " + player);
	//calc match results for individual month
	collection.map((item, index) => {
		//console.log(item);
		let date = item.matchDate;
		let month = parseInt(date.substr(5, 2));
		matchRes[month - 1].counts++;
		if (item.winner.player1 === players[0] &&
				item.winner.player2 === players[1]){
			matchRes[month - 1].wins++;
		}
	});
	//console.log(matchRes);
	return matchRes
};

//Calculate 1v2 or 2v1
let calcMatch1v2 = (players, competitors) => {
	//console.log("calcmatch1v2", players, competitors);
	//players should not be 0
	let playersCount = (undefined === players)? 0: players.length;
	let competitorsCount = (undefined === competitors)? 0: competitors.length;

	let collection = {};
	if(undefined === competitors) {
		if(playersCount === 1) {
			//db.foosrank1v2.find(  {winner: {player1: "James"}} )
			collection = FoosRank1v2.find({ $or: [ 
					{ winner: {player1: players[0]}},
					{ loser: {player1: players[0]}},
			] }).fetch();
		}else{
			//count = 2
			collection = FoosRank1v2.find({ $or: [ 
					{ winner: {player1: players[0], player2: players[1]}},
					{ loser: {player1: players[0], player2: players[1]}},
			] }).fetch();
		}	
	}else {
		if(playersCount === 1) {
			//1v2
			collection = FoosRank1v2.find({ $or: [ 
					{ winner: {player1: players[0]}, loser: {player1: competitors[0] , player2: competitors[1]} },
					{ loser: {player1: players[0]}, winner: {player1: competitors[0] , player2: competitors[1]} },
			] }).fetch();
		}else{
			//count = 2
			collection = FoosRank1v2.find({ $or: [ 
					{ winner: {player1: players[0], player2: players[1]}, loser: {player1: competitors[0]}},
					{ loser: {player1: players[0], player2: players[1]}, winner: {player1: competitors[0]} },
			] }).fetch();
		}	
	}
	//console.log("find in 1v2", collection);

	if(!collection || collection.length === 0){
		console.log("No results");
		return INIT_DATA();
	}
	
	//console.log(collection);
	let matchRes = INIT_DATA();
	//console.log("Player is: " + player);
	//calc match results for individual month
	collection.map((item, index) => {
		//console.log(item);
		let date = item.matchDate;
		let month = parseInt(date.substr(5, 2));
		matchRes[month - 1].counts++;
		if (item.winner.player1 === players[0]){
			matchRes[month - 1].wins++;
		}
	});
	//console.log(matchRes);
	return matchRes
};

if (Meteor.isClient) {
	Template.tableTemplate.helpers({
		foosRank1v1() {
			return FoosRank1v1.find({}, { sort: { matchDate: -1 } });
		},
		foosRank1v2() {
			return FoosRank1v2.find({}, { sort: { matchDate: -1 } });
		},
		foosRank2v2() {
			return FoosRank2v2.find({}, { sort: { matchDate: -1 } });
		},
		theSettings1v1() {
			return {
				//showColumnToggles: true,
				showNavigation: 'never',
				rowsPerPage: 999,
				fields: [
					{ key: 'winner1', label: 'Winner' },
					{ key: 'loser1', label: 'Loser' },
					{ key: 'matchDate', label: 'MATCH DATE'}
				]
			};
		},
		theSettings2v2() {
			return {
				//showColumnToggles: true,
				showNavigation: 'never',
				rowsPerPage: 999,
				fields: [
					{ key: 'winner.player1', label: 'Winner Player1' },
					{ key: 'winner.player2', label: 'Winner Player2' },
					{ key: 'loser.player1', label: 'Loser Player1' },
					{ key: 'loser.player2', label: 'Loser Player2' },
					{ key: 'matchDate', label: 'MATCH DATE'}
				]
			};
		}
	});

  Template.chartTemplate.helpers({
		singlePlayers() {
			return SinglePlayers.find({}, { sort: { name: 1 } });
		},
		doublePlayers() {
			return DoublePlayers.find({}, { sort: { player1: 1 } });
		},
		playersChart() {
			let singlePlayers = SinglePlayers.find().fetch(); 
			if(!singlePlayers){
				console.log("Collection is not ready.");
				return;
			}

      // Use Meteor.defer() to craete chart after DOM is ready:
      Meteor.defer(function() {
        // Create standard Highcharts chart with options:
				Highcharts.chart('playersChart', {
					title: {
							text: 'Player Ranking Trend',
							x: -20 //center
					},
					subtitle: {
							text: '',
							x: -20
					},
					xAxis: {
							categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
									'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
					},
					yAxis: {
							title: {
									text: 'Rate (%)'
							},
							max : 100,
							min : 0,
							plotLines: [{
									value: 0,
									width: 1,
									color: '#808080'
							}]
					},
					tooltip: {
							valueSuffix: '%'
					},
					legend: {
							layout: 'vertical',
							align: 'right',
							verticalAlign: 'middle',
							borderWidth: 0
					},
					series: [{
						name: 'Player',
						data: [null,null,null,null,null,null,null,null,null,null,null,null]
					}]
				});//End chart
      });
		} //End playersChart
	});//End chartTemplate.helpers

	//Events:
	Template.body.events({
		'submit .foosRankRecord'(event) {
			// Prevent default browser form submit
			event.preventDefault();
	 
			// Get value from form element
			//console.log(target);
			const target = event.target;
			let winner1 = target.winner1.value.trim();
			let winner2 = target.winner2.value.trim();
			let loser1 = target.loser1.value.trim();
			let loser2 = target.loser2.value.trim();
			let date = target.date.value;
			if(date === ""){
				alert("Please input match date.");
				return;
			}

			//compare player 1 and 2, sorted in ascend
			if(winner1 === "" || 
				(winner2 !== "" && winner1.localeCompare(winner2) > 0)){
				[winner1, winner2] = [winner2, winner1];
			}
			if(loser1 === "" || 
				(loser2 !== "" && loser1.localeCompare(loser2) > 0)){
				[loser1, loser2] = [loser2, loser1];
			}
			//console.log("winner1", winner1);
			//console.log("winner2", winner2);
			//console.log("loser1", loser1);
			//console.log("loser2", loser2);

			if(winner1 === "" || loser1 === ""){
				alert("Please input both winner and loser.");
				return;
			}
			//Insert into tables based on players
			//1vs1
			if(winner2 === "" && loser2 === ""){
				//console.log("1vs1 case", winner1, loser1);
				FoosRank1v1.insert({
					winner1: winner1,
					loser1: loser1,
					matchDate: date
				});
			}else if(winner2.length > 0 && loser2.length > 0) {
				//2vs2
				//console.log("2vs2 case", winner1, winner2, loser1, loser2);
				FoosRank2v2.insert({
					winner: {player1: winner1, player2: winner2},
					loser: {player1: loser1, player2: loser2}, 
					matchDate: date
				});
			}else {
				//1vs2
				if(winner2 === "") {
					FoosRank1v2.insert({
						winner: {player1: winner1},
						loser: {player1: loser1, player2: loser2}, 
						matchDate: date
					});
				}else {
					FoosRank1v2.insert({
						winner: {player1: winner1, player2: winner2},
						loser: {player1: loser1}, 
						matchDate: date
					});
				}
			}	

			//if player does not exist in player list. Added them.
			//single player
			if(winner2 === "") {
				addSinglePlayer(winner1);
			} else{
				addDoublePlayer(winner1, winner2);
			}

			if(loser2 === "") {
				addSinglePlayer(loser1);
			} else{
				addDoublePlayer(loser1, loser2);
			}
	 
			// Clear form
			target.winner1.value = '';
			target.winner2.value = '';
			target.loser1.value = '';
			target.loser2.value = '';
			target.date.value = '';
		}  
	});

	//selection change event trigers chart redraw
	Template.chartTemplate.events({
		"change #selectSinglePlayer": function(evt) {
			let players = $(evt.target).val();
			//console.log(players);
				
			//Update Competitor as All for default and remove self
			$('[name=selectCompetitor]').val( "All" );
			$('#selectCompetitor option').each(function() {
				if ( $(this).val() == players ) {
					$(this).hide();
				} else{
					$(this).show();
				}
			});

			let playersAry = (players.includes(" & ")) ? players.split("&").map(x => x.trim()) : [players];
			//console.log(playersAry);

		  let chart = $('#playersChart').highcharts();
			chart.setTitle({text: "VS " + "All"});
			chart.series[0].update({name: players}, false);
			let calcRates = calcRate(playersAry);
			chart.series[0].setData(calcRates, true);
		},
		"change #selectCompetitor": function(evt) {
			let competitors = $(evt.target).val();
			let players = $('[name=selectSinglePlayer]').val();
			//console.log(players, competitors);

			let playersAry = (players.includes(" & ")) ? players.split("&").map(x => x.trim()) : [players];
			//console.log(playersAry);

			let competitorsAry = (competitors.includes(" & ")) ? competitors.split("&").map(x => x.trim()) : [competitors];
			//console.log(competitorsAry);

		  let chart = $('#playersChart').highcharts();
			chart.setTitle({text: "VS " + competitors});
			let calcRates = (competitors === "All") ? calcRate(playersAry) : calcRate(playersAry, competitorsAry) ;
			chart.series[0].setData(calcRates, true);
		}
	});
}
