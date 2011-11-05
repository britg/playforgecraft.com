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

  # Forge

  resource :forge, :only => [:show, :create]
  resources :ores, :only => [:index] do
    post :swap, :on => :collection
  end
  resources :loot, :only => [:index, :destroy]

  # Battles

  resources :heroes
  resources :battles

  # Armory

  match 'armory/Sets' => "item_sets#index"
  resources :items, :only => [:show, :update]
  resources :armory, :controller => "classifications" do
    resources :items
  end
  resources :item_sets

  # Chat

  resources :topics

  # Player

  resources :players, :only => [:index, :show] do
    resources :actions, :only => :create
  end
  get "ladder", :to => "players#index"
  get 'menu', :to => "players#edit", :as => :menu
  get ':playername', :to => "players#show", :as => :player

end
