// Конфигурация админ-email
// Можно переопределить через переменную окружения ADMIN_EMAIL
export const getAdminEmails = (): string[] => {
  const envAdminEmail = process.env.ADMIN_EMAIL;
  if (envAdminEmail) {
    // Поддерживаем несколько email через запятую
    return envAdminEmail.split(',').map(email => email.trim()).filter(Boolean);
  }
  // По умолчанию
  return ["admin@example.com"];
};

