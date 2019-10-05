module.exports = function(grunt) {
  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks("grunt-mocha-test");

  grunt.initConfig({
    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: "spec",
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ["test/**/*.js"]
      }
    }
  });

  grunt.registerTask("run:test", "mochaTest");
};
