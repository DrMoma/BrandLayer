function App() {
  return (
    <div className="relative min-h-screen">
      <Nav />
      <Hero />
      <TrustedMarquee />
      <Services />
      <Process />
      <Work />
      <CTA />
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
