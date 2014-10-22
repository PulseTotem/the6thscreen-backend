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
    grunt.loadNpmTasks('grunt-contrib-symlink');


	// tasks
    grunt.initConfig({

        coreReposConfig : grunt.file.readJSON('core-repos-config.json'),

// ---------------------------------------------
//                               configure tasks
// ---------------------------------------------
        symlink: {
            // Enable overwrite to delete symlinks before recreating them
            options: {
                overwrite: false
            },
            // The "build/target.txt" symlink will be created and linked to
            // "source/target.txt". It should appear like this in a file listing:
            // build/target.txt -> ../source/target.txt
            coreBackend: {
                src: '<%= coreReposConfig.coreBackendRepoPath %>',
                dest: 't6s-core/core-backend'
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                          build and dist tasks
// ---------------------------------------------
        copy: {
            buildConnectionInfosFile: {
                files: 	[{'build/js/connection_infos.json': 'scripts/core/connection_infos.json'}]
            },
            distConnectionInfosFile: {
                files: 	[{'dist/js/connection_infos.json': 'scripts/core/connection_infos.json'}]
            },
	        testConnectionInfosFile: {
		        files: 	[{'build/tests/connection_infos.json': 'scripts/core/connection_infos-sample.json'}]
	        }
        },

        typescript: {
            build: {
                src: [
                    'scripts/The6thScreenBackend.ts'
                ],
                dest: 'build/js/The6thScreenBackend.js',
                options: {
                    module: 'commonjs',
                    basePath: 'scripts'
                }
            },
            dbinit: {
                src: [
                    'scripts/CleanAndInitDatabase.ts'
                ],
                dest: 'build/js/CleanAndInitDatabase.js',
                options: {
                    module: 'commonjs',
                    basePath: 'scripts'
                }
            },
            dist: {
                src: [
                    'scripts/The6thScreenBackend.ts'
                ],
                dest: 'dist/js/The6thScreenBackend.js',
                options: {
                    module: 'commonjs',
                    basePath: 'scripts'
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
                    script: 'build/js/The6thScreenBackend.js',
                    args: ["loglevel=debug"]
                }
            },
            dist: {
                options: {
                    script: 'dist/js/The6thScreenBackend.js',
                    args: ["loglevel=error"],
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
                files: ['scripts/**/*.ts'],
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
                    paths: ['scripts/'],
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
                    colors: true,
	                require: 'coverage/blanket'
                },
                src: ['build/tests/Test.js']
            },
	        coverage: {
		        options: {
			        reporter: 'html-cov',
			        // use the quiet flag to suppress the mocha console output
			        quiet: true,
			        // specify a destination file to capture the mocha
			        // output (the quiet option does not suppress this)
			        captureFile: 'coverage.html'
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

    grunt.registerTask('init', ['symlink']);

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
	    //grunt.task.run(['mochaTest:test']);
    });

	grunt.registerTask('coverage', ['test', 'mochaTest:coverage']);

}