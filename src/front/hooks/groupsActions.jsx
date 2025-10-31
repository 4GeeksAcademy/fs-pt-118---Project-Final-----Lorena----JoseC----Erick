export const removeGroupAndCleanup = (dispatch, store, groupId) => {
  dispatch({ type: "removeGroup", payload: groupId });

  if (store.activeGroup?.id === groupId) {
    dispatch({ type: "toggleGroup", payload: { group: null } });
    dispatch({ type: "setEditMode", payload: false });
  }
};
