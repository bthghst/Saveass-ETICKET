var pageTracker;
var totalElementos = 0;
var elementosCargados = 0;
var _STREAMING_URL = ""; 

$(window).ready(function(e) {
    
	$("#MisEventos_menu" ).addClass( "MenuMiCuenta_seleccionado" );
	
	loadElectronicTickets();
	//loadViewOnlineButtons();

	if(totalElementos==0)
		$("body").addClass("loaded");
	
	getInternationalDates();
});

function loadElectronicTickets(){
	
	$(".electronicTicketList").each(function(i,div){
		var eventId = $(div).data("idevento"); 
		var saleId = $(div).data("folio");
		var isOnlineEvent = $(div).data("isonline")=="1";
		var esAbonado = $(div).data("esabonado")=="1";
		var eventAllowsTranfers = $(div).data("transferable")=="1";
		var minsToStart = $(div).data("minstostart");
	
		$.ajax({
			url: API_URL + '/v2/user/tickets/' + saleId,
			cache: false,
			type: 'GET',
			headers: {
				'Authorization': 'Bearer ' + USER_TOKEN
			},
			success: function(d){
	
				var agent = getCurrentAgent();
				var numBoleto = 1;
	
				$(d).each(function(i,t){
					
					t.ticketNumber = i;
					var ht = $.parseHTML($("#templateElectronicTicket").html());
					var ticketLabel;
	
					$(ht).find(".lseccion").html(t.ticket.sectionLabel);
					$(ht).find(".lbloque").html(t.ticket.blockLabel);
					if(t.ticket.rowLabel=="0" && t.ticket.seatLabel=="0"){
						ticketLabel = "Boleto " + numBoleto;
					}else{
						ticketLabel = t.ticket.rowLabel + "-" + t.ticket.seatLabel;
					}
					$(ht).find(".lboleto").html(ticketLabel);	
					
					if(esAbonado){
						$(ht).find(".lidboleto").html(t.ticket.saleDescriptionId);	
					}else{
						$(ht).find(".lidboleto").hide();
					}
					
					if(isOnlineEvent){
						/* eventos online no tienen bloques */
						$(ht).find(".lbloque").hide();
					}
					
					renderTicketTransferStatus(t,ht,isOnlineEvent);

					$(ht).appendTo(div);
					$(ht).data("iddescripcionventa",t.ticket.saleDescriptionId);
					
					
					numBoleto++;
	
				});
	
			},
			error: function(e){
				console.log(e);
			}
				
		});
	});

}

function renderDownloadOptions(t, ht, isOnlineEvent){

	if(isOnlineEvent)
		return false;

	var folio = $(".electronicTicketList[data-idventa="+t.ticket.saleId+"]").data("folio");
	var eventId = $(".electronicTicketList[data-idventa="+t.ticket.saleId+"]").data("idevento");

	var agent = getCurrentAgent();

	if( (agent=="iphone" || agent=="android") ){

		if(t.electronicTicketUri && t.electronicTicketUri!=''){

			$(ht).find(".electronic")
			.show()
			.unbind().off()
			.on("click touchend",function(){
				/* popup electronic tickets mobile */
				//var url = "micuenta_electronicticket.aspx?v="+folio+"&b="+t.ticketNumber;
				var url = t.electronicTicketUri + "&b="+t.ticketNumber;
				if(agent=="mac"){
					window.open(url,"electronic","fullscreen=0,height=700,width=450,right=0");
				}else{
					window.open(url);
				}
				return false;
			});

		} else {

			if(agent=="iphone" && _appIosDownloadUrl){
				$(ht).find(".mobileapp.iphone")
				.show()
				.unbind().off()
				.on("click touchend",function(){
					window.open(_appIosDownloadUrl);
					return false;
				});
			}

			if(agent=="android" && _appAndroidDownloadUrl){
				$(ht).find(".mobileapp.iphone")
				.show()
				.unbind().off()
				.on("click touchend",function(){
					window.open(_appAndroidDownloadUrl);
					return false;
				});
			}

		}

	} else{

		if(t.printTicket && t.printTicket!=''){
			$(ht).find(".printticket")
			.show()
			.unbind().off()
			.on("click touchend",function(){
				var ticketLabel = $(ht).find(".lboleto").html();
				getPrintTicket(t.printTicket, ticketLabel);
				return false;
			});

		} else if(!window.mobileAndTabletcheck() && t.ticket.isDownloadAvailable && !t.ticket.isPrintTicketAvailable) {
			$(`div.aviso-ver-boletos[data-idventa="${t.ticket.saleId}"]`).html('Para ver tus boletos, es necesario que utilices tu dispositivo móvil');

		}
	} 

}

