import { useState, useEffect, useCallback, useRef } from "react";
import {
  Menu, X, ChevronRight, ChevronLeft, Instagram, Facebook,
  Phone, MapPin, Mail, ArrowRight, ShoppingBag, Plus, Minus,
  Trash2, Heart, Star, ChevronDown, Truck, RefreshCw, Ruler, Package, Quote
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════ */
const WA    = "573001234567";
const WA_MSG = encodeURIComponent("¡Hola! Quiero ver las sandalias disponibles 👡");
const ROSE  = "#d69f96";
const PEACH = "#e6b294";
const fmt   = (n: number) => `$ ${n.toLocaleString("es-CO")}`;

/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */
interface ColorOption { name: string; hex: string }
interface Product {
  id: number; name: string; price: number; originalPrice?: number; tag: string | null;
  img: string; alt: string; stars: number; reviews: number;
  colors: ColorOption[]; images: string[];
  description: string; specs: string; care: string;
}
interface CartItem { id: number; name: string; price: number; img: string; qty: number }
interface Review {
  id: number; name: string; avatar: string; rating: number;
  comment: string; date: string; productName?: string; type: "business" | "product";
}

/* ══════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════ */
const PRODUCTS: Product[] = [
  { id:1, name:"Sandalia Tacón Rosa", price:189900, originalPrice:259900, tag:"OFERTA",
    img:"https://images.unsplash.com/photo-1554238113-6d3dbed5cf55?w=600&h=700&fit=crop&auto=format", alt:"Sandalia tacón rosa", stars:5, reviews:42,
    colors:[{name:"Rosa viejo",hex:"#c8877e"},{name:"Nude",hex:"#d4a574"},{name:"Negro",hex:"#1a1a1a"}],
    images:["https://images.unsplash.com/photo-1554238113-6d3dbed5cf55?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1662132090920-060bba5cdf18?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1689193504554-358af52b681a?w=900&h=1100&fit=crop&auto=format"],
    description:"Sandalia de tacón fino con correas cruzadas en cuero sintético premium. Ideal para ocasiones especiales, cenas y eventos nocturnos. Femenina, elegante y atemporal.",
    specs:"Material: Cuero sintético premium\nTacón: 9 cm stiletto\nSuela: Antideslizante\nCierre: Hebilla metálica dorada\nTallas: 35 – 40",
    care:"Limpiar con paño húmedo. No sumergir en agua. Guardar en bolsa de tela. Evitar sol prolongado.",
  },
  { id:2, name:"Sandalia Plana Joya", price:129900, originalPrice:179900, tag:"OFERTA",
    img:"https://images.unsplash.com/photo-1777979925976-723230e37453?w=600&h=700&fit=crop&auto=format", alt:"Sandalia plana joya", stars:5, reviews:87,
    colors:[{name:"Dorado",hex:"#c9a84c"},{name:"Plateado",hex:"#b0b8c1"},{name:"Nude",hex:"#d4a574"}],
    images:["https://images.unsplash.com/photo-1777979925976-723230e37453?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1619510331283-a46c425e48bb?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1638859436319-662beea3bfa8?w=900&h=1100&fit=crop&auto=format"],
    description:"Sandalia plana con piedras joya artesanales. Perfecta para playa y looks bohemios. Su detalle decorativo la convierte en favorita de la temporada.",
    specs:"Material: Sintético y yute\nTacón: Plana\nAdornos: Piedras facetadas\nCierre: Ajustable\nTallas: 35 – 40",
    care:"Evitar agua prolongada. Limpiar adornos con paño seco. Guardar en caja original.",
  },
  { id:3, name:"Sandalia Strappy Nude", price:159900, tag:"NUEVO",
    img:"https://images.unsplash.com/photo-1621525271268-6431feda56b0?w=600&h=700&fit=crop&auto=format", alt:"Sandalia strappy nude", stars:4, reviews:31,
    colors:[{name:"Beige",hex:"#e8d5b7"},{name:"Blanco",hex:"#f5ede8"},{name:"Caramelo",hex:"#c48a4e"}],
    images:["https://images.unsplash.com/photo-1621525271268-6431feda56b0?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1605445175147-8d2340ea9065?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1660632530070-1f543fd36fb2?w=900&h=1100&fit=crop&auto=format"],
    description:"Diseño minimal con correas finas que estilizan el pie. Tono nude ideal para combinar con cualquier outfit. Ligera y cómoda para el día a día.",
    specs:"Material: Eco-cuero\nTacón: 4 cm cuña\nCorreas: 4 tiras ajustables\nSuela: Flexible\nTallas: 35 – 40",
    care:"Limpiar con paño suave. No mojar. Guardar en lugar fresco.",
  },
  { id:4, name:"Sandalia Taco Fino", price:219900, tag:"NUEVO",
    img:"https://images.unsplash.com/photo-1627141792925-eddee39cf275?w=600&h=700&fit=crop&auto=format", alt:"Sandalia taco fino negro", stars:5, reviews:56,
    colors:[{name:"Negro",hex:"#1a1a1a"},{name:"Burdeos",hex:"#6d2b3d"},{name:"Nude",hex:"#d4a574"}],
    images:["https://images.unsplash.com/photo-1627141792925-eddee39cf275?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1512664401326-cd1a54ccd52d?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1662132090867-57a37fa1edf8?w=900&h=1100&fit=crop&auto=format"],
    description:"El clásico taco fino que no puede faltar en tu armario. Elegante, versátil y atemporal. Para la oficina, fiestas o una noche especial.",
    specs:"Material: Cuero sintético\nTacón: 11 cm stiletto\nSuela: Antideslizante\nCierre: Hebilla dorada\nTallas: 35 – 40",
    care:"Limpiar con paño húmedo. Usar protector de tacón. Guardar verticalmente.",
  },
  { id:5, name:"Sandalia Boho Café", price:149900, originalPrice:199900, tag:"OFERTA",
    img:"https://images.unsplash.com/photo-1662132090920-060bba5cdf18?w=600&h=700&fit=crop&auto=format", alt:"Sandalia boho café", stars:4, reviews:19,
    colors:[{name:"Café",hex:"#7a4a2a"},{name:"Cognac",hex:"#a0522d"},{name:"Natural",hex:"#d4a574"}],
    images:["https://images.unsplash.com/photo-1662132090920-060bba5cdf18?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1742392888098-dfd806a8a9f9?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1619510331283-a46c425e48bb?w=900&h=1100&fit=crop&auto=format"],
    description:"Inspirada en el estilo boho-chic con detalles trenzados en cuero legítimo. Artesanal y cálida, perfecta para conectar con la naturaleza.",
    specs:"Material: Cuero legítimo trenzado\nTacón: Plana ergonómica\nCierre: Correa tobillo\nTallas: 35 – 40",
    care:"Crema hidratante para cuero. Evitar lluvia. Guardar en bolsa transpirable.",
  },
  { id:6, name:"Sandalia Casual Nude", price:139900, originalPrice:189900, tag:"OFERTA",
    img:"https://images.unsplash.com/photo-1662132090867-57a37fa1edf8?w=600&h=700&fit=crop&auto=format", alt:"Sandalia casual nude", stars:4, reviews:28,
    colors:[{name:"Nude",hex:"#d4a574"},{name:"Blanco",hex:"#f5ede8"},{name:"Rosa claro",hex:"#f0c4b8"}],
    images:["https://images.unsplash.com/photo-1662132090867-57a37fa1edf8?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1660632530070-1f543fd36fb2?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1605445175147-8d2340ea9065?w=900&h=1100&fit=crop&auto=format"],
    description:"La sandalia del día a día. Cómoda, liviana y versátil. Para el mercado, la universidad o una tarde con amigas.",
    specs:"Material: Sintético suave\nTacón: Plana\nPlantilla: Memory foam\nTallas: 35 – 40",
    care:"Lavar con agua fría y jabón suave. Secar a la sombra.",
  },
  { id:7, name:"Sandalia Elegance Negra", price:199900, tag:null,
    img:"https://images.unsplash.com/photo-1512664401326-cd1a54ccd52d?w=600&h=700&fit=crop&auto=format", alt:"Sandalia strappy negra", stars:5, reviews:63,
    colors:[{name:"Negro",hex:"#1a1a1a"},{name:"Burdeos",hex:"#6d2b3d"},{name:"Nude",hex:"#d4a574"}],
    images:["https://images.unsplash.com/photo-1512664401326-cd1a54ccd52d?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1627141792925-eddee39cf275?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1689193504554-358af52b681a?w=900&h=1100&fit=crop&auto=format"],
    description:"Sandalia elegante con múltiples correas en cuero negro. Resalta la silueta del pie con sofisticación. Combina con vestidos, pantalones y más.",
    specs:"Material: Cuero sintético\nTacón: 8 cm bloque\nCorreas: 5 tiras cruzadas\nTallas: 35 – 40",
    care:"Limpiar con gamuza suave. Aplicar brillo de cuero mensualmente.",
  },
  { id:8, name:"Sandalia Verano Blanca", price:169900, tag:"NUEVO",
    img:"https://images.unsplash.com/photo-1750659902036-4fa1dc6cec6e?w=600&h=700&fit=crop&auto=format", alt:"Sandalia verano blanca", stars:5, reviews:74,
    colors:[{name:"Blanco",hex:"#f5ede8"},{name:"Beige",hex:"#e8d5b7"},{name:"Arena",hex:"#c9a878"}],
    images:["https://images.unsplash.com/photo-1750659902036-4fa1dc6cec6e?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1638859436319-662beea3bfa8?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1742392888098-dfd806a8a9f9?w=900&h=1100&fit=crop&auto=format"],
    description:"Fresca, ligera y veraniega. El must-have de la temporada. Perfecta para la playa o una tarde bajo el sol cucuteño.",
    specs:"Material: Sintético lavable\nTacón: Plana con corcho\nSuela: Extra flexible\nTallas: 35 – 40",
    care:"Lavable con agua y esponja. Secar al sol. Apta para piscina.",
  },
  { id:9, name:"Sandalia Flat Floral", price:119900, originalPrice:159900, tag:"OFERTA",
    img:"https://images.unsplash.com/photo-1619510331283-a46c425e48bb?w=600&h=700&fit=crop&auto=format", alt:"Sandalia plana floral", stars:4, reviews:38,
    colors:[{name:"Natural",hex:"#d4a574"},{name:"Mostaza",hex:"#c9973a"},{name:"Terracota",hex:"#b05a3a"}],
    images:["https://images.unsplash.com/photo-1619510331283-a46c425e48bb?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1777979925976-723230e37453?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1662132090920-060bba5cdf18?w=900&h=1100&fit=crop&auto=format"],
    description:"Diseño floral bordado a mano. Única, artesanal y llena de carácter. Para la mujer que expresa su personalidad en cada detalle.",
    specs:"Material: Yute con bordado floral\nTacón: Plana\nDetalles: Bordado artesanal\nTallas: 35 – 40",
    care:"No lavar a máquina. Limpiar a mano con paño húmedo suavemente.",
  },
  { id:10, name:"Sandalia Blanca Tacón", price:179900, tag:null,
    img:"https://images.unsplash.com/photo-1595970487296-8818e128ac4b?w=600&h=700&fit=crop&auto=format", alt:"Sandalia blanca tacón", stars:5, reviews:51,
    colors:[{name:"Blanco",hex:"#f5ede8"},{name:"Crema",hex:"#e8d5b7"},{name:"Rosa pálido",hex:"#f0c4b8"}],
    images:["https://images.unsplash.com/photo-1595970487296-8818e128ac4b?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1554238113-6d3dbed5cf55?w=900&h=1100&fit=crop&auto=format","https://images.unsplash.com/photo-1662132090867-57a37fa1edf8?w=900&h=1100&fit=crop&auto=format"],
    description:"Elegancia en blanco puro. Perfecta para matrimonios, graduaciones y eventos formales. Sofisticada sin sacrificar comodidad.",
    specs:"Material: Cuero patent\nTacón: 7 cm cuadrado\nSuela: Microporosa\nCierre: Correa tobillo\nTallas: 35 – 40",
    care:"Limpiar con gamuza blanca. Proteger con spray impermeable antes de usar.",
  },
];

const SALE_PRODUCTS = PRODUCTS.filter((p) => p.tag === "OFERTA");
const BEST_SELLERS  = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 6);

