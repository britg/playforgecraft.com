ForgeCraft::Application.routes.draw do

  resources :emails, :only => [:create]

  # Admin

  ActiveAdmin.routes(self)

  # Accounts

  devise_for :users

  devise_scope :user do
    get "login", :to => "devise/sessions#new"
    get "register", :to => "devise/registrations#new"
    get "logout", :to => "devise/sessions#destroy"
    get "admin_logout", :to => "devise/sessions#destroy"
  end

  resources :users, :only => [:index]
  root :to => "users#index"
  get "about", :to => "users#index", :as => :about

  # Map
  resources :map, :controller => "mines", :only => [:index, :show]
  # get "map", :to => "zones#index", :as => :map

  # Forge

  resources :forges, :only => [:show, :create]
  resources :ores, :only => [:index] do
    post :swap, :on => :collection
  end
  resources :loot, :only => [:index, :create, :show, :destroy]

  # Battles

  resources :heroes
  resources :battles do
    resources :actions do
      collection do
        post :commit  
      end
    end
  end

  # Armory
  resources :armory, :controller => :items, :only => [:show, :index, :destroy]
  resources :items

  resources :item_sets

  # Chat

  resources :topics

  # Player

  resources :players, :only => [:index, :show] do
    resource :mine, :only => [:update]
  end

  get "ladder", :to => "players#index"
  get 'menu', :to => "players#edit", :as => :menu
  get ':playername', :to => "players#show", :as => :player

end