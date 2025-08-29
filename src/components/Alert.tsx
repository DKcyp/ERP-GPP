import React from 'react';
import { AlertItem } from '../types';

interface AlertProps extends Omit<AlertItem, 'onAction'> {
  onActionClick: () => void;
  onCloseClick: () => void;
}

const Alert: React.FC<AlertProps> = ({ id, message, type, actionText = 'Kerjakan', onActionClick, onCloseClick }) => {
  let bgColorClass = 'bg-primary'; // Default to primary
  let actionButtonClass = 'bg-primary hover:bg-primary/90 text-white';
  let closeButtonClass = 'bg-gray-500 hover:bg-gray-600 text-white';

  if (type === 'error') {
    bgColorClass = 'bg-error';
    actionButtonClass = 'bg-white hover:bg-gray-100 text-error';
    closeButtonClass = 'bg-error/80 hover:bg-error/70 text-white';
  } else if (type === 'success') {
    bgColorClass = 'bg-success';
    actionButtonClass = 'bg-white hover:bg-gray-100 text-success';
    closeButtonClass = 'bg-success/80 hover:bg-success/70 text-white';
  } else if (type === 'info') { // For the blue alerts as per user image
    bgColorClass = 'bg-secondary'; // Use secondary color for info alerts
    actionButtonClass = 'bg-white hover:bg-gray-100 text-secondary'; // White button, secondary text
    closeButtonClass = 'bg-secondary/80 hover:bg-secondary/70 text-white';
  }
  // If type is 'primary', it will use the default classes

  return (
    <div className={`${bgColorClass} text-white p-4 rounded-lg shadow-lg flex flex-col space-y-3 w-full`}>
      <p className="text-sm font-medium">{message}</p>
      <div className="flex space-x-2 justify-end">
        <button
          onClick={onActionClick}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${actionButtonClass}`}
        >
          {actionText}
        </button>
        <button
          onClick={onCloseClick}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${closeButtonClass}`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Alert;
