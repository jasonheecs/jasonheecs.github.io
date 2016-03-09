var src               = 'app';
var build             = 'build';
var development       = 'build/development';
var production        = 'build/production';
var srcAssets         = 'app/_assets';
var developmentAssets = 'build/assets';
var productionAssets  = 'build/production/assets';

module.exports = {
  browsersync: {
    development: {
      server: {
        baseDir: [development, build, src]
      },
      port: 9999,
      files: [
        developmentAssets + '/css/*.css',
        developmentAssets + '/js/*.js',
        developmentAssets + '/images/**'
      ]
    },
    production: {
      server: {
        baseDir: [production]
      },
      port: 9998
    }
  },
  delete: {
    src: [developmentAssets]
  },
  jekyll: {
    development: {
      src:    src,
      dest:   development,
      config: src + '/_config.yml'
    },
    production: {
      src:    src,
      dest:   production,
      config: src + '/_config.yml,' + src + '/_config.build.yml'
    }
  },
  sass: {
    src:  srcAssets + '/scss/**/*.{sass,scss}',
    dest: developmentAssets + '/css',
    options: {
      outputStyle: 'expanded',
      sourceComments: true,
      sourceMap: './'
    }
  },
  autoprefixer: {
    browsers: [
      "last 3 versions"
    ],
    cascade: true
  },
  browserify: {
    // Enable source maps
    debug: true,
    // Additional file extensions to make optional
    extensions: ['.coffee', '.hbs'],
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries:    './' + srcAssets + '/js/application.js',
      dest:       developmentAssets + '/js',
      outputName: 'application.js'
    }, {
      entries:    './' + srcAssets + '/js/head.js',
      dest:       developmentAssets + '/js',
      outputName: 'head.js'
    }]
  },
  images: {
    src:  srcAssets + '/images/**/*',
    dest: developmentAssets + '/images'
  },
  base64: {
    src: development + '/css/*.css',
    dest: development + '/css',
    options: {
      baseDir: build,
      extensions: ['png'],
      maxImageSize: 20 * 1024, // bytes
      debug: false
    }
  },
  watch: {
    jekyll: [
      src + '/_config.yml',
      src + '/_config.build.yml',
      src + '/_data/**/*.{json,yml,csv}',
      src + '/_includes/**/*.{html,xml}',
      src + '/_layouts/*.html',
      src + '/_plugins/*.rb',
      src + '/_posts/*.{markdown,md}',
      src + '/**/*.{html,markdown,md,yml,json,txt,xml}',
    ],
    sass: srcAssets + '/scss/**/*.{sass,scss}',
    scripts: srcAssets + '/js/**/*.js',
    images: srcAssets + '/images/**/*'
  },
  scsslint: {
    src: [
        srcAssets + '/scss/**/*.{sass,scss}'
      ],
      options: {
        bundleExec: true
      }
  },
  jshint: {
    src: srcAssets + '/js/*.js'
  },
  optimise: {
    css: {
      src:  developmentAssets + '/css/*.css',
      dest: productionAssets + '/css/',
      options: {
        autoprefixer: false
      }
    },
    js: {
      src:  developmentAssets + '/js/*.js',
      dest: productionAssets + '/js/',
      options: {}
    },
    images: {
      src:  developmentAssets + '/images/**/*.{jpg,jpeg,png,gif}',
      dest: productionAssets + '/images/',
      options: {
        interlaced: true
      },
      plugins: {
        png: {
          name: 'imagemin-pngquant',
          options: {
            quality: '70-80',
            speed: 1
          }
        },
        jpg: {
          name: 'imagemin-jpeg-recompress',
          options: {
            accurate: true,
            quality: 'high'
          }
        }
      }
    }
  },
  revision: {
    src: {
      assets: [
        productionAssets + '/css/*.css',
        productionAssets + '/js/*.js',
        productionAssets + '/images/**/*'
      ],
      base: production
    },
    dest: {
      assets: production,
      manifest: {
        name: 'manifest.json',
        path: productionAssets
      }
    }
  },
  collect: {
    src: [
      productionAssets + '/manifest.json',
      production + '/**/*.{html,xml,txt,json,css,js}',
      '!' + production + '/feed.xml'
    ],
    dest: production
  }
};