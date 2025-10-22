export const initialStore=()=>{
  return{
    isAuth: !!localStorage.getItem("user"),
    user: JSON.parse(localStorage.getItem("user")) || null
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){

    case "logout":
      return {
        ...store,
        isAuth: false,
        user: null,
      };
    case "auth":
      return {
        ...store,
        isAuth: true,
        user: action.payload.user,
      };
      
    default:
      throw Error('Unknown action.');
  }    
}
