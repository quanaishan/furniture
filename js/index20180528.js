$(function(){
	var	arrRelyConfig  = {	
		'5': '0,40cm門板',
		'16': '6,80cm門板-7,80cm雙抽屜門板'
	};
	var	arrComgroupHeightConfig  = {	
		'0': 79,
		'1': 335,
		'2': 79,
		'3': 335,
		'4': 179
	};
	var	arrComgroupMaxConfig  = {	
		'0': 0.32,
		'1': 1,
		'2': 0.32,
		'3': 1,
		'4': 0.64
	};
	var	arrComWeightConfig  = {	
		'0': 0,
		'1': 0,
		'2': 0.35,
		'3': 0.2,
		'4': 0.15,
		'5': 0,
		'6': 0,
		'7': 0.32,
		'8': 0.64,
		'9': 0,
		'10': 0.32,
		'11': 0.35,
		'12': 0.2,
		'13': 0.15,
		'14': 0.15,
		'15': 0.35,
		'16': 0
	};
	
	var arrMutexConfig = {
		'6' : '7_80cm雙抽屜門板-8_80cm四抽屜門板-10_80cm雙抽屜',
		'7' : '6_80cm門板-8_80cm四抽屜門板-10_80cm雙抽屜',
		'8' : '6_80cm門板-7_80cm雙抽屜門板-10_80cm雙抽屜',
		'10': '6_80cm門板-7_80cm雙抽屜門板-8_80cm四抽屜門板'
	};	
	
	$('.drag').draggable({ 
		appendTo: 'body',
		helper: 'clone'
	});
	
	$('#dropzone').droppable({
		activeClass: 'active',
		hoverClass: 'hover',
		accept: ".dragBase,.dragCom",
		drop: function (e, ui) {
			var tempObj		= ui.draggable;
            
            //判断配件是否拖进柜体
            if (tempObj.hasClass('dragCom')) {
                $('#isfirstbase').val('0');
                setTimeout(function(){
                    var isfirstbase = parseInt($('#isfirstbase').val(), 10);
                    if (isfirstbase == 0) {
                        $('#isfirstbase').val('1');
                        tipspop('請先選擇櫃體');
                    }
                }, 100);                
                return false;
            }
            
			var dropTitle   = tempObj.find('a').attr('title');
			var arrInfo		= tempObj.find('a').attr('rel').split(',');
			var width		= parseInt(arrInfo[1], 10);
			var comgroup    = parseInt(arrInfo[4], 10);			
			
			if (comgroup > 1) {
				var detaillist = "detailList1";
				var extraclass = "zu1";
				var comnum	   = 11;
			} else {
				var detaillist = "detailList0";
				var extraclass = "zu0";
				var comnum	   = 6;
			}
			
			var $el = $('<div class="drop-item '+extraclass+'" style="width:'+width+'px;" rel="'+arrInfo[3]+'"><p class="details"><img src="'+arrInfo[0]+'" /></p></div>');		
			//绑定删除事件
			$el.append($('<button type="button" class="btn btn-default btn-xs remove"><span class="glyphicon glyphicon-trash"></span></button>').click(function () { 
				var delIndex = $(this).parent().index('.'+extraclass);				
				var tempObj = $(this).parent().parent();
				
				var mod = comgroup % 2;
				tempObj.removeClass('g'+mod);
				$(this).parent().detach();	
				
				if (tempObj.find('.drop-item').length > 0) {
					var childObj = tempObj.find('.drop-item').eq(0);
					var tempH    = tempObj.height() - childObj.height();					
					childObj.css({'marginTop':tempH+'px'});
				} else {
					tempObj.remove();
				}
				
				$('#'+detaillist+' tbody tr').eq(delIndex).remove();  
				$('.'+extraclass).each(function(i){
				   $('#'+detaillist+' tbody tr').eq(i).find('td').eq(0).html(i+1);  
				});
                
                //计算总价
                totalPrice();
                
			}));
			
			//选择容器
			var mod = comgroup % 2;
			var containerid = Math.floor(comgroup/2);
			if ($('.gc'+containerid+':not(.g'+mod+')').length>0) {	
				var tempObj = $('.gc'+containerid+':not(.g'+mod+')').eq(0);
				if (mod == 1) {
					tempObj.append($el);
				} else {
					tempObj.prepend($el);
				}
				tempObj.addClass('g'+mod);
				tempObj.find('.drop-item').css({'marginTop':'0px'});
			} else {
				var $objG = $('<div class="gc gc'+containerid+' g'+mod+'"></div>');
				$(this).append($objG);
				$objG.append($el);
				
				var tempH = $('.gc').height() - arrComgroupHeightConfig[comgroup];
				$el.css({'marginTop':tempH+'px'});				
			}
			
			//添加组件			
			$el.append($('#comgroup'+comgroup).html());			
			
			var addIndex = $el.index('.'+extraclass);
			var index = 1;
			var html  = '';
			html += '<tr>';
			html += '<td>'+index+'</td>';
			html += '<td>'+arrInfo[2]+'<input class="comgroup" value="'+comgroup+'" type="hidden"/></td>';
			for(var i=0;i<comnum;i++) {
				html += '<td>0</td>';
			}
			html += '</tr>';
			
			if (addIndex == 0) {
				$('#'+detaillist+' tbody').prepend(html);
			} else {
				var prevIndex = addIndex-1;
				$('#'+detaillist+' tbody tr').eq(prevIndex).after(html);
			}
			$('.'+extraclass).each(function(i){
				$('#'+detaillist+' tbody tr').eq(i).find('td').eq(0).html(i+1);  
			});
            //计算总价
            totalPrice();

//			$('.drop-item').droppable({
			$el.droppable({
				activeClass: 'active',
				hoverClass: 'hover',
				accept: ".dragCom",
				drop: function (e, ui) {    
                    
                    $('#isfirstbase').val('1');
                    
					var tempObj		= ui.draggable;
					var arrInfo		= tempObj.find('a').attr('rel').split(',');
					var dragTitle   = tempObj.find('a').attr('title');		

					var arrRel    = $(this).attr('rel').split('-');
					var arrVerify = new Array(); 				 
					for(var i in arrRel) {
						tempArr = arrRel[i].split('_');
						arrVerify[tempArr[0]] = parseInt(tempArr[1], 10);
					}

					var cate     = parseInt(arrInfo[0], 10);

					//不是他的配件
					if (!arrVerify[cate]) {                        
                        var tempTip = dragTitle+'不是'+dropTitle+'的配件';
                        tipspop(tempTip);
						return false;
					}

					//组件信息
					var cateInlist = comgroup > 1 ? cate-4 : cate+2;
					var baseIndex  = $(this).index('.'+extraclass)+1;
					var tempNumObj = $('#'+detaillist+' tr').eq(baseIndex).find('td').eq(cateInlist);
					var num = parseInt(tempNumObj.html(), 10);

					if (num >= arrVerify[cate]) {
						tipspop(dragTitle+'在'+dropTitle+'中已達到最大配置數量');
						return false;
					}
					
					//兄弟互斥关系
					var comWeight   = 0;
					var comgroupMax = arrComgroupMaxConfig[comgroup];
					var tempCate    = 0;
					var tempNum     = 0;
					$('#'+detaillist+' tr').eq(baseIndex).find('td').each(function(i){
						if (i >= 2) {
							tempCate   = comgroup > 1 ? i+4 : i-2;
							tempNum    = parseInt($(this).html(), 10);
							tempNum   += cate == tempCate ? 1 : 0;
							comWeight += tempNum*arrComWeightConfig[tempCate];
						}					
					});
					if (comWeight > comgroupMax) {
						tipspop('配件已超过最大選购數量');
						return false;
					}					
					
					//依赖父关系
					if (arrRelyConfig[cate]) {
                        var arrRely	= arrRelyConfig[cate].split('-');
                        var relynum = 0;                         
                        for (i in arrRely) {
                            var arrParent	= arrRely[i].split(',');
                            var rely		= parseInt(arrParent[0], 10);
                            var relyIndex   = comgroup > 1 ? rely-4 : rely+2;
                            var tempRelyObj = $('#'+detaillist+' tr').eq(baseIndex).find('td').eq(relyIndex);
                            relynum        += parseInt(tempRelyObj.html(), 10);   
                        }
						if (relynum == 0) {
                            if (comgroup > 1) {
                                var cate8Index  = 4;
                                var cate8Obj    = $('#'+detaillist+' tr').eq(baseIndex).find('td').eq(cate8Index);
                                var cate8num    = parseInt(cate8Obj.html(), 10);                                
                                var tempTip = cate8num > 0 ? "門板高度無法加裝鏡子" : '您還沒有選擇80cm門板或80cm雙抽屜門板';
                            } else {
                               var tempTip = '您還沒有選擇40cm門板';
                            }
							tipspop(tempTip);
							return false;
						}
					}
					
					//互斥关系
					if (arrMutexConfig[cate]) {
						var arrMutex	= arrMutexConfig[cate].split('-');
						for (i in arrMutex) {
							var temp		 = arrMutex[i].split('_');
							var mutex		 = parseInt(temp[0], 10);
							var mutexIndex   = comgroup > 1 ? mutex-4 : mutex+2;
							var tempMutexObj = $('#'+detaillist+' tr').eq(baseIndex).find('td').eq(mutexIndex);
							var mutexnum     = parseInt(tempMutexObj.html(), 10);
							if (mutexnum > 0) {
								tipspop('您已選擇'+temp[1]);
								return false;
							}						
						}					
					}					

					//更新组件信息
					num++;
					tempNumObj.html(num);					
					
					//显示组件
                    if ($(this).find('.com'+comgroup+'-'+cate+'-'+num).is(":hidden")) {
                        num = num;
                    } else {
                        for (var i=0;i<arrVerify[cate];i++) {
                            if ($(this).find('.com'+comgroup+'-'+cate+'-'+i).is(":hidden")) {
                                 num = i;
                                break;
                            }
                        }
                    }	
                    
                    //双抽屉和格抽的关系
                    if (cate == 10 || cate == 13) {                        
                        var ten    = cate == 10 ? 13 : 10;
                        var tennum = 0;
                        for (var i=0;i<arrVerify[ten];i++) {
                            if ($(this).find('.com'+comgroup+'-'+ten+'-'+i).is(":visible")) {
                                tennum = i;
                                break;
                            }
                        }
                        if (tennum > 0) {
                            if (cate == 10) {
                                num = tennum > 2 ? 1 : 2;
                                if ($(this).find('.com'+comgroup+'-'+cate+'-'+num).is(":visible")) {
                                    num = tennum > 2 ? 2 : 1;
                                }
                            } else {
                                num = tennum > 1 ? 1 : 3;
                                if ($(this).find('.com'+comgroup+'-'+cate+'-'+num).is(":visible")) {
                                    num = tennum > 1 ? 2 : 4;
                                }
                            }
                        }                       
                    }                    
					$(this).find('.com'+comgroup+'-'+cate+'-'+num).show();
                    
                    //计算总价
                    totalPrice();                    
				}
			});
		}
	});	
	
	$('#dropzone').delegate('.drag-item', 'mouseover', function(){
		$(this).find('.remove').show();
	});
	$('#dropzone').delegate('.drag-item', 'mouseout', function(){
		$(this).find('.remove').hide();
	});

	$('#dropzone').delegate('.drop-item', 'mouseover', function(){
		if ($(this).find('.drag-item:visible').length == 0) {
			$(this).find('.remove').show();		
		}
	});
	$('#dropzone').delegate('.drop-item', 'mouseout', function(){
		$(this).find('.remove').hide();
	});	
    
    //鼠标按下
    $('#dropzone').delegate('.mousedown', 'mousedown', function(){
        var stop;
        var obj = $(this).parents('.drop-item').find('.mousedown');
        stop = setTimeout(function() {//down 1s，才运行。
            $('#mousedown').val('1');
            console.log("开始处理你的代码.");
            obj.addClass('notvisibility').css({'visibility':'hidden'});
        }, 300);
	});	
    
    //鼠标抬起
    $('#dropzone').mouseup(function(){
        var flag = parseInt($('#mousedown').val('1'), 10);
        if (flag > 0) {
            clearTimeout(stop);
        }
        $('#mousedown').val('0');
        $('.notvisibility').css({'visibility':'visible'});
    });
    
    //横坐标
    var htmlX = '';
    var index = 0;
    var tempx = 0;
    for(var i=0; i<1200; i+=70) {
        tempx  = index*40;
        if (tempx == 640) {
            tempx += "cm";
            htmlX += '<span style="width:30px;">'+tempx+'</span>';
        } else {
            htmlX += '<span>'+tempx+'</span>';
        }
        index++;
    }
    $('#coor-x').html('').html(htmlX);
    
});

