import Image from "next/image"
import tropipayIcon from "/public/images/paymentMethodIcon/tropipayIcon.png"

const TropipayIcon = () => {
  return (
    <Image
      className="mr-1"
      src={tropipayIcon}
      alt="TropiPay method"
      width={20}
      height={20}
    />
  )
}

export default TropipayIcon
