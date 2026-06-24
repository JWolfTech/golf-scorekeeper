// LOAD STATE
let state = JSON.parse(localStorage.getItem("golf")) || {

    screen: "setup",

    players: ["Jeff", "Sandy"],

    scores: [],

    hole: 0,

    holes: 18,

    currentCourse: null,

    courses: [

        {
            name: "Sample Course",
            pars: [4,4,3,5,4,4,3,5,4,4,3,4,5,4,4,3,5,4]
        }

    ],

    savedRounds: []
};
