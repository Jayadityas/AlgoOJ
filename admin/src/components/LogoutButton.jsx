import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const LogoutButton = ({ onLogout }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        className="w-full sm:w-auto px-5 py-2 font-semibold rounded-lg bg-gradient-to-r from-[#2ef31d] via-[#241df3] to-[#f31df2] text-white hover:scale-105 transition-all duration-300 shadow-md text-sm sm:text-base"
      >
        Logout
      </button>
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          onLogout();
          setShowConfirmation(false);
        }}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
      />
    </>
  );
};

export default LogoutButton;