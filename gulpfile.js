var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    postcss      = require('gulp-postcss'),
    mqpacker     = require("css-mqpacker"),
    htmlmin      = require('gulp-htmlmin');



gulp.task('sassConcat', function() {
    return gulp.src(['src/scss/_import.scss', 'src/blocks/**/*.scss'])
        .pipe(concat('main.scss'))
        .pipe(gulp.dest('src/scss/'))
});

gulp.task('sass', ['sassConcat'], function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 5 versions', '> 1%'], { cascade: true }))
        .pipe(postcss([mqpacker()]))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});

gulp.task('scripts', function() {
    return gulp.src(['src/libs/jquery/dist/jquery.min.js'])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src/js'));
});

gulp.task('css-min', ['sass'], function() {
    return gulp.src(['src/css/*.css', '!src/css/*min.css'])
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('src/css'));
});

gulp.task('watch', ['browser-sync', 'css-min', 'scripts'], function() {
    gulp.watch('src/blocks/**/*.scss', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('clean', function() {
    return del.sync(['*.html', 'css/', 'js/', 'fonts/', 'img/']);
});

gulp.task('img', function() {
    return gulp.src('src/img/**/*.*')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('img'));
});

gulp.task('buildHtml', function() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(''))
})

gulp.task('buildCss', function() {
    return gulp.src(['src/css/*.min.css'])
        .pipe(gulp.dest('css/'))
})

gulp.task('buildFonts', function() {
    return gulp.src(['src/fonts/*.*'])
        .pipe(gulp.dest('fonts/'))
})

gulp.task('buildJs', function() {
    return gulp.src(['src/js/*.js'])
        .pipe(gulp.dest('js/'))
})

gulp.task('buildImg', function() {
    return gulp.src(['src/img/*.+(jpg|png|svg)'])
        .pipe(gulp.dest('img/'))
})


gulp.task('build', ['css-min', 'scripts', 'clean', 'img', 'buildHtml', 'buildCss', 'buildJs', 'buildFonts'])

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);