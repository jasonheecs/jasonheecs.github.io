var src               = './';
var build             = 'build';
var development       = 'build/development';
var production        = 'build/production';
var srcAssets         = 'app/_assets';
var productionAssets  = 'build/production/assets';

module.exports = {
  browsersync: {
    development: {
      server: {
        baseDir: [development, src]
      },
      port: 9999,
      files: [
        development + '/css/*.css',
        development + '/js/*.js',
        development + '/images/*.{jpg,jpeg,png,gif}'
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
    src: [productionAssets]
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
    src:  src + '/_scss/**/*.{sass,scss}',
    dest: development + '/css',
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
      entries:    './' + src + '/_js/app.js',
      dest:       development + '/js',
      outputName: 'app.js'
    }]
  },
  images: {
    src:  src + '/_images/**/*',
    dest: development + '/images'
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
      src + '/_data/**/*.{json,yml,csv}',
      src + '/_includes/**/*.{html,xml}',
      src + '/_layouts/*.html',
      src + '/_plugins/*.rb',
      src + '/_posts/*.{markdown,md,html}',
      src + '/*.{html,markdown,md,yml,json,txt,xml}',
    ],
    sass: src + '/_scss/**/*.{sass,scss}',
    scripts: src + '/_js/**/*.js',
    images: src + '/_images/**/*'
  },
  scsslint: {
    src: [
        src + '/_scss/**/*.{sass,scss}'
      ],
      options: {
        bundleExec: true
      }
  },
  jshint: {
    src: src + '/_js/*.js'
  },
  optimise: {
    css: {
      src:  development + '/css/*.css',
      dest: productionAssets + '/css',
      options: {
        autoprefixer: false
      }
    },
    js: {
      src:  development+ '/js/*.js',
      dest: productionAssets + '/js',
      options: {}
    },
    images: {
      src:  development + '/images/**/*.{jpg,jpeg,png,gif}',
      dest: production + '/images',
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
        productionAssets + '/js/*.js'
      ],
      base: productionAssets
    },
    dest: {
      assets: production,
      manifest: {
        name: 'manifest.json',
        path: production
      }
    }
  },
  collect: {
    src: [
      production + '/manifest.json',
      production + '/**/*.{html,xml,txt,json,css,js}',
      '!' + production + '/feed.xml'
    ],
    dest: production
  },
  github: {
    files: [
      {
        src: [
          productionAssets + '/css/**/*',
          productionAssets + '/js/**/*',
        ],
        dest: './',
        options: {
          base: productionAssets
        }
      },
      {
        src: [
          production + '/images/**/*'
        ],
        dest: './',
        options: {
          base: production
        }
      }
    ]
  }
};