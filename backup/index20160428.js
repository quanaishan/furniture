$(function(){
	$('.drag').draggable({ 
		appendTo: 'body',
		helper: 'clone'
	});
	
	$('#dropzone').droppable({
		activeClass: 'active',
		hoverClass: 'hover',
		accept: ".dragBase",
		drop: function (e, ui) {
			var tempObj		= ui.draggable;
			var dropTitle   = tempObj.find('a').attr('title');
			var arrInfo		= tempObj.find('a').attr('rel').split(',');
			var width		= parseInt(arrInfo[1], 10)+20;
			var $el = $('<div class="drop-item" style="width:'+width+'px;" rel="'+arrInfo[3]+'"><details><img src="'+arrInfo[0]+'" /></details></div>');		
			//绑定删除事件
			$el.append($('<button type="button" class="btn btn-default btn-xs remove"><span class="glyphicon glyphicon-trash"></span></button>').click(function () { 
				var delIndex = $(this).parent().index('.drop-item');
				$(this).parent().detach();
				$('#detailList tbody tr').eq(delIndex).remove();  
				$('.drop-item').each(function(i){
				   $('#detailList tbody tr').eq(i).find('td').eq(0).html(i+1);  
				});
			}));
			$(this).append($el);
			
			//添加组件
			var comgroup = parseInt(arrInfo[4], 10);
			$el.append($('#comgroup'+comgroup).html());			

			var index = $('#detailList tbody tr').length + 1;        
			var html  = '';
			html += '<tr>';
			html += '<td>'+index+'</td>';
			html += '<td>'+arrInfo[2]+'</td>';
			html += '<td>0</td>';
			html += '<td>0</td>';
			html += '<td>0</td>';
			html += '<td>0</td>';
			html += '<td>0</td>';
			html += '<td>0</td>';
			html += '</tr>';
			$('#detailList tbody').append(html);        

			$('.drop-item').droppable({
				activeClass: 'active',
				hoverClass: 'hover',
				accept: ".dragCom",
				drop: function (e, ui) {
					var tempObj		= ui.draggable;
					var arrInfo		= tempObj.find('a').attr('rel').split(',');
					var dragTitle   = tempObj.find('a').attr('title');				

//					console.log($(this).attr('rel'));

					var arrRel    = $(this).attr('rel').split('-');
					var arrVerify = new Array(); 				 
					for(var i in arrRel) {
						tempArr = arrRel[i].split('_');
						arrVerify[tempArr[0]] = parseInt(tempArr[1], 10);
					}

					var cate     = parseInt(arrInfo[0], 10);

					//不是他的配件
					if (!arrVerify[cate]) {
						tipspop(dragTitle+'不是'+dropTitle+'的配件');
						return false;
					}

					//组件信息
					var cateInlist = cate+2;
					var baseIndex  = $(this).index('.drop-item')+1;
					var tempNumObj = $('#detailList tr').eq(baseIndex).find('td').eq(cateInlist);
					var num = parseInt(tempNumObj.html(), 10);
					
//					console.log(num+'=='+arrVerify[cateInlist]+'---'+cateInlist);

					if (num >= arrVerify[cate]) {
						tipspop(dragTitle+'在'+dropTitle+'中已达到最大配置数量');
						return false;
					}
					
					//依赖父关系
					if (arrInfo[1]) {
						var rely = parseInt(arrInfo[1], 10);
						var relyIndex   = rely+2;
						var tempRelyObj = $('#detailList tr').eq(baseIndex).find('td').eq(relyIndex);
						var relynum     = parseInt(tempRelyObj.html(), 10);
						if (relynum == 0) {
							tipspop('您还没有选择'+arrInfo[2]);
							return false;
						}
					}

					//更新组件信息
					num++;
					tempNumObj.html(num);					
					
					//显示组件
					$(this).find('.com'+comgroup+'-'+cate+'-'+num).show();
					
				}
			}).sortable({
				items: '.drop-item',
				sort: function() {
					$( this ).removeClass( "active" );
				}
			});        
		}
	}).sortable({
		items: '.drop-item',
		sort: function() {
			$( this ).removeClass( "active" );
		}
	});
	
});

//信息提示
function tipspop(text) {	
	$('#tipspop .modal-body p').html(text);	
	$('#tipspop').modal("toggle").show();
}

//删除组件
function delcom(obj, cate, rely) {
	
	//依赖子关系
	if (rely) {
		var parentObj   = obj.parents('.drop-item');	
		var baseIndex   = parentObj.index('.drop-item')+1;
		var arrRely		= rely.split(',');
		var relyIndex   = parseInt(arrRely[0], 10)+2;
		var tempRelyObj = $('#detailList tr').eq(baseIndex).find('td').eq(relyIndex);
		var relynum     = parseInt(tempRelyObj.html(), 10);
		if (relynum > 0) {
			tipspop('您还选择了'+arrRely[1]);
			return false;
		}
	}	
	
	var parentObj = obj.parent();
	var grandObj  = parentObj.parent();
	parentObj.hide();
	
	//组件数目减一
	cate = parseInt(cate, 10);
	var cateInlist = cate+2;
	var baseIndex  = grandObj.index('.drop-item')+1;
	var tempNumObj = $('#detailList tr').eq(baseIndex).find('td').eq(cateInlist);
	var num = parseInt(tempNumObj.html(), 10)-1;
	num     = num > 0 ? num : 0;
	tempNumObj.html(num);	
}
