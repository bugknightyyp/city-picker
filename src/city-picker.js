define(function(require, exports, module) {
   var $ = require("jquery");
   require("../css/city-picker.css");
   var offer = require("./offer.js");
   var search = require("./search.js");
   /*var city_picker = function( opitons ){
        this.config = {};
   };*/
   //$( "body").append( new offer({hot:commoncitysFlight,source:citysForFlight}));
   
   //var searcher = new search({source:citysForFlight});
  // search =  function( val, type, sou ){//type ：1 表示搜索中文，2表示搜索字母
 // searcher.search( "J", 2 ).render();	
  //val, sou, current_page
  // $( "body").append( searcher.wrap );
   
   var city_picker = function( options ){
	    var config = $.extend( {
		        txt : null, //输入框对象
				blur_callback : null,//输入框失去焦点回调事件
				item_mdcb : null,//选择城市后的回调事件
				source : [],
				skin : 1,
				offer_w : 334,//选择界面的宽度
				offer_atom_w :16.66666666//选择界面里，每一列城市宽度所占宽度百分比
				/*ie6，ie7在用百分比设置宽度时，由于浏览器在处理浮点数，进位时，可能会出现小偏差，出来的数据可能比预期少一列。
				如果出现请微调offer_w或offer_atom_w，来达到预期效果，例如:想让数据呈现4列，offer_atom_w 设置成为了25%，
				但是在ie6,7能呈现的数据是3列，这时你可以微调offer_atom_w，将其设置为：24.9999999；来达到兼容ie6，ie7
				*/
		    }, options || {} ),
		com_offer = null,
		com_search = null,
		last_val = "",
		is_hide = true,
		set_pos = function( txt, el ){//输入框，相对于输入框定位的element.
		     var offset =  $( txt ).offset(), th = $( txt ).outerHeight();
			 $( el ).css({left:offset.left, top:offset.top + th - 1});
			 return $( el );
		},
		wrap_mdcb = [ function(){
				     is_hide = false;
					 // $("#log").append( "wrap 被点击后 is_hide "+ is_hide +" <br />" );
					  if( !!-[1,] ){//IE678=!-[1,]
					     config.txt.blur();
					  }
					  }],
		item_mdcb = [config.item_mdcb, function(){
				      is_hide = true;
					  last_val = $.trim( config.txt.val() );
					  /*
					    如果其他元素的nousedown事件组织冒泡的话，点击该元素，
						ie 6/7/8 的input 则会失去焦点 从而触发blur事件，
						而其他浏览器中的input不会失去焦点。
					  */
					  if( !!-[1,] ){
					     config.txt.blur();
					  }
		}];
		
		config.txt.focus(function(){
		     config.txt[0].select();//会重新触发一次获得焦点事件
			 if( !com_offer ){
			     com_offer = new offer({
						skin : config.skin,				 
						hot : config.hot,
						source : config.source,
						offer_w : config.offer_w,
						offer_atom_w :config.offer_atom_w,//54
						wrap_mdcb : wrap_mdcb,
						item_mdcb : item_mdcb
				  }); 
				 $( "body" ).append( set_pos( config.txt, com_offer.wrap ) );
			 }else{
			     
				 if( !com_search || com_search.wrap.is(":hidden")){
				    com_offer.wrap.show();
				    set_pos( config.txt, com_offer.wrap );
				 }
				// com_offer.wrap[0].style.display="block";
				
			 }
			// $("#log").append( "yyp focus <br />" );
		}).blur(function(){
		  // return false;
		   // alert("dd");
		    
		    if( !is_hide ){
			   
			    (function( txt ){
				      setTimeout(function(){
					     is_hide = true;
				         $( txt ).trigger("focus");
				        },0); 
						//$("#log").append( "重又获得焦点 <br />" );
				})( this );
			   
			}else{
			   com_offer.wrap && com_offer.wrap.hide();
			   if( com_search ){
			       com_search.wrap.hide();
			   }
			   
			   if( config.blur_callback && typeof config.blur_callback == 'function'){
			       config.blur_callback.call( this, this );
			   }
			  // $("#log").append( "blur 要隐藏了 is_hide "+ is_hide +" <br />" );
			}
			 
		}).keyup(function( e ){
			 var val = $.trim( config.txt.val() ).replace(/[\\\/\*\.\?]/g,"");//简单过滤对正则表达式有影响的特殊字符
			 if ( last_val != val ){
			      last_val = val;
			     if( val == "" ){
					 com_offer.wrap.show();
					 if( com_search ) com_search.wrap.hide();
					 return ;
				 }
				 if( com_offer && com_offer.wrap.is(":visible")){
					 com_offer.wrap.hide();
				 }
				 if( !com_search ){
					 com_search = new search({
                          skin : config.skin,					 
						  source : config.source,
						  wrap_mdcb : wrap_mdcb,
					      item_mdcb : item_mdcb
					  }); 
					  com_search.search( val ).render();
					 $( "body" ).append( set_pos( config.txt, com_search.wrap ) );
				 }else{
					 //console.log( typeof com_search.search )
					 
						com_search.search( val );
						com_search.render();
						set_pos( config.txt, com_search.wrap ).show();
				 }
			 }else{
			     switch( e.which ){
					 case 37:
					     com_search.render( com_search.get_on_page() - 1);
						 break;
					 case 39:
						 com_search.render( com_search.get_on_page() + 1);
					     break; 
                     case 13:
                         com_search.enter_select();	
						 
			      if (!-[1,]){
							//setTimeout(function(){
							   config.txt.blur();
							//},1)
						     
						  }
                         break;						 
			     }
			 }
			 
		}).keydown(function( e ){
		     if( com_search && com_search.wrap.is(":visible")){
			     switch( e.which ){
					 case 38:
					 case 40:
						 com_search.move_select( e.which );
					     break;						 
			     } 
			 }
		   
		});	
     }
  module.exports = city_picker;
})