//信息提示
function tipspop(text) {	
	$('#tipspop .modal-body p').html(text);	
	$('#tipspop').modal("toggle").show();
}

//删除组件
function delcom(obj, comgroup, cate, rely) {
	comgroup = parseInt(comgroup, 10);
	if (comgroup > 1) {
		var detaillist = "detailList1";
		var extraclass = "zu1";
		var comnum	   = 11;
	} else {
		var detaillist = "detailList0";
		var extraclass = "zu0";
		var comnum	   = 6;
	}
	
	//依赖子关系
	if (rely) {
		var parentObj   = obj.parents('.'+extraclass);	
		var baseIndex   = parentObj.index('.'+extraclass)+1;
		var arrRely		= rely.split(',');
		var relyIndex   = comgroup > 1 ? parseInt(arrRely[0], 10)-4 : parseInt(arrRely[0], 10)+2;        
        
		var tempRelyObj = $('#'+detaillist+' tr').eq(baseIndex).find('td').eq(relyIndex);
		var relynum     = parseInt(tempRelyObj.html(), 10);
		if (relynum > 0) {
			tipspop('您還選擇了'+arrRely[1]);
			return false;
		}
	}	
	
	var parentObj = obj.parent();
	var grandObj  = parentObj.parent();
	parentObj.hide();
	
	//组件数目减一
	cate = parseInt(cate, 10);
	var cateInlist = comgroup > 1 ? cate-4 : cate+2;
	var baseIndex  = grandObj.index('.'+extraclass)+1;
	var tempNumObj = $('#'+detaillist+' tr').eq(baseIndex).find('td').eq(cateInlist);
	var num = parseInt(tempNumObj.html(), 10)-1;
	num     = num > 0 ? num : 0;
	tempNumObj.html(num);
    
    //计算总价
    totalPrice();
}

