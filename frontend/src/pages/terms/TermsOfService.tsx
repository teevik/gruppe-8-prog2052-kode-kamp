import { FC, useState } from "react";
import "./TermsOfService.css";

const TermsOfService: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAccept = () => {
    setIsModalOpen(false); // Close the modal
  };


  return (
    <div>
      <p onClick={() => setIsModalOpen(true)} className="termsButton">
        View Terms of Service
      </p>

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modal">
              <h1>Terms of Service</h1>
            <div className="termsOfServiceContent">
              <p>
                By using this application, you acknowledge that the code you
                write here is available for everyone to see and use. The code
                you write is not considered "yours" and may be accessed by other
                users of the platform.
              </p>
              <p>
                Please ensure that you do not include any private or sensitive
                information in your code.
              </p>
              <p>
                By using this application, you agree to abide by the terms of
                service.
              </p>
            </div>
            <div className="modalFooter">
              <button onClick={handleAccept} className="acceptButton">
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsOfService;