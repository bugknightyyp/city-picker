define(function(require, exports, module) {
    var $ = require("jquery");
    /**
	* 分类显示切换模块
	*/
    var offer_pick = function( options ){
	    var config = $.extend( {
				skin : 1,
				wrap_mdcb : [],
				item_mdcb : [],
				source : []
		    }, options || {} ),
		wrap = $( "<div class=\"o_pick  o_pick_skin_"+ config.skin +"\"style=\"width:" +config.offer_w+ "px\">"
					+"		 <div class=\"o_pick_h\">拼音支持首字母输入，或 ← ↑ ↓ → 选择</div>"
					+"		 <div class=\"o_pick_tab\">"
					+"			 <ul></ul>"
					+"		 </div>"
					+"		 <div class=\"o_pick_list\">"
					+"		 </div>"
					+"	</div>" ),
		tips = wrap.children( ".o_pick_h" ),
		tab_box = $( ".o_pick_tab ul", wrap ),
		tab_con = wrap.children( ".o_pick_list" ),
		rend_atomic = function( sou ){
			 return "<span code=\""+ sou[2] + "\"title=\""+ sou[0] +"\" style=\"width:"+config.offer_atom_w+"%;\">"+ sou[0] +"</span>";
		},
		rend_pin_list = function(index, pin, source ){
			var i = j = 0, sort = {}, alpha, letters = str = "";
			//按首字母分类生成响应字符串；
			for(; i < source.length; i++ ){
			     alpha = source[i][1].substr(0,1);//取城市的拼音的第一个字母
				 if( typeof sort[alpha] == "undefined" ){
				     sort[alpha] = "";
				 }
				 sort[alpha] = sort[alpha] + (rend_atomic( source[i] ));
			}
			//按首字母分组生成响应字符串；
			for(i = 0; i < pin.length; i++){
			    for(; j < pin[i].length; j++){
					 alpha = pin[i].substr(j,1);//取按拼音分类的第j个字母
					 if( typeof sort[alpha] != "undefined" ){
							 letters += alpha;
							 str += "<strong>"+ alpha +"</strong>";
							 str += sort[alpha];
					    }
				 }
				 if( str != "" ){
				     tab_box.append("<li>" + letters + "</li>");
				     tab_con.append( "<div class=\"o_pick_item\" name=\""+ letters +"\"  style=\"display:"+(index==0 && i == 0 ? "block" : "none")+";\">" + str +"</div>" );  
				 }  
				 j = 0;
			     letters = str = "";  
			}
		},
		rend_item_hot = function( index,item ){
		    var i = 0, str = "";
			for(; i < item.cities.length; i++){
			     str += rend_atomic( item.cities[i] );
			}
			//alert(str);
			tab_box.append("<li class=\""+(index == 0? "on" : "")+"\">"+item.label+"</li>");
			tab_con.append("<div class=\"o_pick_item\" style=\"display:"+ (index == 0 ? "block" : "none")+"\">"+ str +"</div>");
		},
		rend_tab_list = function( source ){
			$.each(source,function(index,item){
			     switch( Object.prototype.toString.call( item.label ).replace(/\[.+?\s+(.+)\]/,"$1")){
					case "String":
						rend_item_hot(index,item);
						break;
					case "Array":
						rend_pin_list(index, item.label,item.cities);
						break;
					default:
				 }
			});
		};
		/*init*/
		rend_tab_list( options.source );
		tab_box.children().mousedown( function(){
			 if( $( this ).hasClass( "on" )) return ;
			 $(this).addClass("on").siblings(".on").removeClass("on");
			var nima =  tab_con.children().eq($(this).index());
			nima[0].style.display = "block";
			nima.siblings().hide();			 
		});
		wrap.mousedown(function(){
		   var el = this;
			 if( config.wrap_mdcb.length > 0 ){
			     $.each(config.wrap_mdcb,function( index, item){
							   item.call( el, el );
				 });
			 }
			 return false;
		});
		$( ".o_pick_item > span", tab_con ).mousedown(function(){
		    var el = this;
			 if( config.item_mdcb.length > 0 ){
			     $.each(config.item_mdcb,function( index, item){
				              if( item && typeof item == 'function')
							   item.call( el, el );
				 });
			 }
			 return false;
		});
		this.wrap = wrap;
    };
    module.exports = offer_pick;
})
