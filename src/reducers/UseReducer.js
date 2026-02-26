// src/reducers/UseReducer.js

export const initialState = null;

export const reducer = (state, action) => {
    if (action.type === "USER") {
        localStorage.setItem("user", JSON.stringify(action.payload));
        return action.payload; // This updates the state
    }
    if (action.type === "LOGOUT") {
        localStorage.removeItem("user");
        return null; // This updates the state
    }
    if (action.type === "LOAD_USER") {
        try {
            const user = localStorage.getItem("user");
            if (user && user !== "undefined" && user !== "null") {
                return JSON.parse(user); // This updates the state
            }
            return null; // This updates the state
        } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("user");
            return null; // This updates the state
        }
    }
    return state;
}