"use client"

import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApprovalButtonsProps {
  onApprove: () => void
  onReject: () => void
  approveDisabled?: boolean
  rejectDisabled?: boolean
  approveLabel?: string
  rejectLabel?: string
  size?: "sm" | "default"
}

export function ApprovalButtons({
  onApprove,
  onReject,
  approveDisabled,
  rejectDisabled,
  approveLabel = "قبول",
  rejectLabel = "رفض",
  size = "sm",
}: ApprovalButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onApprove}
        variant="outline"
        size={size}
        className="flex-1 text-success border-success/30 hover:bg-success/10 hover:text-success bg-transparent"
        disabled={approveDisabled}
      >
        <CheckCircle className="w-4 h-4 ml-1.5" />
        {approveLabel}
      </Button>
      <Button
        onClick={onReject}
        variant="outline"
        size={size}
        className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive bg-transparent"
        disabled={rejectDisabled}
      >
        <XCircle className="w-4 h-4 ml-1.5" />
        {rejectLabel}
      </Button>
    </div>
  )
}
