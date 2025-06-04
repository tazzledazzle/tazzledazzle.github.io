export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-6">
            <a href="https://github.com/tazzledazzle" className="text-gray-600 hover:text-primary-600">
              GitHub
            </a>
            <a href="https://twitter.com/terenceschu" className="text-gray-600 hover:text-primary-600">
              Twitter
            </a>
            <a href="https://linkedin.com/in/terenceschumacher" className="text-gray-600 hover:text-primary-600">
              LinkedIn
            </a>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Terence Schumacher. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}