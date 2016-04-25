module.exports = function (grunt) {

    grunt.initConfig({

        // Project configuration
        pkg: grunt.file.readJSON('package.json'),

        // Compile Sass
        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
                , sourceComments: false
            }
            , dist: {
                files: {
                    'static/css/style.css': 'scss/style.scss'
                }
            }
        },
        
        //typescript
        typescript: {
            base: {
                src: ['js/**/*.ts']
                , dest: 'static/js/'
                , options: {
                    module: 'amd', //or commonjs 
                    target: 'es5', //or es3 
                    basePath: 'path/to/typescript/files'
                    , sourceMap: true
                    , declaration: true
                }
            }
        },
        
        // Watch and build
        watch: {
            sass: {
                files: ['scss/*.scss', 'scss/**/*.scss']
                , tasks: ['sass']
            },
            typescript: {
                files: ['js/*.ts', 'js/**/*.ts']
                , tasks: ['typescript']
            }
        }

    });

    // Load dependencies
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-typescript');

    // Run tasks
    grunt.registerTask('default', ['sass','typescript', 'watch']);

};