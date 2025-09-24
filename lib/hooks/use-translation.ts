import { useTranslation } from 'react-i18next'

export const useI18n = () => {
  const { t, i18n } = useTranslation()

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
    localStorage.setItem('language', language)
  }

  const getCurrentLanguage = () => {
    return i18n.language
  }

  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' }
    ]
  }

  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    const locale = i18n.language === 'es' ? 'es-ES' : 'en-US'
    return new Intl.DateTimeFormat(locale, options).format(date)
  }

  const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
    const locale = i18n.language === 'es' ? 'es-ES' : 'en-US'
    return new Intl.NumberFormat(locale, options).format(number)
  }

  const formatCurrency = (amount: number, currency = 'USD') => {
    const locale = i18n.language === 'es' ? 'es-ES' : 'en-US'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatRelativeTime = (date: Date) => {
    const locale = i18n.language === 'es' ? 'es-ES' : 'en-US'
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    
    const now = new Date()
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000)
    
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(diffInSeconds, 'second')
    } else if (Math.abs(diffInSeconds) < 3600) {
      return rtf.format(Math.floor(diffInSeconds / 60), 'minute')
    } else if (Math.abs(diffInSeconds) < 86400) {
      return rtf.format(Math.floor(diffInSeconds / 3600), 'hour')
    } else {
      return rtf.format(Math.floor(diffInSeconds / 86400), 'day')
    }
  }

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime
  }
}
