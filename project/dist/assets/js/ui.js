"use strict";

const ui = function (ui, $) {
  ui.init = function () {
    ui.anchorMove.init();
  };

  ui.anchorMove = {
    init : function(){
      this.settings();
      this.event();
    },
    settings : function(){
      this.headerH = Math.ceil($('.g_header').outerHeight());
      this.pdT = parseInt($('.g_conts').css('padding-top'));
      this.anchorTrr = $('.anchor-trriger');
      this.anchorTar = $('.anchor-target');
      this.setDefaultAttr =  {'aria-selected':'false','tabindex':-1};
      this.setActiveAttr = {'aria-selected':'true','tabindex': 0};
      this.anchorTarArr = [];
      let anchorTarArr = this.anchorTarArr;
      let anchorTrr =  this.anchorTrr;
      let anchorTar =  this.anchorTar;
      let setActive = $('.anchor-trriger.active');
      setTimeout(function(){
        anchorTrr.each(function(i){
          anchorTrr.eq(i).attr({'aria-labelledby':'gAnchor' + i, 'aria-selected':'false', 'tabindex':-1});
          anchorTar.eq(i).attr({'aria-labelledby':'gAnchor' + i, 'aria-selected':'false', 'tabindex':-1});
          if(setActive.length <= 0){
            anchorTrr.eq(0).addClass('active').attr({'aria-selected':'true', 'tabindex':0});
            anchorTar.eq(0).addClass('active').attr({'aria-selected':'true', 'tabindex':0});
          }
          anchorTarArr.push([Math.ceil(anchorTar.eq(i).offset().top), Math.ceil(anchorTar.eq(i).outerHeight())]);
        });
      }, 10);
    },
    event : function(){
      // console.log($('body')[0].scrollHeight);
      $('.anchor-trriger>a').on('click', function(){
        let target = $(this);
        anchorMove.action(target);
      });
      anchorMove.scroll();
    },
    action : function(target){     
      let idx = target.closest(this.anchorTrr).index();
      let posT = this.anchorTarArr[idx][0];
      this.anchorTrr.removeClass('active').attr(this.setDefaultAttr);
      this.anchorTrr.eq(idx).addClass('active').attr(this.setActiveAttr);
      this.anchorTar.attr(this.setDefaultAttr);
      this.anchorTar.eq(idx).attr(this.setActiveAttr);

      _clickMove('html, body', (this.pdT + this.headerH));

      function _clickMove(elem, term){
        $(elem).animate({
          scrollTop : posT - term
        }, 200);
      }
    },
    scroll : function(){
      let anchorTarArr = this.anchorTarArr;
      let anchorTrr = this.anchorTrr;
      let anchorTar = this.anchorTar;
      let setDefaultAttr =  {'aria-selected':'false','tabindex':-1};
      let setActiveAttr = {'aria-selected':'true','tabindex': 0};
      _scroll(window, (this.pdT + this.headerH), 'body');
      function _scroll(elem, term, elem2){ 
        $(elem).scroll(function(){
          let thisT = $(this).scrollTop();
          let innerHeight = $(elem).innerHeight();
          let scrollHeight = $(elem2).prop('scrollHeight');
          for(var i = 0; i<anchorTarArr.length; i ++){
            if(thisT >= (anchorTarArr[i][0] - term) && thisT < ((anchorTarArr[i][0] + anchorTarArr[i][1]) - term)){
              anchorTrr.removeClass('active').attr(setDefaultAttr);
              anchorTrr.eq(i).addClass('active').attr(setActiveAttr);
              anchorTar.attr(setDefaultAttr);
              anchorTar.eq(i).attr(setActiveAttr);
              /* scroll bottom */
              if((thisT + innerHeight) >= (scrollHeight)) {
                anchorTrr.removeClass('active').attr(setDefaultAttr);
                anchorTrr.eq(anchorTarArr.length -1).addClass('active').attr(setActiveAttr);
              }
            }
          }
        })
      }
    }
  }
  ui.init();
  return ui;
}(window, jQuery);

window.addEventListener('DOMContentLoaded', function(e){
  ui.anchorMove.init();
  console.log('ts2')
});