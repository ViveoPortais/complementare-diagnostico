import React from "react";

const Loading = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="animate-spin rounded-full h-11 w-11 border-t-2 border-b-2 border-blue"></div>
    </div>
  );
};

export default Loading;
