Rails.application.routes.draw do
# API
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      # ----------master------------
      resources :skill_level1s, only: [:index, :new, :create, :show] do 
        member do 
          get 'skill_level2s' => 'skill_level1s#skill_level2s'
        end
      end
        post 'skill_level1s/:id', to: 'skill_level1s#update', as: nil
      resources :skill_level2s
      resources :list_skill_level2_in_skill_level1s
      # ----------------------------
      resources :users , only: [:index, :new, :create, :show]
        post 'users/:id', to: 'users#update', as: nil
        post 'search', to: 'users#search', as: nil
        get 'searched', to: 'users#show_searched_users'
        get 'skill_inventory/:id', to: 'users#skill_inventory', as: "skill_inventory"
      resources :user_skill1s
      resources :user_skill2s
      resources :admins
      resources :projects, only: [:index, :new, :create, :show] do
        member do
          get 'members' => 'projects#members'
        end
      end
        post 'projects/:id', to: 'projects#update', as: nil
      resources :project_efforts
        get 'project_efforts/:id/month/:month', to: 'project_efforts#show_user_in_month', as: "show_user"
      resources :members, only: [:new, :create, :index]
        post 'members/:id/users/:id', to: 'members#destroy', as: nil
        post 'members/:id', to: 'members#update', as: nil
    end
  end

# Session
  # get 'login' => 'sessions#new'
  root             'sessions#new'
  post 'login' => 'sessions#create'
  delete 'logout' => 'sessions#destroy'
end
