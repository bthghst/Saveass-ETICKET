


// PONER UN VALOR DE DEFAULT Y LO LIMPIA AUTOMATICAMENTE
var reg_ex = new RegExp("&eacute;","g");
var replaceItem = '\u00E9';
var campodebusqueda = 'Buscar artistas y/o eventos';
campodebusqueda = campodebusqueda.replace(reg_ex,replaceItem);
    	
//variable para conocer si se esta utilizando un dispositivo mobile		
var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;		
    
function verifySearchString(form) {
        if(form.keyword.value.replace(/^\s*|\s*$/g,'') == "" || form.keyword.value == campodebusqueda ){
            alert(checkUni("Buscar artistas y/o eventos"));
            form.keyword.focus();
            form.keyword.value = campodebusqueda;
            return false;
}}




function noenter() {
  return !(window.event && window.event.keyCode == 13);
 }


function popUp(URL) {
		day = new Date();
		id = day.getTime();
		eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=720,height=500,left = 312,top = 134');");
}

// showpopwin
function NewWIN(objpath,width,height)
{
    var win31_1=open(objpath,"win31_1",'scrollbars=no,resizable=no,width='+width+',height='+height);
    WinCol(win31_1);
}

//Para el dropdown de mi cuenta

function DropDown(el) {
	this.menu_micuenta = el;
	this.initEvents();
}
DropDown.prototype = {
	initEvents : function() {
		var obj = this;

		obj.menu_micuenta.on('click', function(event){
			$(this).toggleClass('active');
			event.stopPropagation();
		});	
	}
}


$(function() {

	var menu_micuenta = new DropDown( $('#menu_micuenta') );

	$(document).click(function() {
		// all dropdowns
		$('.wrapper-dropdown-5').removeClass('active');
	});

});

