$(document).ready(function() {
  // we'll put our code here

	$("[data-starthidden='true']").hide()

});

function checkyesorno(checkboxid) {
	if($(checkboxid).is(':checked')){
          $(checkboxid).val('YES');
     }
	 else{
          $(checkboxid).val('NO');
     }
}

function hideshowdrop(opselected, op1, op2) {
	switch(opselected) {
	
		case 1:
			op1.fadeIn("fast")
			if (arguments[2])
				{
					arguments[2].fadeOut("fast")
				}
			break;
		
		case 2:
			op1.fadeOut("fast")
			if (arguments[2])
				{
					arguments[2].fadeIn("fast")
				}
			break;
		
		default:
			op1.fadeOut("fast")
			if (arguments[2])
				{
					arguments[2].fadeOut("fast")
				}
			break;
		}
}

function dynamicCFL() {
$('#ramping').fadeToggle("fast")
}


function saveTextAsFile() {

checkyesorno("#limitergg")
checkyesorno("#limiterls")
checkyesorno("#visclim")


	var method = ""
	
	var textToWrite = "### Initial Conditions ###\r\n\
# Mesh/restart file path\r\n\
RESTART = " + $("#restart").val() + "\r\n\
\r\n\
# Gas Properties \r\n\
P_REF = " + $("#pressure").val() + "\r\n\
T_REF = " + $("#temperature").val() + "\r\n\
RHO_REF = " + $("#density").val() + "\r\n\
 \r\n\
U_INITIAL = " + $("#x").val() + " " + $("#y").val() + " " + $("#z").val() +"\r\n\
\r\n\
\r\n\
MU_REF = " + $("#viscosity").val() + "\r\n\
\r\n\
MU_MODE = " 
	
	switch($("#method option:selected").val()) {
			case "1":
				textToWrite += "POWERLAW \r\n\
MU_POWER_LAW = " +$("#coefficient").val(); + "\r\n"
				break;
		
			case "2":
				textToWrite += "SUTHERLAND \r\n"
				break;
				}
	textToWrite += "\r\n\
\r\n\
### Solver Settings ### \r\n\
# CFL \r\n\
CFL = " + $("#CFL").val() + "\r\n"
	if($('#dynamic').is(':checked')) {
		textToWrite += "CFL_RAMP AFTER_ITER =" + $("#start").val() + "\r\n\
INTERVAL_ITER = " + $("#increase").val() + " FACTOR_CFL = " + $("#factor").val() + " MAX_CFL = " + $("#max").val() + "\r\n"
	}
	textToWrite += "\r\n" + "NSTEPS = "+ $("#iterations").val() + "\r\n"
	
	switch($("#dt option:selected").val()) {
		case "1":
			textToWrite+= "TIME_STEP = SUM_BASED \r\n"
			break
	}
	
	switch($("#time option:selected").val()) {
		case "1":
			textToWrite+= "TIME_INTEGRATION = BACKWARD_EULER \r\n \r\n"
			break
		case "2":
			textToWrite += "TIME_INTEGRATION = RK3 \r\n \r\n"
			break
		default:
			textToWrite+= "\r\n"
			break
	}
	
	textToWrite += "#spatial discretization \r\n"
	
	switch($("#integmethod option:selected").val()) {
		case "1":
			textToWrite += "SPACE_INTEGRATION = HLLC \r\n"
			break
	}
	
	textToWrite += "\r\n"
	
	if($("#order").is(':checked')) {
	textToWrite += "SPATIAL_SECOND_ORDER \r\n \r\n"
	}
	textToWrite += "#linear solver information \r\n"
	
	switch($("#nav-stoke option:selected").val()) {
		case "1":
			textToWrite += "LINEAR_SOLVER_NS = PETSC_GMRES \r\n \r\n"
			break
		case "2":
			textToWrite += "LINEAR_SOLVER_NS = BCGSTAB \r\n \r\n"
			break
		default: 
			textToWrite += "\r\n"
			break
	}
	
	textToWrite += "LINEAR_SOLVER_NS_THRESHOLDS \r\n\
MAX_ITER= " + $("#max_iter").val() + "	ABS_RESID= " + $("#abs_resid").val() + "	REL_RESID= " + $("#rel_resid").val() +"\r\n\
UNDER_RELAXATION= "+$("#navrelax").val() +"\r\n \r\n"

	switch($("#scalar option:selected").val()) {
		case "1":
			textToWrite += "LINEAR_SOLVER_SCALARS = PETSC_GMRES \r\n \r\n"
			break
		case "2":
			textToWrite += "LINEAR_SOLVER_SCALARS = BCGSTAB \r\n \r\n"
			break
	}
	textToWrite += "UNDER_RELAXATION_SCALARS= " + $("#scalrelax").val() + "\r\n \r\n"
	switch($("#reconmeth option:selected").val()) {
		case "1":
			textToWrite += "GRAD_RECONSTRUCTION SCHEME=GREENGAUSS	LIMITER= "+$("#limitergg").val()+"	EPS= "+$-("#evgg").val() +"\r\n\r\n"
			break
		case "2":
			textToWrite += "GRAD_RECONSTRUCTION SCHEME=LEASTSQUARES	LIMITER= "+$("#limiterls").val()+"	EPS= "+$("#evls").val() +"\r\n\r\n"
			break
	}
	if ($("#scalstand").is(':checked'))
		{
			textToWrite+= "SCALAR_RECONSTRUCTION=STANDARD +\r\n\r\n"
		}
	textToWrite+="VISC_LIM="+$("#visclim").val()
	


		
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain;charset=utf-8' });
	var fileNameToSaveAs = "Joe Input 1"//$("#FileNameToSaveAs").val();

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null)
	{
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else
	{
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
}


function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}