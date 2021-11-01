const gulp = require('gulp');
const less = require('gulp-less');
const browserSync = require('browser-sync');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
 
gulp.task('server', function(){
    browserSync({
        server:{
            baseDir: 'dist'
        }
    })
});

gulp.task('html', function (){
    gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('less', function (){
    gulp.src('./src/less/*.less')
    .pipe(less())
    .pipe(cssnano())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({
        stream: true
    }));
});



gulp.task('js', function (){
    gulp.src('./src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('images', function (){
    gulp.src('./src/img/*.*')
    .pipe(gulp.dest('./dist/img'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('watch', function(){
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./src/less/*.less', ['less']);
    gulp.watch('./src/js/*.js', ['js']);
    gulp.watch('./src/img/*.*', ['images']);
});

gulp.task('build', ['html', 'less', 'js', 'images']);

gulp.task('default', ['build', 'server', 'watch']);