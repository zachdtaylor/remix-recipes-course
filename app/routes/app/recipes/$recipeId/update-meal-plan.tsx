import ReactModal from "react-modal";

if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}

export default function UpdateMealPlanModal() {
  return <ReactModal isOpen>hello</ReactModal>;
}
