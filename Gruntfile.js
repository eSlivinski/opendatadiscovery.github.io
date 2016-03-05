module.exports = function(grunt) {

    require('time-grunt')(grunt);

    var externalStyleFiles = grunt.file.readJSON('externalStyles.json'),
        externalScriptFiles = grunt.file.readJSON('externalScripts.json');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            compile: {
                options: {
                    cleancss: true
                },
                files: { 'static/styles/app.css': externalStyleFiles.concat('static_src/styles/app.less') }
            }
        },
        concat: {
            libs: {
                src: externalScriptFiles,
                dest: 'temp/libraries.js',
                nonull: true
            },
            app: {
                src: [
                    'temp/libraries.js',
                    'static_src/scripts/**/*.js'
                ],
                dest: 'temp/app.js',
                nonull: true
            }
        },
        uglify: {
            main: {
              files: {
                'static/scripts/app.js' : 'temp/app.js'
              }
            }
        },
        clean: {
            all: ['temp/*.js'],
            scripts: ['temp/scripts.js'],
            libs: ['temp/libraries.js']
        },
        watch: {
            grunt: {
                files: ['Gruntfile.js'],
                options: {
                    livereload: true
                }
            },
            less: {
                files: ['static_src/styles/**/*.less'],
                tasks: ['less']
            },
            libs: {
                files: ['externalScripts.json', 'externalStyles,json', 'static_src/libs/**/*.js', 'static_src/libs/**/*.css'],
                tasks: ['clean:all', 'less', 'concat', 'uglify']
            },
            scripts: {
                files: ['static_src/scripts/**/*.js'],
                tasks: ['clean:scripts', 'concat:app', 'uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', ["watch"]);
    grunt.registerTask('build', ['clean:all', 'less', 'concat', 'uglify']);
};
