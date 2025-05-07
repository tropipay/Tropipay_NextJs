"use client"
import SimplePage from "@/components/simplePage/simplePage"
import React, { useState } from "react" // Importar useState
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog" // Corregido: dialog -> Dialog
// Ya no necesitamos Button aquí si no hay trigger
// import { Button } from "@/components/ui/Button"

const Page = () => {
  // Estado para controlar la apertura del diálogo, inicializado en true
  const [isDialogOpen, setIsDialogOpen] = useState(true)

  return (
    // Pasar el estado y la función de cambio al Dialog
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* Ya no necesitamos DialogTrigger */}
      {/* <DialogTrigger asChild>
        <Button variant="outline">Abrir Página Simple</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[600px]">
        {/* No necesitamos DialogHeader si SimplePage ya tiene su propio título/descripción */}
        {/* <DialogHeader>
          <DialogTitle>Título del Diálogo</DialogTitle>
          <DialogDescription>
            Descripción del diálogo.
          </DialogDescription>
        </DialogHeader> */}
        <SimplePage
          icon=""
          title="Hola"
          description="Muestra de pagina simple"
          buttonAText="Boton A"
          buttonBText="Boton B"
        >
          MUESTRA
        </SimplePage>
        {/* Si necesitas botones específicos para el diálogo, puedes agregarlos aquí o usar los de SimplePage */}
        {/* <DialogFooter>
          <Button type="submit">Guardar Cambios</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}

export default Page
