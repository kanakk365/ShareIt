import React from 'react'

export interface ButtonProp {
    variant:"primary" | "secondary";
    size:"sm"|"md"|"lg";
    text:string;
    startIcon?:any;
    endIcon?:any;
    onClick: ()=> void
}

function MyButton() {
  return (
    <div>MyButton</div>
  )
}

export default MyButton