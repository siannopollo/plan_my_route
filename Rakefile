# Taken from http://matthewbass.com/2007/03/07/overriding-existing-rake-tasks/
Rake::TaskManager.class_eval do
  def remove_task(task_name)
    @tasks.delete(task_name.to_s)
  end
end
def remove_task(task_name)
  Rake.application.remove_task(task_name)
end


require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

desc 'Runs preview'
task :preview do
  system 'staticmatic preview .'
end

desc 'Builds the site'
task :build => 'styles:clear' do
  puts '*** Building the site ***'
  
  require 'staticmatic'
  staticmatic = StaticMatic::Base.new File.dirname(__FILE__)
  staticmatic.run 'build'
end

desc 'Clears and generates new styles, builds and deploys'
task :deploy do
  PACKAGE_ASSETS = true
  Rake::Task[:build].invoke
  
  puts '*** Deploying the site ***'
  system 'scp -r site deploy@iannopollo.com:/var/www/apps/plan_my_route/'
end

namespace :styles do
  desc "Clears the styles"
  task :clear do
    puts "*** Clearing styles ***"
    system "rm -Rfv site/stylesheets/*.css"
  end
  
  desc "Generates new styles"
  task :generate do
    puts "*** Generating styles ***"
    system "compass compile"
  end
end

remove_task :jasmine
desc 'Run specs via server, and open them in Safari'
task :jasmine do
  threads = []
  
  threads << Thread.new do
    sleep 1
    system 'open -a Safari http://localhost:8888'
  end
  threads << Thread.new do
    Rake::Task['jasmine:server'].invoke
  end
  threads.each {|t| t.join}
end
