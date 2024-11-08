
function updateUserCMData(callback, origin = ''){

	_SESSION_DATA = getSessionCookie();
	traceWebEvent('campaignmonitor.js', `seg_campaignmonitor updateUserCMData()-> before -> origin -> ${origin}: ${_SESSION_DATA.userid}`, `session data. ${JSON.stringify(_SESSION_DATA)}`);
	var url = API_URL + '/v2/user/subscriptions' ;
	$.ajax({
		url: url,
		cache: false,
		type: 'PUT',
		tryCount: 0,
		retryLimit: 3,
		headers: {
			'Authorization': 'Bearer ' + _SESSION_DATA.token
		},									
		success: function(d,r){
			traceWebEvent('campaignmonitor.js', `seg_campaignmonitor updateUserCMData()-> success -> origin -> ${origin}: ${_SESSION_DATA.userid} `, `session data. ${JSON.stringify(_SESSION_DATA)}`);
			//TODO: ejecutar acciones
			callback();
			
		},
		error: function(er){
			traceWebEvent('campaignmonitor.js', `seg_campaignmonitor updateUserCMData()-> error -> origin -> ${origin}: ${_SESSION_DATA.userid} `, `err. ${JSON.stringify(er)}, session data. ${JSON.stringify(_SESSION_DATA)}`);
			console.log(JSON.stringify(er));			
			if(er.status == 403){
				if(refreshGuest(this))
					return;
			}
			callback();
		}		
	});	
	
}