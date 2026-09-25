import React from "react";

function HeaderForm({ title }) {
  return (
    <h1 className="bg-pink-500 text-2xl font-bold -rotate-2 py-2 px-4 shadow shadow-[-6px_6px_rgba(0,0,0,255)] absolute -left-3">
      {title}
    </h1>
  );
}

export default HeaderForm;
