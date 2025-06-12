import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="text-center space-y-6">
            <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full">
                <Image
                    src="https://gravatar.com/avatar/10056dfd9bd277610a657d2aee28089b?size=256"
                    alt="Terence Schumacher"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div>
                <h1 className="text-4xl font-bold text-gray-900">Terence Schumacher (tazzledazzle)</h1>
                <p className="text-xl text-gray-600">
                    Full Stack Developer, Gradle Enthusiast & Technical Writer
                </p>
            </div>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
                I build modern web applications and write about technology, development, and best practices.
                Currently focused on React, Next.js, and TypeScript.
            </p>
        </section>
    );
}