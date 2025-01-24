import Image from "next/image"
import tropicardIcon from "/public/images/paymentMethodIcon/tropicardIcon.png"

const TropicardIcon = () => {
  return (
    <div>
      <Image
        className="mr-1"
        src={tropicardIcon}
        alt="TropiCard method"
        width={20}
        height={20}
      />
    </div>
  )
}

export default TropicardIcon