const HERO_SLIDES = [
  { tag:"Nueva Colección 2025", title:"Sandalias que\nhablan por ti.", sub:"Diseño femenino, comodidad y elegancia en cada paso.", img:"https://images.unsplash.com/photo-1763558978011-55404124a148?w=1800&h=1100&fit=crop&auto=format&crop=top", alt:"Mujer con sandalias" },
  { tag:"Tendencia", title:"Brilla en\ncada ocasión.", sub:"Artesanales con materiales premium. Para el día y la noche.", img:"https://images.unsplash.com/photo-1764238385987-2ffa021755a1?w=1800&h=1100&fit=crop&auto=format&crop=top", alt:"Mujer elegante" },
  { tag:"Ofertas Especiales", title:"Tu estilo,\ntu precio.", sub:"Hasta 40% de descuento en estilos seleccionados.", img:"https://images.unsplash.com/photo-1763637896840-9f3cb4529d01?w=1800&h=1100&fit=crop&auto=format&crop=top", alt:"Mujer con outfit" },
];

const GALLERY = [
  "https://images.unsplash.com/photo-1763558978011-55404124a148?w=500&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1777979925976-723230e37453?w=500&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1662132090920-060bba5cdf18?w=500&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1621525271268-6431feda56b0?w=500&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1764238385987-2ffa021755a1?w=500&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1554238113-6d3dbed5cf55?w=500&h=500&fit=crop&auto=format",
];

const REVIEWS: Review[] = [
  { id:1,  name:"María Camila Torres",  avatar:"M", rating:5, comment:"¡Increíble atención! Me ayudaron a encontrar el par perfecto para mi graduación. Las sandalias son exactamente como en las fotos, calidad espectacular.", date:"hace 2 días",    type:"business" },
  { id:2,  name:"Laura Rodríguez",      avatar:"L", rating:5, comment:"Compré las de joya y me enamoré. Las uso todos los días en la playa. Son cómodísimas y se ven hermosas.", date:"hace 5 días",    type:"product", productName:"Sandalia Plana Joya" },
  { id:3,  name:"Valentina Niño",       avatar:"V", rating:5, comment:"El mejor negocio de sandalias en Cúcuta, sin duda. Variedad enorme, precios justos y la atención es muy personalizada.", date:"hace 1 semana",  type:"business" },
  { id:4,  name:"Isabella Guerrero",    avatar:"I", rating:5, comment:"Llegué sin saber qué quería y salí con 3 pares 😂 Me encantaron las strappy nude, son perfectas para combinar con todo.", date:"hace 1 semana",  type:"product", productName:"Sandalia Strappy Nude" },
  { id:5,  name:"Sofía Castellanos",    avatar:"S", rating:4, comment:"Muy buena calidad para el precio. Las de tacón fino son ideales para la oficina. Las recomiendo totalmente.", date:"hace 2 semanas",  type:"product", productName:"Sandalia Taco Fino" },
  { id:6,  name:"Daniela Prada",        avatar:"D", rating:5, comment:"Pedí por WhatsApp y me respondieron súper rápido. Llegaron en perfecto estado. El empaque es muy bonito, parece regalo.", date:"hace 2 semanas",  type:"business" },
  { id:7,  name:"Alejandra Mora",       avatar:"A", rating:5, comment:"Las boho café son las más lindas que he tenido. El cuero es genuino, se nota la calidad artesanal. Volveré pronto 💕", date:"hace 3 semanas",  type:"product", productName:"Sandalia Boho Café" },
  { id:8,  name:"Natalia Quintero",     avatar:"N", rating:5, comment:"CALZADO JB es el sitio de referencia para sandalias en la ciudad. Siempre tienen lo último en tendencias y a buen precio.", date:"hace 1 mes",    type:"business" },
];

