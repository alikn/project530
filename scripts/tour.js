define([], function () {

    function init() {
        $("#tour").on("click", displayTour);
        $("body").on("startTourEvent", displayTour);
    }

    function displayTour() {
        // Instance the tour
        var tour = new Tour({
            storage: false,
            steps: [
                {
                    element: ".materialSelect",
                    title: "Select Material",
                    content: "This is where you can select from the available pollutants. All the elements of the page show informattion about the selected material.\n\
                                <br>Go ahead and change it to another pollutant.",
                    placement: "bottom",
                    backdrop: true,
                    backdropPadding: 10
                },
                {
                    element: "#vis",
                    title: "Interactive Graph",
                    content: "This graph shows the pollutant emission vs. time for various sectors. Sectors are in different groups shown by different colors. \n\
                            <br>You can zoom in and out or drag the graph to find an interesting sector and then select it. \n\
                            <br>Selecting a new sector changes the bar chart below. \n\
                            <br>Go ahead and try it!",
                    placement: "right",
                    backdrop: true,
                    backdropPadding: 10
                },
                {
                    element: "#filters",
                    title: "Graph Legend",
                    content: "This is the legend for the graph. Hover over sector groups to see more info. Click on the circles to select/deselect them.",
                    placement: "left",
                    backdrop: true,
                    backdropPadding: 10
                },
                {
                    element: "#barChart",
                    title: "Bar Chart",
                    content: "We have more info about the sector you chose on the line graph above! This is where you can see about the latest data on how thatt sector does on other pollutants. \n\
                    <br> Go ahead and click on the bars and see what happens.",
                    placement: "top",
                    backdrop: true,
                    backdropPadding: 10
                },
                {
                    element: "#infoBox",
                    title: "Info Box",
                    content: "We know you want to know more about the pollutant you selected in the dropdown! That is why we have this info box! ",
                    placement: "top",
                    backdrop: true,
                    backdropPadding: 10
                },
                {
                    element: ".map",
                    title: "Pollutant WorldMap",
                    content: "So, how is Canada doing compared to other countries? Find out about it here!",
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