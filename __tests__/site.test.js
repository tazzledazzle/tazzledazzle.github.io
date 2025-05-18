describe('Jekyll Site', () => {
  test('basic test setup is working', () => {
    expect(true).toBe(true);
  });

  test('DOM testing works', () => {
    document.body.innerHTML = '<div class="test">Test content</div>';
    expect(document.querySelector('.test')).toBeInTheDocument();
  });
});
