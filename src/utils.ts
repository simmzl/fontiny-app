export async function toggleTheme() {
  const KEY = 'fontiny-theme';
  const root = document.documentElement;
  const userTheme = await window.fontTiny.getStore(KEY)
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const currentTheme = userTheme || systemTheme;
  let result = currentTheme

  if (currentTheme === 'dark') {
    root.setAttribute('data-theme', 'light');
    result = 'light';
  } else {
    root.setAttribute('data-theme', 'dark');
    result = 'dark';
  }

  // 如果用户选择和系统偏好一致，使用空字符串代表跟随系统
  if (userTheme && userTheme !== systemTheme) {
    root.removeAttribute('theme');
    result = '';
  }

  await window.fontTiny.setStore(KEY, result)
}

export async function initTheme() {
  const KEY = 'fontiny-theme';
  const root = document.documentElement;
  const userTheme = await window.fontTiny.getStore(KEY)

  if (!userTheme) return

  root.setAttribute('data-theme', userTheme);
}