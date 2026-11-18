// Datos de marca de cada cliente. Se guardan como JSON en la tabla `tenants` de la base de control.
export type TenantConfig = {
  name: string // nombre completo de la institución
  logo: string
  logoAlt: string
  seaLogo?: string
  seaLogoAlt?: string
  footerAddress?: string
  // true: la barra superior es siempre blanca (no cambia de color según la sección)
  navLight?: boolean
  accent?: string // color propio de la escuela (hex), el mismo en su sitio y en la landing madre
  enrollmentWebhook?: string // Google Apps Script que recibe las inscripciones
}

export type Tenant = {
  slug: string
  name: string
  dbUrl: string // cadena de conexión a Neon de ESTE cliente (incluye su usuario y clave propios)
  config: TenantConfig
  active: boolean
}

// Lo que puede viajar al navegador: nunca la URL ni el token de la base.
export type PublicTenant = { slug: string; name: string; config: Omit<TenantConfig, 'enrollmentWebhook'> }