function loadViewOnlineButtons(){
	$(".botonStreaming").each(function(i,c){
		var idventa = $(this).data("idventa");
		renderViewOnlineEventButton(idventa);
	});
}

function renderViewOnlineEventButton(idventa){

	var btn = $(".botonStreaming[data-idventa="+idventa+"]");

	$.ajax({
		url: API_URL + '/v2/websales/sale/'+idventa+'/isStreamingAllowed',
		cache: false,
		type: 'GET',
		headers: {
			'Authorization': 'Bearer ' + USER_TOKEN
		},
		success: function(d){

			var folio = $(btn).data("folio");

			$(btn).unbind().off().on("click touchend", function(){

				if($(btn).hasClass("interno")){
					document.location.href = 'micuenta_accesoevento.aspx?f=' + folio;
				}

				if($(btn).hasClass("externo")){
					document.location.href = _STREAMING_URL + '/streaming.aspx?f=' + folio;
				}

				return false;
			})
			.removeClass("disabled").show();

		},
		error: function(e){
			if(e.status==400){
				$(db).unbind().off().on("click touchend", function(){
					return false;
				}).hide();	
				if($(dbav).length>0){
					$(dbav).unbind().off().on("click touchend", function(){
						return false;
					}).hide();		
				}		
			}
		}
	});

}

function renderTicketTransferStatus(t,ht,isOnlineEvent){

	$(ht).find(".xfer0,.xfer1,.xfer2").hide();
	var minsToStart = $(".electronicTicketList[data-idventa="+t.ticket.saleId+"]").data("minstostart");
	var eventAllowsTranfers = $(".electronicTicketList[data-idventa="+t.ticket.saleId+"]").data("transferable");
	var eventAllowsRetranfers = $(".electronicTicketList[data-idventa="+t.ticket.saleId+"]").data("retransfer");
	
	$.ajax({
		url: API_URL + '/v2/sale/ticketTransferRequest/' + t.ticket.saleDescriptionId,
		cache: false,
		type: 'GET',
		headers: {
			'Authorization': 'Bearer ' + USER_TOKEN
		},
		complete: function(r){

				if(r.status==204){
					/* no transfers */
					renderDownloadOptions(t, ht, isOnlineEvent);
					if(eventAllowsTranfers==1 && minsToStart>-180){ //no transferible en retransmisiones, cambiar tambien en apiInsTicketTransferRequest!!!
						renderXferBoleto_Transferible(t,ht,isOnlineEvent);
					}
				}else{
					var d = r.responseJSON;
					if(d){
						if(!d.isTransferred){
							renderXferBoleto_Solicitado(t,d,ht);
						}else{
							if(d.isOwned){
								/* boleto recibido */ 
								
								if(eventAllowsRetranfers){
									renderXferBoleto_Transferible(t,ht,isOnlineEvent);
								}else{
									renderXferBoleto_Reclamado(t,d,ht);
								}
								
								renderDownloadOptions(t, ht, isOnlineEvent);
							}else{
								/* este boleto fue transferido */
								renderXferBoleto_Transferido(t,d,ht);
							}
						}
					}
				}
		},
		error: function(e){
			console.log("get ticketTransferRequest error " + e.status);
		}
	});

	renderViewOnlineEventButton(t.ticket.saleId);
	
}

