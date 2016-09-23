/* global module*/

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'src/js/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },

        jsdoc: {
            dist: {
                src: ['<%= jshint.files %>'],
                options: {
                    destination: 'doc'
                }
            }
        },

        babel: {

            options: {
                sourceMap: true,
                //modules: "amd"
                //experimental: true,
                presets: ['es2015'],
                //plugins: ["transform-es2015-modules-umd"]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: "src/js",
                    src: ['**/*.es6'],
                    dest: "build/",
                    ext: '.js'
                }]
            }
        },

        browserify: {
            client: {
                src: ['build/*.js'],
                dest: 'public/app.js',
            }
        },
        
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: ["src/js/moon.js",
                      "src/js/debug.js",
                      "src/js/hexa-matrix.js",
                      "src/js/pathfinding.js",
                      "src/js/character.js",
                      "src/js/tile.js",
                      "src/js/grid-position.js",
                      "src/js/grid.js",
                      "src/js/logic.js"
                     ],
                // the location of the resulting JS file
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        clean: ['build', 'dist']
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('default', ['jshint', 'clean',
                                   'babel',
                                   'browserify',
                                   'concat',
                                   'jsdoc']);
};