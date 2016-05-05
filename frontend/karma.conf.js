module.exports = function(config){
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files:[
		    'node_modules/angular.js',
			'node_modules/angular-mocks.js',
			'node_modules/angular-route.js',
			'node_modules/angular-resource.js',
			'app/**/*.js',
			'http://code.jquery.com/jquery-1.12.0.min.js'
		],
		browsers: ['Chrome'],
		singleRun: false,
		autoWatch: true,
		reporters: ['progress','coverage'],
		preprocessors: {'./**/*.js': ['coverage']}
	})
}