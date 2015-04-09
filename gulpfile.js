// ---------------------------------------------------------------------------------------------------------------- Info

/**
 * @desc  Project build file.
 */


// ------------------------------------------------------------------------------------------------------------ Includes

var gulp  = require('gulp'),
    sass  = require('gulp-sass'),
    jsdoc = require('gulp-jsdoc');

// -------------------------------------------------------------------------------------------------------------- Config

var path = {
    sass :  {
        input  : './dist/scss/*.scss',
        output : './dist/css/'
    },
    docs : {
        input  : './dev/*.js',
        output : './docs/'
    }
};


// --------------------------------------------------------------------------------------------------------------- Tasks
// ------------------------------------------------------------------------------------------------------ SASS

gulp.task('sass', function () {
    return gulp.src(path.sass.input)
               .pipe(sass())
               .pipe(gulp.dest(path.sass.output));
});

// ------------------------------------------------------------------------------------------------------ DOCS

gulp.task('docs', function () {
    return gulp.src(path.docs.input)
        .pipe(jsdoc.parser({
            name:        'PerspectiveView-Solar-Altitude',
            version:     'v0.1.0',
            description: 'Test concept of coloring shapes for PerspectiveView.',
            licenses:    ['MIT'],
            plugins:     false //['plugins/markdown']
        }))
        .pipe(jsdoc.generator(
            path.docs.output, {
                path:            'ink-docstrap',
                systemName:      'PerspectiveView-Solar-Altitude',
                footer:          'Created by Danny Grübl',
                copyright:       '2015',
                navType:         'vertical',
                theme:           'journal',
                linenums:        true,
                collapseSymbols: true,
                inverseNav:      true
            }, {
                showPrivate:       true,
                monospaceLinks:    true,
                cleverLinks:       true,
                outputSourceFiles: true
            }
        ));
});

// ------------------------------------------------------------------------------------------- Default / Watch

gulp.task('watch', function() {
    gulp.run('default');
    gulp.watch(path.sass.input + '/**/*.scss', function() {
        gulp.run('sass');
    });
});


gulp.task('default', function() {
    gulp.run('sass');
});


// ----------------------------------------------------------------------------------------------------------------- EOF
