ForgeCraft::Application.routes.draw do

  root :to => "users#index"

  devise_for :users

  devise_scope :user do
    get "login", :to => "devise/sessions#new"
    get "register", :to => "devise/registrations#new"
    get "logout", :to => "devise/sessions#destroy"
  end

  resources :users, :only => [:index]

end
