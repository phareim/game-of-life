module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint : {
            files : ['public/js/*js','*js','test/*js']
        },
        watch : {
            files: ['<%= jshint.files %>'],
            tasks : ['jshint','mochaTest']
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    colors: false
                },
                src: ['test/*js']
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('default', ['jshint', 'mochaTest']);
};