import * as React from "react"

const CreditcardIcon = ({
  width = "20",
  height = "20",
  color = "#39365B",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <mask
      id="mask0_1990_38070"
      width="20"
      height="20"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
      style={{ maskType: "alpha" }}
    >
      <path fill="#D9D9D9" d="M0 0h20v20H0z"></path>
    </mask>
    <g mask="url(#mask0_1990_38070)">
      <path
        fill={color}
        d="M18 5.5v9q0 .605-.44 1.052A1.43 1.43 0 0 1 16.5 16h-13a1.44 1.44 0 0 1-1.052-.448A1.44 1.44 0 0 1 2 14.5v-9q0-.604.448-1.052A1.44 1.44 0 0 1 3.5 4h13q.62 0 1.06.448.44.449.44 1.052M3.5 8h13V5.5h-13zm0 2v4.5h13V10z"
      ></path>
    </g>
  </svg>
)

export default CreditcardIcon
