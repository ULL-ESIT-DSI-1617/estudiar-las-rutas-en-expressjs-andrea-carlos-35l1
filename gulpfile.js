var gulp = require('gulp');
var shell = require('gulp-shell');
var ghPages = require('gulp-gh-pages');

gulp.task('build', shell.task(
'gitbook build docs html'
));

gulp.task('deploy', function() {
return gulp.src('./html/**/*')
.pipe(ghPages());
});

gulp.task('deploypush', ['deploy'], function() {
  return gulp.src('./html/**/*')
  .pipe(ghPages(['git@github.com:ULL-ESIT-DSI-1617/estudiar-las-rutas-en-expressjs-andrea-carlos-35l1.git']))
})

gulp.task('deploygb', shell.task([
    //'cd ..'+
   // ';'+
    'cd docs'+
    ';'+
    'git add .'+
    ';'+
    'git commit -m "Actualizando gitbook"'+
    ';'+
    'git push https://git.gitbook.com/alu0100819847/carlos-andrea-3.git master'
]));
    
gulp.task('serve', shell.task(
  //'cd ..'+
  'gitbook serve docs html'
));