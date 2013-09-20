module.exports = function(grunt){
	var style = require("grunt-cmd-transport").style.init(grunt);
	var css2jsParser = style.css2jsParser;
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		transport:{
			options:{
				idleading:'<%= pkg.name %>/<%= pkg.version %>/',
				debug:false
			},
			nav_aim:{
				files:[{
					cwd: 'src',
					src: '*.js',
					dest: 'temp'
				}]
			},
			css2js:{
				options:{
					parsers:{
						'.css': [css2jsParser]
					},
					debug:false
				},
				files:[{
					cwd: 'temp',
					src: '*.css',
					dest: 'temp'
				}]
			}
		},
		uglify:{
			options:{
				banner: '/*! nav-aim- v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			nav_aim:{
				files: {
				'dist/<%= pkg.name %>js': ['temp/*.js']
			  }
			}
			
		}
	});
	
	
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default',['transport','uglify']);
};