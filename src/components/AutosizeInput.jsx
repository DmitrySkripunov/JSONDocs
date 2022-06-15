/*
  Fork of https://github.com/JedWatson/react-input-autosize
*/

import React from 'react';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';

const sizerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'hidden',
  height: 0,
  overflow: 'scroll',
  whiteSpace: 'pre'
};

const INPUT_PROPS_BLACKLIST = [
  'extraWidth',
  'injectStyles',
  'inputClassName',
  'inputRef',
  'inputStyle',
  'minWidth',
  'onAutosize',
  'placeholderIsMinWidth'
];

const cleanInputProps = inputProps => {
  INPUT_PROPS_BLACKLIST.forEach(field => delete inputProps[field]);
  return inputProps;
};

const copyStyles = (styles, node) => {
  node.style.fontSize = styles.fontSize;
  node.style.fontFamily = styles.fontFamily;
  node.style.fontWeight = styles.fontWeight;
  node.style.fontStyle = styles.fontStyle;
  node.style.letterSpacing = styles.letterSpacing;
  node.style.textTransform = styles.textTransform;
};

export default function AutosizeInput(props) {
  const [inputWidth, setInputWidth]   = useState(props.minWidth);

  const inputRef = useRef(null);
  const sizerRef = useRef(null);
  const placeHolderSizerRef = useRef(null);

  useEffect(() => {
    copyInputStyles();
    updateInputWidth();
  }, []);

  useLayoutEffect(() => {
    updateInputWidth();
  });

  const copyInputStyles = () => {
	  if (!window.getComputedStyle) {
	    return;
	  }
	  const inputStyles = inputRef.current && window.getComputedStyle(inputRef.current);
	  if (!inputStyles) {
	    return;
	  }
	  copyStyles(inputStyles, sizerRef.current);
	  if (placeHolderSizerRef.current) {
	    copyStyles(inputStyles, placeHolderSizerRef.current);
	  }
  };

  const updateInputWidth = () => {
	  if (!sizerRef.current || typeof sizerRef.current.scrollWidth === 'undefined') {
	    return;
	  }

	  let newInputWidth;
	  if (props.placeholder && (!props.value || (props.value && props.placeholderIsMinWidth))) {
	    newInputWidth = Math.max(sizerRef.current.scrollWidth, placeHolderSizerRef.current.scrollWidth) + 2;
	  } else {
	    newInputWidth = sizerRef.current.scrollWidth + 2;
	  }

	  // add extraWidth to the detected width. for number types, this defaults to 16 to allow for the stepper UI
	  const extraWidth = (props.type === 'number' && props.extraWidth === undefined)
	    ? 16 : parseInt(props.extraWidth) || 0;
	  newInputWidth += extraWidth;
	  if (newInputWidth < props.minWidth) {
	    newInputWidth = props.minWidth;
	  }
	  if (newInputWidth !== inputWidth) {
      setInputWidth(newInputWidth);
	  }
  };

  const sizerValue = [props.defaultValue, props.value, ''].reduce((previousValue, currentValue) => {
    if (previousValue !== null && previousValue !== undefined) {
      return previousValue;
    }
    return currentValue;
  });

  const wrapperStyle = {...props.style};
  if (!wrapperStyle.display) wrapperStyle.display = 'inline-block';

  const inputStyle = {
    boxSizing: 'content-box',
    width: `${inputWidth}px`,
    ...props.inputStyle
  };

  const {...inputProps} = props;
  cleanInputProps(inputProps);
  inputProps.className = props.inputClassName;
  //inputProps.id = props;
  inputProps.style = inputStyle;

  return (
    <div className={props.className} style={wrapperStyle}>
      <input {...inputProps} ref={inputRef} />
      <div ref={sizerRef} style={sizerStyle}>{sizerValue}</div>
      {props.placeholder
        ? <div ref={placeHolderSizerRef} style={sizerStyle}>{props.placeholder}</div>
        : null
      }
    </div>
  );
}
