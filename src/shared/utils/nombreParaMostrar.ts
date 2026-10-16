/** El dueño a veces carga los nombres en mayúsculas: «TARTA DE FRUTILLA» se muestra «Tarta de frutilla» */
export function nombreParaMostrar(nombre: string): string {
  const limpio = nombre.trim();
  if (limpio !== limpio.toUpperCase()) return limpio;
  const minusculas = limpio.toLocaleLowerCase('es-AR');
  return minusculas.charAt(0).toLocaleUpperCase('es-AR') + minusculas.slice(1);
}
