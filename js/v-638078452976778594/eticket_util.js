$(window).ready(function(){
	
	/* renderear textos y legales */
	$('.etktextpopup.modal').each(function(mi, me) {
		var url = '';
		if(window.location.host.includes('.mx')){
			url = 'ajax/textos_mx.html';
		}else if(window.location.host.includes('.co')){
			url = 'ajax/textos_co.html';
		}else if(window.location.host.includes('.cr')){
			url = 'ajax/textos_cr.html';
		}else if(window.location.host.includes('.hn')){
			url = 'ajax/textos_hn.html';
		}
				
		$(me)
			.modal({
				backdrop: 'static',
				show: false
			})
			.on('show.bs.modal', function(){
				$.ajax({
					url: url,
					cache: false,
					success: function(textos){		
						var idtexto = $(me).data("idtexto");
						var t = $(textos).find(".etktextpopup.contenido[data-idtexto='"+idtexto+"']");
						$(me)
							.find(".modal-body")
							.html('').append($(t));					
					},
					error: function(e){
						alert(e);
					}
				});
			});
	});
	
	/*no spaces*/
	$('body').on('textInput', '.nospaces', function(e) { 
		 var keyCode = e.originalEvent.data.charCodeAt(0);
		 if (keyCode == 32) { 
			 return false;
		 }
	 });
	
	 /* solo numeros */
	 $(".only-numbers").on('keypress',function(evt){
	
		var charCode = (evt.which) ? evt.which : evt.keyCode
		
		if ((charCode >= 48 && charCode <= 57) || charCode == 8 || charCode == 13){
			return true;
		}
		
		return false;
	});
	
	/* solo letras */
	$('.only-alphanumeric').on('keypress', function(e) {
		var alphaReg = /^([a-zA-Z0-9\u00C0-\u00FF]+)$/;
		
		if (alphaReg.test(e.key)){
		   return true;
		}
		
		return false;
	 });

	/*no spaces in paste event*/
	$('body').on('paste', '.nospaces', function(e) {
		 e.preventDefault();
		var pastedText = '';
		pastedText = (e.originalEvent || e).clipboardData.getData('text/plain');
		this.value = pastedText.replace(/ /g, '');

	});

	/*only alphanumeric in paste event*/
	$('body').on('paste', '.only-alphanumeric', function(e) {
		e.preventDefault();
	   var pastedText = '';
	   pastedText = (e.originalEvent || e).clipboardData.getData('text/plain');
	   this.value = pastedText.replace(/[^a-z0-9]+/gi, '');

   });

   /*only numbers in paste event*/
	$('body').on('paste', '.only-numbers', function(e) {
		e.preventDefault();
	   var pastedText = '';
	   pastedText = (e.originalEvent || e).clipboardData.getData('text/plain');
	   this.value = pastedText.replace(/[^0-9]+/gi, '');

   });

	/* solo numeros*/
	$(".SoloEnteros").keypress(function(evt){
         var charCode = (evt.which) ? evt.which : event.keyCode
         if ((charCode >= 48 && charCode <= 57) || charCode == 8)
            return true;

         return false;
	});
	
	Number.prototype.formatMoney = function(m, c){
		var sign = m.substring(0,1);
		var d = m.indexOf(",")>m.indexOf(".")?",":".";
		var t = m.indexOf(",")<m.indexOf(".")?",":".";
	
		if(typeof(_decimalSeparator)!="undefined" && _decimalSeparator!=""){
			d = _decimalSeparator;
		}

		var n = this, 
			c = isNaN(c = Math.abs(c)) ? 2 : c, 
			d = d == undefined ? "." : d, 
			t = t == undefined ? "," : t, 
			s = n < 0 ? "-" : "", 
			i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
			j = (j = i.length) > 3 ? j % 3 : 0;
		   return sign + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
		 };
});

function downloadFileFromApi(formato, nombre, url, beforeCallback, completeCallback){

	var fileType, fileExt;
	if(formato=="pdf"){
		fileType = "application/pdf";
		fileExt = "pdf";
	}
	if(formato=="passbook"){
		fileType = "application/vnd.apple.pkpass";
		fileExt = "pkpass";
	}

	if(beforeCallback && typeof(beforeCallback) == "function"){
		beforeCallback();
	}

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'blob';
	xhr.setRequestHeader('Authorization', 'Bearer ' + USER_TOKEN);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.onload = function(e) {
		if (this.status == 200) {
			if(!isChromeIOS()){
				var blob = new Blob([this.response], {type: fileType});
				saveAs(blob, nombre + '.' + fileExt);
			}else{//this block is exclusive for chrome ios because it not support download pkpass file on ordinary form
				var blob = new Blob([this.response], {type: fileType});

				var reader = new FileReader();

				reader.onloadend = function(e) {	
					var popupWindow = window.open(reader.result, '_system');
					setTimeout(function() { popupWindow.close(); }, 3000);
				}
				reader.readAsDataURL(blob);	
			}
		} else {
			alert('Error al obtener el boleto en el formato solicitado.');
		}
		if(completeCallback && typeof(completeCallback) == "function"){
			completeCallback();
		}
	};
	xhr.send();

}

