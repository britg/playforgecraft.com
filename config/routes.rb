ForgeCraft::Application.routes.draw do

  devise_for :users

  devise_scope :user do
    get "login", :to => "devise/sessions#new"
    get "register", :to => "devise/registrations#new"
    get "logout", :to => "devise/sessions#destroy"
  end

  resources :users, :only => [:index]
  resources :emails, :only => [:create]

  resources :items

  namespace :admin do
    resources :users, :only => [:index]
  end

  root :to => "users#index"

end
