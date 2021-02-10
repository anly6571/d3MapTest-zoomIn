import * as d3 from "d3";
import "./styles.css";
import * as _ from "lodash";
import { loadFlowerData, ready } from "./flowers.js";

var width = 900;
var height = 700;

async function getFlowerInfo() {
  let flowerData = await loadFlowerData();
  return ready(flowerData);
}

let flowerData = getFlowerInfo();

let petalPath = "M 0,0 C -10, -10 -10, -40 0, -50 C 10, -40 10, -10, 0,0 ";
// load data
var coloMap = d3.json("CO-counties.geojson"); //this is res[0]

//base SVG
var svg = d3
  .select("div#container")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .style("background-color", "#c9e8fd")
  .attr("viewBox", "0 0 " + width + " " + height)
  .classed("svg-content", true);



//projection
var projection = d3
  .geoMercator()
  .translate([width / 2, height / 2])
  .scale(5300)
  .center([-105.5, 39]); //40, 104
var path = d3.geoPath().projection(projection);

//console.log(flowersData[0].petals)

Promise.all([coloMap, flowerData]).then((res) => {
  console.log(res[1]);

  const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

const g = svg.append("g");

 const states = g.append("g")
    .attr("cursor", "pointer")
    .selectAll("path")
    .data(res[0].features)
    .enter()
    .append("path")
    .on("click", clicked)
    .attr("class", "county")
    .attr("d", path);
    

  let flowers = g
    .append("g")
    .selectAll()
    .data(res[0].features)
    .enter()
    .append("path")
    .attr("transform", (d) => `translate(${path.centroid(d)}) rotate(45)`)
    //.attr("transform", "rotate(45)") //rotates each petal
    //.attr("r", 2)
    .attr("d", petalPath)
    .attr("fill", "blue");

  let coordinates = projection([-104.990251, 39.7392358]);
  svg
    .append("circle")
    .attr("cx", coordinates[0])
    .attr("cy", coordinates[1])
    .attr("r", 5)
    .style("fill", "red");

    svg.call(zoom);

  function reset() {
    states.transition().style("fill", null);
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
  }

  function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    states.transition().style("fill", null);
    d3.select(this).transition().style("fill", "#326941");
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      d3.pointer(event, svg.node())
    );
  }

  function zoomed(event) {
    const {transform} = event;
    states.attr("transform", transform);
    states.attr("stroke-width", 1 / transform.k);
  }

    
});

//path.centroid(res);
