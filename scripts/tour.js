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
                    content: "Content for graph",
                    placement: "top"
                },
                {
                    element: "#filters",
                    title: "Filters",
                    content: "Content for filters",
                    placement: "top"
                },
                {
                    element: "#infoBox",
                    title: "Info Box",
                    content: "Content for infobox",
                    placement: "top"
                },
                {
                    element: "#barChart",
                    title: "Bar Chart",
                    content: "Expanation of what bar char does",
                    placement: "top"
                },
                {
                    element: "#colorCodedMap svg",
                    title: "Map",
                    content: "Expanation of what the map shows",
                    placement: "top"
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