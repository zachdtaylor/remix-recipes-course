import React from "react";
import ReactModal from "react-modal";

if (typeof window !== "undefined") {
  ReactModal.setAppElement("#root");
}

export default function UpdateMealPlan() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <ReactModal isOpen={isOpen}>
      <div>hello</div>
    </ReactModal>
  );
}
