import { useState, useEffect, useRef } from 'react';
import { FaQuestionCircle, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaChevronDown, FaChevronUp, FaLightbulb, FaBug, FaQuoteLeft, FaTimesCircle } from 'react-icons/fa';
import { MdNoteAlt, MdErrorOutline } from 'react-icons/md';
import { BiAbacus } from 'react-icons/bi';
import { AiOutlineExperiment } from 'react-icons/ai';

const icons = {
  note: <MdNoteAlt className="callout-icon" />,
  abstract: <BiAbacus className="callout-icon" />,
  info: <FaInfoCircle className="callout-icon" />,
  tip: <FaLightbulb className="callout-icon" />,
  success: <FaCheckCircle className="callout-icon" />,
  question: <FaQuestionCircle className="callout-icon" />,
  warning: <FaExclamationTriangle className="callout-icon" />,
  fail: <FaTimesCircle className="callout-icon" />,
  error: <MdErrorOutline className="callout-icon" />,
  bug: <FaBug className="callout-icon" />,
  example: <AiOutlineExperiment className="callout-icon" />,
  quote: <FaQuoteLeft className="callout-icon" />,
  faq: <FaQuestionCircle className="callout-icon" />,
};

export default function Callout({ children, type, title, isCollapsible, isInitiallyOpen }) {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen !== undefined ? isInitiallyOpen : !isCollapsible);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
        contentRef.current.style.opacity = '1';
        contentRef.current.style.visibility = 'visible';
      } else {
        contentRef.current.style.maxHeight = '0';
        contentRef.current.style.opacity = '0';
        contentRef.current.style.visibility = 'hidden';
      }
    }
  }, [isOpen]);

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
          <span className={`callout-toggle ${isOpen ? 'rotate-180' : ''}`}>
            <FaChevronDown />
          </span>
        )}
      </div>
      <div ref={contentRef} className={`callout-content ${isOpen ? 'open' : ''}`}>
        {typeof children === 'string' ? <p>{children}</p> : children}
      </div>
    </div>
  );
}
