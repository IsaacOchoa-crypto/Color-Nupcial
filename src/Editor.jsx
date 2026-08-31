import React, { useState, useRef, useMemo } from 'react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { motion, useDragControls } from 'framer-motion';
import { generateHarmonies } from './colorUtils';

// Componente de texto arrastrable e interactivo
const DraggableText = ({ tag: Tag = 'div', className, defaultText, style }) => {
  const controls = useDragControls();

  return (
    <motion.div 
      drag 
      dragControls={controls}
      dragListener={false} // Evita que se arrastre al hacer clic en el texto editable
      dragMomentum={false}
      className="relative group flex items-center justify-center z-10 hover:z-50"
      style={{ position: 'relative' }}
    >
      {/* Manija de Arrastre (Drag Handle) */}
      <div 
        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-move text-gray-500 p-1.5 bg-white/90 rounded border border-gray-200 shadow-sm backdrop-blur transition-opacity z-50 pointer-events-auto"
        onPointerDown={(e) => controls.start(e)}
        title="Arrastrar para mover"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 2H6V8l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/>
        </svg>
      </div>
      
      {/* Texto Editable */}
      <Tag
        className={`outline-none hover:outline-dashed hover:outline-1 hover:outline-gray-300 focus:outline-solid focus:outline-2 focus:outline-rose-400 cursor-text min-w-[20px] transition-all whitespace-pre-wrap ${className}`}
        contentEditable={true}
        suppressContentEditableWarning={true}
        spellCheck={false}
        style={style}
        onPointerDown={(e) => e.stopPropagation()} // Asegura el foco del editor
      >
        {defaultText}
      </Tag>
    </motion.div>
  );
};

