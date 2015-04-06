define([], function () {

    function init() {
        $("#tour").on("click", displayTour);
    }

    function displayTour() {
        // Instance the tour
        var tour = new Tour({
            storage: false,
            steps: [
                {
                    element: "#vis",
                    title: "Graph",
                    content: "The graph shows the total amount in tonnes of the \n\
                            selected pollutant for the years 1985 - 2012 in Canada. \n\
                            <br><br>You can <ul><li>Scroll up or down to zoom in or zoom out<li></ul>",
                    placement: "right",
                    backdrop: true,
                    backdropPadding: 10
                },
                {
                    element: ".materialSelect",
                    title: "Select Material",
                    content: "Use the select box to switch materials. The graph, \n\
                            bar chart, text description and map change accordingly",
                    placement: "bottom",
                    backdrop: true,
                    backdropPadding: 10
                },
                {
                    element: "#filters",
                    title: "Graph Legend",
                    content: "<p>This shows the legend of the graph.</p><p>You can <ul><li>Click on the\n\
                            circular icons to remove the emphasis on any of the \n\
                            pollutants (i.e. changes its line color on the \n\
                            graph to grey)</li> \n\
                            <li>Mouseover the text of the legend to display\n\
                            additional description</li></ul></p>",
                    placement: "left",
                    backdrop: true,
                    backdropPadding: 10
                },
                {
                    element: "#infoBox",
                    title: "Info Box",
                    content: "This contains a detailed description of the \n\
                            selected pollutant",
                    placement: "top",
                    backdrop: true,
                    backdropPadding: 10
                },
                {
                    element: "#barChart",
                    title: "Bar Chart",
                    content: "Expanation of what bar char does",
                    placement: "top",
                    backdrop: true,
                    backdropPadding: 10
                },
                {
                    element: ".map",
                    title: "Map",
                    content: "Expanation of what the map shows",
                    placement: "top",
                    backdrop: true,
                    backdropPadding: 10
                }
            ]
        });

        // Initialize the tour
        tour.init();

        // Start the tour
        tour.start();
    }

    return{
        init: init
    };
});