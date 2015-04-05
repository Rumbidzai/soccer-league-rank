// rank.js
// Coded by Sam Hamm
// samhamm@gmail.com

'use strict';

var rank = exports = module.exports = {}; // jshint ignore:line

rank.input = function() {
  var commandLine = process.argv;
  if (commandLine[2] === 'league') {
    return 'league.txt';
  } else if (commandLine[2] === 'test') {
    return 'lib/sample-input.txt';
  } else {
    return commandLine[2];
  }
};

rank.fileToString = function() {
  rank.input();
  var fs = require('fs');
  var data = fs.readFileSync(rank.input());
  data = data.toString();
  return data;
};

rank.parseString = function() {
  var dataString = rank.fileToString();
  var teamNameStart = 0;
  var teamNameEnd = 0;
  var teams = [];
  var gameScores = [];

  for (var i = 0; i < dataString.length; i++) {
    if (parseInt(dataString[i]) > -1) {
      teamNameEnd = i - 1;

      // accommodates multi-digit scores
      var scoreDigits = dataString[i];
      while (parseInt(dataString[i + 1]) > -1) {
        var j = 1;
        scoreDigits = scoreDigits + dataString[i + j];
        i++;
        j++;
      }

      // disposes of commas
      var comma = 0;
      if (dataString[i + 1] === ',') {
        comma = 1;
      }

      teams.push(dataString.substring(teamNameStart, teamNameEnd));
      gameScores.push(scoreDigits);
      teamNameStart = i + comma + 2; // 2 = space + next letter
      i = teamNameStart;
    }
  }
  return [teams, gameScores];
};

rank.computePoints = function() {
  var teams = rank.parseString()[0];
  var gameScores = rank.parseString()[1];
  var pointsEarned = [];
  for (var i = 0; i < teams.length; i += 2) {
    if (gameScores[i] > gameScores[i + 1]) {  // 1st team wins
      pointsEarned.push([teams[i], 3]);
      pointsEarned.push([teams[i + 1], 0]);
    } else if (gameScores[i] < gameScores[i + 1]) { // 2nd team wins
      pointsEarned.push([teams[i + 1], 3]);
      pointsEarned.push([teams[i], 0]);
    } else if (gameScores[i] === gameScores[i + 1]) { // draw
      pointsEarned.push([teams[i], 1]);
      pointsEarned.push([teams[i + 1], 1]);
    } else {
      console.log('Error in computing points');
    }
  }
  return pointsEarned;
};

rank.calculateTable = function() {
  var tableData = {};
  var pointsEarned = rank.computePoints();
  for (var i = 0; i < pointsEarned.length; i++) {
    var currentTeam = pointsEarned[i][0];
    var currentScore = pointsEarned[i][1];
    var existingScore = 0;
    if (tableData[currentTeam] >= 0) {
      existingScore = tableData[currentTeam];
    }
    tableData[currentTeam] = existingScore + currentScore;
  }
  return tableData;
};

rank.sortTable = function() {
  var table = [];
  var tableData = rank.calculateTable();
  for (var key in tableData) {
    table.push([key, tableData[key]]);
  }

  table.sort(function(a, b) {
    if (a[1] < b[1]) {
      return 1; // sort by score
    }
    if (a[1] > b[1]) {
      return -1;
    }
    if (a[0] > b[0]) {
      return 1; // sort by team name
    }
    if (a[0] < b[0]) {
      return -1;
    }
    return 0;
  });
  return table;
};

rank.displayTable = function() {
  var view = '';
  var table = rank.sortTable();
  var tieOffset = 0;

  for (var i = 0; i < table.length; i++) {
    var rankTeam = table[i][0];
    var teamPts = table[i][1];

    if (i >= 1 && teamPts === table[i - 1 + tieOffset][1]) {
      tieOffset--;
    } else {
      tieOffset = 0;
    }
    var ranking = i + 1 + tieOffset;

    var pts = ' pts';
    if (teamPts === 1) {
      pts = ' pt';
    }

    view = view + ranking + '. ' + rankTeam + ', ' + teamPts + pts + '\n';
  }
  return view;
};

rank.displayTable();
console.log(rank.displayTable());
