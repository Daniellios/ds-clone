import React, { FC } from "react"

export enum Variant {
  Primary,
  Secondary,
}

type Props = {
  variant: Variant
  [key: string]: any
}

const Button: FC<Props> = ({ children, variant, ...props }) => {
  const varianColors = {
    [Variant.Primary]: "bg-blue-500 hover:bg-blue-400",
    [Variant.Secondary]: "bg-gray-500 hover:bg-gray-400",
  }

  return (
    <button
      {...props}
      className={`text-xl rounded p-2 text-white ${varianColors[variant]}`}
    >
      {children}
    </button>
  )
}

export default Button
