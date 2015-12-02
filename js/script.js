var flag = true;
var length_catalog = 0;
var catalog = [];
var max_position = 50;

function isInteger(num) {
  return (num ^ 0) === num;
}

function numPages(val_size_catalog) {
	if (isInteger(val_size_catalog / max_position)) {
		return val_size_catalog / max_position;
	}
	else {
		return Math.floor(val_size_catalog / max_position)+1;
	}
}

function lengthCatalog(data) {
	catalog = [];
	length_catalog = 0;
	var count = 0;
	$.ajax({
		url: 'json/'+data+'',
		dataType: 'json',
		async: false,
		success: function(data) {
			catalog.push(data);
			for (var i = 0; i < catalog[0].length; i++) {
				console.log(catalog[0][i]);
				count++;
			}
		length_catalog = count;
		}
		
	});
	return length_catalog;
}

var size_catalog = lengthCatalog('big.json');
var num_pages = numPages(size_catalog);

function showNavigation() {
	$('.navigation > ul').empty();
	for (var i=1; i <= num_pages; i++) {
		q = i-1;
		$('.navigation > ul').append('<li><a href="#" onclick=showPage('+q+');>'+ i + '</a></li>');
	}
}

function showPage(num_page) {
	var showStringTable = function() {
		$('span#select').empty();
		$(this).children().each(function(){
			$('span#select').append($(this).text()+ " ");
		})
	};
	var sortTable = function(e) {
      if (flag == false) {
        flag = true;
      } else {
        flag = false;
      }
 
      if (e.target.tagName != 'TH') return;

      // Если  то сортируем
      sortGrid(e.target.cellIndex, e.target.getAttribute('data-type'));
	}
	
	var page = num_page+1;
	var k = -1;
	var $catalog = $(".catalog");
		$('.click').click(function() {
		var arr = [];
		$('span#select').empty();
		$(this).children().each(function(){
			arr.push($(this).text());
			$('span#select').append($(this).text()+ " ");
			console.log('count');
		})
	})
	var output = '<table id="grid" class="ut" class="tb"><thead class="t_hdr">'+  
        			'<tr>'+ 
             		'<th data-type="number">Идентификатор</td>'+ 
             		'<th data-type="string">Название</td>'+ 
             		'<th data-type="number">Стоимость</td>'+ 
            		'<th data-type="number">Количество</td>'+ 
        			'</tr>'+    
    				'</thead>';
	///$catalog.empty();
	do {
		k += 1;
		if (catalog[0][k][0] > (page * max_position - max_position) && (catalog[0][k][0] <= page * max_position)) {
			output += '<tr id="z_'+k+'" class = "click">';
			for (var i=0; i <= catalog[0][k].length-1; i++) {
				output += '<td>'+catalog[0][k][i]+'</td>';
			}
			output += '</tr>';
		}
	} while (k < size_catalog-1)
	//size_catalog-1 тк не учитываем  первую хэш строку
	output += '</table>';
	$catalog.html(output);
	$('.click').bind('click', showStringTable);
	$('#grid').bind('click', sortTable);	
}

function sortGrid(colNum, type) {
      var tbody = grid.getElementsByTagName('tbody')[0];

      // Составить массив из tr
      var rowsArray = [].slice.call(tbody.rows);
      var compare;

      switch (type) {
        case 'number':
          compare = function(rowA, rowB) {
			  if (flag == true) {
            return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
			  } else {
				  return rowB.cells[colNum].innerHTML - rowA.cells[colNum].innerHTML;
			  }
          };
          break;
        case 'string':
          compare = function(rowA, rowB) {
			  if (flag == true) {
            return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
			  } else {
				  return rowB.cells[colNum].innerHTML > rowA.cells[colNum].innerHTML ? 1 : -1;
			  }
          };
          break;
      }
        rowsArray.sort(compare);

      grid.removeChild(tbody);
      for (var i = 0; i < rowsArray.length; i++) {
        tbody.appendChild(rowsArray[i]);
      }

      grid.appendChild(tbody);

    }

$(document).ready(function() {
	$("[class=big_data").attr("checked", true);
	showPage(0);
	showNavigation();
	$( "#enter" ).keyup(function() {
		var search_f = $('#enter').val();
		var myExp = new RegExp (search_f, 'i');
		console.log('keyup');
		$("#grid tbody tr").each(function(){
			console.log('keyup2');
			var enable = false;
			$("td",this).each(function(){
				if ($(this).text().search(myExp) == -1 ) {
						console.log(this.parentNode.id );
				}
				else {
					$(this).parent().show();
					enable = true;
				}	
			});
			if (enable == false) {
				console.log('flag==' + enable);
				$(this).hide();
			}
		})
	});	

	$("[class$=_data]").on('click', function() {
		$(this).siblings().attr("checked", false);
		
		if ($(this).hasClass('big_data')) {	
			size_catalog = lengthCatalog('big.json');
		    num_pages = numPages(size_catalog);
			
		};

		if ($(this).hasClass('small_data')) {
			size_catalog = lengthCatalog('small.json');
			num_pages = numPages(size_catalog);
		};

		if ($(this).hasClass('my_data')) {
			size_catalog = lengthCatalog('my.json');
			num_pages = numPages(size_catalog);
		};
		showPage(0);
		showNavigation();
		
	});
	
	
    
});

