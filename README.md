####Sam Hamm • [samhamm@gmail.com](mailto:samhamm@gmail.com)

--

###Initial Instructions

1. On the command line, enter ```git clone https://github.com/samhamm/soccer-league-rank.git``` to create a local copy of the application and its supporting files.
2. On the command line, enter ```npm install``` to install the dependencies for automated testing. The application will operate without these dependencies, but the tests will not.
3. To see the output of the sample input that was provided, enter ```node rank lib/sample-input.txt``` on the command line
3. To see another sample of output, enter ```node rank league``` on the command line. This reads from the ```league.txt``` file at the root level of the directory.
4. To run the automated tests, enter ```grunt test``` on the command line. These tests use the provided sample input as the primary testing source, as well as additional input files (located in the ```lib``` directory) that were created to demonstrate various functionalities of the application.

###Additional Instructions

There are two ways the user can enter league score data to be ranked:
* The user can specify a text file of scores in the command line by entering ```node rank path/to/scores-file.txt```.
* The user can replace the data in the ```league.txt``` file with the desired data, and then enter ```node rank league``` at the command line.