//计算总价
function totalPrice() {
    var	arrComgroupWhitePriceConfig  = {	
		'0': 1350,
		'1': 2800,
		'2': 1200,
		'3': 3600,
		'4': 2400
	};
    var	arrComgroupBlackPriceConfig  = {	
		'0': 1350,
		'1': 2800,
		'2': 1200,
		'3': 3600,
		'4': 2400
	};
	var	arrComPriceConfig  = {	
		'0': 800,
		'1': 300,
		'2': 100,
		'3': 180,
		'4': 500,
		'5': 600,
		'6': 1500,
		'7': 3100,
		'8': 4900,
		'9': 500,
		'10': 2000,
		'11': 200,
		'12': 350,
		'13': 700,
		'14': 1750,
		'15': 1750,
		'16': 600
	};    
    
    var list0Cnt   = $('#detailList0 tr').length-1;
    var list1Cnt   = $('#detailList1 tr').length-1;
    var whitePrice = 0;
    var blackPrice = 0;    
    var comgroup   = 0;
    if (list0Cnt > 0) {
        for (var i=1;i<=list0Cnt;i++) {
            comgroup = parseInt($('#detailList0 tr').eq(i).find('.comgroup').val(), 10);
            whitePrice += arrComgroupWhitePriceConfig[comgroup];
            blackPrice += arrComgroupBlackPriceConfig[comgroup];
            $('#detailList0 tr').eq(i).find('td').each(function(j){
                if (j >= 2) {
                    tempCate    = comgroup > 1 ? j+4 : j-2;
                    tempNum     = parseInt($(this).html(), 10);                    
                    whitePrice += tempNum*arrComPriceConfig[tempCate];
                    blackPrice += tempNum*arrComPriceConfig[tempCate];
                }					
            });
        }
    }
    if (list1Cnt > 0) {
        for (var i=1;i<=list1Cnt;i++) {
            comgroup = parseInt($('#detailList1 tr').eq(i).find('.comgroup').val(), 10);
            whitePrice += arrComgroupWhitePriceConfig[comgroup];
            blackPrice += arrComgroupBlackPriceConfig[comgroup];
            $('#detailList1 tr').eq(i).find('td').each(function(j){
                if (j >= 2) {
                    tempCate    = comgroup > 1 ? j+4 : j-2;
                    tempNum     = parseInt($(this).html(), 10);                    
                    whitePrice += tempNum*arrComPriceConfig[tempCate];
                    blackPrice += tempNum*arrComPriceConfig[tempCate];
                }					
            });
        }
    }
    
    whitePrice = formatCurrency(whitePrice);
    blackPrice = formatCurrency(blackPrice);
    
    $('#price_white').html('NT$'+whitePrice);
    $('#price_black').html('NT$'+blackPrice);
}

//价格规范化
function formatCurrency(num) {  
    num = num.toString().replace(/\$|\,/g,'');  
    if(isNaN(num))  
        num = "0";  
    sign = (num == (num = Math.abs(num)));  
    num = Math.floor(num*100+0.50000000001);  
    cents = num%100;  
    num = Math.floor(num/100).toString();  
    if(cents<10)  
    cents = "0" + cents;  
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)  
    num = num.substring(0,num.length-(4*i+3))+','+  
    num.substring(num.length-(4*i+3));  
//    return (((sign)?'':'-') + num + '.' + cents);  
    return (((sign)?'':'-') + num);  
}  