import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact — NexusHub',
  description: 'Reach the NexusHub team. We respond within 24–48 hours.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#141413]">
      <Navbar />
      <main className="flex-grow">
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
