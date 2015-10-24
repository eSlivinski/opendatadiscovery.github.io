module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                src: [
                    'js/libs/bower_components/angular/angular.js',
                    'js/libs/bower_components/angular-simple-logger/dist/index.js',
                    'js/libs/bower_components/angular-smooth-scroll/angular-smooth-scroll.js',
                    'js/libs/bower_components/angular-bootstrap/ui-bootstrap.js',
                    'js/libs/bower_components/d3/d3.js',
                    'js/libs/bower_components/nvd3/build/nv.d3.js',
                    'js/libs/angularjs-nvd3-directives.min.js',
                    'js/libs/bower_components/jquery/dist/jquery.js',
                    'js/libs/bower_components/bootstrap/dist/js/bootstrap.js',
                    'js/libs/bower_components/leaflet/dist/leaflet.js',
                    'js/libs/bower_components/leaflet-ajax/dist/leaflet.ajax.js',
                    'js/libs/bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.js',
                    'js/src/module.js',
                    'js/src/map.js',
                    'js/src/stat.js'
                ],
                dest: 'js/build.js'
            },
            css: {
                src: [
                    'js/libs/bower_components/bootstrap/dist/css/bootstrap.css',
                    'js/libs/bower_components/nvd3/build/nv.d3.css',
                    'js/libs/bower_components/leaflet/dist/leaflet.css',
                    'css/src/*.css'
                ],
                dest: 'css/build.css'
            }
        },
        uglify: {
            js: {
                src: 'js/build.js',
                dest: 'js/build.min.js'
            }
        },
        cssmin: {
            target: {
                files: {
                    'css/build.min.css': 'css/build.css'
                }
            }
        },
        clean: {
            js: ['js/build.js'],
            css: ['css/build.css']
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'image/src/',
                    src: ['*.{png,jpg,svg,gif}'],
                    dest: 'image/'
                }]
            }
        },
        watch: {
            js: {
                files: ['js/src/**/*.js', 'js/libs/**/*.js'],
                tasks: ['concat', 'uglify', 'clean:js']
            },
            css: {
                files: ['css/src/*.css', 'js/libs/**/*.css'],
                tasks: ['concat', 'cssmin', 'clean:css']
            },
            image: {
                files: ['image/src/*.{png,jpg,svg,gif}'],
                tasks: ['imagemin']
            },
            grunt: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ["concat", "uglify", "cssmin", "clean", "imagemin", "watch"]);
};