ForgeCraft::Application.routes.draw do

  root :to => "users#home"
  resources :users
end
