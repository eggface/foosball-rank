import { Mongo } from 'meteor/mongo';
 
//{winner1, loser1, matchDate}
export const FoosRank1v1 = new Mongo.Collection('foosrank1v1');

//{winner1, winner2, loser1, loser2, matchDate}
export const FoosRank1v2 = new Mongo.Collection('foosrank1v2');

//{winner{player1, player2}, loser{player1, player2}, matchDate}
export const FoosRank2v2 = new Mongo.Collection('foosrank2v2');

//{name}
export const SinglePlayers = new Mongo.Collection('singleplayers');

//{player1, player2}
export const DoublePlayers = new Mongo.Collection('doubleplayers');

Meteor.methods({
  addSinglePlayer: function( id, doc ){
     SinglePlayers.upsert( id, doc );
  },
  addDoublePlayer: function( player1, player2, doc ){
     DoublePlayers.upsert( player1, player2, doc );
  }
});

