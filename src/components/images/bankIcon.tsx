import Image from "next/image"
import bankIcon from "/public/images/paymentMethodIcon/bankIcon.png"

const BankIcon = () => {
  return (
    <div>
      <Image
        className="mr-1"
        src={bankIcon}
        alt="Bank method"
        width={20}
        height={20}
      />
    </div>
  )
}

export default BankIcon