function renderXferBoleto_Transferible(t,ht){

	$(ht).find(".transferir")
	.show()
	.find(".xfer0")
		.show().on("click touchend",function(){
			
			/* modal transferir boleto */
			$("#mdTransferirBoleto")
			.data("iddescripcionventa",t.ticket.saleDescriptionId)
			.off('shown.bs.modal')
			.on('shown.bs.modal', function(){
				
				$(this).find(".lnkEnviarCodigo")
					.off("click")
					.on("click",function(){
						
						$('#loadingoverlay').fadeIn();
						$.ajax({
							url: API_URL + '/v2/mail/ticketTransfer/otp/' + t.ticket.saleDescriptionId,
							cache: false,
							type: 'POST',
							headers: {
								'Authorization': 'Bearer ' + USER_TOKEN
							},
							success: function(d){
								$('#loadingoverlay').fadeOut();
								
								showMessage('', 
									`Te enviamos un correo electrónico con el codigo de verificación para transferir este boleto. `, 
									'green',
									function(){}
								);
							},
							error: function(e){
								console.log(e);
								var error = (e.status == '400')?e.responseJSON.message: 'Desconocido';
								$('#loadingoverlay').fadeOut();
								showMessage('', 
									getContentError(
										'No fue posible generar un código de verificación para este boleto. Por favor vuelve a iniciar tu sesión.', 
										error), 
									'red');
							}	
						})	

					});

				$(this).find('.modal-title').html('<b>Transferir Boleto ' + $(this).data("iddescripcionventa") + '</b>');
				$(this).find('.bTransferir')
					.off("click")
					.on("click",function(){
						/* transferir */
						var iddescripcionventa = $(this).parents().find("#mdTransferirBoleto").data("iddescripcionventa");
						var otp = $(this).parents().find(".tClaveTransferencia").val();
						var email = $(this).parents().find(".tEmailTransferencia").val();
						var emailconfirm = $(this).parents().find(".tEmailTransferencia2").val();
						var nombre = $(this).parents().find(".tNombreTransferencia").val();
						if(!validateTransferirFolio(nombre, email, emailconfirm)){
							return false;
						}
						showConfirm(
						'',
						`¿Estas seguro que deseas transferir este boleto a <b>${email}</b>?\n ${nombre} 
						deberá iniciar sesión en Mi Cuenta para poder recibir este boleto.`,
						'orange',
						function(){
							$('#loadingoverlay').fadeIn();
							$.ajax({
								url: API_URL + '/v2/sale/ticketTransferRequest',
								cache: false,
								type: 'POST',
								headers: {
									'Authorization': 'Bearer ' + USER_TOKEN
								},
								data: {
									saleTicketId: iddescripcionventa,
									verificationCode: otp,
									addresseeEmail: email,
									addresseeName: nombre.toUpperCase()
								},
								success: function(d){
									$('#loadingoverlay').fadeOut();
									
									showMessage('', 
										`Enviamos un correo electrónico a <b>${email}</b> con las instrucciones para recibir este boleto.`, 
										'green',
										function(){

											$("#tEmailTransferencia").val("");
											$("#tEmailTransferencia2").val("");
											$("#tNombreTransferencia").val("");

											/* recargar status de transfer */
											$("#mdTransferirBoleto").modal('toggle');
											renderTicketTransferStatus(t,ht);
										}
									);
								},
								error: function(e){
									$('#loadingoverlay').fadeOut();
									if(e.status == '409'){
										showMessage('', 
											getContentError(
												'El código de verificación para esta transferencia es incorrecto.', 
												error), 
											'red');
									}else{
										var error = (e.status == '400')?e.responseJSON.message: 'Desconocido';
										showMessage('', 
											getContentError(
												'No fue posible generar una solicitud para transferir este boleto. Por favor vuelve a iniciar tu sesión.', 
												error), 
											'red');
									}


								}	
							})	
						});
					});
			})
			.modal('show');
			return false;
			
		});

}

