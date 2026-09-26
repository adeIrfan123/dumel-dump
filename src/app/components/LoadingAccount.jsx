import React from "react";

function LoadingAccount() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-dumel-paper px-5"
      aria-busy="true"
    >
      <div
        role="status"
        aria-live="polite"
        className="rotate-[-2deg] border-4 border-black bg-white px-6 py-4 text-center font-black shadow-[6px_6px_0px_#000]"
      >
        LOADING ACCOUNT...
      </div>
    </main>
  );
}

export default LoadingAccount;
