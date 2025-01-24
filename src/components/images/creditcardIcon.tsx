import Image from "next/image"
import creditcardIcon from "/public/images/paymentMethodIcon/creditcardIcon.png"

const CreditcardIcon = () => {
  return (
    <div>
      <Image
        className="mr-1"
        src={creditcardIcon}
        alt="CreditCard method"
        width={20}
        height={20}
      />
    </div>
  )
}

export default CreditcardIcon
