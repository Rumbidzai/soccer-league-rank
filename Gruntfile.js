'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.initConfig({
    jshint: {
      dev: {
        options: {
          node: true,
          globals: {
            describe: true,
            it: true,
            before: true,
            beforeEach: true,
            after: true
          }
        },
        src: ['Gruntfile.js', 'test/**/*.js', 'rank.js']
      }
    },

    simplemocha: {
      all: {
        src: ['test/**/*.js'],
      }
    },

    jscs: {
      src: ['Gruntfile.js', 'test/**/*.js', 'rank.js'],
      options: {
        preset: 'google'
      }
    }
  });

  grunt.registerTask('test', ['jshint', 'jscs', 'simplemocha:all']);
  grunt.registerTask('default', ['test']);
};
