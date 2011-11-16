#= require jquery
#= require jquery_ujs
#= require underscore
#= require backbone
#= require backbone_rails_sync
#= require backbone_datalink
#= require_tree ./lib
#= require backbone/forge_craft

$ ->

  # Router
  window.router       = new ForgeCraft.Routers.Router

  # Collections
  window.Loot         = new ForgeCraft.Collections.Loot

  # Models
  window.player       = new ForgeCraft.Models.Player ForgeCraft.Config.player

  # Views
  window.flashView    = new ForgeCraft.Views.FlashView el: $('#flash-wrap').get(0)
  window.loadingView  = new ForgeCraft.Views.LoadingView el: $('#loading').get(0)
  window.playerView   = new ForgeCraft.Views.PlayerView el: $('#profile').get(0), model: player
  window.menuView     = new ForgeCraft.Views.MenuView
  window.equipperView = new ForgeCraft.Views.EquipperView
  window.armoryView   = new ForgeCraft.Views.ArmoryView

  window.appView      = new ForgeCraft.Views.AppView

  