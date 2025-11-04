import React from "react";

// --- Avatares predefinidos ---
export const AVATAR_MAP = {
  "1": "https://i.pravatar.cc/240?img=12",
  "2": "https://i.pravatar.cc/240?img=2",
  "3": "https://i.pravatar.cc/240?img=3",
  "4": "https://i.pravatar.cc/240?img=4",
  "5": "https://i.pravatar.cc/240?img=5",
  "6": "https://i.pravatar.cc/240?img=6",
  "7": "https://i.pravatar.cc/240?img=7",
  "8": "https://i.pravatar.cc/240?img=8",
  "9": "https://i.pravatar.cc/240?img=9",
  "10": "https://i.pravatar.cc/240?img=10",
  "11": "https://i.pravatar.cc/240?img=23",
};

// --- Utilidad para deducir el número desde la URL ---
export const inferNumberFromUrl = (url) => {
  if (!url) return "5";
  const match = url.match(/img=(\d+)/);
  return match?.[1];
};

// --- Componente principal ---
const Avatar = ({ src, name, bgClass, size = 50 }) => {
  // Si hay una URL válida o una clave de avatar
  const resolvedSrc = AVATAR_MAP[src] || src;

  if (resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        alt={name || "User avatar"}
        className="rounded-circle object-fit-cover border border-light shadow-sm"
        style={{ width: size, height: size }}
      />
    );
  }

  // Si no hay imagen, mostramos iniciales
  const initials = (name || "U").trim().slice(0, 2).toUpperCase();

  const isLightBg =
    bgClass?.includes("warning") ||
    bgClass?.includes("light") ||
    bgClass?.includes("info") ||
    bgClass?.includes("secondary");

  const textColor = isLightBg ? "text-dark" : "text-white";

  return (
    <div
      className={`rounded-circle d-flex align-items-center justify-content-center ${bgClass || "bg-secondary"} ${textColor}`}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size / 2,
        fontWeight: "semibold",
      }}  
      aria-hidden="true"
    >
      {initials}
    </div>
  );
};

export default Avatar;
