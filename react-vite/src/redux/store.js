import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import watchlistReducer from "./watchlist";
import animeReducer from "./anime";
import followsReducer from "./follows";
import otherUserReducer from "./otherUser";
import imagesReducer from "./images";

const rootReducer = combineReducers({
  session: sessionReducer,
  watchlists: watchlistReducer,
  anime: animeReducer,
  follows: followsReducer,
  otherUser: otherUserReducer,
  images: imagesReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;

//

//! ORIGINAL CODE ABOVE

// import {
//   legacy_createStore as createStore,
//   applyMiddleware,
//   compose,
//   combineReducers,
// } from "redux";
// import thunk from "redux-thunk";
// // Import the logger directly in development
// // Vite will tree-shake this for production builds
// import { createLogger } from "redux-logger";
// import sessionReducer from "./session";
// import watchlistReducer from "./watchlist";

// const rootReducer = combineReducers({
//   session: sessionReducer,
//   watchlists: watchlistReducer
// });

// const configureStore = (preloadedState) => {
//   // Base middleware - always include thunk
//   const middlewares = [thunk];

//   // Determine environment
//   const isProduction = import.meta.env.MODE === "production";

//   // Only add logger in development
//   if (!isProduction) {
//     // Configure redux-logger with proper options
//     const logger = createLogger({
//       collapsed: true,
//       diff: true, // Show the diff between states
//       // Ensure full action and state logging
//       actionTransformer: action => action,
//       stateTransformer: state => state,
//       // Use the detailed formatter
//       logger: console,
//       // Don't log these actions (optional)
//       predicate: (getState, action) => !action.type.includes('@@redux')
//     });

//     middlewares.push(logger);
//   }

//   // Apply appropriate enhancers
//   let enhancer;
//   if (!isProduction && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
//     // Development with Redux DevTools
//     const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//     enhancer = composeEnhancers(applyMiddleware(...middlewares));
//   } else {
//     // Production or development without DevTools
//     enhancer = applyMiddleware(...middlewares);
//   }

//   return createStore(rootReducer, preloadedState, enhancer);
// };

// export default configureStore;
