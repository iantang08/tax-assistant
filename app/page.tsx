"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Paperclip, Send, Loader2 } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import FileUpload from "@/components/file-upload"

const QUICK_REPLIES = [
  "How do tax brackets work?",
  "Tell me about standard deductions",
  "What is a W-2 form?",
  "How do I calculate my taxable income?",
  "What are common tax credits?",
]

export default function Home() {
  const [fileUploading, setFileUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const queryClient = useQueryClient()

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: "/api/chat",
    id: "tax-assistant-chat",
    onFinish: (message) => {
      console.log('Chat finished:', message)
    },
    onError: (error) => {
      console.error('Chat error:', error)
    },
    onResponse: () => {
      // Invalidate relevant queries when we get a new response
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] })
    },
  })

  const handleFileUpload = async (file: File) => {
    setFileUploading(true)

    try {
      // Create FormData to send the file
      const formData = new FormData()
      formData.append("file", file)

      // Add file to uploaded files list
      setUploadedFiles((prev) => [...prev, file.name])

      // Send the file to the API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const data = await response.json()

      // Add user message about the file
      append({
        role: "user",
        content: `I've uploaded a document: ${file.name}`,
      })

      // Add assistant response about the file
      append({
        role: "assistant",
        content: data.message || `I see you've uploaded ${file.name}. This appears to be a ${getDocumentType(file.name)}. How can I help you with this document?`,
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      append({
        role: "assistant",
        content: "Sorry, I encountered an error while processing your file. Please try again.",
      })
    } finally {
      setFileUploading(false)
    }
  }

  const getDocumentType = (filename: string) => {
    const lowerName = filename.toLowerCase()
    if (lowerName.includes("w-2") || lowerName.includes("w2")) return "W-2 Wage and Tax Statement"
    if (lowerName.includes("1099")) return "1099 Form"
    if (lowerName.includes("1040")) return "1040 Tax Return Form"
    return "tax-related document"
  }

  const handleQuickReply = (question: string) => {
    append({
      role: "user",
      content: question,
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-gray-50">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-xl">Tax Assistant</CardTitle>
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <h3 className="text-lg font-medium mb-2">Welcome to Tax Assistant</h3>
              <p className="max-w-md mb-4">
                Ask me any questions about your taxes, Form 1040, deductions, or upload your tax documents for
                assistance.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {QUICK_REPLIES.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  <ChatMessage message={message} />
                  {message.role === "assistant" && (
                    <div className="flex flex-wrap gap-2">
                      {QUICK_REPLIES.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReply(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </CardContent>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <FileUpload onFileSelect={handleFileUpload} disabled={fileUploading || isLoading}>
              <Button type="button" size="icon" variant="outline" disabled={fileUploading || isLoading}>
                {fileUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
              </Button>
            </FileUpload>

            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about your taxes..."
              disabled={isLoading}
              className="flex-grow"
            />

            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  )
}

