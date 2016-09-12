module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/js/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
     },
        
        jsdoc : {
        dist : {
            src: ['<%= jshint.files %>'],
            options: {
                destination: 'doc'
            }
        }
    }
    /*},
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']*/
    //}
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');  
  //grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint','jsdoc']);

};