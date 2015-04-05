// rank-test.js

'use strict';

var expect = require('chai').expect;
var rank = require('../rank');
var fs = require('fs');
var argCache = process.argv;
var sampleInput = fs.readFileSync('lib/sample-input.txt').toString();
var expectedOutput = fs.readFileSync('lib/expected-output.txt').toString();
var expectedOutput2 = fs.readFileSync('lib/tied-teams-2-out.txt').toString();

describe('"rank.js", in its input stage:', function() {

  before(function() {
    process.argv = ['node', 'rank', 'lib/sample-input.txt'];
  });

  after(function() {
    process.argv = argCache;
  });

  it('should read from a file specified in the command line', function() {
    expect(rank.input()).to.eql('lib/sample-input.txt');
  });

  it('should convert the file input buffer into a string', function() {
    expect(rank.fileToString()).to.eql(sampleInput);
  });
});

describe('"rank.js", in its parsing & data-organization stage:', function() {

  before(function() {
    process.argv = ['node', 'rank', 'lib/team-name-spaces.txt'];
  });

  // SAMPLE DATA FOR NEXT THREE TESTS
  // FC Hi 2, FC Lo 0
  // If So 3, Be Me 3

  after(function() {
    process.argv = argCache;
  });

  it('should accommodate spaces inside of team names', function() {
    expect(rank.parseString()[0]).to.eql(['FC Hi', 'FC Lo', 'If So', 'Be Me']);
  });

  it('should dispose of the commas in the input file', function() {
    expect(rank.parseString()[1]).to.eql(['2', '0', '3', '3']);
  });

  it('should produce 2 arrays of equal length (teams & scores)', function() {
    expect(rank.parseString()[0].length).to.eql(rank.parseString()[1].length);
  });
});

describe('"rank.js", in the scores array:', function() {

  before(function() {
    process.argv = ['node', 'rank', 'lib/multi-digit-scores.txt'];
  });

  // SAMPLE DATA FOR THE FOLLOWING TEST
  //  Lions 14, Grouches 888
  //  Tarantulas 3598, FC Awesome 32

  after(function() {
    process.argv = argCache;
  });

  it('should accommodate multi-digit scores', function() {
    expect(rank.parseString()[1]).to.eql(['14', '888', '3598', '32']);
  });
});

describe('"rank.js", in its points computation stage:', function() {

  before(function() {
    process.argv = ['node', 'rank', 'lib/points-computation.txt'];
  });

  // SAMPLE DATA FOR THE NEXT TWO TESTS
  // Johns 3, Pauls 3
  // Georges 2, Ringos 0

  after(function() {
    process.argv = argCache;
  });

  it('should assign appropriate points to each team in each game', function() {
    expect(rank.computePoints()[0]).to.eql(['Johns', 1]);
    expect(rank.computePoints()[1]).to.eql(['Pauls', 1]);
    expect(rank.computePoints()[2]).to.eql(['Georges', 3]);
    expect(rank.computePoints()[3]).to.eql(['Ringos', 0]);
  });

  it('should give total league points between 2/game and 3/game', function() {
    var leaguePts = 0;
    var numberOfGames = (rank.computePoints().length) / 2;
    function pointsPerGame() {
      for (var i = 0; i < rank.computePoints().length; i++) {
        leaguePts = leaguePts + rank.computePoints()[i][1];
      }
      if ((leaguePts / numberOfGames) < 3 && (leaguePts / numberOfGames) > 2) {
        return true;
      }
    }
    expect(pointsPerGame()).to.eql(true);
  });
});

describe('"rank.js", in its table calculation stage:', function() {

  before(function() {
    process.argv = ['node', 'rank', 'lib/sample-input.txt'];
  });

  // SAMPLE DATA FOR THE THIS TEST
  // Lions 3, Snakes 3
  // Tarantulas 1, FC Awesome 0
  // Lions 1, FC Awesome 1
  // Tarantulas 3, Snakes 1
  // Lions 4, Grouches 0

  after(function() {
    process.argv = argCache;
  });

  it('should sum/store all points earned by an individual team', function() {
    expect(rank.calculateTable().Lions).to.eql(5);
    expect(rank.calculateTable().Snakes).to.eql(1);
    expect(rank.calculateTable().Tarantulas).to.eql(6);
    expect(rank.calculateTable()['FC Awesome']).to.eql(1);
    expect(rank.calculateTable().Grouches).to.eql(0);
  });
});

