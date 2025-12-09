// Утилита для проверки, является ли пользователь админом
// Можно использовать на клиенте (только для проверки email)

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  
  // Получаем список админских email из переменной окружения или дефолтного значения
  const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  const adminEmails = adminEmailsEnv 
    ? adminEmailsEnv.split(',').map(e => e.trim()).filter(Boolean)
    : ['vasiliy_arsenov@bizan.pro', 'dmitry_kolesnikov@bizan.pro']; // Дефолтные значения
  
  return adminEmails.includes(email);
}

