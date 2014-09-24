module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    bower: {
      install: {
        options: {
          install: true,
          layout: 'byType',
          copy: false
        }
      }
    },

    jasmine: {
      options: {
        specs: 'spec/**/*_spec.js',
        helpers: 'spec/spec_helper.js',
        vendor: ['bower_components/jquery/jquery.js', 'bower_components/knockout.js/knockout.js']
      },

      source: {
        src: [ 'src/shim.js', 'src/utils.js', 'src/oop.js', 'src/bindings/*.js' ]
      },

      assembled: {
        src: 'build/tkt.min.js'
      }
    },

    concat: {
      options: {
        separator: ';'
      },

      'ko.2.1.0': {
        src:  [ 'src/shim.js', 'src/utils.js', 'src/oop.js', 'src/bindings/*.js' ],
        dest: 'build/<%= pkg.name %>-raw.js'
      },

      'ko.2.2.0': {
        src:  [ 'src/shim.js', 'src/utils.js', 'src/oop.js', 'src/bindings/*.js', '!src/bindings/css.js' ],
        dest: 'build/<%= pkg.name %>-raw.js'
      }
    },

    build: {
      all: {
        src: "<%= concat['ko.2.2.0'].dest %>",
        dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js',
        options: {
          banner:
            "/*! The knockout tools v<%= pkg.version %> | http://github/stalniy/tkt\n" +
            "(c) 2013-2014 Sergiy Stotskiy <sergiy.stotskiy@freaksidea.com> \n" +
            "MIT license */\n"
        }
      }
    },

    uglify: {
      options: {
        compress: true,
        preserveComments: 'some',
        report: 'min'
      },
      build: {
        files: {
          'build/tkt.min.js': [ '<%= build.all.dest %>' ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadTasks("build/tasks");

  grunt.registerTask('default', [
    'bower',
    'jasmine:source',
    'concat:ko.2.2.0',
    'build',
    'uglify',
    'jasmine:assembled'
  ]);
  grunt.registerTask('test', ['bower', 'jasmine:source']);
  grunt.registerTask("for-old-ko", ['bower', 'jasmine:source', 'concat:ko.2.1.0', 'build', 'uglify', 'jasmine:assembled'])
};
