import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import React from "react"

const InformationToolbar = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        {/* Elementos alineados a la izquierda */}
        <div className="flex items-center gap-2"></div>

        {/* Elementos alineados a la derecha */}
        <div className="flex items-center gap-2">
          {
            <Button variant="outline">
              <Download />
            </Button>
          }
        </div>
      </div>
    </>
  )
}

export default InformationToolbar
