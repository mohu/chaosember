var App = Em.Application.create({

});

App.Point = Em.Object.extend({
  x : 0,
  y : 0
});

App.env = Em.Object.create({
  x : 0.5,
  n : 0,
  r : 1.1,
  counter : 0,
  clear_flag : false
});

App.equations = Em.Object.create({
  nonlinear : function(r,x){
    return r*x*(1-x);
  }
});

App.pointController = Em.ArrayController.create({
  content : [],
  refresh : function(){
    var ox = App.env.get('x');
    App.pointController.content.clear();
    App.env.set('n',0);
    for( var i = 0; i<200;i++){
      App.pointController.content.pushObject( App.Point.create({
        x : App.env.get('n'),
        y : App.env.get('x')*500
      }));
      App.env.set('n',App.env.get('n')+5);
      App.env.set('x',App.equations.nonlinear(App.env.get('r'),App.env.get('x')));
    }
    App.env.set('x',ox);
    App.env.set('counter',App.env.get('counter')+1);
  },
  clear : function(){
    App.env.set('clear_flag', true);
    App.env.set('counter',App.env.get('counter')+1);
  }
});

App.Controls = Em.View.extend({
  keyUp : function(e){
    console.log('d');
    if(e.keyCode == 13){
      App.pointController.refresh();
    }
  },
  didInsertElement : function(){
    $('#rslider').slider({
      min : 0,
      max : 4,
      step : 0.1,
      value : App.env.get('r'),
      slide : function(event,ui){
        App.env.set('r',ui.value);
        App.pointController.clear();
        App.pointController.refresh();
      }
    });
    $('#xslider').slider({
      min : 0,
      max : 1,
      step : 0.1,
      value : App.env.get('x'),
      slide : function(event,ui){
        App.env.set('x',ui.value);
        App.pointController.clear();
        App.pointController.refresh();
      }
    });
  },
  redraw : function(){
    App.pointController.refresh();
  },

  clear : function(){
    App.pointController.clear();
  }

});

App.Canvas = Em.View.extend({
  refresh : function(){
    var context = this.getContext();
    if(App.env.get('clear_flag') === true ){
      context.clearRect(0,0,1000,500);
      App.env.set('clear_flag',false);
      return;
    }
    context.fillStyle = "rgb("+Math.floor(Math.random()*200)+","+Math.floor(Math.random()*200)+","+Math.floor(Math.random()*200)+")";
    context.strokeStyle = "rgb("+Math.floor(Math.random()*200)+","+Math.floor(Math.random()*200)+","+Math.floor(Math.random()*200)+")";
    context.beginPath();
    context.moveTo(App.pointController.content[0].x,App.pointController.content[0].y);
    $.each(App.pointController.content,function(i,item){

      //context.arc(item.x,item.y,1.5,0,Math.PI*2,true);
      context.lineTo(item.x,item.y);
    });
    context.stroke();
  }.observes('App.env.counter'),
  mouseDown: function() {

  },
  getContext: function(){
    return this.$(this.getElement()).find('#can').get(0).getContext('2d');
  },
  getElement: function(){
    return Em.get(this,'element');
  }
});
