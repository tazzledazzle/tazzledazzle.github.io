describe('Jekyll Site Structure', () => {
  test('homepage structure', () => {
    document.body.innerHTML = `
      <header class="site-header">
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/projects">Projects</a>
        </nav>
      </header>
      <main>
        <div class="post-list">
          <article class="post">
            <h2>Test Post</h2>
          </article>
        </div>
      </main>
      <footer class="site-footer"></footer>
    `;

    expect(document.querySelector('.site-header')).toBeInTheDocument();
    expect(document.querySelector('nav')).toBeInTheDocument();
    expect(document.querySelectorAll('nav a')).toHaveLength(3);
    expect(document.querySelector('.post-list')).toBeInTheDocument();
    expect(document.querySelector('.site-footer')).toBeInTheDocument();
  });
});
