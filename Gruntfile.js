module.exports = function (grunt) {
    'use strict';

    // load extern tasks
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    // tasks
    grunt.initConfig({



// ---------------------------------------------
//                          build and dist tasks
// ---------------------------------------------
        copy: {
            buildConnectionInfosFile: {
                files: 	[{'build/js/connection_infos.json': 'app/scripts/core/connection_infos.json'}]
            },
            distConnectionInfosFile: {
                files: 	[{'dist/js/connection_infos.json': 'app/scripts/core/connection_infos.json'}]
            },
	        testConnectionInfosFile: {
		        files: 	[{'build/tests/connection_infos.json': 'app/scripts/core/connection_infos-sample.json'}]
	        }
        },

        typescript: {
            build: {
                src: [
                    'app/scripts/The6thScreenBackend.ts'
                ],
                dest: 'build/js/The6thScreenBackend.js',
                options: {
                    module: 'commonjs',
                    basePath: 'app/scripts'
                }
            },
            dbinit: {
                src: [
                    'app/scripts/CleanAndInitDatabase.ts'
                ],
                dest: 'build/js/CleanAndInitDatabase.js',
                options: {
                    module: 'commonjs',
                    basePath: 'app/scripts'
                }
            },
            dist: {
                src: [
                    'app/scripts/The6thScreenBackend.ts'
                ],
                dest: 'dist/js/The6thScreenBackend.js',
                options: {
                    module: 'commonjs',
                    basePath: 'app/scripts'
                }
            },
            test: {
                src: [
                    'tests/**/*.ts'
                ],
                dest: 'build/tests/Test.js'
            }
        },

        express: {
            options: {
                port: 4000
            },
            build: {
                options: {
                    script: 'build/js/The6thScreenBackend.js'
                }
            },
            dist: {
                options: {
                    script: 'dist/js/The6thScreenBackend.js',
                    node_env: 'production'
                }
            }
        },
// ---------------------------------------------





// ---------------------------------------------
//                                 develop tasks
// ---------------------------------------------
        watch: {
            express: {
                files:  [ 'build/js/The6thScreenBackend.js' ],
                tasks:  [ 'express:build' ],
                options: {
                    spawn: false
                }
            },

            developServer: {
                files: ['app/scripts/**/*.ts'],
                tasks: ['typescript:build']
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                 doc tasks
// ---------------------------------------------
        yuidoc: {
            compile: {
                name: 'The 6th Screen - Backend',
                description: 'Backend for The 6th Screen products.',
                version: '0.0.1',
                url: 'http://www.the6thscreen.fr',
                options: {
                    extension: '.ts, .js',
                    paths: ['app/scripts/'],
                    outdir: 'doc/'
                }
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                 test tasks
// ---------------------------------------------
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    'colors': true
                },
                src: ['build/tests/Test.js']
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                    clean task
// ---------------------------------------------
        clean: {
            build: ['build/'],
            dist: ['dist/'],
            doc: ['doc'],
            test: ['build/tests/Test.js']
        }
// ---------------------------------------------
    });

    // register tasks
    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', function () {
        grunt.task.run(['clean:build']);

        grunt.task.run(['copy:buildConnectionInfosFile', 'typescript:build']);
    });

    grunt.registerTask('dbinit', function () {
        grunt.task.run(['clean:build']);

        grunt.task.run(['copy:buildConnectionInfosFile', 'typescript:dbinit']);
    });

    grunt.registerTask('dist', function () {
        grunt.task.run(['clean:dist']);

        grunt.task.run(['copy:distConnectionInfosFile', 'typescript:dist']);
    });

    grunt.registerTask('develop', ['build', 'express:build', 'watch']);

    grunt.registerTask('doc', ['clean:doc', 'yuidoc']);

    grunt.registerTask('test', function() {
        grunt.task.run(['clean:test']);

        grunt.task.run(['copy:testConnectionInfosFile', 'typescript:test', 'mochaTest:test']);
    });

}