function renderXferBoleto_Solicitado(t,d,ht){

	$(ht).find(".transferir")
	.show()
	.find(".xfer1")
		.show()
		.click(function(){

			showConfirm(
				'',
				`Solicitaste transferir este boleto a <b>${d.addresseeEmail}</b>, sin embargo <b>${capitalize(d.addresseeName)}</b>
				aún no accede a su cuenta eticket para reclamarlo. ¿Deseas cancelar la transferencia?`,
				'red',
				function(){
					$.ajax({
						url: API_URL + '/v2/sale/ticketTransferRequest/' + d.saleTicketId,
						cache: false,
						type: 'DELETE',
						headers: {
							'Authorization': 'Bearer ' + USER_TOKEN
						},
						success: function(d){
							showMessage('', 
								`Se canceló tu solicitud para transferir este boleto.`, 
								'green',
								function(){
									renderTicketTransferStatus(t,ht);
								}
							);
						},
						error: function(e){
							var error = (e.status == '400')?e.responseJSON.message: 'Desconocido';
							$('#loadingoverlay').fadeOut();
							showMessage('', 
								getContentError(
									'No fue posible cancelar esta solicitud de transferencia de boleto. Por favor vuelve a iniciar tu sesión.', 
									error), 
								'red');
						}	
					})	
				});

		})
		.find(".xferNombreDestinatario").html(capitalize(d.addresseeName));

	return false;
}

function renderXferBoleto_Transferido(t,d,ht){

	$(ht).find(".transferir")
	.show()
	.find(".xfer2")
		.show()
		.click(function(){

			showMessage('', 
			`Este boleto ya fue transferido a <b>${capitalize(d.addresseeName)}</b> (${d.addresseeEmail}). La transferencia se ha completado y no se puede cancelar.`, 
			'green'
		);

		})
		.find(".xferNombreDestinatario").html(capitalize(d.addresseeName));

	return false;
}

function renderXferBoleto_Reclamado(t,d,ht){

	var nombreCorto = d.senderName.split(' ')[0];

	$(ht).find(".transferir")
	.show()
	.find(".xfer3")
		.show()
		.click(function(){
			showMessage('', 
			`<b>${capitalize(d.senderName)}</b> te envió este boleto y ya puedes utilizarlo! &#128512;`, 
			'green'
		);
		})
		.find(".xferNombreOrigen").html(capitalize(nombreCorto));

	return false;
}

function getPrintTicket(url,ticketLabel){
	downloadFileFromApi("pdf",ticketLabel,url);
}

function validateTransferirFolio(name, email, emailconfirm){
	
	var divvalidation = $('#messagevalidation');
	var errors = [];
	$(divvalidation).hide().find('ul').html('');
	if(name == ''){
		errors.push('Escribe el nombre completo del destinatario.');
	}
	var fullname = name.trim().split(' ');
	if(name != '' && (name.length < 6 || fullname.length < 2 )){
	   errors.push('Ingresa nombre y apellido.');
	}
	
	if(email == ''){
		errors.push('Escribe el correo electrónico del destinatario.');
	}
	if(emailconfirm == ''){
		errors.push('Escribe la confirmación del correo electrónico del destinatario');
	}
	if(email != '' && emailconfirm != ''){
		if(!validateEmail(email)){
			errors.push('Ingresa un correo electrónico válido.');
		}
		if(email.trim() != emailconfirm.trim()){
			errors.push('El correo electrónico y la confirmación no coinciden.');
		}
	}
	
	if(errors.length > 0){
		$(divvalidation).show();
		$.each(errors, function(index, value){
			$(divvalidation)
				.find('ul').append(
					$('<li />').html(value)
				);
		});
		return false;
	}else{
		$(divvalidation).hide().find('ul').html('');
		return true;
	}
}

//Load timezones events online
function getInternationalDates(){
	//Iteration all divs whit 
	$('div[data-type="timezones"]').each(function(){
		var container = $(this);
		var date = $(this).attr('data-date');
		getTimeZones(
			$(this).attr('data-date'),
			null,
			function(dates){
				$.each(dates, function(index, item){
					var datediv = $('<div class="item-date"/>');
					var placesdiv = $('<div class="places"/>');
					$.each(item.places, function(idxplace, place){
						$(placesdiv).append(
							`<p>
								<span class="place-hour">${place.hour} HRS</span> - <span>${place.location}</span>
							</p>`)
					});
					$(datediv)
						.append($('<div class="date" />').append(
							`<span>&#x1F4C5; ${capitalize(item.date.daylong)}, ${item.date.day} de ${item.date.monthlong} de ${item.date.year}</span>`
						))
						.append($(placesdiv));
					$(container).append($(datediv));	
				});

			});
	});


	
}

