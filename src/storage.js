// =========================
// SAVE STATE
// =========================

export function save(state) {

    localStorage.setItem(
        "golf",
        JSON.stringify(state)
    );
}