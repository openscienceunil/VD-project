// Parameters
const width = 600;
const height = 600;
const padding = 20;
const margin = { top: 20, right: 0, bottom: 20, left: 30 };

let data = null;        // store the data and enable to reuse it
let currentLanguage = 'FR';     // set language by default, the same as used un html

function loadData() {
	d3.dsv(',','data/principal_languages.csv').then((dataLoaded) => {
        data = dataLoaded;  
        drawGraph();
    });
}

function drawGraph(){
    d3.select('#languageGraph').remove();

    const svg = d3.select('.principalLanguages')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'languageGraph') // add id to find and remove svg
        .attr('style', 'font: 10px sans-serif');  
        
    // Horizontal scale
    scaleX = d3.scaleBand()
        .domain([1970, 1980, 1990, 2000, 2014])
        .range([margin.left, width - margin.right])
        .padding(0.3)
        .round(true) //arrondir les valeurs a pixel pres

    // Vertical scale
    scaleY = d3.scaleLinear()
        .domain([100, 0])
        .range([margin.top, height-margin.bottom]);
    
    svg.append('g')
        .attr('transform', `translate(60, 0)`)
        .call(d3.axisLeft(scaleY))
        
    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
        .call(d3.axisBottom(scaleX));


    const filteredData = data.filter(d=> d.language === currentLanguage);

    //create color scale
    colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
        .domain([0, d3.max(filteredData, d=> d.value)]);

    //create bars 
    Bars = svg.append('g')
        .selectAll('rect')
        .data(filteredData)
        .join('rect')
        .attr('width', scaleX.bandwidth())
        .attr('height', d => scaleY(0) - scaleY(d.value))
        .attr('x', function(d) { return margin.left + scaleX(d.year) })
        .attr('y',  d => scaleY(d.value))
        .style('fill', d => colorScale(d.value));

    //Add text
    Texte = svg.append('g')
        .style('fill', 'rgb(57,91,113)')
        .attr('text-anchor','end')
        .selectAll('text')
        .data(filteredData)
        .enter()
        .append('text')
        .attr('x', d => margin.left + scaleX(d.year) + (scaleX.bandwidth()/2) + 10 )
        .attr('y', d => scaleY(d.value)-5)
        .text(d => d.value);
}

function init() {
    loadData();
    
    d3.select('#language').on('change', function() {
        currentLanguage = d3.event.target.value;
        drawGraph()
    });
}
init();
