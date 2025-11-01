export const initialStore = () => {
  return {
    isAuth: !!localStorage.getItem("user"),
    user: JSON.parse(localStorage.getItem("user")) || null,
    activeGroup: null,
    editMode: false,
    groups: {},
    userEvents: [],
    userGroups: [],
    comments: [],
    showGroupDetails: false,
    showGroupEditor: false,
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
        groups: store.groups.filter((g) => g.id !== action.payload),
      };

    case "setEditMode":
      return {
        ...store,
        editMode: action.payload,
      };
    case "setUserEvents":
      return {
        ...store,
        userEvents: action.payload,
      };

    case "setUserGroups":
      return {
        ...store,
        userGroups: action.payload,
      };

    case "setGroups":
      return {
        ...store,
        groups: action.payload,
      };

    default:
      throw Error("Unknown action.");

    case "setEventGroups":
      return {
        ...store,
        groups: {
          ...store.groups,
          [action.payload.eventId]: action.payload.groups,
        },
      };

    case "setEventComments":
      return {
        ...store,
        comments: {
          ...store.comments,
          [action.payload.eventId]: action.payload.comments,
        },
      };

    case "addEventComment":
      return {
        ...store,
        comments: {
          ...store.comments,
          [action.payload.eventId]: [
            ...(store.comments[action.payload.eventId] || []),
            action.payload.comment,
          ],
        },
      };

    case "updateEventComment":
      return {
        ...store,
        comments: {
          ...store.comments,
          [action.payload.eventId]: store.comments[action.payload.eventId].map(
            (c) =>
              c.id === action.payload.comment.id ? action.payload.comment : c
          ),
        },
      };

    case "deleteEventComment":
      return {
        ...store,
        comments: {
          ...store.comments,
          [action.payload.eventId]: store.comments[
            action.payload.eventId
          ].filter((c) => c.id !== action.payload.commentId),
        },
      };

    case "setShowGroupDetails":
      return {
        ...store,
        showGroupDetails: action.payload,
      };
    case "setShowGroupEditor":
      return {
        ...store,
        showGroupEditor: action.payload,
      };
      
  }
}
