import CustomerPanelApp from "@/views/customer-panel/customer-panel-app";

// The public provider profile is the only ISR surface in the customer app.
export const revalidate = 3600;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "آرایشگاه خانه نو",
  description: "رزرو آنلاین کوتاهی، اصلاح ریش و خدمات مراقبتی آقایان در تهرانپارس.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "تهران",
    addressRegion: "تهرانپارس",
    addressCountry: "IR",
  },
  priceRange: "$$",
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <CustomerPanelApp />
    </>
  );
}
