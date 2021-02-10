import * as d3 from "d3";
import * as _ from "lodash";

let allmonths = ["Jan", "Feb", "Mar", "Apr", "Aug", "Sep", "Oct", "Nov", "Dec"];

export let months = allmonths;
// --- GLOBAL ---
let petalSize = 50;
let petalPath = "M 0,0 C -10, -10 -10, -40 0, -50 C 10, -40 10, -10, 0,0 ";

// --- FUNCTIONS ---
async function loadFlowerData() {
  // type conversion
  function type(d) {
    return {
      county: d.County,
      energy: +d.PercentRenewable,
      ghg: +d.GHG,
      transit: +d.GreenTransit
    };
  }

  return d3.csv("data/FakeData.csv", type).then((res) => res);
}

function ready(data) {
  const numData = data.length + 1;
  const energyMinMax = d3.extent(data, (d) => d.energy);
  const ghgMinMax = d3.extent(data, (d) => d.ghg);
  const sizeScale = d3.scaleLinear().domain(energyMinMax).range([0.25, 1]); //size mapped to energy
  const numPetalScale = d3.scaleQuantize().domain(ghgMinMax).range([5, 7, 12]); //number mapped to ghg
  const xScale = d3.scaleLinear().domain([0, numData]).range([0, 1000]);

  //for each county, return data
  const flowersData = _.map(data, (d) => {
    const numPetals = numPetalScale(d.ghg);
    const petSize = sizeScale(d.energy);
    return {
      petSize,
      petals: _.times(numPetals, (i) => {
        return { angle: (360 * i) / numPetals, petalPath };
      }),
      numPetals
    };
  });
  // console.log(`PETAL SIZE = ${flowersData[0].petSize}`);
  // console.log(`Flower data from flower.js = ${flowersData}`);
  // console.log(flowersData);
  return flowersData;
}
//loadData(ready);

export { loadFlowerData, ready };
