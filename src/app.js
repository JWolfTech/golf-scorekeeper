// =========================
// GOLF APP V3
// =========================

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

// SCORECARD TOGGLE
let showScorecard = false;

// =========================
// SAVE STATE
// =========================

function save() {

    localStorage.setItem(
        "golf",
        JSON.stringify(state)
    );
}

// =========================
// COURSE FUNCTIONS
// =========================

function currentPar() {

    if (!state.currentCourse) {
        return 4;
    }

    return state.currentCourse.pars[state.hole];
}

function selectCourse(index) {

    state.currentCourse = state.courses[index];

    save();
    render();
}

function removeCourse(index) {

    let confirmDelete = confirm(
        `Delete ${state.courses[index].name}?`
    );

    if (!confirmDelete) return;

    state.courses.splice(index, 1);

    if (
        state.currentCourse === state.courses[index]
    ) {
        state.currentCourse = null;
    }

    save();

    render();
}

function createCourse() {

    let name = prompt("Course Name");

    if (!name) return;

    let holeCount = prompt(
        "How many holes? (9 or 18)",
        "18"
    );

    holeCount = parseInt(holeCount);

    if (holeCount !== 9 && holeCount !== 18) {
        alert("Please enter 9 or 18");
        return;
    }

    let pars = [];

    for (let i = 1; i <= holeCount; i++) {

        let par = prompt(
            `Par for Hole ${i}`,
            "4"
        );

        pars.push(parseInt(par) || 4);
    }

    let course = {
        name,
        holes: holeCount,
        pars
    };

    state.courses.push(course);

    state.currentCourse = course;

    save();

    render();
}
// =========================
// ROUND FUNCTIONS
// =========================

function startRound() {

 state.holes = state.currentCourse
    ? state.currentCourse.holes
    : 18;
  state.scores = state.players.map(() =>
      Array(
          state.currentCourse
              ? state.currentCourse.holes
              : 18
          ).fill(0) 
    );

    state.hole = 0;

    state.screen = "score";

    save();

    render();
}

function updateScore(playerIndex, delta) {

    if (!state.scores[playerIndex]) {
        return;
    }

    state.scores[playerIndex][state.hole] += delta;

    if (state.scores[playerIndex][state.hole] < 0) {
        state.scores[playerIndex][state.hole] = 0;
    }

    save();

    render();
}

function removePlayer(index) {

    if (state.players.length <= 1) {

        alert("At least one player required");

        return;
    }

    state.players.splice(index, 1);

    save();

    render();
}

function nextHole() {

    if (state.hole < state.holes - 1) {
        state.hole++;
    }

    save();

    render();
}

function prevHole() {

    if (state.hole > 0) {
        state.hole--;
    }

    save();

    render();
}

// =========================
// TOTALS
// =========================

function total(playerIndex) {

    if (!state.scores[playerIndex]) {
        return 0;
    }

    return state.scores[playerIndex]
        .reduce((a, b) => a + b, 0);
}

function totalPar() {

    if (!state.currentCourse) {
        return 72;
    }

    return state.currentCourse.pars
        .reduce((a, b) => a + b, 0);
}

function playedPar() {

    if (!state.currentCourse) {
        return 0;
    }

    return state.currentCourse.pars
        .slice(0, state.hole + 1)
        .reduce((a, b) => a + b, 0);
}
function totalVsPar(playerIndex) {

    const playedAnyHole =
        state.scores[playerIndex].some(score => score > 0);

    if (!playedAnyHole) {
        return "";
    }

    let diff = total(playerIndex) - playedPar();

    if (diff === 0) {
        return "E";
    }

    if (diff > 0) {
        return `+${diff}`;
    }

    return `${diff}`;
}

function segmentTotal(playerIndex, start, end) {

    if (!state.scores[playerIndex]) {
        return 0;
    }

    return state.scores[playerIndex]
        .slice(start, end)
        .reduce((a, b) => a + b, 0);
}

// =========================
// SCORE COLORS
// =========================

function scoreColor(score, par) {

    let diff = score - par;

    if (diff <= -1) {
        return "green";
    }

    if (diff === 0) {
        return "";
    }

    if (diff === 1) {
        return "orange";
    }

    return "red";
}

// =========================
// SCORECARD TOGGLE
// =========================

function toggleScorecard() {

    showScorecard = !showScorecard;

    render();
}

// =========================
// SUMMARY
// =========================

function showSummary() {

    state.screen = "summary";

    render();
}

function backToRound() {

    state.screen = "score";

    render();
}

// =========================
// SAVE COMPLETED ROUND
// =========================

function saveCompletedRound() {

    let round = {

        date: new Date().toLocaleDateString(),

        course: state.currentCourse
            ? state.currentCourse.name
            : "Unknown",

        players: [...state.players],

        scores: JSON.parse(
            JSON.stringify(state.scores)
        )
    };

    state.savedRounds.push(round);

    save();
}

// =========================
// END ROUND
// =========================

function endRound() {

    saveCompletedRound();

    state.screen = "setup";

    state.players = ["Jeff", "Sandy"];

    state.scores = [];

    state.hole = 0;

    state.currentCourse = null;

    save();

    render();
}

// =========================
// RENDER
// =========================

