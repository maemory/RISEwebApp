$(document).ready(function() {
  // hide objects on pageload
  $("[data-starthidden='true']").hide()
  
  
  // add switchery switches
  var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
  elems.forEach(function(html) {
	var switchery = new Switchery(html, {color: '#0E48C7'});
});
	$("#saveButton").click(saveTextAsFile);
	$("#previewshow").click(function () {
		$("#preview").modal('show');
		$("#preview_body").append(TextToWrite("<br>"))
	});
});


function checkYesOrNo(checkBoxId) {
	if($(checkBoxId).is(':checked')) {
	  $(checkBoxId).val('YES');
	}
	else {
	  $(checkBoxId).val('NO');
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

function TextToWrite(linebreak) {
	checkYesOrNo("#limitergg")
	checkYesOrNo("#limiterls")
	checkYesOrNo("#visclim")
	checkYesOrNo("#scalstand")
	
	var values = {
		"RESTART": $("#restart").val(),
		"P_REF": $("#pressure").val(), 
		"T_REF": $("#temperature").val(),
		"RHO_REF": $("#density").val(),
		"U_INITX": $("#x").val(),
		"U_INITY": $("#y").val(),
		"U_INITZ": $("#z").val(),
		"MU_REF": $("#viscosity").val(),
		"MU_POWER_LAW": $("#plCoefficient").val(),
		"CFL": $("#CFL").val(),
		"CFL_RAMP_AFTER_ITER": $("#cflStart").val(),
		"INTERVAL_ITER": $("#cflIncrease").val(),
		"FACTOR_CFL": $("#cflFactor").val(),
		"MAX_CFL": $("#cflMax").val(),
		"NSTEPS": $("#iterations").val(),
		"MAX_ITER": $("#maxIter").val(),
		"ABS_RESID": $("#absResid").val(),
		"REL_RESID": $("#relResid").val(),
		"UNDER_RELAXATION": $("#navRelax").val(),
		"UNDER_RELAXATION_SCALARS": $("#scalRelax").val(),
		"LIMITERGG": $("#limitergg").val(),
		"LIMITERLS": $("#limiterls").val(),
		"EPSGG": $("#evgg").val(),
		"EPSLS": $("#evls").val(),
		"VISC_LIM": $("#visclim").val()
  }
	var textToWrite = 
	"##########################" + linebreak +
	"## Computational Domain ##" + linebreak +
	"##########################" + linebreak +
	linebreak +
	"# Mesh/restart file path " + linebreak +
	"RESTART = " + values.RESTART + linebreak +
	linebreak +
	"##########################" + linebreak +
	"### Initial Conditions ###" + linebreak +
	"##########################" + linebreak +
	linebreak +
	"# Gas Properties " + linebreak +
	"P_REF = " + values.P_REF + linebreak +
	"T_REF = " + values.T_REF + linebreak +
	"RHO_REF = " + values.RHO_REF + linebreak +
	linebreak +
	"U_INITIAL = " + values.U_INITX + " " + values.U_INITY + " " + values.U_INITZ + linebreak+
	linebreak+
	"#Viscosity" + linebreak +
	"MU_REF = " + values.MU_REF + linebreak +
	"MU_MODE = " 
	switch($("#method option:selected").val()) {
	case "1":
		textToWrite += "POWERLAW " + linebreak +
		"MU_POWER_LAW = " + values.MU_POWER_LAW + "\r\n"
		break;

	case "2":
		textToWrite += "SUTHERLAND \r\n"
		break;
	}
	
	textToWrite += linebreak +
	linebreak +
	"##########################" + linebreak +
	"#### Solver Settings #####" + linebreak +
	"##########################" + linebreak +
	linebreak +
	"# CFL " + linebreak +
	"CFL = " + values.CFL + "\r\n"
	if($('#dynamic').is(':checked')) {
		textToWrite += "CFL_RAMP AFTER_ITER=" + values.CFL_RAMP_AFTER_ITER + " \
INTERVAL_ITER=" + values.INTERVAL_ITER  + " FACTOR_CFL=" + values.FACTOR_CFL + " MAX_CFL=" + values.MAX_CFL + "\r\n"
		}
	textToWrite += linebreak + "NSTEPS = "+ values.NSTEPS + linebreak
		
	switch($("#dt option:selected").val()) {
		case "1":
			textToWrite+= "TIME_STEP = SUM_BASED" +linebreak
			break
	}
		
	switch($("#time option:selected").val()) {
		case "1":
			textToWrite+= "TIME_INTEGRATION = BACKWARD_EULER" +linebreak + linebreak
			break
		case "2":
			textToWrite += "TIME_INTEGRATION = RK3"+linebreak+linebreak
			break
		default:
			textToWrite+= linebreak
			break
		}
		
	textToWrite += "#spatial discretization"+linebreak
		
	switch($("#integmethod option:selected").val()) {
		case "1":
			textToWrite += "SPACE_INTEGRATION = HLLC"+linebreak
			break
		}
		
	textToWrite += linebreak
		
	if($("#order").is(':checked')) {
		textToWrite += "SPATIAL_SECOND_ORDER"+linebreak+linebreak
	}
	textToWrite += "#linear solver information"+linebreak
		
	switch($("#nav-stoke option:selected").val()) {
		case "1":
			textToWrite += "LINEAR_SOLVER_NS = PETSC_GMRES"+linebreak+linebreak
			break
		case "2":
			textToWrite += "LINEAR_SOLVER_NS = BCGSTAB"+linebreak+linebreak
			break
		default: 
			textToWrite += linebreak
			break
	}
		
	textToWrite += "LINEAR_SOLVER_NS_THRESHOLDS \
MAX_ITER=" + values.MAX_ITER + " ABS_RESID=" + values.ABS_RESID + " REL_RESID=" + values.REL_RESID +"" + linebreak +
	"UNDER_RELAXATION="+ values.UNDER_RELAXATION +linebreak

	switch($("#scalar option:selected").val()) {
		case "1":
			textToWrite += "LINEAR_SOLVER_SCALARS = PETSC_GMRES"+linebreak+linebreak
			break
		case "2":
			textToWrite += "LINEAR_SOLVER_SCALARS = BCGSTAB"+linebreak+linebreak
			break
	}
	textToWrite += "UNDER_RELAXATION_SCALARS= " + values.UNDER_RELAXATION_SCALARS +linebreak+linebreak
	switch($("#reconmeth option:selected").val()) {
		case "1":
			textToWrite += "GRAD_RECONSTRUCTION SCHEME=GREENGAUSS	LIMITER= "+ values.LIMITERGG +"	EPS= "+ values.EPSGG +linebreak+linebreak
			break
		case "2":
			textToWrite += "GRAD_RECONSTRUCTION SCHEME=LEASTSQUARES	LIMITER= "+ values.LIMITERLS +"	EPS= "+ values.EVSLS +linebreak+linebreak
			break
	}
	if ($("#scalstand").is(':checked')) {
		textToWrite+= "SCALAR_RECONSTRUCTION=STANDARD" +linebreak+linebreak
	}
	textToWrite+="VISC_LIM="+values.VISC_LIM
	return textToWrite;
}



function saveTextAsFile() {
  var textToWrite = TextToWrite("\r\n")
  var textFileAsBlob = new Blob([textToWrite], {type:'text/plain;charset=utf-8' });
  var fileNameToSaveAs = "Joe.in"//$("#FileNameToSaveAs").val();

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