import React from "react";

const Avatar = ({ src, name }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name || "User avatar"}
        className="rounded-circle object-fit-cover"
        style={{ width: 36, height: 36 }}
      />
    );
  }

  const initials = (name || "U").trim().slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white"
      style={{ width: 36, height: 36, fontSize: 12, fontWeight: 700 }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
};

export default Avatar;
