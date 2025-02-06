type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "date"
  | "password"

interface SelectOption {
  value: string
  label: string
}

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  min?: number
  max?: number
  email?: boolean
  password?: {
    requireNumbers?: boolean
    requireSpecialChars?: boolean
    requireUppercase?: boolean
    requireLowercase?: boolean
  }
  message: string
}

interface FormField {
  name: string
  type: FieldType
  label: string
  placeholder?: string
  options?: SelectOption[]
  defaultValue?: string | boolean
  validate?: ValidationRule[]
}

interface FormDefinition {
  fields: FormField[]
  submitText?: string
}

interface FormErrors {
  [key: string]: string | null
}

interface FormData {
  [key: string]: string | boolean | Date | null
}

interface DynamicFormProps {
  formDefinition: FormDefinition
  onSubmit: (data: FormData) => void
}

interface CrossFieldValidation {
  fields: string[]
  validate: (values: { [key: string]: any }) => string | null
}

interface FormDefinition {
  fields: FormField[]
  crossFieldValidations?: CrossFieldValidation[]
  submitText?: string
}
