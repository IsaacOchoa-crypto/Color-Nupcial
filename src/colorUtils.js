// Convierte de HEX a HSL
export const hexToHSL = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

// Convierte de HSL a HEX
export const hslToHex = (h, s, l) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

// Generador de Armonías (5 Colores)
export const generateHarmonies = (baseHex) => {
  const { h, s, l } = hexToHSL(baseHex);
  
  // Helpers para asegurar que los valores estén dentro de rangos legibles
  const clampL = (val) => Math.max(10, Math.min(95, val)); 
  const clampS = (val) => Math.max(10, Math.min(100, val));
  const wrapH = (val) => (val + 360) % 360;

  // Color de texto con alto contraste respecto al fondo (Base)
  const textColor = l > 50 
    ? hslToHex(h, clampS(s - 30), 15) // Fondo claro -> Texto muy oscuro
    : hslToHex(h, clampS(s - 30), 95); // Fondo oscuro -> Texto muy claro

  return [
    {
      nombre: "Contraste Audaz (Complementaria)",
      colores: [
        baseHex, 
        hslToHex(wrapH(h + 180), clampS(s), clampL(l - 15)), // Secundario
        hslToHex(wrapH(h + 180), clampS(s - 10), clampL(l + 15)), // Terciario
        hslToHex(wrapH(h + 180), clampS(s + 30), clampL(l > 50 ? 40 : 60)), // Acento vibrante
        textColor // Tinta / Texto
      ],
      tags: ["Generada por IA"]
    },
    {
      nombre: "Vibra Natural (Análoga)",
      colores: [
        baseHex,
        hslToHex(wrapH(h + 30), clampS(s), clampL(l - 15)), // Secundario
        hslToHex(wrapH(h - 30), clampS(s), clampL(l + 10)), // Terciario
        hslToHex(wrapH(h + 60), clampS(s + 20), clampL(l > 50 ? 45 : 65)), // Acento
        textColor // Tinta / Texto
      ],
      tags: ["Generada por IA"]
    },
    {
      nombre: "Elegancia Pura (Monocromática)",
      colores: [
        baseHex,
        hslToHex(h, clampS(s - 10), clampL(l - 35)), // Secundario oscuro
        hslToHex(h, clampS(s - 15), clampL(l + 25)), // Terciario claro
        hslToHex(h, clampS(s + 20), clampL(l > 50 ? 25 : 75)), // Acento tonal
        textColor // Tinta / Texto
      ],
      tags: ["Generada por IA"]
    },
    {
      nombre: "Equilibrio Perfecto (Dividida)",
      colores: [
        baseHex,
        hslToHex(wrapH(h + 150), clampS(s), clampL(l - 15)), // Secundario
        hslToHex(wrapH(h + 210), clampS(s), clampL(l + 10)), // Terciario
        hslToHex(wrapH(h + 180), clampS(s + 25), clampL(l > 50 ? 40 : 70)), // Acento
        textColor // Tinta / Texto
      ],
      tags: ["Generada por IA"]
    }
  ];
};
