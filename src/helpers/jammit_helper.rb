module JammitHelper
  def javascripts(*packages)
    packages.map do |pack|
      if defined?(PACKAGE_ASSETS)
        puts 'Packaging assets'
        url = current_page_relative_path + Jammit.asset_url(pack, :js)[1..-1]
        %{<script src="#{url}"></script>\n}
      else
        puts 'Not packaging assets'
        Jammit.packager.individual_urls(pack.to_sym, :js).map do |file|
          url = file.gsub(%r(^.*site/), current_page_relative_path)
          %{<script src="#{url}"></script>\n}
        end
      end
    end.join
  end
  alias include_javascripts javascripts
end