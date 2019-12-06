source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "2.5.5"

gem "rails", "~> 5.2.3"
gem "pg", ">= 0.18", "< 2.0"
gem "puma", "~> 3.12"
gem "webpacker"
gem "jbuilder", "~> 2.5"
gem "graphql"
gem "bootsnap", ">= 1.1.0", require: false
gem "discard"

group :development, :test do
  gem "pry-rails"
  gem "rubocop"
  gem "rubocop-rails"
end

group :development do
  gem "graphiql-rails"
  gem "web-console", ">= 3.3.0"
  gem "listen", ">= 3.0.5", "< 3.2"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
end
