
var _isMobile;
var auth2; 

/* arrays for secondary pixels (events) */
let _fb_pixels = [];
let _google_pixels = [];
let _tiktok_pixels = [];

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

console.log("setupGoogleAnalytics()");
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

var _etkUserId = Cookies.get("etkws_user") ? JSON.parse(Cookies.get("etkws_user")).userid : 0;
var _etkUserEmail = Cookies.get("etkws_user") ? JSON.parse(Cookies.get("etkws_user")).email : '';

$(document).ready(function(e) {
	
	console.log("(redes_gtag.js > document ready)");
	_isMobile = window.mobileAndTabletcheck();

	/* cargar arrays de pixeles disponibles */
	$('[data-pxl-facebook]').each((i, element) => { 
		let pxl = $(element).data('pxl-facebook');
		if(!_fb_pixels.includes(pxl)){
			_fb_pixels.push(pxl); 
		}
	});

	$('[data-pxl-ga-evento]').each((i, element) => { 
		let pxl = $(element).data('pxl-ga-evento');
		if(!_google_pixels.includes(pxl)){
			_google_pixels.push(pxl); 
		}
	});

	$('[data-pxl-tiktok]').each((i, element) => { 
		let pxl = $(element).data('pxl-tiktok');
		if(!_tiktok_pixels.includes(pxl)){
			_tiktok_pixels.push(pxl); 
		}
	});

	setupGoogleAnalytics();

	if(debeCargarRed('FACEBOOK')){
		if(window.FB){
			/* por si jquery(document.ready) carga primero que fbsdk */
			/* https://tanzu.vmware.com/content/blog/working-with-asynchronously-loaded-javascript */
			console.log("window.FB exists");
			setupFacebook();
		}else{
			/* por si fbsdk carga primero que jquery(document.ready) */
			console.log("window.FB does not exists");
			window.fbAsyncInit = setupFacebook;
		}
	}
				
	if(debeCargarRed('GOOGLE_PLUS_USER'))
		setupGoogle();
							
	if(debeCargarRed('GOOGLE_SOCIAL_TRACKING'))
		setupGoogleSocialTracking();
	
	if(debeCargarRed('FACEBOOK_CHAT'))
		setupFacebookChat();

	if(debeCargarRed('FACEBOOK_PIXEL'))
		setupFacebookPixel();
			
	if(debeCargarRed('TWITTER'))
		setupTwitter();
	
	if(debeCargarRed('PINGDOM'))
		setupPingdom();

	if(debeCargarRed('TIKTOK_PIXEL'))
		setupTikTokPixel();
		
});

function debeCargarRed(r){
	var f = $.inArray(r,_jsRedesRequeridas);
	return f >= 0;
}

function setupGoogleAnalytics(){

	gtag('js', new Date());
	gtag('set', {'user_id': _etkUserId});  //G4 va a ignocrar cualqueir parametro de config de los UA. PAra mitigar eso hay que pasarlos como "set" antes del "config" (esto, porque estamos usando UA-, en lugar de G-)
	//You can mitigate this issue by moving the parameters assigned in the gtag(âconfigâ) command for Universal Analytics to a gtag(âsetâ) command before the gtag(âconfigâ) command.
	
	gtag('config', _glAnalyticsId);
	
	if(_glGAEventoId!=""){
		gtag('config', _glGAEventoId);			// Aqui es donde se dispara el segundo tracking code de GA y dependende que de se cargue la variable en la pagina
	}

	$(_google_pixels).each((i, pxl)=>{
		console.log("set google pixel " + pxl);
		gtag('config', pxl); // este el loop
	});

	//para cargar los componenetes extras de Google Analytics par tracking de ecommerce
	if(typeof gaAddProductInfo === "function"){
		console.log('gaAddProductInfo()');
		gaAddProductInfo();
	}	
	
	/*
	//Esto se va activar una vez que hayamos subido todos los archivos actualizando el template con la variable declarada en TODAS las pÃ¡ginas
	if(_glAWConversionId!=""){
		gtag('config', _glAWConversionId);		// Aqui es donde se dispara el Conversion ID de Google Ads y dependende que de se cargue la variable en la pagina
	}
	*/
}

