export function toggleTheme(preferredTheme?: 'dark' | 'light') {
  const root = document.documentElement;
  const userTheme = localStorage.getItem('theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const currentTheme = userTheme || systemTheme;

  if (preferredTheme) {
    // 设置用户选择的主题
    root.setAttribute('data-theme', preferredTheme);
    localStorage.setItem('theme', preferredTheme);
  } else {
    // 如果没有指定，切换到系统偏好的主题
    if (currentTheme === 'dark') {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  // 如果用户选择和系统偏好一致，使用空字符串代表跟随系统
  if (userTheme && userTheme !== systemTheme) {
    root.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  }
}