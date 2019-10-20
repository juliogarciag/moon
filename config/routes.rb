Rails.application.routes.draw do
  root to: "home#index"

  get "*path", to: "home#index", constraints: ->(request) do
    request.format.html? && request.path.exclude?("rails/active_storage")
  end
end
