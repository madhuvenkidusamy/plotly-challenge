// Read in samples.json with D3
d3.json("data/samples.json").then((data) => { 


  // pull array of participant IDs from sample.json
  var names = data.names;
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // add IDs as dropdown options using forEach loop
  names.forEach(name => {
    dropdownMenu.append("option").text(name);
  });


  // get vars for graphing
  var samples = data.samples;
  var otu_ids = samples.map(samples => {
    return samples.otu_ids;
  });
  var otu_labels = samples.map(samples => {
    return samples.otu_labels;
  });
  var sample_values = samples.map(samples => {
    return samples.sample_values;
  });
  

  // Format y-axis labels to show "OTU"
  y_labels = [];
  otu_ids.forEach(individual => {
    var labeled_individual = []; 
    individual.forEach(id => {
      labeled_individual.push("OTU " + id);
    });
    y_labels.push(labeled_individual);
  });


  // Only get 10 OTUs for all data points
  var x = [];
  var y = [];
  var hover = [];

  y_labels.forEach(array => {
    var slice = array.slice(0,10);
    y.push(slice);
  });

  sample_values.forEach(array => {
    var slice = array.slice(0,10);
    x.push(slice);
  });

  otu_labels.forEach(array => {
    var slice = array.slice(0,10);
    hover.push(slice);
  });


  // Assign metadata element to variable
  var metadata = d3.select('#sample-metadata');
  

  // Display the default plot. Show data for first individual.
  function init() {
    // Trace1. Bar graph
    var trace1 = {
      x: x[0].reverse(),
      y: y[0].reverse(),
      text: hover[0].reverse(),
      type: "bar",
      orientation: "h"
    };

    // bardata
    var bardata = [trace1];

    // Apply the group bar mode to the layout
    var layout = {
      title: "Most Prevalent OTUs",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    // Plotting bar graph
    Plotly.newPlot("bar", bardata, layout);

    // Trace2. Bubble graph
    var trace2 = {
      x: otu_ids[0],
      y: sample_values[0],
      text: otu_labels[0],
      mode: 'markers',
      marker: {
          color: otu_ids[0],
          size: sample_values[0]
      }
    };

    // bubble data
    var bubbleData = [trace2];

    // Applying bubble layout
    var layout = {
      height: 500,
      width: 1000,
      xaxis: {
          title:{
              text: 'OTU ID',
          }
      }
    };

    // plotting bubble chart
    Plotly.newPlot("bubble", bubbleData, layout)


    // Display the sample metadata
    var keys = Object.keys(data.metadata[0]);
    var values = Object.values(data.metadata[0])
    metadata.html("");
    for (var i = 0; i < keys.length; i++) {
        metadata.append("p").text(`${keys[i]}: ${values[i]}`);
    };
  };   // end init function

  // On change to the DOM, call getData()
  dropdownMenu.on("change", getData);

  // Function called by DOM changes
  function getData() {

    // Assign the value of the dropdown menu option to a variable
    var input = dropdownMenu.property("value");

    // Get index of input value
    for (var i = 0; i < names.length; i++) {
      if (input === names[i]) {
          var x_bar = x[i].reverse();
          var y_bar = y[i].reverse();
          var hover_bar = hover[i].reverse();
          var otu_id = otu_ids[i];
          var sample_value = sample_values[i];
          var otu_label = otu_labels[i];
          var keys = Object.keys(data.metadata[i]);
          var values = Object.values(data.metadata[i]);
      };
    };


    // Resetting data
    var trace3 = {
      x: x_bar,
      y: y_bar,
      text: hover_bar,
      type: "bar",
      orientation: "h"
    };

    // data
    var newbar = [trace3];

    // Apply the group bar mode to the layout
    var layout = {
      title: "Most Prevalent OTUs",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    // Update plot
    Plotly.react("bar", newbar, layout);



    // Resetting bubble data 
    var trace4 = {
      x: otu_id,
      y: sample_value,
      text: otu_label,
      mode: 'markers',
      marker: {
          color: otu_id,
          size: sample_value
      }
    };

    // new bubble data
    var newbubble = [trace4];

    // Applying bubble layout
    var layout = {
      height: 500,
      width: 1000,
      xaxis: {
          title:{
              text: 'OTU ID',
          }
      }
    };

    // Update bubble chart
    Plotly.newPlot("bubble", newbubble, layout)


    // Display each key-value pair from the metadata JSON object somewhere on the page.
    // var metadata = d3.select('#sample-metadata');
    metadata.html("");
    for (var j = 0; j < keys.length; j++) {
        metadata.append("p").text(`${keys[j]}: ${values[j]}`);
    };

  }; // end getData function

  // Render default graph
  init()


});
