var oncallback = null;

var currentlocation = '';

const stateLabel = () => {
  switch (_siteLocation) {
      case 'mx':  return 'Estado';
      case 'cr': return 'Provincia';
      case 'co': return 'Departamento';
      case 'hn': return 'Provincia';
      case 'gt': return 'Departamento';
      default: return 'Estado';
  }
};

const stateSelectHidden = () => {
  switch (_siteLocation) {
      case 'mx':  return 'Selecciona un Estado...';
      case 'cr': return 'Selecciona una Provincia...';
      case 'co': return 'Selecciona un Departamento...';
      case 'hn': return 'Selecciona una Provincia...';
      case 'gt': return 'Selecciona un Departamento...';
      default: return 'Selecciona un Estado...';
  }
};


var countries = [];

const deliveryForm = `
<div id="delivery-loader" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.5);z-index: 999;">
<div class="cv-spinner">
  <span class="spinner"></span>
</div>
</div>
<div class="container-fluid text-start">
  <div class="text-center mb-3 {classContainerTitle}">
    <h3>{headerTitle}</h3>
    <button type="button" class="btn-close delivery-cancel {classTitleButtonClose}" aria-label="Close"></button>
  </div>
  <form id="frmDelivery" class="g-3">
    <div style="margin:20px 10px">
      <div class="flex-container-nowrap">
        <div class="alinearenmedio ancho_50"  style="align-self:center; flex:2"> <!--2 cuando el texto es pequeño 1y 1 si es grande -->
            <div class="grisclarofondo" style="height:1px">
            </div>
        </div>
        <div class="alinearenmedio flex-container-nowrap" style="padding:0px 5px; flex:1">
            <div class="font14 grisoscuro boldear ancho_100 text-center" style="min-width:200px">
              <i class="icon-informacion" style="margin:0px 5px;"></i> 
              ¿Quién recibe?
            </div>
        </div>
        <div class="alinearenmedio ancho_50" style="align-self:center; flex:2"> <!--2 cuando el texto es pequeño 1y 1 si es grande -->
            <div class="grisclarofondo" style="height:1px">
            </div>                                
        </div>    
      </div>                     
    </div>

    <div class="mb-3">
      <label for="dFirstName" class="form-label mb-1">Nombre</label>
      <input type="text" class="form-control form-control-sm mt-1 editable" id="dFirstName" name="dFirstName" maxlength="100" {capturemode}>
    </div>

    <div class="mb-3">
      <label for="dLastName" class="form-label mb-1">Apellido(s)</label>
      <input type="text" class="form-control form-control-sm mt-1 editable" id="dLastName" name="dLastName" maxlength="100" {capturemode}>
    </div>

    <div class="mb-3">
      <label for="dPhone1" class="form-label mb-1">Teléfono</label>
      <input type="text" class="form-control form-control-sm mt-1 only-numbers editable" id="dPhone1" name="dPhone1" maxlength="15" {capturemode}>
    </div>
    
    <!--<div class="row d-flex">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="dEmail" class="form-label">Email</label>
          <input type="email" class="form-control form-control-sm mt-1 editable" id="dEmail" name="dEmail" {capturemode}>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label for="dPhone" class="form-label">Teléfono</label>
          <input type="text" class="form-control form-control-sm mt-1 only-numbers editable" id="dPhone" name="dPhone" {capturemode}>
        </div>
      </div>
    </div>-->

    <div style="margin:20px 10px">
      <div class="flex-container-nowrap">
        <div class="alinearenmedio ancho_50"  style="align-self:center; flex:2"> <!--2 cuando el texto es pequeño 1y 1 si es grande -->
            <div class="grisclarofondo" style="height:1px">
            </div>
        </div>
        <div class="alinearenmedio flex-container-nowrap" style="padding:0px 5px; flex:1">
            <div class="font14 grisoscuro boldear ancho_100 text-center" style="min-width:200px">
              <i class="icon-location" style="margin:0px 5px;"></i> 
              Dirección
            </div>
        </div>
        <div class="alinearenmedio ancho_50" style="align-self:center; flex:2"> <!--2 cuando el texto es pequeño 1y 1 si es grande -->
            <div class="grisclarofondo" style="height:1px">
            </div>                                
        </div>    
      </div>                     
    </div>
    
    <div class=" mb-3">
      <label for="dCountry" class="form-label">País</label>
      <input class="form-control form-control-sm mt-1" type="text" id="dCountryName" name="dCountryName" value="{countryName}" disabled readonly>
      <select class="form-select form-select-sm mt-1" id="dCountry" name="dCountry" disabled style="display:none;">
        <option disabled value="">Selecciona un país</option>
        {countryList}
      </select>
    </div>

    <div class=" mb-3">
      <label for="dState" class="form-label">{stateLabel}</label>
      <select class="form-select form-select-sm mt-1 editable" id="dState" name="dState" required {capturemode}>
        {stateList}
      </select>
    </div>

    <div class="mb-3">
      <label for="dCity" class="form-label">Ciudad</label>
      <input type="text" class="form-control form-control-sm mt-1 editable" id="dCity" name="dCity" maxlength="100" {capturemode}>
    </div>

    <div class="mb-3">
      <label for="dStreet" class="form-label mb-1">Dirección</label>
      <input type="text" class="form-control form-control-sm mt-1 editable" id="dStreet" name="dStreet" maxlength="250" {capturemode}>
    </div>

    <div class="mb-3">
      <label for="dRefrence" class="form-label">Referencia ubicación (Apartamento. Bloque, etc)</label>
      <input type="text" class="form-control form-control-sm mt-1 editable" id="dReference" name="dReference" maxlength="250" {capturemode}>
    </div>

    <div class="row d-flex">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="dZipCode" class="form-label">Código postal</label>
          <input type="text" class="form-control form-control-sm mt-1 editable" id="dZipCode" name="dZipCode" maxlength="10" {capturemode}>
        </div>    
      </div>
    </div>

    <div id="delivery-error-message" class="alert alert-danger alert-dismissible fade show" role="alert" style="display:none;">
      No fue posible almacenar tus datos, intenta nuevamente.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>

    <div class="text-center mt-3 container-btn">{buttonContainer}</div>
  </form>
</div>
`;
/*Tmeplate buttons*/
//Cancel buttons
const deliveryCancelButton = `<button type="button" class="goButton_sec_white delivery-cancel">Cancelar</button>`;
const deliveryCloseButton = `<button type="button" class="goButton_sec delivery-cancel">Cerrar</button>`;
//Edit buttons
const deliveryEditButton = `<button type="button" class="goButton_sec_white delivery-edit">Modificar</button>`;
//Ok buttons
const deliveryIsOkButton = `<button type="button" class="goButton delivery-ok">CONTINUAR</button>`;
//Submit buttons
const deliverySubmitbutton = `<button type="button" class="goButton delivery-submit">CONTINUAR</button>`;
const deliveryUpdateButton = `<button type="button" class="goButton delivery-submit">ACTUALIZAR Y CONTINUAR</button>`;


