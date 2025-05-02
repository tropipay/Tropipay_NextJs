"use client"
import DynamicForm from "@/components/DynamicForm"

const MyPage: React.FC = () => {
  const formConfig: FormDefinition = {
    fields: [
      {
        name: "nombre",
        type: "text",
        label: "Nombre",
        placeholder: "Tu nombre",
        validate: [
          { required: true, message: "El nombre es requerido" },
          {
            minLength: 3,
            message: "El nombre debe tener al menos 3 caracteres",
          },
          {
            maxLength: 50,
            message: "El nombre no puede exceder los 50 caracteres",
          },
        ],
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "correo@ejemplo.com",
        validate: [
          { required: true, message: "El email es requerido" },
          { email: true, message: "Ingresa un email válido" },
        ],
      },
      {
        name: "edad",
        type: "number",
        label: "Edad",
        validate: [
          { required: true, message: "La edad es requerida" },
          { min: 18, message: "Debes ser mayor de edad" },
          { max: 100, message: "Edad inválida" },
        ],
      },
      {
        name: "password",
        type: "password",
        label: "Contraseña",
        validate: [
          { required: true, message: "La contraseña es requerida" },
          {
            minLength: 8,
            message: "La contraseña debe tener al menos 8 caracteres",
          },
          {
            password: {
              requireNumbers: true,
              requireSpecialChars: true,
              requireUppercase: true,
            },
            message:
              "La contraseña debe contener números, caracteres especiales y mayúsculas",
          },
        ],
      },
      {
        name: "pais",
        type: "select",
        label: "País",
        placeholder: "Selecciona un país",
        options: [
          { value: "ar", label: "Argentina" },
          { value: "br", label: "Brasil" },
          { value: "cl", label: "Chile" },
          { value: "co", label: "Colombia" },
          { value: "mx", label: "México" },
          { value: "pe", label: "Perú" },
        ],
        validate: [
          { required: true, message: "Por favor selecciona un país." },
        ],
      },
      {
        name: "estadoCivil",
        type: "select",
        label: "Estado Civil",
        placeholder: "Selecciona tu estado civil",
        options: [
          { value: "soltero", label: "Soltero/a" },
          { value: "casado", label: "Casado/a" },
          { value: "divorciado", label: "Divorciado/a" },
          { value: "viudo", label: "Viudo/a" },
        ],
        validate: [
          { required: true, message: "Por favor selecciona tu estado civil." },
        ],
      },
    ],
    crossFieldValidations: [
      {
        fields: ["nombre", "pais"],
        validate: (values) => {
          if (values.nombre === "Luis" && values.pais === "ar") {
            return "Este nombre no está permitido para Argentina"
          }
          return null
        },
      },
      {
        fields: ["nombre", "edad"],
        validate: (values) => {
          if (values.nombre === "Luis" && values.edad !== "50") {
            return "La edad no se corresponde"
          }
          return null
        },
      },
    ],
    submitText: "Guardar",
  }

  const handleSubmit = (data: FormData) => {
    console.log("Datos del formulario:", data)
  }

  return <DynamicForm formDefinition={formConfig} onSubmit={handleSubmit} />
}

export default MyPage