describe('"rank.js", in its table sorting stage:', function() {

  before(function() {
    process.argv = ['node', 'rank', 'lib/sample-input.txt'];
  });

  // SAMPLE DATA FOR THE THIS TEST
  // Lions 3, Snakes 3
  // Tarantulas 1, FC Awesome 0
  // Lions 1, FC Awesome 1
  // Tarantulas 3, Snakes 1
  // Lions 4, Grouches 0

  after(function() {
    process.argv = argCache;
  });

  it('should rank teams in descending order by points scored', function() {
    expect(rank.sortTable()[0]).to.eql(['Tarantulas', 6]);
    expect(rank.sortTable()[1]).to.eql(['Lions', 5]);
    expect(rank.sortTable()[2]).to.eql(['FC Awesome', 1]);
    expect(rank.sortTable()[3]).to.eql(['Snakes', 1]);
    expect(rank.sortTable()[4]).to.eql(['Grouches', 0]);
  });
});

describe('"rank.js", in its table sorting stage:', function() {

  before(function() {
    process.argv = ['node', 'rank', 'lib/tied-teams.txt'];
  });

  // SAMPLE DATA FOR THE THIS TEST
  // Fish 0, Fowl 0
  // Dogs 2, Cats 2
  // Ligers 42, Unicorns 42
  // Hobbits 1, Dwarves 1

  after(function() {
    process.argv = argCache;
  });

  it('should rank teams with equal points in alphabetical order', function() {
    expect(rank.sortTable()[0]).to.eql(['Cats', 1]);
    expect(rank.sortTable()[1]).to.eql(['Dogs', 1]);
    expect(rank.sortTable()[2]).to.eql(['Dwarves', 1]);
    expect(rank.sortTable()[3]).to.eql(['Fish', 1]);
    expect(rank.sortTable()[4]).to.eql(['Fowl', 1]);
    expect(rank.sortTable()[5]).to.eql(['Hobbits', 1]);
    expect(rank.sortTable()[6]).to.eql(['Ligers', 1]);
    expect(rank.sortTable()[7]).to.eql(['Unicorns', 1]);
  });
});

describe('"rank.js", in its ranking display stage:', function() {

  before(function() {
    process.argv = ['node', 'rank', 'lib/sample-input.txt'];
  });

  // SAMPLE DATA FOR THE THIS TEST
  // Lions 3, Snakes 3
  // Tarantulas 1, FC Awesome 0
  // Lions 1, FC Awesome 1
  // Tarantulas 3, Snakes 1
  // Lions 4, Grouches 0

  after(function() {
    process.argv = argCache;
  });

  it('has output that matches format of provided sample output', function() {
    expect(rank.displayTable()).to.eql(expectedOutput);
  });
});

describe('"rank.js", in its ranking display stage:', function() {

  before(function() {
    process.argv = ['node', 'rank', 'lib/tied-teams-2.txt'];
  });

  // SAMPLE DATA FOR THE NEXT 2 TESTS
  // Fish 0, Fowl 0
  // Dogs 2, Cats 2
  // Ligers 42, Unicorns 42
  // Hobbits 1, Dwarves 1
  // Fish 5, Fowl 0
  // Dogs 2, Cats 1
  // Ligers 42, Unicorns 0
  // Hobbits 1, Dwarves 0

  after(function() {
    process.argv = argCache;
  });

  it('should display tied teams with the same numerical ranking', function() {
    expect(rank.displayTable()).to.eql(expectedOutput2);
  });

  it('should end each line with "pts" except in case of "1 pt"', function() {
    expect(rank.displayTable()).to.eql(expectedOutput2);
  });
});
