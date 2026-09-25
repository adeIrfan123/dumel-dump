import Link from "next/link";
import React from "react";

function ButtonX() {
  return (
    <div className="flex justify-end px-8 pt-4 ">
      <Link href="/" className="text-3xl font-bold">
        X
      </Link>
    </div>
  );
}

export default ButtonX;
