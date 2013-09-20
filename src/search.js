define(function(require, exports, module) {
   var $ = require("jquery");
   /**
	* 搜索选择模块
	*/
   var search_pick = function( options ){
        var config = $.extend( {
		        skin : 1,
				wrap_mdcb : [],
				item_mdcb : [],
				source : [],
				pager_entries : 3,
				per_pager_num : 10,
				pager_num_edgs :1
		    }, options || {} ),//这里写错一个 逗号，导致找问题找了2个小时
			on_page = 1,
			cach_result = [],
			search_type = 1,//1 表示搜索中文，2表示搜索字母
			search_val = "",
			repl = null,
			wrap = $("<div class=\"s_pick   s_pick_skin_"+ config.skin +"\">"
					+"	 <div class=\"s_pick_h\">abc,按拼音排序</div>"
					+"	 <ul class=\"s_pick_r\">"
					+"	 </ul>"
					+"	 <div class=\"s_pick_pager\">"
					+"		 <span>&lt;&lt;</span><span>1</span><span class=\"on\">2</span><span>4</span><span>&gt;&gt;</span>"
					+"	 </div>"
					+"</div>"),
			tips = wrap.children( ".s_pick_h" ),
			re_wrap = wrap.children( ".s_pick_r" ),//record wrap
			page_wrap = wrap.children( ".s_pick_pager" ),
			
			get_entries = function(current_page, num_records )  {
				var ne_half = Math.floor(config.pager_entries/2);
				var np = Math.ceil( num_records / config.per_pager_num );
				var upper_limit = np - config.pager_entries;
				var start = current_page > ne_half ? Math.max( Math.min(current_page - ne_half, upper_limit), 1 ) : 1;
				var end = current_page > ne_half?Math.min(current_page+ne_half, np):Math.min( config.pager_entries, np);
				return {start:start , end:end , num_page: np};
			},
			make_patt = function( val ){
			    var i = 0, patt = "^", rep = "";
				for( ;i < val.length; i ++ ){
				   patt += '(' + val.substr(i,1) + ")(.*?)";
				   rep +="<i>$"+ (2 * (i+1) - 1 ) +"</i>$"+( 2*(i+1));
				}
				return {patt : new RegExp( patt, "i"), rep : rep };
			},
			search =  function( val, sou ){
			    var i = 0,temp = ""; 
				    // type = /[A-Za-z]+/.test( val ) ? 2 : 1,//type ：1 表示搜索中文，2表示搜索字母
				sou = sou || config.source, 
				record = [], result = [];
				repl = make_patt( val );	 
				 /*if( type != search_type && /\d/.test( type.toString() ) ){
     				 search_type = parseInt( type );
				}*/
				/* for(; i < sou.length; i++){
					 record = sou.slice( i, i+1 )[0].concat();
					 if( repl.patt.test( record[ type ] ) ){//
						 record.push( record[ 2 ] );//排序用
						 record.push( record[ 1 ] );//绑定title用
						 record[ type ] = record[ type ].replace( repl.patt, repl.rep ) 
						 result.push( record );
					 }else if( repl.patt.test( record[ 0 ] ) ){//三字码搜索
						 record.push( record[ 1 ] );//排序用
						 record.push( record[ 1 ] );//绑定title用
						 result.push( record );
					 }
					 
				 }*/
				$.each(sou,function(num,item){
					if((!item.label || (typeof item.isSearch != 'undefined' && item.isSearch ))&&(Object.prototype.toString.call( item.cities ).replace(/\[.+?\s+(.+)\]/,"$1") == "Array" )){
						$.each(item.cities,function(index,el){
							$.each(el,function(serial,single){
							    if(!/[A-Za-z]+/.test( val )){
									if( repl.patt.test( single )){//中文匹配
										record = el.concat();
										record.push(serial);//保存匹配的字段的下标
										result.push(record);
										return false;
									}
								}else{
									if( repl.patt.test( single )){//字母匹配
										record = el.concat();
										record.push(serial);//保存匹配的字段的下标
										result.push(record);
										return false;
									}
								}
							});
						});
					}
				});
				on_page = 1;
				search_val = val;
				result.sort(function( a, b ){
					   var a = a[a[a.length-1]],
						   b = b[b[b.length-1]],
						   c = [ a, b].sort();
						   if( c[0] == a ){
							  return -1;
						   }else{
							  return 1;
						   }
				});
				for(i=0;i<result.length;i++){//过滤掉相同的城市
					if(temp == result[i][0]){
						result.splice(i,1);
						i--;
					}else{
						temp = result[i][0];
					}
				}
				cach_result = result;//所有符合的搜索结果
				return this;
			},
			rend_list = function( result){//渲染列表
			//console.log(result);
			    var  i = 0, str = "",index = 0;temp = {};
					 for(; i < result.length ; i++){
						index = result[i].slice(-1);
						if( index == "0" ){
							temp.hanzi = result[i][0].replace( repl.patt, repl.rep ) ;
							temp.zimu = result[i][1];
						}else{
							temp.hanzi = result[i][0];
							temp.zimu = result[i][index].replace( repl.patt, repl.rep );
						}
						str += "<li title=\""+ result[i][0] +"\" code=\""+ result[i][2] +"\""+ (i == 0 ? "class=\"on\"" : "") +">"
							+"<span class=\"s_pick_city\">"+ temp.hanzi +"</span><span class=\"s_pick_char\">"+ temp.zimu +"</span></li>"
					 } 
				re_wrap.html( str );
			},
			rend_page = function( current_page, num_records){
			    var page_info = get_entries( current_page, num_records ), str="", i = 0;
				if( current_page > 1 ){
				    str += "<span>&lt;&lt;</span>";
				}
				
				if( config.pager_num_edgs < page_info.start ){
				    str += "<span>"+ 1 +"</span>";
				}
				if( page_info.start - config.pager_num_edgs > 1 ){
				    str += "<em>...</em>"; 
				}
				for(i = page_info.start; i<=page_info.end; i++){	
				    str +=  i == current_page ? ("<span class=\"on\">"+ i +"</span>") : ("<span>"+ i +"</span>");	   
				}
				if( page_info.num_page - page_info.end > 1){
				    str += "<em>...</em>"; 
					
				}
				if( page_info.num_page > page_info.end){
				    str += "<span>"+ page_info.num_page +"</span>";
				}
				if( current_page < page_info.num_page ){
				     str += "<span>&gt;&gt;</span>"; 
				}
				page_wrap.html( str );
			},
			render = function( current_page, sou ){
			     var num ,
				     sou = sou || cach_result,
				 　　np = Math.ceil( sou.length / config.per_pager_num ),
					 current_page = current_page || on_page;
					 if( current_page < 1 || current_page > np && np != 0 ){
                         return ;						 
					 }
					 if( current_page != on_page ){
					    on_page = current_page;
					 }
					 num = config.per_pager_num * (current_page - 1);
				 if( sou.length == 0){
				     tips.html( "对不起，找不到<strong style=\"padding:0 5px;\">"+search_val+"</strong>相关信息");
					 page_wrap.hide();
				 }else{
				     tips.html( search_val +"，<span style=\"color:#777777;\">按拼音排序</span>");
					 page_wrap.show();
				 }	 
				 
				 rend_list( sou.slice( num, num + config.per_pager_num ));
				 rend_page( current_page,sou.length );
				 e_to_wrap();
				 e_to_record();
				 e_to_page();
				 return this;
			},
			e_to_wrap = function(){
			     wrap.mousedown(function(){
					   var el = this;
						 if( config.wrap_mdcb.length > 0 ){
							 $.each(config.wrap_mdcb,function( index, item){
										   item.call( el, el );
							 });
						 }
						 return false;
					});
			},
			e_to_record = function(){
			     re_wrap.children().mousedown(function(){
				     var el = this;
					 if( config.item_mdcb.length > 0 ){
						 $.each(config.item_mdcb,function( index, item){
						              if( item && typeof item == 'function')
									   item.call( el, el );
						 });
					 }
					 return false;
				 }).mouseover(function(){
				     $( this ).addClass("on").siblings(".on").removeClass("on");
				 });
			},
			e_to_page = function(){
			     page_wrap.children().mousedown(function( index, item ){
				     if( $( this ).hasClass("on") || $( this ).attr("tagName") == "em" ) return;
				     if( /\d/.test( $(this).html() ) ){
					     on_page =parseInt( $(this).html() );
					 }else if( $( this ).index() == 0 ){
					     --on_page;
					 }else{
					     ++on_page;
					 }
					 render();
					 return false;
				 });
			};
			this.get_on_page = function(){
			     return on_page;
			};
			this.enter_select = function(){
			       re_wrap.children(".on").trigger("mousedown");
			}
			this.move_select = function( keycode ){//38 ↑, 40,↓
			     var child = re_wrap.children();
				     index = child.filter(".on").index();
				switch( keycode ){
					case 38:
						 --index;
						 break;
					case 40:
						 ++index;
						 break;	
				}
				if( index < 0 ) index = child.length - 1;
				if( index >= child.length ) index = 0;
				child.eq( index ).addClass("on").siblings(".on").removeClass("on");		
                        						
			};
			this.wrap = wrap;
			this.search = search;
			this.render = render;
			
   };
   module.exports = search_pick;
})