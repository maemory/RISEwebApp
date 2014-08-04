
var fileInput = $('#files');

fileInput.on('change', function() {
        if (!window.FileReader) {
                alert('Your browser is not supported')
        }
        var input = fileInput.get(0);

        // Create a reader object
        var reader = new FileReader();
        if (input.files.length) {
                var textFile = input.files[0];
                reader.readAsText(textFile);
                $(reader).load(processFile);
        } else {
                alert('Please upload a file before continuing')
        }

});

function processFile(e) {

        var file = e.target.result
        if (file && file.length) {
                var obj = JSON.parse(file);
                
                // update coeffs boxes
                $("#C1").val(obj.c1)
                $("#C2").val(obj.c2)
                $("#C3").val(obj.c3)
                
                window.obj=obj
                }
        }
        $("#graph").on('click', timeformath);
        function timeformath(){
                d3.select("svg").remove();
                var y=0;

                var pointData ={};
                var evalnum=parseInt($("#evalnum").val())-1
                window.evalnum=evalnum
                
                for(i=0; i <= evalnum; i++){
                  var newPoint = i
                  var x= 2*Math.PI*i/evalnum
                  switch ($("#function option:selected").val()) {
                    case "1":
                            y= obj.c1*Math.sin(obj.c2*x)
                            break
                    case "2":
                            y= obj.c1*Math.cos(obj.c2*x)
                            break
                    case "3":
                            y= obj.c1*(Math.sin(obj.c2*x) + Math.pow(Math.cos(obj.c2*x),obj.c3))
                            break
                    default:
                            alert("Illegal Equation")
                            break
                  }
                  pointData[newPoint] = {"x": x, "y": y}
                }
                 
                var yArray = []
                
                for (i=0; i<= evalnum; i++) {
                  yArray.push(pointData[i].y)
                }
                var minY = Math.min.apply(Math,yArray)
                var maxY = Math.max.apply(Math,yArray)
                
                window.pointData=pointData

                var newScaledData = []

                var linearScale = d3.scale.linear()
                        .domain([0,2*Math.PI])
                        .range([0,400])
                var linearScale2 = d3.scale.linear()
                        .domain([minY,maxY])
                        .range([0,225])

                for (var i = 0; i <= evalnum; i++) {
                        var newPoint = i
                        newScaledData[newPoint] = {"x": linearScale(pointData[i].x)+30, "y": 250 - linearScale2(pointData[i].y)};
                }

                var svgContainer = d3.select("#graphWindow").append("svg")
                        .attr("width", 430)
                        .attr("height", 275)


                var xScale = d3.scale.linear()
                        .domain([0,2*Math.PI])
                        .range([0,400])
                var yScale = d3.scale.linear()
                        .domain([maxY,minY])
                        .range([0,225])
                var x_axis = d3.svg.axis().scale(linearScale).orient("bottom").ticks(5);
                var y_axis = d3.svg.axis().scale(yScale).orient("left").ticks(10);

                d3.select("svg")
                        .append("g")
                        .attr("class","x axis")
                        .attr("transform","translate(30,250)")
                        .call(x_axis);

                d3.select("svg")
                        .append("g")
                        .attr("class","y axis")
                        .attr("transform","translate(30,25)")
                        .call(y_axis);

                var circles = svgContainer.selectAll("circle")
                        .data(newScaledData)
                        .enter()
                        .append("circle");
                var circleAttributes = circles
                        .attr("cx", function(d) {return d.x;})
                        .attr("cy", function(d) {return d.y;})
                        .attr("r", 2)
                        .style("fill", "black")
                $("#integrate").click(IntegrateTime)

        }

        function IntegrateTime() {
                        var integral=0
                switch ($("#method option:selected").val()) {
                        case "1":
                                for (i=0;i<evalnum; i++) {
                                        integral+=(pointData[i+1].x-pointData[i].x)*pointData[i].y
                                }
                                break
                        case "2":
                                for (i=0;i<evalnum; i++) {
                                        integral+=(pointData[i+1].x-pointData[i].x)*(pointData[i].y+pointData[i+1].y)/2
                                }
                                break
                        default:
                                alert("Illegal Method")
                                break
                                }
                $("#integral").val(integral)

        }


        $("#save").click(function() {
        var textToWrite = $("#integral").val()

        var textFileAsBlob = new Blob([textToWrite], {type:'text/plain;charset=utf-8' });
        var fileNameToSaveAs = "integral";

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
})

function destroyClickedElement(event)
{
        document.body.removeChild(event.target);
}
