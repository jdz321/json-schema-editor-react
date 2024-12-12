import { Input, InputProps } from 'antd';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

export default function ComposiableInput(props: InputProps) {
  const compositing = useRef(false);
  const [innerVal, setInnerVal] = useState(props.value);
  useEffect(() => {
    setInnerVal(props.value);
  }, [props.value]);
  const onChange: InputProps['onChange'] = (e) => {
    if (compositing.current) {
      setInnerVal(e.target.value);
    } else {
      props.onChange?.(e);
    }
  };
  return (
    <Input
      {...props}
      value={innerVal}
      onChange={onChange}
      onCompositionStart={() => {
        compositing.current = true;
      }}
      onCompositionEnd={(e) => {
        compositing.current = false;
        props.onChange?.(e as unknown as ChangeEvent<HTMLInputElement>);
      }}
    />
  );
}
