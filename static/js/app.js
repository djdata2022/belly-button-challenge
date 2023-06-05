// Use the D3 library to read in samples.json from the URL given
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Set the text values in data.names as options in the drop down menu <select id="selDataset" onchange="optionChanged(this.value)"
d3.json(url).then(({names}) => {
    // Create drop down menu / populate select options
    names.forEach(id => { 
        d3.select('select').append('option').text(id)
    });
    // Update dashboard with user selection info
    optionChanged(); 
})

// Define optionChanged used above and in html file: <select id="selDataset" onchange="optionChanged(this.value)"></select>
function optionChanged() {
    let choice = d3.select("select").node().value; // The choice is the value user selected from the drop down menu
    function selectChoice(input) {  
        return input.id == choice;
    }

    d3.json(url).then(({metadata, samples}) => {  //pulls metadata and samples from data
        
        let meta = metadata.filter(obj=> obj.id == choice)[0];
        let sample = samples.filter(obj=> obj.id == choice)[0]; 
        
        // ================================METADATA=====================================
        d3.select('.panel-body').html(''); //clears the field between ID selections
        
        // Enter user-selected values in Demographic Info box 
        Object.entries(meta).forEach(([key,val])=>{
            d3.select('.panel-body').append('h6').text(`${key.toUpperCase()}: ${val}`)
        })
        
        console.log(sample);
        
        // ==================================BARCHART=====================================
        
        // Plot the bar chart showing top 10 otus found in user-selected individual
        let { otu_ids, sample_values, otu_labels } = sample;
        
        var data = [
            {
                x: sample_values.slice(0,10).reverse(),
                y: otu_ids.slice(0,10).reverse().map(x=>`OTU ${x}`),
              text: otu_labels.slice(0,10).reverse(),
              type: 'bar',
              orientation: 'h'
            }
        ];

        var layout = {
          showlegend: false,
          xaxis: {title: 'OTU ID'}
        };
        
        var layout = {
          title: 'Top 10 OTUs Found in Individual'
        };

        Plotly.newPlot("bar", data, layout);
          
          
        // ================================BUBBLECHART=====================================
        
        // Plot bubble chart of otus in user-selected individual
        var trace1 = {
          x: otu_ids,
          y: sample_values,
          mode: 'markers',
          marker: {
            size: sample_values,
            color: otu_ids, 
            colorscale: "Earth"
            },
          text: otu_labels  
          };
          
          var data = [trace1];
          
          var layout = {
            title: "OTUs Found in Individual",
            xaxis: {title: 'OTU ID'}
          };
          
          Plotly.newPlot('bubble', data, layout);
          
          
          // ================================GAUGE=====================================

          // Show gauge of washing frequency for individual (also shown in box)
          var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: meta.wfreq,
              title: { text: "Belly Button Washing Frequency (Washes/Week)" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: { range: [null, 9] },
              }
            }
          ];

          console.log(meta)
          
          var layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };
          Plotly.newPlot('gauge', data, layout);

    });
};

