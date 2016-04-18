var dimensions = {
    cylinders: 'cylinders',
    mpg: 'mpg',
    displacement: 'displacement',
    horsepower: 'horsepower',
    weight : 'weight',
    acceleration : 'acceleration',
};

width = 440,
height = 440;
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var x_axis = d3.svg.axis().scale(x).orient("bottom");
var y_axis = d3.svg.axis().scale(y).orient("left");

var svg = d3.select("body").append("svg")
        .attr("width", 500)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(40,20)");

svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("displacement");

svg.append("g")
        .attr("class", "y axis")
        .call(y_axis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("mpg");


var draw = function(mpg_min,mpg_max) {

    d3.csv("car.csv", function(error, data) {
        data.forEach(function(d) {
            d.mpg = +d.mpg;
            d.cylinders = +d.cylinders;
            d.displacement = +d.displacement;
            d.horsepower = +d.horsepower;
            d.weight = +d.weight;
            d.acceleration = +d.acceleration;
        });

        data = data.filter(function(d) {
          return d.mpg <= mpg_max && d.mpg >= mpg_min;
        })

        x_axis_draw = $('#x_axis').val();
        y_axis_draw = $('#y_axis').val();

        x.domain(d3.extent(data, function(d) { 
        	return d[x_axis_draw]; 
        })).nice();
        svg.select(".x.axis").transition().call(x_axis);
        
        y.domain(d3.extent(data, function(d) { 
        	return d[y_axis_draw]; 
        })).nice();
        svg.select(".y.axis").transition().call(y_axis);

        var dots =  svg.selectAll(".dot").data(data);
        dots.enter().append("circle");
        dots.attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", function(d) { return x(d[x_axis_draw]); })
                .attr("cy", function(d) { return y(d[y_axis_draw]); })
                .on("mouseover", function(d) {
                  $('h4').text(d.name);
                })
                .on('mouseout', function(d){
                  $('h4').text('Car Name');
                });

        dots.exit().remove();
		
		//When select dimensions from drop menu
        d3.select("[name=x_axis]").on("change", function(){
            x_a = this.value;
            x.domain(d3.extent(data, function(d) { return d[x_a]; })).nice();
            svg.select(".x.axis").transition().call(x_axis);
            svg.selectAll(".dot").transition().attr("cx", function(d) {
                return x(d[x_a]);
            });
            svg.selectAll(".x.axis").selectAll("text.label").text(dimensions[x_a]);
        });

        d3.select("[name=y_axis]").on("change", function(){
            y_a = this.value;
            y.domain(d3.extent(data, function(d) { return d[y_a]; })).nice();
            svg.select(".y.axis").transition().call(y_axis);
            svg.selectAll(".dot").transition().attr("cy", function(d) {
                return y(d[y_a]);
            });
            svg.selectAll(".y.axis").selectAll("text.label").text(dimensions[y_a]);
        });

    });
}


$(document).ready(function() {
  draw(0,50);
      $('button').click(function(){
        var mpg_min = +$('#mpg-min').val();
        var mpg_max = +$('#mpg-max').val();
        draw(mpg_min,mpg_max);
    });

});
