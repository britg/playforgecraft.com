ForgeCraft::Application.routes.draw do

  ActiveAdmin.routes(self)

  devise_for :users

  devise_scope :user do
    get "login", :to => "devise/sessions#new"
    get "register", :to => "devise/registrations#new"
    get "logout", :to => "devise/sessions#destroy"
    get "admin_logout", :to => "devise/sessions#destroy"
  end

  resources :users, :only => [:index]
  resources :players, :only => [:index, :show]
  get "ladder", :to => "players#index"
  
  resources :emails, :only => [:create]

  match 'armory/Sets' => "item_sets#index"
  resources :items, :only => [:show, :update]
  resources :armory, :controller => "classifications" do
    resources :items
  end
  resources :item_sets

  resources :topics

  match 'play' => "games#new"
  resources :games do
    member do
      get :restart
      get :finished
    end
    
    resources :actions, :only => :create
  end

  root :to => "users#index"

  get ':playername', :to => "players#show", :as => :player

end
