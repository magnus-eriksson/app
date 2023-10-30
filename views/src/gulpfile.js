const { watch, series, parallel, src, dest } = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const path = require('path');

sass.compiler = require('node-sass');

const paths = {
    dist: '../../public/static',
    sass: './scss',
    tmp: './tmp',
    js: './js',
    templates: './../templates/handlebars',
    nodeModules: './node_modules'
};


/**
 * Concatenate JS files
 */
function js() {
    return src([
        `${paths.nodeModules}/handlebars/dist/handlebars.js`,
        `${paths.tmp}/*.js`,
        `${paths.js}/helpers/*.js`,
        `${paths.js}/components/*.js`,
        `${paths.js}/main.js`,
    ])
        .pipe(concat('main.js'))
        //.pipe(uglify())
        .pipe(dest(paths.dist));
}

function templates() {
    return src([`${paths.templates}/*.hbs`])
        .pipe(handlebars())
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'Hbs',
            noRedeclare: true,
            allowEmpty: true,
        }))
        .pipe(concat('templates.js'))
        //.pipe(uglify())
        .pipe(dest(paths.tmp));
}

function partials() {
    return src([`${paths.templates}/partials/_*.hbs`])
        .pipe(handlebars())
        .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
            imports: {
                processPartialName: function (fileName) {
                    return JSON.stringify(path.basename(fileName, '.js').substring(1));
                }
            }
        }))
        .pipe(concat('partials.js'))
        .pipe(dest(paths.tmp));
}


/**
 * Build sass files
 */
function css() {
    return src([
        paths.sass + '/main.scss'
    ])
        .pipe(concat('main.css'))
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(cleanCss())
        .pipe(dest(paths.dist));
}


/**
 * Export tasks
 */
exports.default = function () {
    // CSS
    watch([
        `${paths.sass}/**/*.scss`,
    ],
        {
            ignoreInitial: false
        },
        series(css)
    );

    //JS
    watch([
        `${paths.js}/*.js`,
        `${paths.js}/**/*.js`,
        `${paths.templates}/**/*.hbs`,
    ],
        {
            ignoreInitial: false
        },
        series(templates, partials, js)
    );
};
