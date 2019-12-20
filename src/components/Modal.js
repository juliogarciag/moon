import React from "react";
import ReactModal from "react-modal";

function Modal({ showModal, setShowModal, children }) {
  return (
    <ReactModal
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      style={{
        overlay: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%"
        },
        content: {
          position: "static",
          width: "fit-content",
          height: "800px"
        }
      }}
    >
      {children}
    </ReactModal>
  );
}

export default Modal;
