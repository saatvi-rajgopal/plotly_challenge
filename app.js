// global
var global_data = {};

// document ready
$(document).ready(function() {
    // alert("Page Loaded");
    getData();

    // EVENT LISTENER
    $("#selDataset").on("change", function() {
        doWork();
    });
});

function getData() {
    let url = "samples.json";

    // AJAX
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        dataType: "json",
        success: function(data) {

            // DO WORK HERE
            console.log(data);

            // save to memory
            global_data = data;
            doWork();
        },
        error: function(data) {
            console.log("YOU BROKE IT!!");
        },
        complete: function(data) {
            console.log("Request finished");
        }
    });
}

function getData2() {
    let url = "samples.json";

    d3.json(url).then(function(data) {
        // DO WORK HERE
        console.log(data);
        global_data = data;
        doWork();
    });
}

////////////////////// 5 Things Functions ///////////////////

function doWork() {
    buildDropdown();
    buildBarPlot();
    buildTable();
    buildBubblePlot();
    buildGaugePlot();
}

function buildDropdown() {
    let names = global_data.names;

    // loop through names, create html, put into dropdown
    for (let i = 0; i < names.length; i++) {
        let name = names[i];
        let html_option = `<option value="${name}">${name}</option>`;
        $("#selDataset").append(html_option);
    }
}

function buildTable() {
    let curr_id = parseInt($("#selDataset").val());
    let curr_data = global_data.metadata.filter(x => x.id === curr_id)[0];

    // empty the div
    $("#sample-metadata").empty();

    let items = Object.entries(curr_data).map(([key, value]) => `${key}: ${value}`);
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let html_text = `<p>${item}<p>`;
        $("#sample-metadata").append(html_text);
    }
}

function buildBarPlot() {
    let curr_id = $("#selDataset").val();
    let curr_data = global_data.samples.filter(x => x.id === curr_id)[0];

    // create trace
    let trace1 = {
        x: curr_data.sample_values.slice(0, 10).reverse(),
        y: curr_data.otu_ids.map(x => `OTU ID: ${x}`).slice(0, 10).reverse(),
        text: curr_data.otu_labels.slice(0, 10).reverse(),
        name: "Bacteria Count",
        type: "bar",
        marker: {
            color: "purple"
        },
        orientation: 'h'
    };

    // Create data array
    let traces = [trace1];

    // Apply a title to the layout
    let layout = {
        title: "Bacteria Count in Belly Button",
        xaxis: {
            title: "Number of Bacteria"
        }
    };

    Plotly.newPlot('bar', traces, layout);
}

function buildBubblePlot() {
    let curr_id = $("#selDataset").val();
    let curr_data = global_data.samples.filter(x => x.id === curr_id)[0];

    // create trace
    var trace1 = {
        x: curr_data.otu_ids,
        y: curr_data.sample_values,
        text: curr_data.otu_labels,
        mode: 'markers',
        marker: {
            color: curr_data.otu_ids,
            size: curr_data.sample_values,
            colorscale: 'Greens',
        }
    };

    var traces = [trace1];

    var layout = {
        title: 'Bacteria Count in Belly Button Bubble Chart',
        showlegend: false,
        xaxis: {
            title: "Bacteria OTU ID"
        },
        yaxis: {
            title: "Number of Bacteria"
        }
    };

    Plotly.newPlot('bubble', traces, layout);
}

function buildGaugePlot() {
    let curr_id = parseInt($("#selDataset").val());
    let curr_data = global_data.metadata.filter(x => x.id === curr_id)[0];

    // create trace
    var trace1 = {
        domain: { x: [0, 1], y: [0, 1] },
        gauge: {
            axis: { range: [0, 9] },
            steps: [
                { range: [0, 3], color: "lightgray" },
                { range: [3, 6], color: "gray" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: 4.5
            }
        },
        delta: { reference: 4.5 },
        value: curr_data.wfreq,
        title: { text: "Washes" },
        type: "indicator",
        mode: "gauge+number+delta"
    };

    var traces = [trace1];

    var layout = {
        title: 'Belly Button Wash Frequency'
    };
    Plotly.newPlot('gauge', traces, layout);
}