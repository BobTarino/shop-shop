import React, { useEffect } from 'react';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { useStoreContext } from "../../utils/GlobalState";
import { idbPromise } from '../../utils/helpers';


function CategoryMenu() {
  
  //query category data, store into global state object, and bring data to UI
  const [state, dispatch] = useStoreContext();

  const { categories } = state;
  
  // useQuery() hook destructured
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);
  
  // useEffect() hook notices CategoryData is not undefined anymore and runs the dispatch function
  // sets category data to global state when changed and when component loads
  useEffect(() => {
    // if categoryData exists or has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
      // but let's also take each category and save it to IndexedDB using the helper function 
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      // since we're offline, get all of the categores from the `category` store
      idbPromise('categories', 'get').then(categories => {
        // use retrieved data to set global state for offline browsing
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
