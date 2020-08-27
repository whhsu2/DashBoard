import React, { Component } from 'react';
import * as d3 from "d3";
import { select } from 'd3';
import stock from '../data/aapl.csv'


class Timeline extends Component {
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
    var file = await d3.csv(stock, function({date, close}) {
        return {
          date: date,
          value: +close
        }
    })
    var data = Object.assign(file, {y: "$ Close"})

    var line = d3.line()
        .curve(d3.curveStep)
        .defined(d => !isNaN(d.value))
        .x(d => x(new Date(d.date) ))
        .y(d => y(+d.value))

    const node = this.node
    var margin = ({top: 20, right: 30, bottom: 30, left: 40})
    var width = select(node).attr("width") - margin.left - margin.right;
    var height = select(node).attr("height") - margin.bottom - margin.top;
    

    var x = d3.scaleUtc()
    .domain(d3.extent(data, d => new Date(d.date) ))
    .range([margin.left, width - margin.right])
    
    var y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top])

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

    function bisect(mx) {
      const bisect = d3.bisector(d => new Date(d.date) ).left;
      const date = x.invert(mx);
      const index = bisect(data, date, 1);
      const a = data[index - 1];
      const b = data[index];
      return b && (date - a.date > b.date - date) ? b : a;
    };

  function callout (g, value) {
      if (!value) return g.style("display", "none");

      g
          .style("display", null)
          .style("pointer-events", "none")
          .style("font", "10px sans-serif");

      const path = g.selectAll("path")
          .data([null])
          .join("path")
          .attr("fill", "white")
          .attr("stroke", "black");

      const text = g.selectAll("text")
          .data([null])
          .join("text")
          .call(text => text
          .selectAll("tspan")
          .data((value + "").split(/\n/))
          .join("tspan")
              .attr("x", 0)
              .attr("y", (d, i) => `${i * 1.1}em`)
              .style("font-weight", (_, i) => i ? null : "bold")
              .text(d => d));

      const {x, y, width: w, height: h} = text.node().getBBox();

      text.attr("transform", `translate(${-w / 2},${15 - y})`);
      path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
  }

    function formatDate (date) {
      return date.toLocaleString("en", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC"
          });
      }
        
    function formatValue(value) {
        return value.toLocaleString("en", {
            style: "currency",
            currency: "USD"
            });    
    }

    select(node)
        .append("g")
        .call(xAxis);
    
    select(node)
        .append("g")
        .call(yAxis);
    
    select(node)
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
  
    const tooltip = select(node).append("g");
  
    select(node).on("touchmove mousemove", function() {
      const {date, value} = bisect(d3.mouse(this)[0]);
      tooltip
          .attr("transform", `translate(${x(new Date(date) )},${y( +value)})`)
          .call(callout, `${formatValue(+value)} ${formatDate(new Date(date) )}`);
    });
  
    select(node).on("touchend mouseleave", () => tooltip.call(callout, null));

  }


  render(){
    return <svg ref={node => this.node = node}
    width={1200} height={500}>
    </svg>
  }
}


export default Timeline;