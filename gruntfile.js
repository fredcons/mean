module.exports = function(grunt) {
    //Load NPM tasks 
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            jade: {
                files: ['app/views/**'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['public/js/**', 'app/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true,
                },
            },
            html: {
                files: ['public/views/**'],
                options: {
                    livereload: true,
                },
            },
            css: {
                files: ['public/css/**'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: ['gruntfile.js', 'public/js/**/*.js', 'test/mocha/**/*.js', 'test/karma/**/*.js', 'app/**/*.js']
        },
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['app', 'config'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'xunit',
                    captureFile: 'test/mocha/test.out',
                    require: 'test/blanket'
                },
                src: ['test/mocha/**/*.js']
            },
            coverage: {
                options: {
                    reporter: 'mocha-lcov-reporter',
                    //reporter: 'html-cov',
                    // use the quiet flag to suppress the mocha console output
                    quiet: true,
                    //captureFile: 'test/coverage/coverage.html'
                    captureFile: 'test/coverage/coverage.lcov'
                },
                src: ['test/mocha/**/*.js']
            }
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma/karma.conf.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                force: true,
                reporter: 'checkstyle',
                reporterOutput: 'test/coverage/jshint-checkstyle.xml'
            },
            all: ['Gruntfile.js', 'app/**/*.js', 'test/karma/**/*.js', 'test/mocha/**/*.js'],
        }
    });

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['jshint', 'concurrent']);

    //Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest:test', 'karma:unit']);

    grunt.registerTask('ci', ['env:test', 'mochaTest:test', 'mochaTest:coverage', 'karma:unit', 'jshint']);
};