const Editor = () => {
  const [activeTemplate, setActiveTemplate] = useState('botanical');
  const [backgroundImage, setBackgroundImage] = useState(null);
  
  // Nuevo: Estado de Color y Tipografía
  const [baseColor, setBaseColor] = useState('#22543D'); // Verde botánico por defecto
  const [fontFamily, setFontFamily] = useState("'Playfair Display', serif");
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // IA de Color Integrada
  const palette = useMemo(() => {
    return generateHarmonies(baseColor).find(h => h.nombre === "Complementaria Dividida")?.colores || [baseColor, '#333', '#666'];
  }, [baseColor]);
  const [cBase, cSecondary, cAccent] = palette;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };

  const captureCanvas = async (pixelRatio = 2) => {
    if (!canvasRef.current) return null;
    return await htmlToImage.toPng(canvasRef.current, {
      quality: 1,
      pixelRatio: pixelRatio,
      skipFonts: false,
    });
  };

  const handleDownloadPNG = async () => {
    try {
      const dataUrl = await captureCanvas(2);
      if (!dataUrl) return;
      const link = document.createElement('a');
      link.download = 'invitacion-nupcial.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al descargar PNG:', err);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const dataUrl = await captureCanvas(3); // Mayor resolución para impresión
      if (!dataUrl) return;
      
      // Lienzo de 450x650 px
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [450, 650]
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 450, 650);
      pdf.save('invitacion-nupcial-imprenta.pdf');
    } catch (err) {
      console.error('Error al descargar PDF:', err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 border-t border-gray-200 overflow-hidden">
      
      {/* PANEL LATERAL (Herramientas - 25% aprox) */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-sm flex flex-col z-10 h-full">
        <div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-20">
          <h2 className="text-xl font-serif text-gray-800 mb-1">Estudio de Diseño</h2>
          <p className="text-[11px] text-gray-500 uppercase tracking-wide">Editor WYSIWYG Avanzado</p>
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto">
          
          {/* Herramientas de Diseño (Color y Fuente) */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Estilo Global</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm border border-gray-200 shrink-0">
                  <input 
                    type="color" 
                    value={baseColor} 
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none p-0 m-0"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-gray-500 font-bold">Color Tema (IA)</span>
                  <span className="text-xs text-gray-700 font-mono">{baseColor.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex flex-col bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase text-gray-500 font-bold mb-1">Tipografía Principal</span>
                <select 
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="bg-transparent text-sm text-gray-800 outline-none w-full border-b border-gray-200 pb-1 cursor-pointer"
                >
                  <option value="'Playfair Display', serif">Clásica (Playfair)</option>
                  <option value="'Alex Brush', cursive">Romántica (Alex Brush)</option>
                  <option value="'Montserrat', sans-serif">Moderna (Montserrat)</option>
                  <option value="'Courier New', monospace">Minimalista (Courier)</option>
                </select>
              </div>
            </div>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Plantillas Base</h3>
          <div className="space-y-4">
            {/* Plantilla Botánica */}
            <div 
              onClick={() => setActiveTemplate('botanical')}
              className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${activeTemplate === 'botanical' ? 'border-rose-400 shadow-md' : 'border-transparent hover:border-gray-200 shadow-sm'}`}
            >
              <div className="bg-[#fdfbf7] h-24 p-4 flex flex-col items-center justify-center relative">
                 <div className="absolute inset-2 border" style={{ borderColor: cSecondary }}></div>
                 <span className="font-serif text-lg" style={{ color: cBase }}>Botánico</span>
              </div>
            </div>

            {/* Plantilla Minimalista */}
            <div 
              onClick={() => setActiveTemplate('minimalist')}
              className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${activeTemplate === 'minimalist' ? 'border-rose-400 shadow-md' : 'border-transparent hover:border-gray-200 shadow-sm'}`}
            >
              <div className="bg-white h-24 p-4 flex flex-col items-center justify-center relative">
                 <div className="w-16 h-px mb-2" style={{ backgroundColor: cAccent }}></div>
                 <span className="font-sans font-light tracking-widest text-sm uppercase" style={{ color: cBase }}>Geométrico</span>
                 <div className="w-16 h-px mt-2" style={{ backgroundColor: cAccent }}></div>
              </div>
            </div>

            {/* Plantilla Fotográfica */}
            <div 
              onClick={() => setActiveTemplate('photographic')}
              className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${activeTemplate === 'photographic' ? 'border-rose-400 shadow-md' : 'border-transparent hover:border-gray-200 shadow-sm'}`}
            >
              <div className="bg-gray-800 h-24 p-4 flex flex-col items-center justify-center relative">
                 <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                 <span className="font-sans font-light text-white text-lg relative z-10" style={{ textShadow: `0 2px 4px ${cBase}` }}>Fotográfico</span>
              </div>
            </div>
          </div>

          {activeTemplate === 'photographic' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              <button onClick={() => fileInputRef.current.click()} className="w-full bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                Subir tu Foto
              </button>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-2">
          <button onClick={handleDownloadPNG} className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium shadow-sm hover:bg-gray-50 transition-all text-xs" title="Descargar Imagen Web">
            PNG (Web)
          </button>
          <button onClick={handleDownloadPDF} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium shadow-lg hover:bg-gray-800 transition-all text-xs flex items-center justify-center gap-2" title="Descargar Alta Resolución para Imprenta">
            PDF (Imprenta)
          </button>
        </div>
      </div>

      {/* LIENZO CENTRAL (Canvas - 75%) */}
      <div className="flex-1 bg-gray-100/80 flex items-center justify-center p-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="bg-white px-6 py-2 rounded-full shadow-sm text-xs font-medium tracking-widest text-gray-500 absolute top-6 flex items-center gap-2 border border-gray-200">
           <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
           Haz clic y arrastra los textos
        </div>

        {/* CONTENEDOR DE CAPTURA (Invitación) */}
        <div 
          ref={canvasRef}
          className="w-[450px] h-[650px] shadow-2xl relative overflow-hidden transition-colors duration-500"
          style={{
            backgroundColor: activeTemplate === 'botanical' ? '#fdfbf7' : activeTemplate === 'minimalist' ? '#ffffff' : '#1f2937',
            backgroundImage: activeTemplate === 'photographic' && backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >

          {/* 1. BOTÁNICO - Aplicando IA de Color y Tipografía */}
          {activeTemplate === 'botanical' && (
            <div className="absolute inset-0 p-8 flex flex-col items-center text-center">
              <div className="absolute inset-4 border-2 rounded-sm pointer-events-none" style={{ borderColor: cSecondary, opacity: 0.3 }}></div>
              <div className="absolute inset-5 border rounded-sm pointer-events-none" style={{ borderColor: cSecondary, opacity: 0.15 }}></div>
              
              <div className="text-4xl mb-6 mt-4 opacity-80 pointer-events-none" style={{ color: cBase }}>❦</div>
              
              <div className="flex-1 flex flex-col items-center w-full z-10 gap-2">
                <DraggableText tag="p" defaultText="Nos complace invitarte a celebrar nuestra boda" className="text-[10px] tracking-[0.3em] uppercase mb-6 font-sans w-full" style={{ color: cSecondary }} />
                
                {/* Nombre con tipografía seleccionable */}
                <DraggableText tag="h1" defaultText="Valeria & Mateo" className="text-6xl mb-6 font-serif w-full" style={{ color: cBase, fontFamily: fontFamily }} />
                
                <div className="w-16 h-px mb-8 pointer-events-none" style={{ backgroundColor: cAccent, opacity: 0.6 }}></div>
                
                <DraggableText tag="p" defaultText="Sábado, 25 de Octubre" className="text-sm tracking-widest uppercase mb-1 font-medium font-sans w-full" style={{ color: cSecondary }} />
                <DraggableText tag="p" defaultText="Dos mil veintiséis" className="text-xs italic mb-8 font-serif w-full" style={{ color: cSecondary, opacity: 0.8 }} />
                
                <DraggableText tag="p" defaultText="Hacienda Los Arcángeles" className="text-sm font-sans w-full" style={{ color: cBase }} />
                <DraggableText tag="p" defaultText="Ciudad de México" className="text-xs font-sans mt-1 w-full" style={{ color: cSecondary, opacity: 0.8 }} />
              </div>
              
              <div className="text-4xl mt-auto mb-4 opacity-80 rotate-180 pointer-events-none" style={{ color: cBase }}>❦</div>
            </div>
          )}

          {/* 2. MINIMALISTA - Geométrico, enfocado en el Accent Color */}
          {activeTemplate === 'minimalist' && (
            <div className="absolute inset-0 p-10 flex flex-col items-center text-center">
              <div className="absolute top-10 left-10 right-10 h-px pointer-events-none" style={{ backgroundColor: cAccent, opacity: 0.4 }}></div>
              <div className="absolute bottom-10 left-10 right-10 h-px pointer-events-none" style={{ backgroundColor: cAccent, opacity: 0.4 }}></div>
              <div className="absolute top-10 bottom-10 left-10 w-px pointer-events-none" style={{ backgroundColor: cAccent, opacity: 0.4 }}></div>
              <div className="absolute top-10 bottom-10 right-10 w-px pointer-events-none" style={{ backgroundColor: cAccent, opacity: 0.4 }}></div>
              
              <div className="flex-1 flex flex-col items-center justify-center w-full z-10 bg-white m-4 shadow-sm border border-gray-50">
                <DraggableText tag="p" defaultText="CELEBRAMOS NUESTRO AMOR" className="text-[8px] tracking-[0.5em] uppercase mb-10 font-sans w-full" style={{ color: cSecondary }} />
                
                <DraggableText tag="h1" defaultText="VALERIA" className="text-4xl tracking-widest font-sans font-light w-full" style={{ color: cBase, fontFamily: fontFamily }} />
                <DraggableText tag="span" defaultText="&" className="text-2xl my-4 font-serif italic" style={{ color: cAccent }} />
                <DraggableText tag="h1" defaultText="MATEO" className="text-4xl tracking-widest font-sans font-light mb-12 w-full" style={{ color: cBase, fontFamily: fontFamily }} />
                
                <div className="flex items-center justify-center gap-4 w-full px-10 relative">
                  <DraggableText tag="p" defaultText="25.10.2026" className="text-sm tracking-widest font-sans" style={{ color: cSecondary }} />
                </div>
                
                <DraggableText tag="p" defaultText="SALÓN EL DORADO" className="text-xs tracking-widest mt-10 mb-2 font-sans w-full" style={{ color: cBase }} />
                <DraggableText tag="p" defaultText="Recepción a las 20:00 hrs" className="text-[10px] font-sans uppercase w-full" style={{ color: cSecondary, opacity: 0.7 }} />
              </div>
            </div>
          )}

          {/* 3. FOTOGRÁFICO - Glassmorphism adaptado al color Base */}
          {activeTemplate === 'photographic' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
              <div className="absolute inset-6 backdrop-blur-md rounded-xl border pointer-events-none" style={{ backgroundColor: `${cBase}B3`, borderColor: `${cAccent}40` }}></div>
              
              {!backgroundImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-20">
                  <span className="text-white text-xl font-light tracking-widest">Sube una foto</span>
                </div>
              )}

              <div className="relative z-10 w-full flex flex-col items-center justify-center h-full text-white px-4">
                <DraggableText tag="p" defaultText="CON GRAN ALEGRÍA" className="text-xs tracking-[0.4em] uppercase mb-10 font-sans font-light opacity-90 w-full" />
                
                <DraggableText tag="h1" defaultText="Valeria & Mateo" className="text-6xl mb-4 w-full" style={{ fontFamily: fontFamily, color: cAccent, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }} />
                
                <DraggableText tag="p" defaultText="TE INVITAN A SU BODA" className="text-[9px] tracking-[0.3em] uppercase mb-10 font-sans font-light opacity-80 w-full" />
                
                <div className="px-8 py-4 rounded-lg border w-4/5 mb-6 relative group" style={{ backgroundColor: `${cSecondary}33`, borderColor: `${cAccent}40` }}>
                  <DraggableText tag="p" defaultText="25 OCT 2026" className="text-xl tracking-widest font-light mb-1 font-sans w-full" />
                  <DraggableText tag="p" defaultText="A LAS 4:00 PM" className="text-xs font-light opacity-80 font-sans w-full" />
                </div>
                
                <DraggableText tag="p" defaultText="Jardín Botánico" className="text-sm font-light tracking-wide font-sans w-full" />
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Editor;
