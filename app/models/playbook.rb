class Playbook
  include Mongoid::Document

  embeds_many :plays

  class << self

    def refresh
      Playbook.destroy_all
      i = -1
      Playbook.create({:plays => [
        
        Play.new({:id => (i+=1), :player => 1, :hero => "warrior", :action => "choose_action"}),
        Play.new({:id => (i+=1), :player => 1, :hero => "thief", :action => "choose_action"}),
        Play.new({:id => (i+=1), :player => 1, :hero => "ranger", :action => "choose_action"}),

        Play.new({:id => (i+=1), :player => 0, :action => "sync"}),

        Play.new({:id => (i+=1), :player => 1, :hero => "warrior", :action => "run_action"}),
        Play.new({:id => (i+=1), :player => 0, :action => "reap"}),
        Play.new({:id => (i+=1), :player => 0, :action => "end"}),

        Play.new({:id => (i+=1), :player => 1, :hero => "thief", :action => "run_action"}),
        Play.new({:id => (i+=1), :player => 0, :action => "reap"}),
        Play.new({:id => (i+=1), :player => 0, :action => "end"}),

        Play.new({:id => (i+=1), :player => 1, :hero => "ranger", :action => "run_action"}),
        Play.new({:id => (i+=1), :player => 0, :action => "reap"}),
        Play.new({:id => (i+=1), :player => 0, :action => "end"}),

        Play.new({:id => (i+=1), :player => 2, :hero => "warrior", :action => "choose_action"}),
        Play.new({:id => (i+=1), :player => 2, :hero => "thief", :action => "choose_action"}),
        Play.new({:id => (i+=1), :player => 2, :hero => "ranger", :action => "choose_action"}),

        Play.new({:id => (i+=1), :player => 2, :hero => "warrior", :action => "run_action"}),
        Play.new({:id => (i+=1), :player => 0, :action => "reap"}),
        Play.new({:id => (i+=1), :player => 0, :action => "end"}),

        Play.new({:id => (i+=1), :player => 2, :hero => "thief", :action => "run_action"}),
        Play.new({:id => (i+=1), :player => 0, :action => "reap"}),
        Play.new({:id => (i+=1), :player => 0, :action => "end"}),

        Play.new({:id => (i+=1), :player => 2, :hero => "ranger", :action => "run_action"}),
        Play.new({:id => (i+=1), :player => 0, :action => "reap"}),
        Play.new({:id => (i+=1), :player => 0, :action => "end"})

      ]})
      
    end

  end


end
