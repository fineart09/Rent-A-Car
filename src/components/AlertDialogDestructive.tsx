import { Trash2Icon, Trash } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface AlertDialogDestructiveProps {
  onClick?: () => void
  title?: string
  description?: string
} 
  
export function AlertDialogDestructive({ onClick, title, description }: AlertDialogDestructiveProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" size="icon-sm" variant="destructive" >
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title || 'ต้องการลบข้อมูลนี้ใช่หรือไม่?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? การกระทำนี้ไม่สามารถย้อนกลับได้.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">ยกเลิก</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onClick}>ลบ</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
