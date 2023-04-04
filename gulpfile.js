const gulp = require('gulp'),
  del = require('del'),
  sass = require('gulp-sass')(require('sass')),
  minificss = require('gulp-minify-css'),
  minify = require('gulp-minify'),
  rename = require('gulp-rename'),
  include = require('gulp-html-tag-include'),
  imagemin = require('gulp-imagemin'),
  spritesmith = require('gulp.spritesmith'),
  browserSync = require('browser-sync').create(),
  fs = require('fs');

//paths
const src = './project/src';
const dist = './project/dist';
const paths = {
  src : {
    js : src + '/assets/js/*.js',
    css : src + '/assets/scss/*.scss',
    image : src + '/assets/images/**/*',
    imageminExc : src + '/assets/images/sprite/**/*',
    html : src + '/pages/**/*.html',
    include : src + '/pages/include/*.html',
    webfonts : src + '/assets/scss/webfonts/*',
    libJs : src + '/assets/js/lib/*',
    sprite : src  + '/assets/images/sprite/',
    guide : src + '/guide/*'
  },
  dist : {
    js : dist + '/assets/js',
    css : dist + '/assets/css',
    image : dist + '/assets/images/',
    html : dist + '/pages/',
    webfonts : dist + '/assets/css/webfonts/',
    libJs : dist + '/assets/js/lib/',
    sprite : dist  + '/assets/images/sprite/',
    guide : dist + '/guide/*'
  }
};

//browserSync
gulp.task('browserSync', () => {
  browserSync.init({
    server: {baseDir: dist},
    startPath : '/workList.html' //시작페이지
  });
  gulp.watch(src).on("change", browserSync.reload);
});

//html-include
gulp.task('html-index', () => {
  return gulp.src(src + '/workList.html')
    .pipe(gulp.dest(dist));
});

//html-include
gulp.task('html-include', () => {
  return gulp.src([paths.src.html, '!' + paths.src.include])
    .pipe(include())
    .pipe(gulp.dest(paths.dist.html));
});

//scss
var sourcemaps = require('gulp-sourcemaps');
gulp.task('gulp-scss', () => {
  return gulp.src(paths.src.css)
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded', indentType : "space", indentWidth : 0, sourceComments:true}).on('error', sass.logError))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.dist.css))
  // .pipe(minificss())
  // .pipe(rename({suffix: ".min"}))   
  // .pipe(gulp.dest(paths.dist.css))
});

// gulp.task('minify-css', () => {
//   return gulp.src(paths.dist.css + '/*.css')
//    .pipe(minificss())
//   .pipe(rename({suffix: ".min"}))   
//   .pipe(gulp.dest(paths.dist.css))
//   // .pipe(cssmin())
//   // .pipe(concat('*.css'))
//   // .pipe(rename("main.min.css"))
//   // .pipe(gulp.dest('./public/styles'));
// });
//min js
gulp.task('gulp-js', () => {
  return gulp.src(paths.src.js)
  .pipe(gulp.dest(paths.dist.js))
  .pipe(minify({ext:{min: '.min.js'}}))
  .pipe(gulp.dest(paths.dist.js))
});

//lib js
gulp.task('lib-js', () => {
  return gulp.src(paths.src.libJs)
  .pipe(gulp.dest(paths.dist.libJs))
});

//web font
gulp.task('web-fonts', () => {
  return gulp.src(paths.src.webfonts)
  .pipe(gulp.dest(paths.dist.webfonts))
});

//image 배포 / 최적화
gulp.task('image-min', () => {
  return gulp.src([paths.src.image, '!' + paths.src.imageminExc]) //sprite 폴더 제외
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
			  {cleanupIDs: false}
      ]
    })
  ]))
  .pipe(gulp.dest(paths.dist.image))
});

gulp.task('sprite', async () => {
  const spConfig = {
    destImgName: 'sprite-',
    destCssName: '_sprite-',
    destImgPath: paths.dist.sprite,
    destCssPath: './project/src/assets/scss/components/sprite/',
    destCssTemplate: './project/src/handlebarsStr.css.handlebars'
  }
  const dirs = fs.readdirSync(paths.src.sprite);
  for(var i = 0; i < dirs.length; i++){
    var dir = dirs[i];
    const spriteData = gulp.src(paths.src.sprite + dir + '/*.png')
    .pipe(spritesmith({
      imgName: spConfig.destImgName + dir + ".png",
      padding: 5,
      cssName: spConfig.destCssName  + dir + ".scss",
      cssTemplate: spConfig.destCssTemplate
    }));
    spriteData.img.pipe(gulp.dest(spConfig.destImgPath));
    spriteData.css.pipe(gulp.dest(spConfig.destCssPath));
  }
});

//guide
gulp.task('guide', ()=>{
  return gulp.src(paths.src.guide)
  .pipe(gulp.dest(paths.dist.guide))
});

//watch
gulp.task('watch', () => {
  gulp.watch(paths.src.html, gulp.series('html-include'));
  gulp.watch(paths.src.css, gulp.series('gulp-scss'));
  gulp.watch(paths.src.js, gulp.series('gulp-js'));
  gulp.watch(paths.src.js, gulp.series('image-min'));
  gulp.watch(paths.src.js, gulp.series('guide'));
});

//build 시  clean
gulp.task('clean', () => {
  return del(dist, {force:true});
});

gulp.task("default", gulp.parallel('watch', 'browserSync'));
gulp.task("build", gulp.series('clean', 'html-index', 'gulp-scss', 'html-include', 'gulp-js', 'lib-js', 'web-fonts', 'image-min', 'sprite', 'guide'));