$(document).ready(function(){
  getCountries();
  //cancel button event
  $('body').on('click', 'button.delivery-cancel', async function(e){
    e.preventDefault();
    Swal.close();
  });

  //edit button event
  $('body').on('click', 'button.delivery-edit', async function(e){
    e.preventDefault();
    enableDeliveryCapture();
  });

  //ok button event
  $('body').on('click', 'button.delivery-ok', async function(e){
    e.preventDefault();
    Swal.close();
    oncallback();
  });

  //submit button event
  $('body').on('click', 'button.delivery-submit', async function(e){
    e.preventDefault();
    if(!$('#frmDelivery').valid()){
			//console.log('error de validacion');
			return false;
		}
    showDeliveryLoader();
    try {
      const data = {
        EncryptedSaleId: _idVentaEnc ,
        RecipientName: $('#dFirstName').val(),
        RecipientSurNames: $('#dLastName').val(),
        RecipientPhoneNumber: $('#dPhone1').val(),
        CountryIso: $('#dCountry').val(),
        StateId: parseInt($('#dState').val()),
        CityName: $('#dCity').val(),
        AddressNumber: $('#dStreet').val(),
        ZipCode: $('#dZipCode').val(),
        Reference: $('#dReference').val(),
      }
      await RequestApiEtkAsync('v2/HomeDelivery', data, 'POST', {
        'Authorization': `Bearer ${_GUEST_TOKEN}`
      });
      oncallback();
    } catch (error) {
      traceWebEvent(_idVentaEnc, currentlocation, ' err submit delivery form: --> ' + JSON.stringify(error));
      console.log('error', JSON.stringify(error));
      showDeliveryAlert();
      hideDeliveryLoader();
    }
  });
});

/**
 * modo captura
 * 1 - Captura normal(no carga datos)
 * 2 - Deshabilitado con opciones de editar y confirmar datos (carga datos)
 * 3 - Deshabilitado solo lectura(carga datos)
 */
const showDeliveryCapture = (title, idSesionWebEnc, callbackSuccess, captureMode = 1, location = '') => {
  currentlocation = location;
  oncallback = callbackSuccess;
  Swal.fire({
    title: '',
    html: getDeliveryFormContent(title, captureMode),
    allowOutsideClick: false,
    allowEscapeKey: false,
    heightAuto: false,
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
    buttonsStyling: false,
    customClass: {
      confirmButton: 'goButton',
    },
    didOpen: () => {
    },
    didRender: () => {
      //showDeliveryLoader();
      loadDeliveryValidations();
      loadDeliveryData(idSesionWebEnc);
      //hideDeliveryLoader();
    }});
};

const enableDeliveryCapture = () => {
  $('body').find('#frmDelivery').find('.editable').prop('disabled', false)
  $('#frmDelivery').find('.container-btn').html(`${deliveryUpdateButton}`);
}

