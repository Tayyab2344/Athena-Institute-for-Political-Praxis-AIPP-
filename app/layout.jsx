import "./globals.css";
import ScrollObserver from "./components/ScrollObserver";

export const metadata = {
  title: "Athena Institute for Political Praxis",
  description:
    "An international institute advancing women's political leadership, governance research, institutional reform, and strategic public policy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ScrollObserver />
        {children}
      </body>
    </html>
  );
}
