import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"

const DynamicForm: React.FC<DynamicFormProps> = ({
  formDefinition,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>(() => {
    return formDefinition.fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue ?? ""
      return acc
    }, {} as FormData)
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPasswords, setShowPasswords] = useState<{
    [key: string]: boolean
  }>({})

  const validateField = (field: FormField, value: any): string | null => {
    if (!field.validate) return null

    for (const rule of field.validate) {
      if (rule.required && !value) {
        return rule.message
      }
      if (!value && !rule.required) continue

      if (typeof value === "string") {
        if (rule.minLength && value.length < rule.minLength) {
          return rule.message
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          return rule.message
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          return rule.message
        }
      }

      if (field.type === "number" && typeof value === "string") {
        const numValue = Number(value)
        if (rule.min !== undefined && numValue < rule.min) {
          return rule.message
        }
        if (rule.max !== undefined && numValue > rule.max) {
          return rule.message
        }
      }

      if (rule.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return rule.message
        }
      }

      if (rule.password) {
        if (rule.password.requireNumbers && !/\d/.test(value)) {
          return rule.message
        }
        if (
          rule.password.requireSpecialChars &&
          !/[!@#$%^&*(),.?":{}|<>]/.test(value)
        ) {
          return rule.message
        }
        if (rule.password.requireUppercase && !/[A-Z]/.test(value)) {
          return rule.message
        }
        if (rule.password.requireLowercase && !/[a-z]/.test(value)) {
          return rule.message
        }
      }
    }

    return null
  }

  const validateCrossFields = (): FormErrors => {
    const crossFieldErrors: FormErrors = {}

    formDefinition.crossFieldValidations?.forEach((validation) => {
      const relevantValues = validation.fields.reduce(
        (acc, fieldName) => ({
          ...acc,
          [fieldName]: formData[fieldName],
        }),
        {}
      )

      const error = validation.validate(relevantValues)
      if (error) {
        validation.fields.forEach((fieldName) => {
          crossFieldErrors[fieldName] = error
        })
      }
    })

    return crossFieldErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const fieldErrors: FormErrors = {}
    formDefinition.fields.forEach((field) => {
      const error = validateField(field, formData[field.name])
      if (error) {
        fieldErrors[field.name] = error
      }
    })

    const crossFieldErrors = validateCrossFields()
    const combinedErrors = { ...fieldErrors, ...crossFieldErrors }

    setErrors(combinedErrors)

    if (Object.keys(combinedErrors).length === 0) {
      onSubmit(formData)
    }
  }

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    const field = formDefinition.fields.find((f) => f.name === name)
    if (field) {
      const error = validateField(field, value)
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }
  }

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      placeholder: field.placeholder,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => handleChange(field.name, e.target.value),
      value: (formData[field.name] as string) || "",
      className: errors[field.name] ? "border-red-500" : "",
    }

    const fieldWrapper = (children: React.ReactNode) => (
      <div key={field.name} className="space-y-2">
        <label
          htmlFor={field.name}
          className="block text-sm font-medium text-gray-700"
        >
          {field.label}
          {field.validate?.some((rule) => rule.required) && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
        {children}
        {errors[field.name] && (
          <Alert variant="destructive" className="mt-1">
            <AlertDescription>{errors[field.name]}</AlertDescription>
          </Alert>
        )}
      </div>
    )

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return fieldWrapper(<Input type={field.type} {...commonProps} />)

      case "password":
        return fieldWrapper(
          <div className="relative">
            <Input
              type={showPasswords[field.name] ? "text" : "password"}
              {...commonProps}
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => togglePasswordVisibility(field.name)}
            >
              {showPasswords[field.name] ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </Button>
          </div>
        )

      case "date":
        return fieldWrapper(
          <Input
            type="date"
            {...commonProps}
            value={formData[field.name] ? String(formData[field.name]) : ""}
          />
        )

      case "textarea":
        return fieldWrapper(<Textarea {...commonProps} />)

      case "select":
        return fieldWrapper(
          <Select
            onValueChange={(value) => handleChange(field.name, value)}
            value={formData[field.name] as string}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "checkbox":
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={(formData[field.name] as boolean) || false}
              onCheckedChange={(checked) =>
                handleChange(field.name, checked as boolean)
              }
            />
            <label
              htmlFor={field.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
              {field.validate?.some((rule) => rule.required) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
          </div>
        )
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {formDefinition.fields.map(renderField)}
        <Button type="submit" className="w-full">
          {formDefinition.submitText || "Enviar"}
        </Button>
      </form>
    </Card>
  )
}

export default DynamicForm
