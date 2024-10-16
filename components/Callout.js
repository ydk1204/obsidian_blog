import { FaQuestionCircle, FaInfoCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const icons = {
  faq: <FaQuestionCircle className="callout-icon" />,
  info: <FaInfoCircle className="callout-icon" />,
  warning: <FaExclamationTriangle className="callout-icon" />,
  success: <FaCheckCircle className="callout-icon" />,
};

export default function Callout({ children, type }) {
  return (
    <div className={`callout callout-${type.toLowerCase()}`}>
      <div className="callout-header">
        <span className="callout-icon-wrapper">{icons[type.toLowerCase()]}</span>
        <span className="callout-title">{type.toUpperCase()}</span>
      </div>
      <div className="callout-content">{children}</div>
    </div>
  );
}