function setupFacebookPixel(){
	
	console.log("setupFacebookPixel()");
	!function(f,b,e,v,n,t,s)
	{
	console.log("setupFacebookPixel() inner 1");	
	if(f.fbq)return;n=f.fbq=function(){n.callMethod?
	n.callMethod.apply(n,arguments):n.queue.push(arguments)};
	if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
	n.queue=[];t=b.createElement(e);t.async=!0;
	t.src=v;s=b.getElementsByTagName(e)[0];
	s.parentNode.insertBefore(t,s)}(window,document,'script',
	'https://connect.facebook.net/en_US/fbevents.js');

	fbq('init', _fbPixelId, {em: _etkUserEmail});

	$(_fb_pixels).each((i, pxl)=>{
		console.log("set meta pixel " + pxl + " {email: " + _etkUserEmail + "}");
		fbq('init', pxl, {em: _etkUserEmail});  // este el loop
	});

	fbq('track', 'PageView');

	if(typeof fbSendProductInfo === "function"){
		console.log('fbSendProductInfo()');
		fbSendProductInfo();	
	}

}

function setupTikTokPixel(type = ''){

	pixelId = _tkPixelId;
	console.log(`setupTikTokPixel() ${ type != ''? 'by ' + type: ''}`);

	!function(e,t,n){e.TiktokAnalyticsObject=n;var o=e[n]=e[n]||[];o.methods=
	["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],
	o.setAndDefer=function(e,t){e[t]=function(){
	e.push([t].concat(Array.prototype.slice.call(arguments,0)))}};
	for(var i=0;i<o.methods.length;i++)o.setAndDefer(o,o.methods[i]);
	o.instance=function(e){for(var t=o._i[e]||[],n=0;n<o.methods.length;n++)o.setAndDefer(t,o.methods[n]);return t}
	,o.load=function(e,t){var i="https://analytics.tiktok.com/i18n/pixel/events.js";

	o._i=o._i||{},o._i[e]=[],o._i[e]._u=i,o._t=o._t||{},o._t[e]=+new Date,o._o=o._o||{},o._o[e]=t||{},
	(t=document.createElement("script")).type="text/javascript",t.async=!0,t.src=i+"?sdkid="+e+"&lib="+n,
	(e=document.getElementsByTagName("script")[0]).parentNode.insertBefore(t,e)},
	o.load(pixelId),o.page()}(window,document,"ttq");
	
	$(_tiktok_pixels).each((i, pxl)=>{
		console.log("set tiktok pixel " + pxl);
		ttq.load(pxl); // este el loop
	});
	
	if(typeof tiktokSendProductInfo === "function"){
	console.log('tiktokSendProductInfo()');
	tiktokSendProductInfo();	
	}

}

function setupGoogle(){
	if('google' in window) {
		if($('#divonetap').length){
			console.log('google is defined in one tap');

			handleGlLoginResponse = (response) => {
				const googleUser = JSON.parse(atob(response.credential.split('.')[1]));
				glConnect(response);
			};

			google.accounts.id.initialize({
				client_id: _glClientId,
				cancel_on_tap_outside: false,
				prompt_parent_id: 'divonetap',
				callback: handleGlLoginResponse
			});

			google.accounts.id.renderButton(
				document.getElementById("btnGoogle"),
				{ 
					shape:"rectangular", 
					logo_alignment:"left", 
					theme: "outline", 
					size: "large", 
					text: "continue_with", 
					width: $( window ).width() <= 600? 355 : 375,
					locale: "es-MX"
				}  // customization attributes
			);
			
			google.accounts.id.prompt((notification) => {
				if(notification.isDisplayed()){
					$('#btnGoogle').hide();
				}else if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
					$('#btnGoogle').show();
				}
			});
		}
	} else {
		//console.log('google is not defined in one tap');
		setTimeout(setupGoogle, 1000);
	}

}

