// This function requires jquery-confirm(js,css)
// for better usability for the user, use bootstrap
function showMessage(title, message, type, fnFunction){
	$.confirm({
		title: title,
		content: message,
		type: type,
		typeAnimated: true,
		buttons: {
			confirm: {
				text: 'Ok',	
				action: function(){
					if (fnFunction != undefined && typeof fnFunction == "function")
						fnFunction();
				}
			}
		}
	});
}

function showConfirm(title, message, type, fnOk, fnCancel, txtYes, txtNo){
	$.confirm({
		title: title,
		content: message,
		type: type,
		typeAnimated: true,
		buttons: {
			cancel:{
				text: txtNo ? txtNo : 'Regresar',
				btnClass: 'btn-gogray',
				action: function(){
					if (fnCancel != undefined && typeof fnCancel == "function")
						fnCancel();
				}
			},
			confirm: {
				text: txtYes ? txtYes : 'Continuar',
				btnClass: 'btn-goblue',
				action: function(){
					if (fnOk != undefined && typeof fnOk == "function")
						fnOk();
				}
			}
		}
	});
}

function showAlert(message, type){
	$('.container-alert').append(
		$('<div id="alert" class="alert alert-' + type +' alert-dismissible fade show" role="alert"/>').append(message).append(
		$('<button type="button" class="close" data-bs-dismiss="alert" aria-label="Close"/>').append(
			$('<span aria-hidden="true"/>').append('&times;'))
		)
	);
}

function showAlertOnly(message, type){
	$('.container-alert').append(
		$('<div id="alert" class="alert alert-' + type +' alert-dismissible fade show" role="alert"/>').append(message)
	);
}

/**/
function getContentError(message, codeerror){
	 var content = $('<div />').append(
		$('<div />').append($('<strong />').append(message))
		).append(
			$('<div class="text-right" />')
			.append($('<span class="badge badge-secondary" />').append(`Error: ${codeerror}`))
		);
	return content;
}
	
var typeAlert = {
	Success: "success",
	Error: "danger",
	Warning: "warning"
};