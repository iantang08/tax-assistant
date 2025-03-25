# Tax Assistant

A web-based chatbot that helps users with basic questions about individual tax returns (Form 1040) using AI. Built with Next.js, Tailwind CSS, and the Vercel AI SDK.

## Features

- Chat interface for tax-related questions
- File upload support for tax documents
- Quick-reply buttons for common questions
- Streaming AI responses
- Responsive design with Tailwind CSS
- State management with TanStack Query

## Tech Stack

- **Frontend**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **AI Integration**: Vercel AI SDK
- **File Processing**: OpenAI GPT-4 Vision

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app directory with pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and shared code

## Features Implementation Status

### Completed
- ✅ Chat interface with streaming responses
- ✅ File upload functionality
- ✅ Quick-reply buttons
- ✅ Responsive design
- ✅ Basic tax document analysis

### Future Improvements
- Add support for more document types
- Implement tax calculation visualizations
- Add user authentication
- Store chat history
- Add more interactive tax forms
- Implement multi-language support

## Assumptions

1. The application focuses on US individual tax returns (Form 1040)
2. Users have basic understanding of tax terminology
3. File uploads are limited to common tax document types
4. AI responses are general guidance and not professional tax advice

## Development Notes

- The project uses the Edge Runtime for API routes to support streaming responses
- File uploads are processed using OpenAI's GPT-4 Vision model
- Chat history is managed using TanStack Query for better UX
- The UI is built with Tailwind CSS for responsive design

## License

MIT
