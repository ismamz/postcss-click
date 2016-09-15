module.exports = function (grunt) {
  grunt.initConfig({
    postcss: {
      options: {
        processors: [
          require('postcss-click')({
            output: 'click.js',
            append: false
          })
        ]
      },
      dist: {
        src: 'css/_style.css',
        dest: 'css/style.css'
      }
    },

    watch: {
      options: {
        spawn: false,
        livereload: true
      },
      pages: {
        files: ['*.html']
      },
      styles: {
        files: ['css/_style.css'],
        tasks: ['postcss']
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
           '*.html',
           'css/style.css',
           'click.js'
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: "./"
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('default', [
    'postcss',
    'browserSync',
    'watch'
  ]);

};
