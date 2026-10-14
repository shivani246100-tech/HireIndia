export default function manifest() {
  return {
    name: "HireIndia – Jobs", short_name: "HireIndia",
    description: "Find jobs across India | भारत में नौकरी खोजें",
    start_url: "/", scope: "/", display: "standalone", lang: "hi",
    background_color: "#ffffff", theme_color: "#0b4f3a",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" } ] };
}
