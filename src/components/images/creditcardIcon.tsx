import React from "react"

interface CreditcardIconProps {
  color?: string
  size?: number
}

const CreditcardIcon: React.FC<CreditcardIconProps> = ({
  color = "#39365B",
  size = 24,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 6.75V17.25C21 17.7199 20.8348 18.1291 20.5043 18.4774C20.1738 18.8258 19.7766 19 19.3125 19H4.6875C4.23437 19 3.83984 18.8258 3.50391 18.4774C3.16797 18.1291 3 17.7199 3 17.25V6.75C3 6.28009 3.16797 5.87095 3.50391 5.52257C3.83984 5.17419 4.23437 5 4.6875 5H19.3125C19.7766 5 20.1738 5.17419 20.5043 5.52257C20.8348 5.87095 21 6.28009 21 6.75ZM4.6875 9.66667H19.3125V6.75H4.6875V9.66667ZM4.6875 12V17.25H19.3125V12H4.6875Z"
        fill={color}
      />
    </svg>
  )
}

export default CreditcardIcon
