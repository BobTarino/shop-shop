import React, { createContext, useContext } from "react";
import { useProductReducer } from './reducers';

// instantiate global state object
const StoreContext = createContext();
// provider is a special type of react component that we wrap our app in so state data passed into prop is available to all other components
const { Provider } = StoreContext;

// StoreProvider is a custom <Provider> component - set up to accept props, manage state, and provide state to rest of components
// instantiate initial global state with useProductReducer()
const StoreProvider = ({ value = [], ...props }) => {
    // useProductReducer() provides us with up-to-date global state object and dispatch - method for that executes to update state
    const [state, dispatch] = useProductReducer({
      products: [],
      categories: [],
      currentCategory: '',
    });
    // use this to confirm it works!
    console.log(state);
    return <Provider value={[state, dispatch]} {...props} />;
};

// custom React Hook - receives the [state, dispatch] data provided by StoreProvider
// any component with access to StoreProvider can use any data in global state object
const useStoreContext = () => {
    return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
