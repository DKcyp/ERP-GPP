import React from 'react';
import { AlertItem } from '../types';

interface AlertProps extends Omit<AlertItem, 'onAction'> {
  onActionClick: () => void;
  onCloseClick: () => void;
}

const Alert: React.FC<AlertProps> = ({ id, message, type, actionText = 'Kerjakan', onActionClick, onCloseClick }) => {
  const bgColorClass = type === 'error' ? 'bg-error' : type === 'success' ? 'bg-success' : 'bg-primary';

  return (
    <div className={`${bgColorClass} text-white p-4 rounded-lg shadow-lg flex flex-col space-y-3 w-full`}>
      <p className="text-sm font-medium">{message}</p>
      <div className="flex space-x-2 justify-end">
        <button
          onClick={onActionClick}
          className="px-3 py-1.5 rounded-md bg-primary hover:bg-primary/90 text-white text-xs font-medium transition-colors duration-200"
        >
          {actionText}
        </button>
        <button
          onClick={onCloseClick}
          className="px-3 py-1.5 rounded-md bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Alert;
