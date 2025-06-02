import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const DeliverablesTrackerTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Deliverables Tracker - Test</h1>
          <p className="text-center mt-4">This is a test page to verify the component renders.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliverablesTrackerTest;
