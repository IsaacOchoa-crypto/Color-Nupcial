import React, { useState, useRef } from 'react';
import { generateHarmonies } from './colorUtils';

const palettes = [
  {"nombre":"Atardecer Árido","colores":["#FFFDD0","#CC7722","#E2725B"], "tags": ["Otoño", "Playa/Cálidas"]},
  {"nombre":"Dunas y Cobre","colores":["#F5F5DC","#D2691E","#B87333"], "tags": ["Otoño", "Rústicas"]},
  {"nombre":"Cañón Cálido","colores":["#FAF0E6","#B7410E","#9DC183"], "tags": ["Otoño", "Rústicas"]},
  {"nombre":"Desierto Floral","colores":["#F7E7CE","#D49A89","#654321"], "tags": ["Primavera", "Rústicas"]},
  {"nombre":"Arcilla y Arena","colores":["#F9F6EE","#B66A50","#8F9779"], "tags": ["Playa/Cálidas", "Rústicas"]},
  {"nombre":"Bosque Otoñal","colores":["#F5F5F5","#228B22","#FFDB58"], "tags": ["Otoño"]},
  {"nombre":"Olivo y Miel","colores":["#FFFFF0","#708238","#FFC30B"], "tags": ["Rústicas", "Primavera"]},
  {"nombre":"Pino y Madera","colores":["#D3D3D3","#01796F","#5C4033"], "tags": ["Rústicas", "Otoño"]},
  {"nombre":"Helecho y Tierra","colores":["#F8F8FF","#4F7942","#A67B5B"], "tags": ["Rústicas", "Otoño"]},
  {"nombre":"Eucalipto Dorado","colores":["#EAE0C8","#5F8575","#FFD700"], "tags": ["Rústicas", "Primavera"]},
  {"nombre":"Melocotón Rústico","colores":["#FFEBCD","#FFCBA4","#B5B35C"], "tags": ["Otoño", "Playa/Cálidas"]},
  {"nombre":"Ciruela y Trigo","colores":["#F5DEB3","#8E4585","#9DC183"], "tags": ["Clásicas", "Otoño"]},
  {"nombre":"Rubor Orgánico","colores":["#FFFDD0","#DE5D83","#7B3F00"], "tags": ["Clásicas", "Primavera"]},
  {"nombre":"Néctar y Hoja","colores":["#F3E5AB","#F08080","#71AA34"], "tags": ["Primavera"]},
  {"nombre":"Pétalo y Musgo","colores":["#FFD1DC","#8A9A5B","#708090"], "tags": ["Primavera"]},
  {"nombre":"Naranja Quemado","colores":["#F3E5AB","#CC5500","#4B5320"], "tags": ["Otoño", "Rústicas"]},
  {"nombre":"Sol de Toscana","colores":["#FFFFE0","#B22222","#005E20"], "tags": ["Clásicas", "Playa/Cálidas"]},
  {"nombre":"Cítrico Rústico","colores":["#F5F5DC","#E38C2D","#006A4E"], "tags": ["Rústicas", "Playa/Cálidas"]},
  {"nombre":"Ámbar y Castaño","colores":["#F9F6EE","#FFBF00","#954535"], "tags": ["Otoño", "Rústicas"]},
  {"nombre":"Girasol y Tierra","colores":["#E2CA76","#FFDA03","#8B4513"], "tags": ["Playa/Cálidas", "Rústicas"]},
  {"nombre":"Zafiro y Oro","colores":["#0F2027","#D4AF37","#F8F9FA"], "tags": ["Oscuras y Elegantes", "Clásicas"]},
  {"nombre":"Esmeralda y Rubor","colores":["#1B4332","#FFC8DD","#E9ECEF"], "tags": ["Oscuras y Elegantes", "Primavera"]},
  {"nombre":"Vino Tinto y Marfil","colores":["#4A0404","#D5B4B4","#F4F1DE"], "tags": ["Oscuras y Elegantes", "Clásicas"]},
  {"nombre":"Azul Terciopelo","colores":["#1D3557","#457B9D","#E63946"], "tags": ["Oscuras y Elegantes"]},
  {"nombre":"Ónice y Cuarzo","colores":["#22223B","#C9ADA7","#F2E9E4"], "tags": ["Oscuras y Elegantes"]},
  {"nombre":"Berenjena y Cobre","colores":["#422040","#CB793A","#F1E3D3"], "tags": ["Oscuras y Elegantes", "Otoño"]},
  {"nombre":"Mar Profundo","colores":["#03045E","#0077B6","#90E0EF"], "tags": ["Oscuras y Elegantes", "Playa/Cálidas"]},
  {"nombre":"Bosque Místico","colores":["#2C3E2D","#C2C5AA","#A4AC86"], "tags": ["Oscuras y Elegantes", "Rústicas"]},
  {"nombre":"Cielo Nocturno","colores":["#14213D","#FCA311","#E5E5E5"], "tags": ["Oscuras y Elegantes"]},
  {"nombre":"Granate y Arena","colores":["#780000","#C1121F","#FDF0D5"], "tags": ["Oscuras y Elegantes", "Otoño"]}
];

