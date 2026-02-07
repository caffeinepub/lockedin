export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          <div>
            © 2026. Built with 💝 by Rissrozy using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-gold hover:text-accent-gold/80 transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </div>
          <div className="mt-1">
            App version 1.2
          </div>
        </div>
      </div>
    </footer>
  );
}