function render() {

    const app = document.getElementById("app");

    // =====================
    // SETUP SCREEN
    // =====================

    if (state.screen === "setup") {

        app.innerHTML = `

            <div class="container">

                <h2>New Round</h2>

                <div class="card">

                    <h3>Select Course</h3>

${state.courses.map((course, i) => `

 <div style="
    display:flex;
    gap:8px;
    margin-bottom:10px;
">

    <button
        class="primary"
        style="flex:1;"
        onclick="selectCourse(${i})"
    >
        ${course.name}
    </button>

    <button
        onclick="removeCourse(${i})"
    >
      🗑
    </button>

</div>
`).join("")}

                    <button
                        class="expand-btn"
                        onclick="createCourse()"
                    >
                        + Add Course
                    </button>

                </div>

                <div class="card">

                    <h3>Players</h3>

${state.players.map((player, i) => `

<div style="
    display:flex;
    gap:8px;
    margin-bottom:10px;
">

    <input
        style="flex:1;"
        value="${player}"
        onchange="
            state.players[${i}] = this.value;
            save();
        "
    >

    <button
        onclick="removePlayer(${i})"
    >
        🗑
    </button>

</div>

`).join("")}

<button
                        class="expand-btn"
                        onclick="
                            state.players.push('Player');
                            render();
                        "
                    >
                        + Add Player
                    </button>

                </div>

                <button
                    class="primary"
                    onclick="startRound()"
                >
                    Start Round
                </button>

            </div>
        `;
    }

    // =====================
    // SCORE SCREEN
    // =====================

    if (state.screen === "score") {

        app.innerHTML = `

            <div class="container">

                <div class="topbar">

                    <button onclick="endRound()">
                        End
                    </button>

                    <div>
                        <strong>
                            Hole ${state.hole + 1}
                        </strong>
                        <br>
                        Par ${currentPar()}
                    </div>

                    <button onclick="showSummary()">
                        Totals
                    </button>

                </div>

                ${state.players.map((player, i) => {

                    let score =
                        state.scores[i][state.hole];

                    return `

                        <div class="card">

                            <div class="player-name">
                                ${player}
                            </div>

                            <div class="score-row">

                                <button
                                    class="score-btn"
                                    onclick="updateScore(${i}, -1)"
                                >
                                    −
                                </button>

                                <div class="
                                    score-display
                                    ${scoreColor(
                                        score,
                                        currentPar()
                                    )}
                                ">
                                    ${score}
                                </div>

                                <button
                                    class="score-btn"
                                    onclick="updateScore(${i}, 1)"
                                >
                                    +
                                </button>

                            </div>

 <div class="total">
    Total: ${total(i)}
    ${totalVsPar(i) ? `(${totalVsPar(i)})` : ""}
</div>
                        </div>
                    `;

                }).join("")}

                <div class="nav-row">

                    <button
                        class="nav-btn"
                        onclick="prevHole()"
                    >
                        ◀ Previous
                    </button>

                    <button
                        class="nav-btn"
                        onclick="nextHole()"
                    >
                        Next ▶
                    </button>

                </div>

                <button
                    class="expand-btn"
                    onclick="toggleScorecard()"
                >
                    ${showScorecard
                        ? "Hide Scorecard ▲"
                        : "Show Scorecard ▼"}
                </button>

                ${showScorecard ? `

                    <div class="scorecard">

                        <table>

                            <tr>

                                <th>Player</th>

                                ${Array.from(
                                    { length: state.holes },
                                    (_, h) =>
                                        `<th>${h + 1}</th>`
                                ).join("")}

                                <th>OUT</th>

                                <th>IN</th>

                                <th>Total</th>

                            </tr>

                            ${state.players.map((player, i) => `

                                <tr>

                                    <td>
                                        ${player}
                                    </td>

                                    ${state.scores[i].map(
                                        (score, h) => `

                                        <td class="
                                            ${scoreColor(
                                                score,
                                                state.currentCourse
                                                    ? state.currentCourse.pars[h]
                                                    : 4
                                            )}
                                        ">
                                            ${score}
                                        </td>

                                    `).join("")}

                                    <td>
                                        ${segmentTotal(i, 0, 9)}
                                    </td>

                                    <td>
                                        ${segmentTotal(i, 9, 18)}
                                    </td>

                                    <td>
                                        <strong>
                                            ${total(i)}
                                        </strong>
                                    </td>

                                </tr>

                            `).join("")}

                        </table>

                    </div>

                ` : ""}

            </div>
        `;
    }

    // =====================
    // SUMMARY SCREEN
    // =====================

    if (state.screen === "summary") {

        app.innerHTML = `

            <div class="container">

                <h2>Round Totals</h2>

                ${state.players.map((player, i) => `

                    <div class="card">

                        <div class="player-name">
                            ${player}
                        </div>

                        <div class="score-display">
                            ${total(i)}
                        </div>

                        <div class="total">
                            ${totalVsPar(i)}
                        </div>

                    </div>

                `).join("")}

                <button
                    class="primary"
                    onclick="backToRound()"
                >
                    Back To Round
                </button>

            </div>
        `;
    }
}

// =========================
// SWIPE SUPPORT
// =========================

let startX = 0;

document.addEventListener("touchstart", e => {

    startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {

    let dx =
        e.changedTouches[0].clientX - startX;

    if (dx > 80) {
        prevHole();
    }

    if (dx < -80) {
        nextHole();
    }
});

// =========================
// INITIAL RENDER
// =========================

render();