const filters = ["Todas", "Primavera", "Otoño", "Playa/Cálidas", "Rústicas", "Clásicas", "Oscuras y Elegantes"];

const exportPalette = (palette) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 1200;
  canvas.height = 1200;
  
  // Background
  ctx.fillStyle = '#faf9f7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Title
  ctx.fillStyle = '#1f2937';
  ctx.font = '300 72px serif';
  ctx.textAlign = 'center';
  ctx.fillText(palette.nombre, canvas.width / 2, 160);
  
  // Subtitle
  ctx.fillStyle = '#6b7280';
  ctx.font = '300 32px sans-serif';
  ctx.fillText('Proporción de Color Nupcial (60 - 30 - 10)', canvas.width / 2, 230);
  
  // Layout
  const startY = 320;
  const barHeight = 400;
  
  // Colors
  ctx.fillStyle = palette.colores[0];
  ctx.fillRect(100, startY, 600, barHeight); // 60%
  
  ctx.fillStyle = palette.colores[1];
  ctx.fillRect(700, startY, 300, barHeight); // 30%
  
  ctx.fillStyle = palette.colores[2];
  ctx.fillRect(1000, startY, 100, barHeight); // 10%
  
  // Border
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 4;
  ctx.strokeRect(100, startY, 1000, barHeight);
  
  ctx.textAlign = 'center';
  
  // Labels Base
  ctx.fillStyle = '#6b7280';
  ctx.font = '600 24px sans-serif';
  ctx.fillText('BASE', 400, startY + barHeight + 60);
  ctx.fillStyle = '#1f2937';
  ctx.font = '300 36px monospace';
  ctx.fillText(palette.colores[0], 400, startY + barHeight + 110);
  
  // Labels Secondary
  ctx.fillStyle = '#6b7280';
  ctx.font = '600 24px sans-serif';
  ctx.fillText('SECUNDARIO', 850, startY + barHeight + 60);
  ctx.fillStyle = '#1f2937';
  ctx.font = '300 36px monospace';
  ctx.fillText(palette.colores[1], 850, startY + barHeight + 110);
  
  // Labels Accent
  ctx.fillStyle = '#6b7280';
  ctx.font = '600 24px sans-serif';
  ctx.fillText('ACENTO', 1050, startY + barHeight + 60);
  ctx.fillStyle = '#1f2937';
  ctx.font = '300 36px monospace';
  ctx.fillText(palette.colores[2], 1050, startY + barHeight + 110);
  
  // Footer
  ctx.fillStyle = '#9ca3af';
  ctx.font = '300 24px sans-serif';
  ctx.fillText('Generado por Color Nupcial App', canvas.width / 2, canvas.height - 80);
  
  // Download
  const link = document.createElement('a');
  link.download = `Paleta-${palette.nombre.replace(/\s+/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

const PaletteCard = ({ palette, onCopy }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  
  const [base, secondary, accent] = palette.colores;

  const handleMouseMove = (e) => {
    if (!isFlipped || !cardRef.current) return;
    
    // Desactivar física 3D en dispositivos táctiles (móviles) para no interferir con el scroll
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Invertimos el eje Y y mantenemos el X invertido por la rotación de 180deg
    const rotateX = ((y - centerY) / centerY) * -12; 
    const rotateY = ((x - centerX) / centerX) * -12; 
    
    setTiltStyle({
      transform: `rotateY(${180 + rotateY}deg) rotateX(${rotateX}deg)`,
      transition: 'none'
    });

    // Calcular posición del resplandor (glare)
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    
    setGlareStyle({
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
      opacity: 1,
      transition: 'none'
    });
  };

  const handleMouseLeave = () => {
    if (!isFlipped) return;
    setTiltStyle({
      transform: `rotateY(180deg) rotateX(0deg) rotateY(0deg)`,
      transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
    });
    setGlareStyle({
      opacity: 0,
      transition: 'opacity 0.6s ease'
    });
  };

  const toggleFlip = (state) => {
    setIsFlipped(state);
    if (!state) {
      setTiltStyle({});
      setGlareStyle({ opacity: 0 });
    } else {
      setTiltStyle({
        transform: `rotateY(180deg) rotateX(0deg) rotateY(0deg)`,
        transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
      });
    }
  };

  return (
    <div 
      className="bg-transparent rounded-2xl h-[420px] relative group/card [perspective:1200px]"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="relative w-full h-full [transform-style:preserve-3d]"
        style={isFlipped ? tiltStyle : { transform: 'rotateY(0deg)', transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        
        {/* CARA FRONTAL: Paleta de Colores */}
        <div className="absolute inset-0 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col [backface-visibility:hidden]">
          
          {/* En móviles (lg:opacity-0), el botón siempre es visible. En escritorio, aparece con el hover */}
          <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover/card:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); exportPalette(palette); }}
              className="bg-white/90 backdrop-blur text-gray-700 hover:text-gray-900 hover:bg-white p-2 rounded-full shadow-sm transition-all border border-gray-100"
              title="Descargar PNG"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
          </div>

          <div className="p-6 flex-grow flex flex-col">
            <h3 className="text-xl font-serif text-gray-800 tracking-wide text-center mb-6">
              {palette.nombre}
            </h3>
            
            <div className="flex w-full h-28 rounded-xl overflow-hidden shadow-inner mb-6 shrink-0">
              {palette.colores.map((color, idx) => (
                <div 
                  key={idx}
                  onClick={() => onCopy(color)}
                  className="h-full cursor-pointer transition-all duration-300 hover:brightness-110 relative group"
                  style={{ width: idx === 0 ? '60%' : idx === 1 ? '30%' : '10%', backgroundColor: color }}
                  title={`Copiar ${idx === 0 ? 'Base' : idx === 1 ? 'Secundario' : 'Acento'}`}
                >
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[1px]">
                      {idx === 2 ? (
                        <svg className="w-4 h-4 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      ) : (
                        <span className="text-white text-xs font-semibold drop-shadow-md tracking-widest uppercase">Copiar</span>
                      )}
                   </div>
                </div>
              ))}
            </div>

            <div className="flex text-xs font-medium text-gray-500 mb-6 shrink-0">
              {palette.colores.map((color, idx) => (
                <div key={idx} className={`flex flex-col items-center ${idx === 1 ? 'border-l border-r border-gray-100' : ''}`} style={{ width: idx === 0 ? '60%' : idx === 1 ? '30%' : '10%' }}>
                  <span className="mb-2 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">{idx === 0 ? 'Base' : idx === 1 ? 'Sec' : 'Acc'}</span>
                  <button 
                    onClick={() => onCopy(color)}
                    className="cursor-pointer hover:text-gray-900 transition-colors bg-transparent border-none p-1 focus:outline-none tracking-wider rounded hover:bg-gray-50"
                  >
                    {color}
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => toggleFlip(true)}
              className="w-full mt-auto py-3 rounded-xl font-medium text-sm transition-all duration-300 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 flex items-center justify-center gap-2 group-hover/card:bg-rose-50 group-hover/card:text-rose-700 group-hover/card:border-rose-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" /></svg>
              Ver Invitación
            </button>
          </div>
        </div>

        {/* CARA TRASERA: Invitación 3D Interactiva */}
        <div 
          className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ backgroundColor: base }}
        >
          {/* Capa de resplandor (Glare) */}
          <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay" style={glareStyle}></div>
          
          {/* Diseño de la invitación premium */}
          <div className="flex-grow flex flex-col items-center justify-center p-8 relative z-0" style={{ fontFamily: "'Playfair Display', serif" }}>
            
            {/* Marco Metálico Fino */}
            <div className="absolute inset-4 border opacity-80" style={{ borderColor: accent }}></div>
            
            <div className="text-center px-4 w-full">
              <span className="block text-[9px] tracking-[0.4em] uppercase mb-6" style={{ color: secondary, fontFamily: "'Montserrat', sans-serif" }}>
                Únete a nosotros
              </span>
              
              <div 
                className="text-4xl leading-tight mb-2 outline-none whitespace-nowrap overflow-hidden text-ellipsis cursor-text" 
                style={{ color: secondary, fontFamily: "'Alex Brush', cursive", textShadow: `0px 1px 2px ${accent}33` }}
                contentEditable="true"
                suppressContentEditableWarning={true}
                spellCheck="false"
              >
                Ana & Carlos
              </div>
              
              <div className="w-16 h-[1px] my-5 mx-auto" style={{ backgroundColor: accent, opacity: 0.8 }}></div>
              
              <p className="text-[10px] tracking-widest uppercase mb-2 font-medium" style={{ color: secondary, fontFamily: "'Montserrat', sans-serif" }}>Sábado, 25 de Octubre</p>
              <p className="text-xs italic" style={{ color: secondary, opacity: 0.8 }}>Dos mil veintiséis</p>
            </div>
          </div>

          <button 
            onClick={() => toggleFlip(false)}
            className="w-full py-4 font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 relative z-20 hover:brightness-110"
            style={{ backgroundColor: secondary, color: base, fontFamily: "'Montserrat', sans-serif" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver
          </button>
        </div>

      </div>
    </div>
  );
};

function App() {
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('');
  const [activeFilter, setActiveFilter] = useState("Todas");
  
  // Estados para la IA de color
  const [customColor, setCustomColor] = useState('#D2691E');
  const [generatedPalettes, setGeneratedPalettes] = useState([]);

  const handleCopy = (color) => {
    navigator.clipboard.writeText(color);
    setToastMessage(`¡Copiado al portapapeles!`);
    setToastColor(color);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const filteredPalettes = activeFilter === "Todas" 
    ? palettes 
    : palettes.filter(p => p.tags.includes(activeFilter));

  const handleGenerate = () => {
    const newPalettes = generateHarmonies(customColor);
    setGeneratedPalettes(newPalettes);
    // Hacemos scroll suave a la sección generada
    setTimeout(() => {
      document.getElementById('generated-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] font-sans text-gray-900 py-16 px-4 sm:px-6 lg:px-8 relative selection:bg-rose-100 selection:text-rose-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-12 sm:mb-20">
          <h1 className="text-4xl md:text-6xl font-serif text-gray-800 mb-4 md:mb-6 tracking-tight">
            Color Nupcial <span className="text-rose-500 font-light">&</span> Co.
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide text-lg md:text-xl leading-relaxed">
            Descubre paletas seleccionadas siguiendo la proporción perfecta <br className="hidden md:block" />
            <span className="font-medium text-gray-700 bg-white px-2 py-1 rounded shadow-sm">60%</span> base, 
            <span className="font-medium text-gray-700 bg-white px-2 py-1 rounded shadow-sm mx-1">30%</span> secundario y 
            <span className="font-medium text-gray-700 bg-white px-2 py-1 rounded shadow-sm">10%</span> acento.
          </p>
        </header>

        {/* Sección: Crea tu Propia Paleta (IA) */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-12 sm:mb-20 max-w-4xl mx-auto text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200"></div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 mb-2 mt-2">Crea tu Propia Paleta</h2>
          <p className="text-gray-500 mb-8 font-light text-sm sm:text-base">Nuestra Inteligencia de Diseño calculará las combinaciones matemáticas perfectas para tu color base.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-inner border-4 border-gray-50 flex-shrink-0 cursor-pointer group">
               <input 
                 type="color" 
                 value={customColor} 
                 onChange={(e) => setCustomColor(e.target.value)}
                 className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none p-0 m-0"
                 title="Selecciona tu Color Base"
               />
               <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                 <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
               </div>
            </div>
            
            <div className="flex flex-col text-center sm:text-left items-center sm:items-start w-full sm:w-auto">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Color Seleccionado</span>
              <span className="text-xl sm:text-2xl font-mono text-gray-800 mb-5">{customColor.toUpperCase()}</span>
              <button 
                onClick={handleGenerate}
                className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto justify-center text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-gray-200 flex items-center gap-3 transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                Generar Armonías
              </button>
            </div>
          </div>
        </section>

        {generatedPalettes.length > 0 && (
          <div id="generated-section" className="mb-16 sm:mb-24 scroll-mt-10">
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
              <h3 className="text-2xl sm:text-3xl font-serif text-gray-800 whitespace-nowrap">Tus Paletas Generadas</h3>
              <div className="h-px bg-gray-200 flex-grow"></div>
              <button onClick={() => setGeneratedPalettes([])} className="text-sm font-medium text-gray-400 hover:text-rose-500 transition-colors shrink-0 px-3 py-1 bg-gray-50 rounded-md">Limpiar Resultados</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {generatedPalettes.map((palette, index) => (
                <PaletteCard key={`gen-${index}`} palette={palette} onCopy={handleCopy} />
              ))}
            </div>
          </div>
        )}

        {/* Filtros para la Colección */}
        <div className="flex items-center gap-4 mb-6 sm:mb-10">
          <h3 className="text-2xl sm:text-3xl font-serif text-gray-800 whitespace-nowrap">Colección Premium</h3>
          <div className="h-px bg-gray-200 flex-grow"></div>
        </div>

        {/* Contenedor de filtros con scroll horizontal en móviles */}
        <div className="flex overflow-x-auto sm:flex-wrap justify-start sm:justify-center gap-3 mb-10 px-2 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`snap-center shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeFilter === filter 
                  ? 'bg-gray-800 text-white border-gray-800 shadow-md transform -translate-y-0.5' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {filteredPalettes.map((palette, index) => (
            <PaletteCard 
              key={palette.nombre} 
              palette={palette} 
              onCopy={handleCopy} 
            />
          ))}
        </div>
        
        {filteredPalettes.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-light">
            No hay paletas disponibles en esta categoría.
          </div>
        )}
        
        <footer className="mt-28 text-center text-sm text-gray-400 font-light tracking-wide pb-8 border-t border-gray-200 pt-12">
          <p>Creado para inspirar bodas inolvidables.</p>
        </footer>
      </div>

      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl transition-all duration-300 z-[60] ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
      >
        <div className="w-5 h-5 rounded-full shadow-sm border border-white/20" style={{ backgroundColor: toastColor }}></div>
        <span className="font-medium tracking-wide text-sm">{toastMessage}</span>
      </div>
    </div>
  );
}

export default App;
