desc "Runs preview"
task :preview do
  system "staticmatic preview ."
end

desc "Builds the site"
task :build => 'styles:clear' do
  puts "*** Building the site ***"
  system "rm -f ./site/stylesheets/*.css && staticmatic build ."
end

desc "Clears and generates new styles, builds and deploys"
task :deploy => [:build, :push] do
  puts "*** Deploying the site ***"
  
end

desc "push"
task :push do
  # system("rsync -avz --delete site/ #{ssh_user}:#{remote_root}")
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
