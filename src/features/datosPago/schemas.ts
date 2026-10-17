import { z } from 'zod';

/** GET y PUT /api/datos-pago: la cuenta a la que el cliente le transfiere al dueño */
export const datosPagoSchema = z.object({
  /** El titular de la cuenta */
  nombreCompleto: z.string(),
  alias: z.string(),
  /** CBU o CVU: 22 números, como texto (los CVU empiezan con 000) */
  cbu: z.string(),
  /** Mercado Pago, Ualá, Banco Nación… */
  billetera: z.string(),
});

// ── Formulario (app del dueño) ────────────────────────────────────────────────

// Los dos dígitos verificadores del CBU (también valen para el CVU): el mismo cálculo que el back
function esCbuValido(cbu: string): boolean {
  if (!/^\d{22}$/.test(cbu)) return false;
  const verifica = (bloque: string, pesos: number[]) => {
    const suma = pesos.reduce((total, peso, i) => total + Number(bloque[i]) * peso, 0);
    return (10 - (suma % 10)) % 10 === Number(bloque[pesos.length]);
  };
  return verifica(cbu.slice(0, 8), [7, 1, 3, 9, 7, 1, 3]) && verifica(cbu.slice(8), [3, 9, 7, 1, 3, 9, 7, 1, 3, 9, 7, 1, 3]);
}

/** Las mismas reglas que el back, para avisar antes de mandar */
export const formularioDatosPagoSchema = z.object({
  nombreCompleto: z
    .string()
    .trim()
    .min(1, 'Escribí el nombre del titular')
    .min(3, 'Tiene que tener al menos 3 letras')
    .max(80, 'Puede tener hasta 80 letras'),
  alias: z
    .string()
    .trim()
    .min(1, 'Escribí el alias')
    .regex(/^[a-zA-Z0-9.-]{6,20}$/, 'De 6 a 20 caracteres: letras sin acentos, números, puntos y guiones'),
  cbu: z
    .string()
    .trim()
    .min(1, 'Escribí el CBU o CVU')
    // Como lo pegue el dueño: los espacios y guiones no cuentan
    .transform((valor) => valor.replace(/[\s-]/g, ''))
    .refine(esCbuValido, 'Revisá el CBU o CVU: tiene que tener 22 números y estar bien copiado'),
  billetera: z
    .string()
    .trim()
    .min(1, 'Escribí dónde está la cuenta: Mercado Pago, Ualá…')
    .min(2, 'Tiene que tener al menos 2 letras')
    .max(40, 'Puede tener hasta 40 letras'),
});
