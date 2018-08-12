'use strict';

const gulp = require('gulp');

const $ = require('gulp-load-plugins')();
const del = require('del');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe($.plumber())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['last 1 version']}))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(reload({stream: true}));
});

gulp.task('html', ['styles'], function () {
    return gulp.src('app/*.html')
        .pipe($.useref({searchPath: '{.tmp,app}'}))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
        .pipe($.if('*.css', $.uncss(({html: ['app/index.html']}))))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('extras', function () {
    return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
    return del(['.tmp', 'dist'], cb);
});

gulp.task('build', ['html', 'images', 'extras'], function() {
    return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('serve', ['styles'], function () {
    browserSync({
        notify: false,
        server: {
            baseDir: ['.tmp', 'app']
        }
    });
});

gulp.task('watch', ['serve'], function () {
    // watch for changes
    gulp.watch([
        'app/*.html',
        '.tmp/styles/**/*.css',
        'app/images/**/*'
    ]).on('change', reload);

    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/images/**/*', ['images']);
});
