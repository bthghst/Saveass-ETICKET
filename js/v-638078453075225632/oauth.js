var HAS_COOKIE = false;
var USER_TOKEN;
var _SESSION_DATA;
	
function getGuestToken(){
	
	var guest_token = null;
	var d = {
		"login_origin": "js.getGuestToken",
		"grant_type": "client_credentials",
		"client_id": API_CLIENT_ID,
		"client_secret": API_CLIENT_SECRET
	};
	
	$.ajax({
		url: API_URL + '/v2/token',
		cache: false,
		async: false,
		type: 'POST',
		dataType: 'json',
		data: d,
		success: function(r){
			guest_token = r.access_token;
		},
		error: function(e){
			console.log("error:" + JSON.stringify(e) + " d:" + JSON.stringify(d) );
		}
	});
	
	return guest_token;

}

function getSessionCookie(){
	try{
		HAS_COOKIE = true;
		var c = JSON.parse(Cookies.get("etkws_user"));
		return c;
	}catch(ex){
		HAS_COOKIE =  false;
	}
}

function refreshToken(fn){
	
	var token_data = getSessionCookie();
	if (!HAS_COOKIE){
		console.log("token refresh: there is not User Token" );
		return false;
	}
	
	var d = {
		"login_origin": 'js.refreshToken',
		"grant_type": "refresh_token",
		"refresh_token": token_data.refresh_token,
		"client_id": API_CLIENT_ID,
		"client_secret": API_CLIENT_SECRET
	};
	
	$.ajax({
		url: API_URL + '/v2/token',
		cache: false,
		async: false,
		type: 'POST',
		dataType: 'json',
		data: d,
		success: function(r){
			token_data.token = r.access_token;
			token_data.refresh_token = r.refresh_token;
			
			Cookies.set(
				"etkws_user", 
				token_data,
				{ expires: 7,
				  json: true,
				  secure: true }
			);
			
			USER_TOKEN = token_data.token;
			_SESSION_DATA = getSessionCookie();
			
			fn.headers = { 'Authorization': 'Bearer ' + USER_TOKEN }
			fn.tryCount++;

			if (fn.tryCount <= fn.retryLimit){ 
				$.ajax(fn); 
			} else { return false; }
			console.log("refresh token done!");
			return true;
		},
		error: function(e){
			console.log("error:" + JSON.stringify(e) + " d:" + JSON.stringify(d) );
			return false;
		}
	});
}

function refreshGuest(fn){
	GUEST_TOKEN = getGuestToken();
	
	fn.headers = { 'Authorization': 'Bearer ' + GUEST_TOKEN }
	fn.tryCount++;
	
	if (fn.tryCount <= fn.retryLimit){ 
		$.ajax(fn); 
	} else { return false; }
	console.log("refresh token done!");	
	return true;
}