const loadPopupClosing = () => {
  $('body').find('#frmDelivery').find('.container-title').addClass('modal-header');
  $('body').find('#frmDelivery').find('.container-title').find('.btn-close').removeClass('d-none');

}

const loadDeliveryData = async (idSesionWebEnc) => {
  if(typeof idSesionWebEnc != 'undefined'){
    //showDeliveryLoader();
    try {
      const result = await RequestApiEtkAsync(`v2/HomeDelivery/${idSesionWebEnc}`, null, 'GET', {
        'Authorization': `Bearer ${_GUEST_TOKEN}`
      });
      //console.log('result', JSON.stringify(result));
      $('#dFirstName').val(result.recipientName);
      $('#dLastName').val(result.recipientSurNames);
      $('#dPhone1').val(result.recipientPhoneNumber);
      $('#dState').val(result.stateId);
      $('#dCity').val(result.cityName);
      $('#dStreet').val(result.addressNumber);
      $('#dZipCode').val(result.zipCode);
      $('#dReference').val(result.reference);

    } catch (error) {
      console.log('error', JSON.stringify(error));
      traceWebEvent(idSesionWebEnc, currentlocation, ' err loadDeliveryData: --> ' + JSON.stringify(error));
    }
    hideDeliveryLoader();
  } else {
    hideDeliveryLoader();
  }
}

const loadDeliveryValidations = () =>{
  $.validator.setDefaults({
		onfocusout: function (e) {
			this.element(e);
		},
		//onkeyup: false,
		highlight: function (element) {
			jQuery(element).closest('.form-control').addClass('is-invalid');
		},
		unhighlight: function (element) {
			jQuery(element).closest('.form-control').removeClass('is-invalid');
		},
		errorElement: 'div',
		errorClass: 'invalid-feedback',
		errorPlacement: function (error, element) {
			if (element.parent('.input-group-prepend').length) {
				$(element).siblings(".invalid-feedback").append(error);
			} else {
				error.insertAfter(element);
			}
		},
	})
	
	$("#frmDelivery").validate({
		rules: {
			dFirstName: {
				required: true
			},
			dLastName: {
				required: true
			},
      dPhone1: {
				required: true
			},
			dState: {
				required: true
			},
			dCity:{ 
				required: true
			},
			dStreet:{
				required: true
			}
		},
		messages: {
			dFirstName: {
				required: 'Nombre es requerido'
			},
			dLastName: {
				required: 'Apellido(s) es requerido'
			},
      dPhone1: {
				required: 'Teléfono es requerido'
			},
			dState: {
				required: `${stateLabel()} es requerido`
			},
			dCity:{ 
				required: 'Ciudad es requerido'
			},
			dStreet:{
				required: "Dirección es requerido"
			},											
		}
	});
}

const getCountries = async () => {
 countries = await RequestApiEtkAsync('v2/country/list', null, 'GET');
}

const getDeliveryFormContent = (title, captureMode) => {
  /**
 * ver comentario modo captura en showDeliveryCapture
 */
  const data = null
  var currentcountry = countries.find( c => c.isO2 == _siteLocation.toUpperCase());

  let countryOptions = null;

  countries.forEach((country) => { countryOptions += `<option value="${country.isO2}" ${ country.isO2 == currentcountry.isO2 ? 'selected' : '' }>${country.name}</option>` });


  let stateOptions = `<option ${ data == null ? 'selected': ''} disabled value="">${stateSelectHidden()}</option>`;

  currentcountry.states.forEach((state) => { stateOptions += `<option value="${state.stateID}" ${ data != null ? 'selected' : '' }>${state.name}</option>` });


  let contentHtml = deliveryForm
    .replace('{headerTitle}', title)
    .replace('{countryName}', currentcountry.name)
    .replace('{countryList}', countryOptions)
    .replace('{stateLabel}', stateLabel())
    .replace('{stateSelectLabel}', stateSelectHidden())
    .replace('{stateList}', stateOptions)
    .replace(/\{capturemode}/g, captureMode != 1 ? 'disabled': '')
    .replace('{buttonContainer}', captureMode == 1 
                                    ? `${deliveryCancelButton} ${deliverySubmitbutton}` 
                                    : captureMode == 2 
                                      ? `${deliveryEditButton} ${deliveryIsOkButton}` 
                                      : captureMode == 3 
                                        ? `${deliveryCloseButton}` 
                                        : `${deliveryCloseButton}`)
    .replace('{classContainerTitle}', captureMode == 2 ? 'modal-header' : '')
    .replace('{classTitleButtonClose}', captureMode == 2? '' : 'd-none');
    
    return contentHtml;
}

const showDeliveryLoader = () =>{
  document.getElementById('delivery-loader').style.display = 'block';
}

const hideDeliveryLoader = () =>{
  document.getElementById('delivery-loader').style.display = 'none';
}

const showDeliveryAlert = () =>{
  document.getElementById('delivery-error-message').style.display = 'block';
}

const hideDeliveryAlert = () =>{
  document.getElementById('delivery-error-message').style.display = 'none';
}