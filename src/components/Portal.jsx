import ReactDOM from 'react-dom';
import {useEffect, useState} from 'react';

export default function Portal({children}) {
  const [element] = useState(() => document.createElement('div'));
  useEffect(() => {
    document.body.appendChild(element);
    return () => {
      document.body.removeChild(element);
    };
  }, []);

  return ReactDOM.createPortal(children, element);
}
