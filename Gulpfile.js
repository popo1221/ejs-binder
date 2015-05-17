var gulp = require('gulp');
var clean = require('gulp-clean');
var ejs = require('gulp-ejs-template');

// Clean Task
gulp.task('clean', function() {
	return gulp.src('./src/templates.js')
		.pipe(clean());
});

// precompile ejs
gulp.task('ejs', function() {
	return gulp.src('templates/**/*.ejs')
		.pipe(ejs())
		.pipe(gulp.dest('src'));
});