const SIZE_GUIDE = [
  { size:35, cm:"22.0", eu:"35", us:"5"   },
  { size:36, cm:"23.0", eu:"36", us:"6"   },
  { size:37, cm:"24.0", eu:"37", us:"7"   },
  { size:38, cm:"25.0", eu:"38", us:"7.5" },
  { size:39, cm:"25.5", eu:"39", us:"8.5" },
  { size:40, cm:"26.0", eu:"40", us:"9"   },
];

/* ══════════════════════════════════════════════════════════
   SMALL ATOMS
══════════════════════════════════════════════════════════ */
function WaIcon({ size=14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" style={{width:size,height:size}} className="fill-white shrink-0">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function Stars({ n, sm }: { n: number; sm?: boolean }) {
  const s = sm ? 10 : 12;
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => <Star key={i} size={s} fill={i<=n?ROSE:"none"} stroke={i<=n?ROSE:"#ccc"} />)}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SIZE GUIDE MODAL
══════════════════════════════════════════════════════════ */
function SizeGuideModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-background w-full max-w-md shadow-2xl z-10" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-bold text-lg" style={{fontFamily:"'Playfair Display',serif"}}>Guía de Tallas</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Mide tu pie en cm para encontrar tu talla ideal</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={18}/></button>
        </div>

        {/* How to measure */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-start gap-3 p-3 rounded-sm mb-4" style={{background:`${ROSE}15`,border:`1px solid ${ROSE}33`}}>
            <Ruler size={16} style={{color:ROSE,marginTop:2,flexShrink:0}}/>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Coloca tu pie sobre una hoja, marca el talón y el dedo más largo. Mide esa distancia en centímetros y busca tu talla en la tabla.
            </p>
          </div>

          {/* Table */}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{background:ROSE}}>
                {["Talla CO","Largo (cm)","EU","US"].map((h) => (
                  <th key={h} className="text-white text-xs font-semibold py-2.5 px-3 text-left tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((row, i) => (
                <tr key={row.size} style={{background: i%2===0 ? "white" : `${ROSE}08`}} className="border-b border-border/50">
                  <td className="py-2.5 px-3 font-bold" style={{color:ROSE}}>{row.size}</td>
                  <td className="py-2.5 px-3 text-foreground">{row.cm} cm</td>
                  <td className="py-2.5 px-3 text-foreground">{row.eu}</td>
                  <td className="py-2.5 px-3 text-foreground">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-[11px] text-muted-foreground mt-4 italic">
            * Si tu pie está entre dos tallas, te recomendamos elegir la talla mayor. ¿Dudas? Escríbenos por WhatsApp.
          </p>
        </div>

        <div className="px-6 pb-5">
          <a href={`https://wa.me/${WA}?text=${encodeURIComponent("¡Hola! Necesito ayuda para encontrar mi talla 👡")}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 text-sm uppercase tracking-wide text-white font-medium hover:opacity-90 transition-opacity"
            style={{background:"#25D366"}}>
            <WaIcon/> Pedir asesoría de talla
          </a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ACCORDION — exclusive (one open at a time)
══════════════════════════════════════════════════════════ */
function AccordionItem({ id, openId, setOpenId, title, children, icon }: {
  id: string; openId: string|null; setOpenId: (id: string|null) => void;
  title: string; children: React.ReactNode; icon?: React.ReactNode;
}) {
  const open = openId === id;
  return (
    <div className="border-b border-border">
      <button onClick={() => setOpenId(open ? null : id)}
        className="w-full flex items-center justify-between py-4 text-left group">
        <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground group-hover:opacity-70 transition-opacity">
          {icon}{title}
        </span>
        <ChevronDown size={15} className={`text-muted-foreground transition-transform duration-300 ${open?"rotate-180":""}`}/>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open?"max-h-96 pb-4":"max-h-0"}`}>
        <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════════════════════════ */
function ProductCard({ p, onAdd, wishlist, toggleWish, onView }: {
  p: Product; onAdd: (p:Product)=>void;
  wishlist: Set<number>; toggleWish:(id:number)=>void; onView:(p:Product)=>void;
}) {
  const disc = p.originalPrice ? Math.round((1-p.price/p.originalPrice)*100) : 0;
  return (
    <div className="group flex flex-col cursor-pointer" onClick={() => onView(p)}>
      <div className="relative overflow-hidden bg-secondary" style={{aspectRatio:"3/4"}}>
        <img src={p.img} alt={p.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
        {p.tag && (
          <span className="absolute top-2 left-2 z-10 text-white text-[10px] px-2 py-1 tracking-widest font-semibold"
            style={{fontFamily:"'DM Mono',monospace",background:p.tag==="OFERTA"?"#c0392b":ROSE}}>
            {p.tag==="OFERTA"&&disc>0?`-${disc}%`:p.tag}
          </span>
        )}
        <button onClick={(e)=>{e.stopPropagation();toggleWish(p.id);}}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
          <Heart size={14} fill={wishlist.has(p.id)?ROSE:"none"} stroke={wishlist.has(p.id)?ROSE:"#999"}/>
        </button>
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={(e)=>{e.stopPropagation();onAdd(p);}}
            className="w-full py-3 text-white text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2"
            style={{background:ROSE}}>
            <ShoppingBag size={13}/> Añadir al carrito
          </button>
        </div>
      </div>
      <div className="flex gap-1.5 mt-2">
        {p.colors.map((c) => (
          <span key={c.name} title={c.name} className="w-3 h-3 rounded-full border border-white shadow-sm" style={{background:c.hex}}/>
        ))}
      </div>
      <div className="mt-1">
        <div className="flex items-center gap-1"><Stars n={p.stars} sm/><span className="text-[10px] text-muted-foreground">({p.reviews})</span></div>
        <h4 className="text-xs sm:text-sm font-medium text-foreground mt-0.5 leading-snug group-hover:opacity-70 transition-opacity">{p.name}</h4>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-sm font-bold" style={{color:ROSE}}>{fmt(p.price)}</span>
          {p.originalPrice && <span className="text-xs text-muted-foreground line-through">{fmt(p.originalPrice)}</span>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SALE MARQUEE — never pauses unless mousedown
══════════════════════════════════════════════════════════ */
function SaleMarquee({ onAdd, wishlist, toggleWish, onView }: {
  onAdd:(p:Product)=>void; wishlist:Set<number>; toggleWish:(id:number)=>void; onView:(p:Product)=>void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const items = [...SALE_PRODUCTS,...SALE_PRODUCTS,...SALE_PRODUCTS];

  const pause  = () => { if(trackRef.current) trackRef.current.style.animationPlayState="paused"; };
  const resume = () => { if(trackRef.current) trackRef.current.style.animationPlayState="running"; };

  return (
    <section className="py-10 overflow-hidden" style={{background:"linear-gradient(135deg,#fdeee9 0%,#fdf3ee 50%,#fde8e0 100%)"}}>
      <div className="flex flex-col items-center mb-7 px-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-px w-10 sm:w-20" style={{background:`linear-gradient(to right,transparent,${ROSE})`}}/>
          <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground" style={{fontFamily:"'DM Mono',monospace"}}>ofertas especiales</span>
          <div className="h-px w-10 sm:w-20" style={{background:`linear-gradient(to left,transparent,${ROSE})`}}/>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold" style={{fontFamily:"'Playfair Display',serif"}}>
          ✦ Hasta <span style={{color:ROSE}}>40% off</span> ✦
        </h2>
        <p className="text-[11px] text-muted-foreground mt-1">Mantén presionado para pausar</p>
      </div>

      <div className="relative select-none">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none" style={{background:"linear-gradient(to right,#fdeee9,transparent)"}}/>
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none" style={{background:"linear-gradient(to left,#fdeee9,transparent)"}}/>

        <div ref={trackRef} className="flex gap-3 sm:gap-4 w-max"
          style={{animation:"marquee 38s linear infinite"}}
          onMouseDown={pause} onMouseUp={resume} onMouseLeave={resume}
          onTouchStart={pause} onTouchEnd={resume}>
          {items.map((p, i) => {
            const disc = p.originalPrice ? Math.round((1-p.price/p.originalPrice)*100) : 0;
            const wide = i%3===1;
            return (
              <div key={i} onClick={() => onView(p)}
                className="relative shrink-0 overflow-hidden group cursor-pointer"
                style={{width:wide?220:175,height:290,borderRadius:2}}>
                <img src={p.img} alt={p.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                <div className="absolute inset-0" style={{background:"linear-gradient(to top,rgba(43,21,16,.85) 0%,rgba(43,21,16,.05) 55%,transparent 100%)"}}/>

                {/* Ribbon */}
                <div className="absolute top-0 left-0 overflow-hidden" style={{width:58,height:58}}>
                  <div className="absolute font-bold text-white text-[10px] text-center leading-tight"
                    style={{background:"#c0392b",width:78,transform:"rotate(-45deg) translate(-20px,-4px)",padding:"4px 0",fontFamily:"'DM Mono',monospace"}}>
                    -{disc}%
                  </div>
                </div>

                <button onClick={(e)=>{e.stopPropagation();toggleWish(p.id);}}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center z-10">
                  <Heart size={11} fill={wishlist.has(p.id)?ROSE:"none"} stroke={wishlist.has(p.id)?ROSE:"#999"}/>
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <p className="text-white text-xs font-semibold leading-snug mb-1">{p.name}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-white">{fmt(p.price)}</span>
                    {p.originalPrice && <span className="text-[10px] text-white/55 line-through">{fmt(p.originalPrice)}</span>}
                  </div>
                  <button onClick={(e)=>{e.stopPropagation();onAdd(p);}}
                    className="w-full py-1.5 text-[11px] tracking-widest uppercase font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{background:ROSE}}>
                    + Carrito
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   ADVERTISING BANNER (aparece cada 40 s)
══════════════════════════════════════════════════════════ */
function AdBanner({ onView, onAdd }: { onView:(p:Product)=>void; onAdd:(p:Product)=>void }) {
  const [visible, setVisible]   = useState(false);
  const [product, setProduct]   = useState<Product>(BEST_SELLERS[0]);
  const [adType,  setAdType]    = useState<"sale"|"best">("best");
  const cycleRef = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  const showAd = useCallback(() => {
    cycleRef.current++;
    const isSale = cycleRef.current % 2 === 0;
    const pool = isSale ? SALE_PRODUCTS : BEST_SELLERS;
    setAdType(isSale ? "sale" : "best");
    setProduct(pool[cycleRef.current % pool.length]);
    setVisible(true);
    hideTimer.current = setTimeout(() => setVisible(false), 9000);
  }, []);

  useEffect(() => {
    const t = setInterval(showAd, 40000);
    return () => { clearInterval(t); if(hideTimer.current) clearTimeout(hideTimer.current); };
  }, [showAd]);

  const dismiss = () => { setVisible(false); if(hideTimer.current) clearTimeout(hideTimer.current); };

  const disc = product.originalPrice ? Math.round((1-product.price/product.originalPrice)*100) : 0;

  return (
    <div
      className="fixed bottom-24 right-4 sm:right-6 z-50 w-64 sm:w-72 shadow-2xl transition-all duration-500"
      style={{
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Label */}
      <div className="flex items-center justify-between px-3 py-2" style={{background: adType==="sale"?"#c0392b":ROSE}}>
        <span className="text-white text-[10px] tracking-widest uppercase font-bold" style={{fontFamily:"'DM Mono',monospace"}}>
          {adType==="sale" ? "🔥 Oferta especial" : "⭐ Más vendida"}
        </span>
        <button onClick={dismiss} className="text-white/80 hover:text-white transition-colors"><X size={13}/></button>
      </div>

      <div className="bg-background flex gap-3 p-3">
        <div className="shrink-0 overflow-hidden bg-secondary" style={{width:72,height:90}}>
          <img src={product.img} alt={product.name} className="w-full h-full object-cover"/>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground leading-snug">{product.name}</p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-sm font-bold" style={{color:ROSE}}>{fmt(product.price)}</span>
              {product.originalPrice && <span className="text-[10px] text-muted-foreground line-through">{fmt(product.originalPrice)}</span>}
              {disc>0 && <span className="text-[10px] text-white font-bold px-1" style={{background:"#c0392b"}}>-{disc}%</span>}
            </div>
          </div>
          <div className="flex gap-1.5 mt-2">
            <button onClick={()=>{onView(product);dismiss();}}
              className="flex-1 py-1.5 text-[10px] tracking-wide uppercase text-white font-semibold"
              style={{background:ROSE}}>
              Ver
            </button>
            <button onClick={()=>{onAdd(product);dismiss();}}
              className="flex-1 py-1.5 text-[10px] tracking-wide uppercase text-white font-semibold flex items-center justify-center gap-1"
              style={{background:"#2b1510"}}>
              <ShoppingBag size={10}/> Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   REVIEWS SECTION
══════════════════════════════════════════════════════════ */
function ReviewsSection() {
  const [tab, setTab]   = useState<"all"|"business"|"product">("all");
  const filtered = tab==="all" ? REVIEWS : REVIEWS.filter(r => r.type===tab);
  const avg = (REVIEWS.reduce((s,r) => s+r.rating, 0)/REVIEWS.length).toFixed(1);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-10 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 sm:w-20" style={{background:`linear-gradient(to right,transparent,${ROSE})`}}/>
            <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground" style={{fontFamily:"'DM Mono',monospace"}}>Lo que dicen</span>
            <div className="h-px w-12 sm:w-20" style={{background:`linear-gradient(to left,transparent,${ROSE})`}}/>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold" style={{fontFamily:"'Playfair Display',serif"}}>Reseñas</h2>

          {/* Overall rating */}
          <div className="flex flex-col items-center mt-6 gap-2">
            <div className="flex items-center gap-3">
              <span className="text-5xl font-black" style={{fontFamily:"'Playfair Display',serif",color:ROSE}}>{avg}</span>
              <div className="flex flex-col gap-1">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => <Star key={i} size={18} fill={i<=Math.round(Number(avg))?ROSE:"none"} stroke={i<=Math.round(Number(avg))?ROSE:"#ccc"}/>)}
                </div>
                <span className="text-xs text-muted-foreground">{REVIEWS.length} reseñas verificadas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex border border-border overflow-hidden">
            {[["all","Todas"],["business","Negocio"],["product","Productos"]].map(([key,label]) => (
              <button key={key} onClick={() => setTab(key as any)}
                className="px-4 sm:px-6 py-2.5 text-xs tracking-widest uppercase font-medium transition-colors duration-150"
                style={{
                  background: tab===key ? ROSE : "transparent",
                  color: tab===key ? "white" : "#9a6e65",
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="relative p-5 flex flex-col gap-3" style={{background:"#fdf6f2",border:`1px solid ${ROSE}33`}}>
              {/* Ornament corners */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l" style={{borderColor:ROSE}}/>
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r" style={{borderColor:ROSE}}/>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l" style={{borderColor:ROSE}}/>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r" style={{borderColor:ROSE}}/>

              <Quote size={18} style={{color:ROSE,opacity:0.4}}/>
              <p className="text-sm text-foreground/80 leading-relaxed flex-1 italic" style={{fontFamily:"'Playfair Display',serif"}}>
                "{r.comment}"
              </p>
              {r.productName && (
                <span className="text-[10px] px-2 py-0.5 self-start font-medium" style={{background:`${ROSE}22`,color:ROSE,fontFamily:"'DM Mono',monospace"}}>
                  {r.productName}
                </span>
              )}
              <div className="flex items-center justify-between mt-1 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{background:ROSE}}>
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.date}</p>
                  </div>
                </div>
                <Stars n={r.rating} sm/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   PRODUCT DETAIL PAGE
══════════════════════════════════════════════════════════ */
function ProductDetail({ p, onBack, onAdd, wishlist, toggleWish }: {
  p: Product; onBack:()=>void; onAdd:(p:Product)=>void;
  wishlist:Set<number>; toggleWish:(id:number)=>void;
}) {
  const [imgIdx,    setImgIdx]    = useState(0);
  const [selColor,  setSelColor]  = useState(p.colors[0].name);
  const [selSize,   setSelSize]   = useState<number|null>(null);
  const [qty,       setQty]       = useState(1);
  const [sizeErr,   setSizeErr]   = useState(false);
  const [addedMsg,  setAddedMsg]  = useState(false);
  const [openAccId, setOpenAccId] = useState<string|null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const disc = p.originalPrice ? Math.round((1-p.price/p.originalPrice)*100) : 0;

  useEffect(() => { window.scrollTo({top:0,behavior:"smooth"}); }, []);
  useEffect(() => { setImgIdx(0); setSelColor(p.colors[0].name); setSelSize(null); setQty(1); setSizeErr(false); setOpenAccId(null); }, [p.id]);

  const handleAdd = () => {
    if(!selSize){ setSizeErr(true); return; }
    for(let i=0;i<qty;i++) onAdd(p);
    setAddedMsg(true);
    setTimeout(()=>setAddedMsg(false),2200);
  };

  const waMsg = encodeURIComponent(`¡Hola! Quiero pedir:\n${p.name}\nTalla: ${selSize||"?"} · Color: ${selColor}\nPrecio: ${fmt(p.price)} 👡`);
  const productReviews = REVIEWS.filter(r => r.productName === p.name);

  return (
    <div className="min-h-screen bg-background">
      {showGuide && <SizeGuideModal onClose={()=>setShowGuide(false)}/>}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <button onClick={onBack} className="hover:text-foreground transition-colors flex items-center gap-1">
            <ChevronLeft size={13}/> Tienda
          </button>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{p.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 md:py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">

          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden bg-secondary" style={{aspectRatio:"4/5"}}>
              {p.images.map((img,i) => (
                <img key={i} src={img} alt={`${p.alt} ${i+1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  style={{opacity:i===imgIdx?1:0}}/>
              ))}
              {p.tag && (
                <span className="absolute top-3 left-3 text-white text-xs px-3 py-1 font-bold tracking-widest z-10"
                  style={{fontFamily:"'DM Mono',monospace",background:p.tag==="OFERTA"?"#c0392b":ROSE}}>
                  {p.tag==="OFERTA"&&disc>0?`-${disc}%`:p.tag}
                </span>
              )}
              <button onClick={()=>setImgIdx((i)=>(i-1+3)%3)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm z-10"><ChevronLeft size={16}/></button>
              <button onClick={()=>setImgIdx((i)=>(i+1)%3)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm z-10"><ChevronRight size={16}/></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {p.images.map((img,i) => (
                <button key={i} onClick={()=>setImgIdx(i)} className="overflow-hidden bg-secondary transition-all" style={{aspectRatio:"1/1",outline:i===imgIdx?`2px solid ${ROSE}`:"2px solid transparent",outlineOffset:2}}>
                  <img src={img} alt={`Vista ${i+1}`} className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground" style={{fontFamily:"'DM Mono',monospace"}}>CALZADO JB · Sandalias</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 mb-2" style={{fontFamily:"'Playfair Display',serif"}}>{p.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Stars n={p.stars}/>
                <span className="text-xs text-muted-foreground">({p.reviews} reseñas)</span>
                {productReviews.length>0 && <span className="text-xs" style={{color:ROSE}}>· {productReviews.length} comentarios</span>}
              </div>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold" style={{fontFamily:"'Playfair Display',serif",color:ROSE}}>{fmt(p.price)}</span>
              {p.originalPrice && <span className="text-lg text-muted-foreground line-through">{fmt(p.originalPrice)}</span>}
              {disc>0 && <span className="text-xs px-2 py-0.5 text-white font-bold" style={{background:"#c0392b"}}>-{disc}%</span>}
            </div>

            <div className="h-px bg-border"/>

            {/* Colors */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2">
                Color: <span className="font-normal text-muted-foreground">{selColor}</span>
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {p.colors.map((c) => (
                  <button key={c.name} onClick={()=>setSelColor(c.name)} title={c.name}
                    className="w-8 h-8 rounded-full hover:scale-110 transition-all duration-200"
                    style={{background:c.hex,boxShadow:selColor===c.name?`0 0 0 2px white,0 0 0 4px ${ROSE}`:"0 1px 3px rgba(0,0,0,.2)"}}/>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold tracking-widest uppercase">
                  Talla: <span className="font-normal text-muted-foreground">{selSize||"Selecciona"}</span>
                </p>
                <button onClick={()=>setShowGuide(true)} className="flex items-center gap-1 text-xs underline underline-offset-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Ruler size={11}/> Guía de tallas
                </button>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {[35,36,37,38,39,40].map((sz) => (
                  <button key={sz} onClick={()=>{setSelSize(sz);setSizeErr(false);}}
                    className="w-11 h-11 text-sm font-medium border transition-all duration-150 hover:scale-105"
                    style={{borderColor:selSize===sz?ROSE:"rgba(43,21,16,.15)",background:selSize===sz?ROSE:"white",color:selSize===sz?"white":"#2b1510"}}>
                    {sz}
                  </button>
                ))}
              </div>
              {sizeErr && <p className="text-[11px] mt-1.5" style={{color:"#c0392b"}}>⚠ Por favor selecciona una talla.</p>}
            </div>

            {/* Qty */}
            <div className="flex items-center gap-4">
              <p className="text-xs font-semibold tracking-widest uppercase">Cantidad</p>
              <div className="flex items-center border border-border">
                <button onClick={()=>setQty((q)=>Math.max(1,q-1))} className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"><Minus size={13}/></button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button onClick={()=>setQty((q)=>q+1)} className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"><Plus size={13}/></button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              <button onClick={handleAdd}
                className="flex items-center justify-center gap-2 w-full py-4 text-sm tracking-widest uppercase font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{background:addedMsg?"#4caf50":ROSE}}>
                <ShoppingBag size={15}/> {addedMsg?"¡Agregado!":"Agregar al carrito"}
              </button>
              <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 text-sm tracking-widest uppercase font-semibold text-white hover:opacity-90 transition-opacity"
                style={{background:"#25D366"}}>
                <WaIcon size={15}/> Comprar por WhatsApp
              </a>
              <button onClick={()=>toggleWish(p.id)}
                className="flex items-center justify-center gap-2 w-full py-3.5 text-sm tracking-widest uppercase font-medium border transition-colors duration-200"
                style={{borderColor:wishlist.has(p.id)?ROSE:"rgba(43,21,16,.15)",color:wishlist.has(p.id)?ROSE:"#2b1510"}}>
                <Heart size={14} fill={wishlist.has(p.id)?ROSE:"none"} stroke={wishlist.has(p.id)?ROSE:"currentColor"}/>
                {wishlist.has(p.id)?"Guardado en favoritos":"Agregar a favoritos"}
              </button>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2.5 text-xs" style={{background:`${ROSE}12`,border:`1px solid ${ROSE}33`}}>
              <Truck size={14} style={{color:ROSE,flexShrink:0}}/>
              <span className="text-foreground/70">Envío en Cúcuta · Pedidos por WhatsApp</span>
            </div>

            {/* Accordion */}
            <div className="border-t border-border">
              <AccordionItem id="desc" openId={openAccId} setOpenId={setOpenAccId} title="Descripción" icon={<Package size={14} style={{color:ROSE}}/>}>
                <p>{p.description}</p>
              </AccordionItem>
              <AccordionItem id="specs" openId={openAccId} setOpenId={setOpenAccId} title="Especificaciones" icon={<Ruler size={14} style={{color:ROSE}}/>}>
                <p className="whitespace-pre-line">{p.specs}</p>
              </AccordionItem>
              <AccordionItem id="care" openId={openAccId} setOpenId={setOpenAccId} title="Cuidados" icon={<span style={{color:ROSE,fontSize:14,lineHeight:1}}>✦</span>}>
                <p>{p.care}</p>
              </AccordionItem>
              <AccordionItem id="ship" openId={openAccId} setOpenId={setOpenAccId} title="Envíos y devoluciones" icon={<Truck size={14} style={{color:ROSE}}/>}>
                <div className="space-y-2.5">
                  <p><strong>Envío:</strong> Entregas en Cúcuta y área metropolitana. Pedidos por WhatsApp con confirmación en el día.</p>
                  <p><strong>Tiempo:</strong> 24–48 horas hábiles dentro de Cúcuta.</p>
                  <p><strong>Cambios:</strong> Dentro de los 5 días siguientes, sin uso y con empaque original.</p>
                  <p><strong>Devoluciones:</strong> Por defecto de fabricación. Contáctanos con foto del producto.</p>
                  <button className="flex items-center gap-1.5 text-xs underline underline-offset-2 mt-1" style={{color:ROSE}}>
                    <RefreshCw size={11}/> Conoce aquí los cuidados y política completa
                  </button>
                </div>
              </AccordionItem>
            </div>

            {/* Product reviews */}
            {productReviews.length > 0 && (
              <div className="mt-2">
                <h3 className="text-base font-bold mb-3" style={{fontFamily:"'Playfair Display',serif"}}>Reseñas de este producto</h3>
                <div className="space-y-3">
                  {productReviews.map((r) => (
                    <div key={r.id} className="p-4" style={{background:"#fdf6f2",border:`1px solid ${ROSE}22`}}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{background:ROSE}}>{r.avatar}</div>
                          <div>
                            <p className="text-xs font-semibold">{r.name}</p>
                            <p className="text-[10px] text-muted-foreground">{r.date}</p>
                          </div>
                        </div>
                        <Stars n={r.rating} sm/>
                      </div>
                      <p className="text-xs text-foreground/70 italic" style={{fontFamily:"'Playfair Display',serif"}}>"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION HEADER
══════════════════════════════════════════════════════════ */
function SH({ label, title, right }: { label:string; title:string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-8 md:mb-12">
      <div>
        <span className="text-xs tracking-[0.3em] uppercase mb-2 block" style={{fontFamily:"'DM Mono',monospace",color:ROSE}}>{label}</span>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold" style={{fontFamily:"'Playfair Display',serif"}}>{title}</h2>
      </div>
      {right}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════ */
export default function App() {
  const [view,          setView]          = useState<"home"|"product">("home");
  const [activeProduct, setActiveProduct] = useState<Product|null>(null);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [slide,         setSlide]         = useState(0);
  const [cartOpen,      setCartOpen]      = useState(false);
  const [cart,          setCart]          = useState<CartItem[]>([]);
  const [wishlist,      setWishlist]      = useState<Set<number>>(new Set());

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((s)=>(s+1)%HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const openProduct  = useCallback((p:Product) => { setActiveProduct(p); setView("product"); }, []);
  const closeProduct = useCallback(() => { setActiveProduct(null); setView("home"); }, []);

  const addToCart = useCallback((p:Product) => {
    setCart((prev) => {
      const ex = prev.find(i=>i.id===p.id);
      return ex ? prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i)
                : [...prev,{id:p.id,name:p.name,price:p.price,img:p.img,qty:1}];
    });
    setCartOpen(true);
  }, []);

  const updateQty = (id:number,d:number) =>
    setCart(prev=>prev.map(i=>i.id===id?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0));

  const toggleWish = (id:number) =>
    setWishlist(prev=>{ const s=new Set(prev); s.has(id)?s.delete(id):s.add(id); return s; });

  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const cartTotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const waCartMsg = encodeURIComponent("¡Hola! Quiero pedir:\n"+cart.map(i=>`• ${i.qty}x ${i.name} — ${fmt(i.price)}`).join("\n")+`\n\nTotal: ${fmt(cartTotal)}`);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" style={{fontFamily:"'DM Sans',sans-serif"}}>

      <style>{`
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        @keyframes floatUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .hero-anim { animation: floatUp .65s ease forwards; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:${ROSE}; border-radius:2px; }
      `}</style>

      {/* Announcement */}
      <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-[10px] sm:text-[11px] tracking-widest uppercase">
        Envío gratis &gt; $200.000 · Cúcuta, Norte de Santander
      </div>

      {/* Navbar */}
      <header className={`sticky top-0 z-50 border-b border-border transition-all duration-300 ${scrolled?"bg-background/96 backdrop-blur-md shadow-sm":"bg-background"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 md:h-[72px]">
            <button onClick={closeProduct} className="flex flex-col leading-none shrink-0">
              <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight" style={{fontFamily:"'Playfair Display',serif",color:ROSE}}>CALZADO</span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.4em] uppercase -mt-0.5" style={{fontFamily:"'DM Mono',monospace",color:PEACH}}>JB</span>
            </button>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {["Colección","Más Vendidas","Ofertas","Nosotras","Contacto"].map(l=>(
                <a key={l} href="#" className="text-sm text-foreground/65 hover:text-foreground transition-colors relative group">
                  {l}<span className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{background:ROSE}}/>
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button onClick={()=>setCartOpen(true)} className="relative p-1" aria-label="Carrito">
                <ShoppingBag size={21}/>
                {cartCount>0 && (
                  <span className="absolute -top-1 -right-1 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{background:ROSE}}>
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="lg:hidden p-1" onClick={()=>setMenuOpen(!menuOpen)}>
                {menuOpen?<X size={22}/>:<Menu size={22}/>}
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-background border-t border-border px-5 pb-5 pt-3 shadow-lg">
            {["Colección","Más Vendidas","Ofertas","Nosotras","Contacto"].map(l=>(
              <a key={l} href="#" className="block py-3 text-sm border-b border-border/40 last:border-0 text-foreground/75 hover:text-foreground transition-colors" onClick={()=>setMenuOpen(false)}>{l}</a>
            ))}
          </div>
        )}
      </header>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={()=>setCartOpen(false)}/>
          <div className="w-full max-w-sm bg-background h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={17} style={{color:ROSE}}/>
                <h2 className="font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>
                  Mi carrito {cartCount>0&&<span className="text-sm font-normal text-muted-foreground">({cartCount})</span>}
                </h2>
              </div>
              <button onClick={()=>setCartOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={19}/></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.length===0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-16 text-center">
                  <ShoppingBag size={36} className="opacity-20"/>
                  <p className="text-muted-foreground text-sm">Tu carrito está vacío</p>
                  <button onClick={()=>setCartOpen(false)} className="text-xs tracking-widest uppercase underline underline-offset-2" style={{color:ROSE}}>Seguir comprando</button>
                </div>
              ) : cart.map(item=>(
                <div key={item.id} className="flex gap-3 pb-4 border-b border-border last:border-0">
                  <div className="shrink-0 overflow-hidden bg-secondary" style={{width:68,height:84}}>
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium leading-snug">{item.name}</h4>
                    <p className="text-sm font-bold mt-0.5" style={{color:ROSE}}>{fmt(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={()=>updateQty(item.id,-1)} className="w-6 h-6 border border-border flex items-center justify-center hover:border-foreground"><Minus size={10}/></button>
                      <span className="text-sm font-medium w-5 text-center">{item.qty}</span>
                      <button onClick={()=>updateQty(item.id,1)} className="w-6 h-6 border border-border flex items-center justify-center hover:border-foreground"><Plus size={10}/></button>
                      <button onClick={()=>updateQty(item.id,-item.qty)} className="ml-auto text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={13}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length>0 && (
              <div className="px-5 py-4 border-t border-border space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-bold text-lg" style={{fontFamily:"'Playfair Display',serif",color:ROSE}}>{fmt(cartTotal)}</span>
                </div>
                <a href={`https://wa.me/${WA}?text=${waCartMsg}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-sm tracking-wide uppercase text-white font-medium hover:opacity-90 transition-opacity"
                  style={{background:"#25D366"}}>
                  <WaIcon/> Comprar por WhatsApp
                </a>
                <button className="flex items-center justify-center w-full py-3.5 text-sm tracking-wide uppercase border border-foreground hover:bg-foreground hover:text-background transition-colors duration-200">
                  Comprar en línea
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ad Banner */}
      <AdBanner onView={openProduct} onAdd={addToCart}/>

      {/* ── PRODUCT DETAIL ── */}
      {view==="product" && activeProduct ? (
        <>
          <ProductDetail p={activeProduct} onBack={closeProduct} onAdd={addToCart} wishlist={wishlist} toggleWish={toggleWish}/>
          <footer className="bg-primary text-primary-foreground py-7 px-4 text-center">
            <span className="text-2xl font-black" style={{fontFamily:"'Playfair Display',serif",color:ROSE}}>CALZADO</span>
            <span className="text-xs tracking-[0.4em] block" style={{fontFamily:"'DM Mono',monospace",color:PEACH}}>JB · Cúcuta</span>
            <p className="text-primary-foreground/40 text-xs mt-2">© 2025 CALZADO JB. Todos los derechos reservados.</p>
          </footer>
        </>
      ) : (

      /* ── HOME ── */
      <>
        {/* Hero */}
        <section className="relative overflow-hidden bg-secondary" style={{height:"min(92vh,680px)",minHeight:480}}>
          {HERO_SLIDES.map((s,i) => (
            <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{opacity:i===slide?1:0,zIndex:i===slide?1:0}}>
              <img src={s.img} alt={s.alt} className="absolute inset-0 w-full h-full object-cover object-top"/>
              <div className="absolute inset-0" style={{background:"linear-gradient(to right,rgba(43,21,16,.72) 0%,rgba(43,21,16,.18) 60%,transparent 100%)"}}/>
            </div>
          ))}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full">
              <div className="max-w-lg">
                <span key={`t-${slide}`} className="hero-anim inline-block text-xs tracking-[0.3em] uppercase mb-4" style={{fontFamily:"'DM Mono',monospace",color:PEACH}}>{HERO_SLIDES[slide].tag}</span>
                <h1 key={`h-${slide}`} className="hero-anim text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.95] mb-4" style={{fontFamily:"'Playfair Display',serif",whiteSpace:"pre-line"}}>{HERO_SLIDES[slide].title}</h1>
                <p className="text-white/70 text-sm sm:text-base mb-7 leading-relaxed max-w-sm">{HERO_SLIDES[slide].sub}</p>
                <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                  <a href={`https://wa.me/${WA}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 text-xs sm:text-sm tracking-wide uppercase text-white font-medium hover:opacity-90 transition-opacity"
                    style={{background:"#25D366"}}>
                    <WaIcon/> Comprar por WhatsApp
                  </a>
                  <button className="flex items-center justify-center gap-1.5 px-5 sm:px-6 py-3.5 text-xs sm:text-sm tracking-wide uppercase border border-white text-white hover:bg-white/10 transition-colors">
                    Comprar en línea <ArrowRight size={13}/>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button onClick={()=>setSlide(s=>(s-1+HERO_SLIDES.length)%HERO_SLIDES.length)} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronLeft size={16}/></button>
          <button onClick={()=>setSlide(s=>(s+1)%HERO_SLIDES.length)} className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronRight size={16}/></button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {HERO_SLIDES.map((_,i) => (
              <button key={i} onClick={()=>setSlide(i)} className="transition-all duration-300" style={{width:i===slide?22:7,height:7,borderRadius:3.5,background:i===slide?PEACH:"rgba(255,255,255,.35)"}}/>
            ))}
          </div>
        </section>

        {/* Sale Marquee */}
        <SaleMarquee onAdd={addToCart} wishlist={wishlist} toggleWish={toggleWish} onView={openProduct}/>

        {/* Collection */}
        <section className="py-14 md:py-22 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
          <SH label="Colección" title="Nuestras Sandalias"
            right={<a href="#" className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group">Ver todo<ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform"/></a>}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {PRODUCTS.map(p=><ProductCard key={p.id} p={p} onAdd={addToCart} wishlist={wishlist} toggleWish={toggleWish} onView={openProduct}/>)}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-14 md:py-22 px-4 sm:px-6 lg:px-10" style={{background:"#fdf0eb"}}>
          <div className="max-w-7xl mx-auto">
            <SH label="Favoritas" title="Las más vendidas"
              right={<div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground"><Star size={12} fill={ROSE} stroke={ROSE}/> +8.000 clientas</div>}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
              {BEST_SELLERS.map(p=><ProductCard key={p.id} p={p} onAdd={addToCart} wishlist={wishlist} toggleWish={toggleWish} onView={openProduct}/>)}
            </div>
          </div>
        </section>

        {/* Brand story */}
        <section className="py-14 md:py-22 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="relative max-w-sm mx-auto lg:max-w-none w-full">
              <div className="relative z-10 aspect-[4/5] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1768803968298-e31d64afee56?w=800&h=1000&fit=crop&auto=format&crop=top" alt="Mujer con sandalias" className="w-full h-full object-cover"/>
              </div>
              <div className="absolute -bottom-4 -right-4 w-28 h-28 sm:w-36 sm:h-36 opacity-20 -z-0" style={{background:ROSE}}/>
            </div>
            <div>
              <span className="text-xs tracking-[0.3em] uppercase mb-4 block" style={{fontFamily:"'DM Mono',monospace",color:ROSE}}>Sobre Nosotras</span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4" style={{fontFamily:"'Playfair Display',serif"}}>Hecho con amor<br/><em>para la mujer cucuteña.</em></h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">En CALZADO JB somos especialistas en sandalias femeninas. Llevamos años vistiendo los pies de las mujeres de Cúcuta con diseños que combinan elegancia, comodidad y precio justo.</p>
              <div className="grid grid-cols-3 gap-3 border-t border-border pt-6 mb-7">
                {[{num:"500+",label:"Modelos"},{num:"8K+",label:"Clientas"},{num:"#1",label:"En Cúcuta"}].map(s=>(
                  <div key={s.label}>
                    <div className="text-2xl md:text-3xl font-bold mb-0.5" style={{fontFamily:"'Playfair Display',serif",color:ROSE}}>{s.num}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
              <a href={`https://wa.me/${WA}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs tracking-widest uppercase text-white font-medium hover:opacity-90 transition-opacity"
                style={{background:ROSE}}>
                Contáctanos <ArrowRight size={13}/>
              </a>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <ReviewsSection/>

        {/* Gallery */}
        <section className="py-12 md:py-18 px-4 sm:px-6 lg:px-10" style={{background:"#fdf0eb"}}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs tracking-[0.3em] uppercase mb-2 block" style={{fontFamily:"'DM Mono',monospace",color:ROSE}}>@calzadojb</span>
              <h2 className="text-2xl sm:text-4xl font-bold" style={{fontFamily:"'Playfair Display',serif"}}>Síguenos en Instagram</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-1 sm:gap-1.5">
              {GALLERY.map((url,i)=>(
                <a key={i} href="#" className="relative overflow-hidden bg-secondary group" style={{aspectRatio:"1/1"}}>
                  <img src={url} alt={`Instagram ${i+1}`} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"/>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Instagram size={16} className="text-white"/>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Visítanos */}
        <section className="py-14 md:py-22 px-4 sm:px-6 lg:px-10 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-px w-10 sm:w-16" style={{background:`linear-gradient(to right,transparent,${ROSE})`}}/>
                <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground" style={{fontFamily:"'DM Mono',monospace"}}>Encuéntranos</span>
                <div className="h-px w-10 sm:w-16" style={{background:`linear-gradient(to left,transparent,${ROSE})`}}/>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold" style={{fontFamily:"'Playfair Display',serif"}}>Visítanos en Cúcuta</h2>
              <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto italic" style={{fontFamily:"'Playfair Display',serif"}}>"Estamos aquí para que encuentres tu sandalia perfecta."</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                {icon:<MapPin size={20} style={{color:ROSE}}/>,label:"Dirección",value:"Centro Comercial\nVentura Plaza, Cúcuta"},
                {icon:<Phone size={20} style={{color:ROSE}}/>,label:"WhatsApp",value:"+57 300 123 4567"},
                {icon:<Mail size={20} style={{color:ROSE}}/>,label:"Horarios",value:"Lun–Sáb: 9am–7pm\nDomingo: 10am–5pm"},
              ].map(card=>(
                <div key={card.label} className="relative flex flex-col items-center text-center py-8 px-5" style={{background:"#fdf6f2",border:`1px solid ${ROSE}44`}}>
                  <div className="absolute top-2 left-2 w-4 h-4 border-t border-l" style={{borderColor:ROSE}}/>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t border-r" style={{borderColor:ROSE}}/>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l" style={{borderColor:ROSE}}/>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r" style={{borderColor:ROSE}}/>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3" style={{background:`${ROSE}18`}}>{card.icon}</div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1.5" style={{fontFamily:"'DM Mono',monospace"}}>{card.label}</p>
                  <p className="text-sm font-medium whitespace-pre-line leading-relaxed" style={{fontFamily:"'Playfair Display',serif"}}>{card.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-5 gap-5 items-stretch">
              <div className="lg:col-span-3 overflow-hidden shadow-md" style={{minHeight:360,border:`1px solid ${ROSE}33`}}>
                <iframe title="CALZADO JB" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63319.38280459805!2d-72.55258882089842!3d7.893930199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6650bba9f4cc41%3A0x42aed88c51b82a2!2sCúcuta%2C%20Norte%20de%20Santander!5e0!3m2!1ses!2sco!4v1719000000000!5m2!1ses!2sco"
                  width="100%" height="100%" style={{border:0,minHeight:360,display:"block"}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
              </div>
              <div className="lg:col-span-2 flex flex-col gap-3.5 py-7 px-5 sm:px-6 relative" style={{background:"#fdf6f2",border:`1px solid ${ROSE}44`}}>
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l" style={{borderColor:ROSE}}/>
                <div className="absolute top-3 right-3 w-5 h-5 border-t border-r" style={{borderColor:ROSE}}/>
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l" style={{borderColor:ROSE}}/>
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r" style={{borderColor:ROSE}}/>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-0.5" style={{fontFamily:"'DM Mono',monospace"}}>Escríbenos</p>
                  <h3 className="text-xl font-bold" style={{fontFamily:"'Playfair Display',serif"}}>¿En qué te ayudamos?</h3>
                </div>
                <form className="flex flex-col gap-2.5 flex-1" onSubmit={e=>e.preventDefault()}>
                  {[["Nombre","text","Tu nombre"],["Teléfono","tel","300 000 0000"]].map(([label,type,ph])=>(
                    <div key={label}>
                      <label className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-1">{label}</label>
                      <input type={type} placeholder={ph} className="w-full bg-white border px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none transition-colors"
                        style={{borderColor:`${ROSE}44`}} onFocus={e=>e.target.style.borderColor=ROSE} onBlur={e=>e.target.style.borderColor=`${ROSE}44`}/>
                    </div>
                  ))}
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-1">Mensaje</label>
                    <textarea rows={3} placeholder="¿En qué te podemos ayudar?" className="w-full bg-white border px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none transition-colors resize-none"
                      style={{borderColor:`${ROSE}44`}} onFocus={e=>e.target.style.borderColor=ROSE} onBlur={e=>e.target.style.borderColor=`${ROSE}44`}/>
                  </div>
                  <div className="flex flex-col gap-2 mt-auto">
                    <a href={`https://wa.me/${WA}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 text-sm tracking-wide uppercase text-white font-medium hover:opacity-90 transition-opacity"
                      style={{background:"#25D366"}}>
                      <WaIcon/> WhatsApp
                    </a>
                    <button type="submit" className="w-full py-3 text-sm tracking-wide uppercase text-white font-medium hover:opacity-90 transition-opacity" style={{background:ROSE}}>
                      Enviar mensaje
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-10 opacity-40">
              <div className="h-px flex-1" style={{background:`linear-gradient(to right,transparent,${ROSE})`}}/>
              <Heart size={12} fill={ROSE} stroke={ROSE}/>
              <span className="text-xs" style={{color:ROSE}}>✦</span>
              <Heart size={12} fill={ROSE} stroke={ROSE}/>
              <div className="h-px flex-1" style={{background:`linear-gradient(to left,transparent,${ROSE})`}}/>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-7 mb-9">
              <div className="col-span-2 lg:col-span-1">
                <span className="text-2xl font-black block" style={{fontFamily:"'Playfair Display',serif",color:ROSE}}>CALZADO</span>
                <span className="text-xs tracking-[0.4em]" style={{fontFamily:"'DM Mono',monospace",color:PEACH}}>JB</span>
                <p className="text-primary-foreground/50 text-sm leading-relaxed mt-3 max-w-xs">Especialistas en sandalias femeninas. Cúcuta, Norte de Santander.</p>
                <div className="flex gap-4 mt-4">
                  {[Instagram,Facebook].map((Icon,i)=>(
                    <a key={i} href="#" className="transition-opacity hover:opacity-70" style={{color:ROSE}}><Icon size={18}/></a>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-[10px] tracking-widest uppercase text-primary-foreground/40 mb-4" style={{fontFamily:"'DM Mono',monospace"}}>Colecciones</h5>
                <ul className="space-y-2.5">
                  {["Sandalias Planas","Sandalias Tacón","Sandalias Strappy","Sandalias Joya","Ofertas"].map(item=>(
                    <li key={item}><a href="#" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] tracking-widest uppercase text-primary-foreground/40 mb-4" style={{fontFamily:"'DM Mono',monospace"}}>Información</h5>
                <ul className="space-y-2.5">
                  {["Sobre Nosotras","Cambios y devoluciones","Envíos","Preguntas frecuentes"].map(item=>(
                    <li key={item}><a href="#" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] tracking-widest uppercase text-primary-foreground/40 mb-4" style={{fontFamily:"'DM Mono',monospace"}}>Contacto</h5>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2 text-sm text-primary-foreground/55"><Phone size={12} style={{color:ROSE}}/> +57 300 123 4567</li>
                  <li className="flex items-center gap-2 text-sm text-primary-foreground/55"><Mail size={12} style={{color:ROSE}}/> hola@calzadojb.co</li>
                  <li className="flex items-start gap-2 text-sm text-primary-foreground/55"><MapPin size={12} className="mt-0.5 shrink-0" style={{color:ROSE}}/> Cúcuta, Norte de Santander</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-primary-foreground/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-primary-foreground/30 text-xs">© 2025 CALZADO JB. Todos los derechos reservados.</p>
              <div className="flex gap-5">
                {["Términos","Privacidad"].map(item=>(
                  <a key={item} href="#" className="text-xs text-primary-foreground/30 hover:text-primary-foreground/60 transition-colors">{item}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </>
      )}

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${WA}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-5 right-4 sm:right-5 z-50 w-13 h-13 sm:w-14 sm:h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
        style={{background:"#25D366",width:52,height:52}} aria-label="WhatsApp">
        <WaIcon size={26}/>
      </a>

    </div>
  );
}