function getCurrentAgent(){

	var Name = ""; 
	if (navigator.userAgent.indexOf("Win") != -1) 
		Name =  "win"; 
	if (navigator.userAgent.indexOf("Mac") != -1) 
		Name =  "mac"; 
	if (navigator.userAgent.indexOf("Linux") != -1) 
		Name =  "linux"; 
	if (navigator.userAgent.indexOf("Android") != -1) 
		Name =  "android"; 
	if (navigator.userAgent.indexOf("like Mac") != -1) 
		Name =  "iphone";
	return Name;
}

function getCurrentBrowser(){

	var name = "unknown-browser";
	if(navigator.userAgent.indexOf("MSIE")!=-1 || navigator.userAgent.indexOf("rv:11.0")!=-1) name = "msie";
	else if(navigator.userAgent.indexOf("Edge")!=-1) name = "microsoft-edge";
	else if(navigator.userAgent.indexOf("Firefox")!=-1) name = "firefox";
	else if(navigator.userAgent.indexOf("Opera")!=-1) name = "opera";
	else if(navigator.userAgent.indexOf("Chrome") != -1) name = "chrome";
	else if(navigator.userAgent.indexOf("Safari")!=-1) name = "safari";

	if(navigator.userAgent.indexOf("CriOS") != -1) name = "chrome"; //chrome in iphone also contains 'safari'
	
	return name;
		
}

function isChromeIOS(){
	var userAgent = navigator.userAgent;
	return (/(iPad|iPhone|iPod)/gi).test(userAgent) && (/CriOS/).test(userAgent);
}

function capitalize(str) 
{
	str = str.toLowerCase();
	str = str.replace('  ',' ');
	str = str.split(" ");

    for (var i = 0, x = str.length; i < x; i++) {
		if(str[i]!=""){
			str[i] = str[i][0].toUpperCase() + str[i].substr(1);
		}
    }

    return str.join(" ");
}

function validateEmail(email) {
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailReg.test(email);
}
  
function openInNewTab(url) {
	setTimeout(function(){
		//alert("url");
		window.open(url, '_blank');
	},500);

	//win.focus();
	return false;
}

function traceWebEvent(origin,environment,details){
	
	$.ajax({
		url: API_URL + '/v2/debug/trace',
		cache: false,
		type: 'POST',
		data: {
			origin: origin,
			environment: environment,
			details: details + ' | ' + navigator.userAgent
		},
		success: function(d){
			console.log(JSON.stringify(d));
		},
		error: function(e){
			console.log(JSON.stringify(e));
		}
	});

	
}

function getClientGuid(){

	var guid;
	var c_guid = Cookies('etkws_user_guid');
	if(!c_guid || c_guid==''){
		guid = generateGuid();
		Cookies.set(
			"etkws_user_guid", 
			guid,
			{ 
				expires: 1,
				json: false,
				secure: true
			}
		);	
	}else{
		guid = Cookies("etkws_user_guid");
	}
	return guid;
}

function generateGuid(){
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}

function getTimeZones(currentDate, timeZones, actionCallback, locale){
	var zones = [];
	var momentZones = [];
	var date = moment(currentDate);

	if(timeZones == undefined || timeZones == null){
		timeZones = [
			{timezone: 'America/Tijuana', label: 'Tijuana' },
			{timezone: 'America/Los_Angeles', label: 'Los Angeles' },
			{timezone: 'America/Tegucigalpa', label: 'Tegucigalpa' },
			{timezone: 'America/Costa_Rica', label: 'Costa Rica' },
			{timezone: 'America/Mexico_City', label: 'Ciudad de M&eacute;xico' },
			{timezone: 'America/Bogota', label: 'Bogot&aacute;' },
			{timezone: 'America/New_York', label: 'New York' },
			{timezone: 'Europe/Madrid', label: 'Espa&ntilde;a'},
		];
	}

	if(locale == undefined || locale == '')
		locale = 'es-MX';

	if(Array.isArray(timeZones)){
		zones = timeZones;
	}else{
		zones.push({timezone: timeZones, label: timeZones });
	}

	$.each(zones, function(index, value){
		var itemDate, day, longday, month, longmonth, year;
		day = date.tz(value.timezone).format('DD');
		month = date.tz(value.timezone).format('MM');
		year = date.tz(value.timezone).format('YYYY')
		itemDate = new Date(year, month-1, day, 0,0,0);
		longday = itemDate.toLocaleDateString(locale, { weekday: 'long'});
		longmonth = itemDate.toLocaleDateString(locale, { month: 'long'});
		momentZones.push({ 
			date: {
				real: `${year}-${month}-${day}`,
				day: day,
				daylong: longday,
				month: month,
				monthlong: longmonth,
				year: year
			},
			hour: date.tz(value.timezone).format('HH:mm'),
			location: value.label  
		} );
	});
	// compress places by date
	days = momentZones.map((zone) => zone.date.real);
	days = days.filter((v,i) => days.indexOf(v) === i).sort();
	var dates = [];
	$.each(days, function(index, value){
		var zones = momentZones.filter((item) => item.date.real == value);
		var places = [];
		$.each(zones, function(zoneindex, zone){
			places.push({
				location: zone.location,
				hour: zone.hour
			});
		});
		dates.push(
			{
				date: zones[0].date,
				places: places 
			}
		);
	});
	//
	actionCallback(dates);
}

function getQueryStringParam(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function createGuid() {  
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
      return v.toString(16);  
   });  
} 


