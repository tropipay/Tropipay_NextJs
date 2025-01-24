import Image from "next/image"
import giftcardIcon from "/public/images/paymentMethodIcon/giftcardIcon.png"

const GiftcardIcon = () => {
  return (
    <div>
      <Image
        className="mr-1"
        src={giftcardIcon}
        alt="GiftCard method"
        width={20}
        height={20}
      />
    </div>
  )
}

export default GiftcardIcon
