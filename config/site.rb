require "bundler"
Bundler.setup

ROOT = File.dirname(__FILE__)
JAVASCRIPTS_PATH = File.join(ROOT, 'site', 'javascripts')

require "jammit"
Jammit.load_configuration(File.join(ROOT, 'config', 'assets.yml'))
Jammit.packager.precache_all(JAVASCRIPTS_PATH, ROOT) if ARGV[0] == 'build'

# Default is 3000
# configuration.preview_server_port = 3000
 
# Default is localhost
# configuration.preview_server_host = "localhost"
 
# Default is true
# When false .html & index.html get stripped off generated urls
# configuration.use_extensions_for_page_links = true
 
# Default is an empty hash
configuration.sass_options = {:style => :compressed}
 
# Default is an empty hash
# http://haml-lang.com/docs/yardoc/file.HAML_REFERENCE.html#options
# configuration.haml_options = {}