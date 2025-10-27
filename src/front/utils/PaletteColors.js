export const randomAvatarBg = () => {
  const palette = [
    "bg-primary", 
    "bg-success", 
    "bg-danger", 
    "bg-warning", 
    "bg-info", 
    "bg-dark", 
    "bg-secondary"];
  const i = Math.floor(Math.random() * palette.length);
  return palette[i];
};
