/* global module*/

module.exports = function (grunt) {

    grunt.initConfig({
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
                sourceMap: true
            },
            dist: {
                files: {
                    "dist/app.js": "src/js/*.js"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('default', ['jshint', 'babel', 'jsdoc']);
};