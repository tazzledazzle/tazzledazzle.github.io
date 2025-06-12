import Link from 'next/link';

export default function ContactCTA() {
    return (
        <section className="text-center bg-primary-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-gray-600 mb-6">
                I'm always interested in hearing about new projects and opportunities.
            </p>
            <Link
                href="/contact"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
                Get in Touch
            </Link>
        </section>
    );
}