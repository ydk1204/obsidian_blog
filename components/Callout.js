import { useState } from 'react';
import { FaQuestionCircle, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const icons = {
  faq: <FaQuestionCircle className="callout-icon" />,
  info: <FaInfoCircle className="callout-icon" />,
  warning: <FaExclamationTriangle className="callout-icon" />,
  success: <FaCheckCircle className="callout-icon" />,
};

export default function Callout({ children, type, title, isCollapsible }) {
  const [isOpen, setIsOpen] = useState(!isCollapsible);

  const toggleOpen = () => {
    if (isCollapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`callout callout-${type.toLowerCase()}`}>
      <div className="callout-header" onClick={toggleOpen}>
        <span className="callout-icon-wrapper">{icons[type.toLowerCase()]}</span>
        <span className="callout-title">{title}</span>
        {isCollapsible && (
          <span className="callout-toggle">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        )}
      </div>
      {isOpen && <div className="callout-content">{children}</div>}
    </div>
  );
}
