import React, { memo, useRef, useLayoutEffect } from "react";
import usePrevious from "../../../hooks/usePrevious";

export const  SingleOTPInputComponent = (props) => {
    const { focus, autoFocus, ...rest } = props;
    const prevFocus = usePrevious(focus);
    const inputRef = useRef(null);

    useLayoutEffect(() => {
        if (inputRef.current) {
          if (focus && autoFocus) {
            inputRef.current.focus();
          }
          if (focus && autoFocus && focus !== prevFocus) {
            inputRef.current.focus();
            inputRef.current.select();
          }
        }
    }, [autoFocus,focus, prevFocus, inputRef]);

    return <input ref={inputRef} {...rest}/>;
}

const SingleOTPInput = memo(SingleOTPInputComponent);
export default SingleOTPInput;