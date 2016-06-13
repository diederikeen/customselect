var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    include = require('gulp-include'),
    fileinclude = require('gulp-file-include'),
    sourcemaps = require('gulp-sourcemaps');


gulp.task('default', ['sass', 'js', 'watch', 'fileinclude', 'assets']);


// Sass
gulp.task('sass', function () {
    return gulp.src('src/sass/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/assets/css'));
});

// JS
gulp.task('js', function () {
    //Custom JS
    gulp.src('./src/js/*.js')
        .pipe(include())
        // .pipe(uglify())
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest('app/assets/js/'));

    //Vendor JS
    gulp.src('./src/js/libs/vendor.js')
        .pipe(include())
        .pipe(concat("vendor.min.js"))
        .pipe(gulp.dest('app/assets/js/'));
});

// Watch js, sass & html
gulp.task('watch', function () {
    gulp.watch('./src/js/**/*.js', ["js"]);
    gulp.watch('./src/sass/**/*.sass', ["sass"]);
    gulp.watch('./src/html/**/*.html', ["fileinclude"]);
});

// Include html files
gulp.task('fileinclude', function () {
    gulp.src(['src/html/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./app/'));
});

// Assests to public
gulp.task('assets', function () {
    gulp.src('./src/images/**/*')
        .pipe(gulp.dest('./app/assets/images/'));
    gulp.src('./src/fonts/*')
        .pipe(gulp.dest('./app/assets/fonts/'));
    gulp.src('./src/css/*')
        .pipe(gulp.dest('./app/assets/css/'));
    gulp.src('./src/media/*')
        .pipe(gulp.dest('./app/assets/media/'));
});
