#= require jquery
#= require jquery_ujs
#= require underscore
#= require backbone
#= require backbone_rails_sync
#= require backbone_datalink
#= require_tree ./lib
#= require backbone/forge_craft

ForgeCraft.start = ->

  # Router
  window.router       = new ForgeCraft.Routers.Router

  # Collections
  window.Loot         = new ForgeCraft.Collections.Loot
  window.Sounds       = new ForgeCraft.Collections.Sounds(ForgeCraft.Config.sounds)

  # Models
  window.player       = new ForgeCraft.Models.Player ForgeCraft.Config.player
  window.map          = new ForgeCraft.Models.Map

  # Views
  window.flashView    = new ForgeCraft.Views.FlashView el: $('#flash-wrap').get(0)
  window.loadingView  = new ForgeCraft.Views.LoadingView el: $('#loading').get(0)
  window.playerView   = new ForgeCraft.Views.PlayerView el: $('#profile').get(0), model: player
  window.menuView     = new ForgeCraft.Views.MenuView
  window.equipperView = new ForgeCraft.Views.EquipperView
  window.armoryView   = new ForgeCraft.Views.ArmoryView
  window.mapView      = new ForgeCraft.Views.MapView
  window.tooltipView  = new ForgeCraft.Views.TooltipView
  window.splashView   = new ForgeCraft.Views.SplashView el: $('#splash-message').get(0)

  window.appView      = new ForgeCraft.Views.AppView