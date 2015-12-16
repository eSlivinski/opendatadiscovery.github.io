module.exports = function(grunt) {

    var externalStyleFiles = grunt.file.readJSON('externalStyles.json'),
        externalScriptFiles = grunt.file.readJSON('externalScripts.json');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            compile: {
                options: {
                    cleancss: true
                },
                files: { 'static/styles/app.css': externalStyleFiles.concat('temp/app.less') }
            }
        },
        ngAnnotate: {
            main: {
                files: {
                    'temp/scripts.js': [
                        'static_src/scripts/module.js',
                        'static_src/srcipts/controllers/**/*.js',
                        'static_src/scripts/services/**/*.js',
                        'static_Src/srcipts/utils/**/*.js'
                    ]
                }
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
                    'temp/scripts.js',
                    'temp/libraries.js'
                ],
                dest: 'static/scripts/app.js',
                nonull: true
            },
            less: {
                src: ['static_src/styles/**/*.less'],
                dest: 'temp/app.less',
                nonull: true
            }
        },
        uglify: {
            main: {
              files: {
                'static/scripts/app.js' : ['static/scripts/app.js'],
              }
            }
        },
        clean: {
            all: ['temp/'],
            scripts: ['temp/scripts.js'],
            libs: ['temp/libraries.js'],
            less: ['temp/app.less']
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
                tasks: ['concat:less', 'less']
            },
            libs: {
                files: ['externalScripts.json', 'externalStyles,json', 'static_src/libs/**/*.js', 'static_src/libs/**/*.css'],
                tasks: ['clean:libs','concat:less', 'less', 'concat:libs', 'ngAnnotate', 'concat:app']
            },
            scripts: {
                files: ['static_src/scripts/**/*.js'],
                tasks: ['clean:scripts', 'ngAnnotate', 'concat:app']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.registerTask('default', ["watch"]);
    grunt.registerTask('build', ['clean:all', 'concat:less', 'less', 'concat:libs', 'ngAnnotate', 'concat:app', 'uglify']);
};