function setupFacebook(){

	console.log("facebookInit() init");

	FB.init({
		appId      : _fbAppId,
		status	 : true, 
		cookie 	 : true,
		oauth		 : true,
		xfbml      : true,
		version    : 'v21.0' 
	});
	
	FB.AppEvents.logPageView();
	
	FB.getLoginStatus(function(response){
		/* facebook listo */
		console.log("fb ready");
		$("#btnFacebook").show();
		$("body").addClass("loaded");
	});

	FB.Event.subscribe('messenger_checkbox', function(e) {
		console.log("messenger_checkbox event");
		console.log(e);
		
		if (e.event == 'rendered') {
		console.log("Plugin was rendered");
		} else if (e.event == 'checkbox') {
		var checkboxState = e.state;
			console.log("Checkbox state: " + checkboxState);
			/*
			if(checkboxState=="checked"){
				confirmMessengerOptIn();
			}
			*/
		} else if (e.event == 'not_you') {
		console.log("User clicked 'not you'");
		} else if (e.event == 'hidden') {
		console.log("Plugin was hidden");
		}
		
	});
	
}

function setupGoogleSocialTracking(){

	console.log("setupGoogleSocialTracking()");
	
	window._ga = window._ga || {};
	
	var _gaTitle = _overrideGaTitle?_overrideGaTitle:document.title;
	
	_ga.trackTwitter = function(opt_pageUrl) {
	  try {
		if (twttr && twttr.events && twttr.events.bind) {
		  twttr.events.bind('tweet', function(event) {
			if (event) {
			  gtag( 'event', 'share', {
				'method' : 'twitter',
				'content_type' :  'tweet',
				'content_id' :	 _gaTitle		  
			  });
			}
		  });
			twttr.events.bind('follow', function(){
				gtag( 'event', 'share', {
					'method' : 'twitter',
					'content_type' :  'follow',
					'content_id' :	 'twitter.com'		  
				});
			});
		}
	  } catch (e) {}
	};
	
	
	_ga.trackMail = function() {
		gtag( 'event', 'share', {
			'method' : 'Mail',
			'content_type' :  'Enviar',
			'content_id' :	 _gaTitle		  
		});
	}

	_ga.extractParamFromUri_ = function(uri, paramName) {
	  if (!uri) {
		return;
	  }
	  var uri = uri.split('#')[0];
	  var parts = uri.split('?'); 
	  if (parts.length == 1) {
		return;
	  }
	  var query = decodeURI(parts[1]);
	  paramName += '=';
	  var params = query.split('&');
	  for (var i = 0, param; param = params[i]; ++i) {
		if (param.indexOf(paramName) === 0) {
		  return unescape(param.split('=')[1]);
		}
	  }
	  return;
	};
	
}

function setupFacebookChat(){
	
	// Estamos dejando el script con el sdk.js en cada pÃ¡gina donde se requiera
	// En teoria, hace conflicto tener el sdk.js y el customerchat.js juntos (debe ser uno o el otro)
	//por lo tanto en las paginas donde se requiera el chat, remplazamos el sdk.js por el customerchat.js
	/*
	console.log("setupFacebookChat()");
	(function(d, s, id) {
		console.log("setupFacebookChat() inner 1");
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = 'https://connect.facebook.net/es_LA/sdk/xfbml.customerchat.js';
		fjs.parentNode.insertBefore(js, fjs);
	  }(document, 'script', 'facebook-jssdk'));
	*/
	
}

function setupTwitter(){
	
	console.log("setupTwitter()");
	window.twttr = (function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0],
		t = window.twttr || {};
	  if (d.getElementById(id)) return t;
	  js = d.createElement(s);
	  js.id = id;
	  js.src = "https://platform.twitter.com/widgets.js";
	  fjs.parentNode.insertBefore(js, fjs);
	
	  t._e = [];
	  t.ready = function(f) {
		t._e.push(f);
	  };
	
	  return t;
	}(document, "script", "twitter-wjs"));	

	twttr.ready(function (twttr) {
		if(typeof window._ga === "object"){
			console.log('_ga.trackTwitter()');
			_ga.trackTwitter();
		}		
	});
				
}

function setupPingdom(){
	
	/*<script src="//rum-static.pingdom.net/pa-XXXXXXXXXXXXXXXXXX.js" async></script>*/
	console.log("setupPingdom()");
	(function() {
		var s = document.getElementsByTagName('script')[0], p = document.createElement('script');
		p.async = 'async';
		p.src = '//rum-static.pingdom.net/pa-' + _pingdomId + '.js';
		s.parentNode.insertBefore(p, s);
	})();
}
