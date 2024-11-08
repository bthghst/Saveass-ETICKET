var GUEST_TOKEN;
//var _SESSION_DATA;

$(window).ready(function(e) {

	GUEST_TOKEN = getGuestToken(); 	
	_SESSION_DATA = getSessionCookie();
	
	/* cargar foto de perfil */
	/*
	try{
		$.ajax({
			url: API_URL + '/v2/user/me',
			cache: false,
			async: true,
			type: 'GET',
			headers: {
				'Authorization': 'Bearer ' + _SESSION_DATA.token
			},
			success: function(me){
				console.log("/me " + JSON.stringify(me));
				alert("carga foto " + me.fbid);
			},
			error: function(e){
				console.log("/me error: " + JSON.stringify(e));
				
			}				
		});	
	}catch(ex){
		console.log("not logged in");
	}
	*/
				
});