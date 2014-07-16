$(document).ready(function() {
  // hide objects on pageload
  $("[data-starthidden='true']").hide()

  // add switchery switches
  var elems = Array.prototype.slice.call($('.js-switch'));
  elems.forEach(function(html) {
    var switchery = new Switchery(html, {color: '#0E48C7'});
  });

  // scrollReveal initialization
  var config = {
        after: '0s',
        enter: 'right',
        over: '0.5s',
        easing: 'ease-in-out',
        viewportFactor: 0.25,
        reset: true,
        init: true
      };
  window.scrollReveal = new scrollReveal(config);
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


            function saveTextAsFile() {

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

              var textToWrite = "##########################\r\n\
              ## Computational Domain ##\r\n\
              ##########################\r\n\
              \r\n\
              # Mesh/restart file path \r\n\
              RESTART = " + values.RESTART + "\r\n\
              \r\n\
              ##########################\r\n\
              ### Initial Conditions ###\r\n\
              ##########################\r\n\
              \r\n\
              # Gas Properties \r\n\
              P_REF = " + values.P_REF + "\r\n\
              T_REF = " + values.T_REF + "\r\n\
              RHO_REF = " + values.RHO_REF + "\r\n\
              \r\n\
              U_INITIAL = " + values.U_INITX + " " + values.U_INITY + " " + values.U_INITZ +"\r\n\
              \r\n\
              #Viscosity\r\n\
              MU_REF = " + values.MU_REF + "\r\n\
              MU_MODE = "
              switch($("#method option:selected").val()) {
                case "1":
                  textToWrite += "POWERLAW \r\n\
                  MU_POWER_LAW = " + values.MU_POWER_LAW + "\r\n"
                  break;

                  case "2":
                    textToWrite += "SUTHERLAND \r\n"
                    break;
                  }

                  textToWrite += "\r\n\
                  \r\n\
                  ##########################\r\n\
                  #### Solver Settings #####\r\n\
                  ##########################\r\n\
                  \r\n\
                  # CFL \r\n\
                  CFL = " + values.CFL + "\r\n"
                  if($('#dynamic').is(':checked')) {
                    textToWrite += "CFL_RAMP AFTER_ITER=" + values.CFL_RAMP_AFTER_ITER + " \
                    INTERVAL_ITER=" + values.INTERVAL_ITER  + " FACTOR_CFL=" + values.FACTOR_CFL + " MAX_CFL=" + values.MAX_CFL + "\r\n"
                  }
                  textToWrite += "\r\n" + "NSTEPS = "+ values.NSTEPS + "\r\n"

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

                                textToWrite += "LINEAR_SOLVER_NS_THRESHOLDS \
                                MAX_ITER=" + values.MAX_ITER + " ABS_RESID=" + values.ABS_RESID + " REL_RESID=" + values.REL_RESID +"\r\n\
                                UNDER_RELAXATION="+ values.UNDER_RELAXATION +"\r\n"

                                switch($("#scalar option:selected").val()) {
                                  case "1":
                                    textToWrite += "LINEAR_SOLVER_SCALARS = PETSC_GMRES \r\n \r\n"
                                    break
                                    case "2":
                                      textToWrite += "LINEAR_SOLVER_SCALARS = BCGSTAB \r\n \r\n"
                                      break
                                    }
                                    textToWrite += "UNDER_RELAXATION_SCALARS= " + values.UNDER_RELAXATION_SCALARS + "\r\n \r\n"
                                    switch($("#reconmeth option:selected").val()) {
                                      case "1":
                                        textToWrite += "GRAD_RECONSTRUCTION SCHEME=GREENGAUSS	LIMITER= "+ values.LIMITERGG +"	EPS= "+ values.EPSGG +"\r\n\r\n"
                                        break
                                        case "2":
                                          textToWrite += "GRAD_RECONSTRUCTION SCHEME=LEASTSQUARES	LIMITER= "+ values.LIMITERLS +"	EPS= "+ values.EVSLS +"\r\n\r\n"
                                          break
                                        }
                                        if ($("#scalstand").is(':checked'))
                                          {
                                            textToWrite+= "SCALAR_RECONSTRUCTION=STANDARD +\r\n\r\n"
                                          }
                                          textToWrite+="VISC_LIM="+values.VISC_LIM




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
