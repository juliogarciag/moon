Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end

  post "/graphql", to: "graphql#execute"
  root to: "home#index"

  get "*path", to: "home#index", constraints: ->(request) do
    request.format.html? && request.path.exclude?("rails/active_storage")
  end
end
