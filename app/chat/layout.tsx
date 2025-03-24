export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-3xl mx-auto h-screen">
      {children}
    </div>
  )
} 