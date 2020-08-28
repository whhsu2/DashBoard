import React, { Component } from 'react';
import * as d3 from "d3";
import { select } from 'd3';
import percentage from '../data/percentage.csv'

class PercentagePlot extends Component {
  constructor() {
    super()
    this.state = {
    }
    this.drawChart = this.drawChart.bind(this)

  }

  componentDidMount() {
    this.drawChart()
  }

  async drawChart() {
    const node = this.node
    const margin = ({top: 30, right: 10, bottom: 20, left: 50})

    var width = 900 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var data = await d3.csv(percentage, d3.autoType)

    data.forEach(function(d) {
        d.date = new Date(d.date);
    });

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    color.domain(d3.keys(data[0]).filter(function(key) {
        return key !== "date";
    }));
    
    var x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right]);

    var y = d3.scaleLinear()
    .range([height - margin.bottom, margin.top]);

    var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y))

    var line = d3.line()
        .curve(d3.curveBasis)
        .x(d => x(d.date) )
        .y(d => y(d.temperature) );

    var svg = select(node)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")

    var cities = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
            return {
                date: d.date,
                temperature: +d[name]
            };
            })
        };
    });

    y.domain([ d3.min(cities, function(c) {
        return d3.min(c.values, function(v) {
        return v.temperature;
        });
    }),
    d3.max(cities, function(c) {
        return d3.max(c.values, function(v) {
        return v.temperature;
        });
    })
    ]);

    var legend = svg.selectAll('g')
        .data(cities)
        .enter()
        .append('g')
        .attr('class', 'legend');

    legend.append('rect')
        .attr('x', width - 120)
        .attr('y', function(d, i) {
            return i * 20 + 10;
        })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d) {
            return color(d.name);
    });

    legend.append('text')
    .attr('x', width - 100)
    .attr('y', function(d, i) {
        return (i * 20) + 20;
    })
    .text(function(d) {
        return d.name;
    });

    select(node)
        .append("g")
        .call(xAxis);

    select(node)
        .append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temperature (ºF)");

    var city = svg.selectAll(".city")
        .data(cities)
        .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .style('fill', 'none')
        .attr("class", "line")
        .attr("d", function(d) {
            return line(d.values);
        })
    .style("stroke", function(d) {
        return color(d.name);
    });

    city.append("text")
        .datum(function(d) {
            return {
            name: d.name,
            value: d.values[d.values.length - 1]
            };
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
        })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.name;
    });
    var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(cities)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
        .attr("r", 7)
        .style("stroke", function(d) {
            return color(d.name);
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
            .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
            .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
            .style("opacity", "0");
    })
    .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
        .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
        .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
        .style("opacity", "1");
    })
    .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
        .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
        });

    d3.selectAll(".mouse-per-line")
    .attr("transform", function(d, i) {
        var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

        while (true){
            target = Math.floor((beginning + end) / 2);
            var pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
        }
        if (pos.x > mouse[0])      end = target;
        else if (pos.x < mouse[0]) beginning = target;
        else break; //position found
        }
        
        d3.select(this).select('text')
        .text(y.invert(pos.y).toFixed(2));
        
        return "translate(" + mouse[0] + "," + pos.y +")";
    });
    });

  }

  render(){
    return ( 
      <svg className="percentage-plot" ref={node => this.node = node}
      width={600} height={450}>
      </svg>
    )
  }
}


export default PercentagePlot;



