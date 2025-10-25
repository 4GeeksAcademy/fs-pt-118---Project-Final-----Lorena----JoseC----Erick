export const initialStore = () => {
  return {
    isAuth: !!localStorage.getItem("user"),
    user: JSON.parse(localStorage.getItem("user")) || null,
    activeGroup: null,
    editMode: false,
    groups: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
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
    case "toggleGroup":
      return {
        ...store,
        activeGroup: action.payload.group,
      };
      case "removeGroup":
      return {
        ...store,
        groups: store.groups.filter(g => g.id !== action.payload),
      };
    case "setEditMode":
      return {
        ...store,
        editMode: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}
