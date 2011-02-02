# Doing this so I can load remote files
Jasmine::Config.class_eval do
  def src_files_with_remote_files
    remote_files = simple_config['src_files'].select {|f| f =~ /^http:\/\//}
    remote_files + src_files_without_remote_files
  end
  alias_method :src_files_without_remote_files, :src_files
  alias_method :src_files, :src_files_with_remote_files
  
  def js_files_with_remote_files(*args)
    defaults = js_files_without_remote_files(*args)
    defaults.each do |file|
      file.sub!(/^\/http:\/\//, 'http://')
    end
    defaults
  end
  alias_method :js_files_without_remote_files, :js_files
  alias_method :js_files, :js_files_with_remote_files
end