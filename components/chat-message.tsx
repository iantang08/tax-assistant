import type { Message } from "ai"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"

interface ChatMessageProps {
  message: Message
}

function TaxTable({ data }: { data: { label: string; amount: number }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.label}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                ${item.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  // Check if the message contains a tax calculation table
  const hasTaxTable = message.content.includes("TAX_TABLE:")
  let tableData: { label: string; amount: number }[] = []

  if (hasTaxTable) {
    try {
      const tableStart = message.content.indexOf("TAX_TABLE:")
      const tableEnd = message.content.indexOf("END_TAX_TABLE")
      const tableJson = message.content.slice(tableStart + 10, tableEnd).trim()
      tableData = JSON.parse(tableJson)
      message.content = message.content.slice(0, tableStart) + message.content.slice(tableEnd + 13)
    } catch (error) {
      console.error("Error parsing tax table:", error)
    }
  }

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex items-start gap-3 max-w-[80%]", isUser ? "flex-row-reverse" : "flex-row")}>
        <Avatar className={cn("h-8 w-8 flex items-center justify-center", isUser ? "bg-primary" : "bg-muted")}>
          {isUser ? <User className="h-4 w-4 text-primary-foreground" /> : <Bot className="h-4 w-4" />}
        </Avatar>

        <Card className={cn("shadow-sm", isUser ? "bg-primary text-primary-foreground" : "bg-card")}>
          <CardContent className="p-3">
            <p className="whitespace-pre-wrap">{message.content}</p>
            {hasTaxTable && tableData.length > 0 && <TaxTable data={tableData} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

