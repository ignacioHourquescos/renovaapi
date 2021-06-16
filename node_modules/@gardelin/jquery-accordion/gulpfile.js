const gulp = require('gulp')
const minify = require('gulp-minify')

const path = {
    src: 'src/',
    dist: 'dist/',
}

gulp.task('js', function() {
    return gulp
        .src([
            path.src + '*.js'
        ])
        .pipe(minify())
        .pipe(gulp.dest(path.dist))
});