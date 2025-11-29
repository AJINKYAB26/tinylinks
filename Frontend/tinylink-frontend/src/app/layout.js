import "./globals.css";

export const metadata = {
  title: "TinyLink",
  description: "URL Shortener",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <header className="bg-white shadow px-6 py-4">
          <h1 className="text-2xl font-bold">TinyLink</h1>
        </header>

        <main className="max-w-4xl mx-auto py-8 px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
