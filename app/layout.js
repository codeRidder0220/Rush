import "./globals.css";

export const metadata = {
  title: "RUSH — Read. Remember. Rush.",
  description: "Test your memory. Beat your best.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}