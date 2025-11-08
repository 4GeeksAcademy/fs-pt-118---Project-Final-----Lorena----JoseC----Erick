import React from "react";

const Avatar = ({
  src,               
  name = "User",    
  style = "initials",
  size = 50,
}) => {
  
  if (src && /^https?:\/\//.test(src)) {
    return (
      <img
        src={src}
        alt={name}
        className="rounded-circle object-fit-cover border border-light shadow-sm"
        style={{ width: size, height: size }}
      />
    );
  }

  // Si no tiene imagen personalizada, generamos el avatar DiceBear
  const seed = name.trim().replace(/\s+/g, "-").toLowerCase() || "user";

  // Si el usuario quiere el modo “clásico”, usamos el estilo “initials”
  const dicebearUrl = `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(seed)}&size=${size * 4}&radius=50`;

  return (
    <img
      src={dicebearUrl}
      alt={name}
      className="rounded-circle object-fit-cover border border-light shadow-sm"
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;
