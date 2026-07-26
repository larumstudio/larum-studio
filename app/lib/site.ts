/* ============================================================
   Constantes del sitio — punto único de configuración
   ------------------------------------------------------------
   Para cambiar el dominio de producción, edite SITE aquí.
   Todos los archivos de metadata leen de esta constante.
   ============================================================ */

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://landing.larumstudio.com'

// Teléfono comercial único (formato E.164 sin +)
export const PHONE_WA = '595972186472'

// URLs WhatsApp por idioma para la página de entorno
export const WA_ES =
  `https://wa.me/${PHONE_WA}?text=Hola%2C%20vi%20la%20p%C3%A1gina%20de%20San%20Bernardino%20y%20me%20gustar%C3%ADa%20solicitar%20una%20visita%20privada.`
export const WA_EN =
  `https://wa.me/${PHONE_WA}?text=Hello%2C%20I%20saw%20the%20San%20Bernardino%20area%20page%20and%20would%20like%20to%20request%20a%20private%20viewing.`

// URL Calendly comercial (compartida ES/EN)
export const CALENDLY_URL = 'https://calendly.com/contactolarum/sesion-estrategica-larum?back=1'
