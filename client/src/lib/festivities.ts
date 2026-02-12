export interface DecorativeElement {
  id: string;
  name: string;
  nameEs: string;
  category: "decoration" | "sign" | "product" | "color";
  locked: boolean;
  unlockQuiz: boolean;
  svgIcon: string;
  color: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Festivity {
  id: string;
  name: string;
  nameEs: string;
  icon: string;
  color: string;
  bgGradient: string;
  description: string;
  baseElements: DecorativeElement[];
  lockedElements: DecorativeElement[];
  quiz: QuizQuestion[];
  unlockThreshold: number;
}

export const festivities: Festivity[] = [
  {
    id: "easter",
    name: "Easter",
    nameEs: "Pascua",
    icon: "egg",
    color: "#A8D8B9",
    bgGradient: "from-green-100 to-yellow-50",
    description: "Decorate your bookshop window for Easter! Use spring colours and Easter-themed decorations.",
    baseElements: [
      {
        id: "easter-egg-1",
        name: "Easter Egg",
        nameEs: "Huevo de Pascua",
        category: "decoration",
        locked: false,
        unlockQuiz: false,
        svgIcon: "egg",
        color: "#FFB6C1",
      },
      {
        id: "easter-bunny",
        name: "Bunny",
        nameEs: "Conejito",
        category: "decoration",
        locked: false,
        unlockQuiz: false,
        svgIcon: "bunny",
        color: "#F5F5DC",
      },
      {
        id: "easter-flower",
        name: "Spring Flower",
        nameEs: "Flor de primavera",
        category: "decoration",
        locked: false,
        unlockQuiz: false,
        svgIcon: "flower",
        color: "#FFD700",
      },
      {
        id: "easter-basket",
        name: "Basket",
        nameEs: "Cesta",
        category: "decoration",
        locked: false,
        unlockQuiz: false,
        svgIcon: "basket",
        color: "#DEB887",
      },
    ],
    lockedElements: [
      {
        id: "easter-chick",
        name: "Chick",
        nameEs: "Pollito",
        category: "decoration",
        locked: true,
        unlockQuiz: true,
        svgIcon: "chick",
        color: "#FFD700",
      },
      {
        id: "easter-sale-sign",
        name: "Easter SALE Sign",
        nameEs: "Cartel de REBAJAS",
        category: "sign",
        locked: true,
        unlockQuiz: true,
        svgIcon: "sale-sign",
        color: "#FF6B6B",
      },
      {
        id: "easter-butterfly",
        name: "Butterfly",
        nameEs: "Mariposa",
        category: "decoration",
        locked: true,
        unlockQuiz: true,
        svgIcon: "butterfly",
        color: "#DDA0DD",
      },
    ],
    quiz: [
      {
        id: "eq1",
        question: "What is the English word for 'escaparate'?",
        options: ["Shelf", "Window display", "Counter", "Warehouse"],
        correctIndex: 1,
        explanation: "'Window display' is the correct translation for 'escaparate' - the decorated shop window.",
      },
      {
        id: "eq2",
        question: "What animal is the symbol of Easter?",
        options: ["Cat", "Dog", "Bunny", "Bird"],
        correctIndex: 2,
        explanation: "The Easter Bunny (conejo de Pascua) is the traditional symbol of Easter.",
      },
      {
        id: "eq3",
        question: "What does 'SALE' mean in Spanish?",
        options: ["Salida", "Rebajas", "Venta libre", "Tienda"],
        correctIndex: 1,
        explanation: "'SALE' means 'Rebajas' - a reduction in prices to attract customers.",
      },
      {
        id: "eq4",
        question: "Which colour is typically associated with Spring?",
        options: ["Black", "Grey", "Green", "Brown"],
        correctIndex: 2,
        explanation: "Green is the colour of spring because it represents new growth and nature.",
      },
      {
        id: "eq5",
        question: "What is a 'price tag' in Spanish?",
        options: ["Etiqueta de precio", "Cartel", "Folleto", "Recibo"],
        correctIndex: 0,
        explanation: "A 'price tag' (etiqueta de precio) shows the cost of a product.",
      },
    ],
    unlockThreshold: 4,
  },
  {
    id: "valentines",
    name: "Valentine's Day",
    nameEs: "San Valentin",
    icon: "heart",
    color: "#FF69B4",
    bgGradient: "from-pink-100 to-red-50",
    description: "Create a romantic bookshop window for Valentine's Day!",
    baseElements: [
      { id: "val-heart", name: "Heart", nameEs: "Corazon", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "heart", color: "#FF69B4" },
      { id: "val-rose", name: "Rose", nameEs: "Rosa", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "rose", color: "#FF0000" },
      { id: "val-gift", name: "Gift Box", nameEs: "Caja de regalo", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "gift", color: "#FF1493" },
    ],
    lockedElements: [
      { id: "val-cupid", name: "Cupid", nameEs: "Cupido", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "cupid", color: "#FFB6C1" },
      { id: "val-sale", name: "Love SALE Sign", nameEs: "Cartel REBAJAS", category: "sign", locked: true, unlockQuiz: true, svgIcon: "sale-sign", color: "#FF1493" },
      { id: "val-ribbon", name: "Ribbon", nameEs: "Lazo", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "ribbon", color: "#FF69B4" },
    ],
    quiz: [
      { id: "vq1", question: "What does 'customer' mean in Spanish?", options: ["Vendedor", "Cliente", "Empleado", "Jefe"], correctIndex: 1, explanation: "'Customer' means 'cliente' - the person who buys products." },
      { id: "vq2", question: "What is a 'gift' in Spanish?", options: ["Regalo", "Compra", "Venta", "Oferta"], correctIndex: 0, explanation: "'Gift' means 'regalo' - something given to another person." },
      { id: "vq3", question: "What colour represents love?", options: ["Blue", "Green", "Red", "Yellow"], correctIndex: 2, explanation: "Red is the universal colour of love and passion." },
      { id: "vq4", question: "What does 'discount' mean?", options: ["Aumento", "Descuento", "Precio", "Impuesto"], correctIndex: 1, explanation: "'Discount' means 'descuento' - a reduction in price." },
      { id: "vq5", question: "What is a 'shop assistant'?", options: ["Dependiente", "Director", "Contador", "Limpiador"], correctIndex: 0, explanation: "A 'shop assistant' (dependiente) helps customers in a store." },
    ],
    unlockThreshold: 4,
  },
  {
    id: "spring-sale",
    name: "Spring Sale",
    nameEs: "Rebajas de Primavera",
    icon: "sun",
    color: "#98FB98",
    bgGradient: "from-green-100 to-emerald-50",
    description: "Design a fresh spring sale window display!",
    baseElements: [
      { id: "sp-flower", name: "Daisy", nameEs: "Margarita", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "daisy", color: "#FFFFFF" },
      { id: "sp-sun", name: "Sun", nameEs: "Sol", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "sun", color: "#FFD700" },
      { id: "sp-leaf", name: "Leaf", nameEs: "Hoja", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "leaf", color: "#32CD32" },
    ],
    lockedElements: [
      { id: "sp-sale", name: "Spring SALE", nameEs: "REBAJAS primavera", category: "sign", locked: true, unlockQuiz: true, svgIcon: "sale-sign", color: "#32CD32" },
      { id: "sp-bird", name: "Bird", nameEs: "Pajaro", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "bird", color: "#87CEEB" },
      { id: "sp-rainbow", name: "Rainbow", nameEs: "Arcoiris", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "rainbow", color: "#FF6347" },
    ],
    quiz: [
      { id: "sq1", question: "What does 'shelf' mean?", options: ["Suelo", "Estanteria", "Pared", "Techo"], correctIndex: 1, explanation: "'Shelf' means 'estanteria' - where products are displayed." },
      { id: "sq2", question: "What is 'spring' in Spanish?", options: ["Verano", "Otono", "Invierno", "Primavera"], correctIndex: 3, explanation: "'Spring' is 'primavera' - the season of flowers." },
      { id: "sq3", question: "What does 'buy one get one free' mean?", options: ["Compra dos", "2x1", "Gratis", "Descuento"], correctIndex: 1, explanation: "It's a promotion: buy one product and get another one free (2x1)." },
      { id: "sq4", question: "What is 'receipt' in Spanish?", options: ["Factura", "Recibo/Ticket", "Nota", "Papel"], correctIndex: 1, explanation: "'Receipt' is 'recibo/ticket' - proof of purchase." },
      { id: "sq5", question: "What does 'brand' mean?", options: ["Tipo", "Marca", "Modelo", "Clase"], correctIndex: 1, explanation: "'Brand' means 'marca' - the name of a product line." },
    ],
    unlockThreshold: 4,
  },
  {
    id: "mothers-day",
    name: "Mother's Day",
    nameEs: "Dia de la Madre",
    icon: "heart",
    color: "#DDA0DD",
    bgGradient: "from-purple-100 to-pink-50",
    description: "Create a beautiful window display for Mother's Day!",
    baseElements: [
      { id: "md-flower", name: "Bouquet", nameEs: "Ramo", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "bouquet", color: "#FF69B4" },
      { id: "md-card", name: "Card", nameEs: "Tarjeta", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "card", color: "#FFB6C1" },
      { id: "md-perfume", name: "Perfume", nameEs: "Perfume", category: "product", locked: false, unlockQuiz: false, svgIcon: "perfume", color: "#E6E6FA" },
    ],
    lockedElements: [
      { id: "md-crown", name: "Crown", nameEs: "Corona", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "crown", color: "#FFD700" },
      { id: "md-sale", name: "Mum's SALE", nameEs: "REBAJAS mama", category: "sign", locked: true, unlockQuiz: true, svgIcon: "sale-sign", color: "#DDA0DD" },
      { id: "md-stars", name: "Stars", nameEs: "Estrellas", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "stars", color: "#FFD700" },
    ],
    quiz: [
      { id: "mq1", question: "What does 'wrapping paper' mean?", options: ["Papel de carta", "Papel de regalo", "Papel higienico", "Papel de periodico"], correctIndex: 1, explanation: "'Wrapping paper' is 'papel de regalo' - used to wrap gifts." },
      { id: "mq2", question: "What is 'greeting card' in Spanish?", options: ["Tarjeta de credito", "Tarjeta de felicitacion", "Tarjeta de visita", "Postal"], correctIndex: 1, explanation: "'Greeting card' is 'tarjeta de felicitacion' - a card with a message." },
      { id: "mq3", question: "What does 'checkout' mean?", options: ["Salida", "Caja/Punto de pago", "Entrada", "Almacen"], correctIndex: 1, explanation: "'Checkout' is 'caja/punto de pago' - where you pay for items." },
      { id: "mq4", question: "What is a 'bestseller'?", options: ["Libro caro", "Libro viejo", "Libro mas vendido", "Libro raro"], correctIndex: 2, explanation: "A 'bestseller' is a 'libro mas vendido' - a very popular product." },
      { id: "mq5", question: "What does 'delivery' mean?", options: ["Devolucion", "Entrega", "Descarga", "Envio"], correctIndex: 1, explanation: "'Delivery' means 'entrega' - bringing products to customers." },
    ],
    unlockThreshold: 4,
  },
  {
    id: "summer-sale",
    name: "Summer Sale",
    nameEs: "Rebajas de Verano",
    icon: "sun",
    color: "#FFD700",
    bgGradient: "from-yellow-100 to-orange-50",
    description: "Design a hot summer sale window display!",
    baseElements: [
      { id: "ss-sun", name: "Big Sun", nameEs: "Gran Sol", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "big-sun", color: "#FFD700" },
      { id: "ss-beach", name: "Beach Ball", nameEs: "Pelota de playa", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "beach-ball", color: "#FF6347" },
      { id: "ss-ice", name: "Ice Cream", nameEs: "Helado", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "ice-cream", color: "#FFB6C1" },
    ],
    lockedElements: [
      { id: "ss-palm", name: "Palm Tree", nameEs: "Palmera", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "palm", color: "#32CD32" },
      { id: "ss-sale", name: "HOT SALE Sign", nameEs: "Cartel REBAJAS", category: "sign", locked: true, unlockQuiz: true, svgIcon: "sale-sign", color: "#FF4500" },
      { id: "ss-waves", name: "Waves", nameEs: "Olas", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "waves", color: "#4169E1" },
    ],
    quiz: [
      { id: "ssq1", question: "What does 'stock' mean?", options: ["Tienda", "Existencias", "Dinero", "Ventas"], correctIndex: 1, explanation: "'Stock' means 'existencias' - the goods available to sell." },
      { id: "ssq2", question: "What is 'summer' in Spanish?", options: ["Primavera", "Otono", "Verano", "Invierno"], correctIndex: 2, explanation: "'Summer' is 'verano' - the hottest season of the year." },
      { id: "ssq3", question: "What does 'bargain' mean?", options: ["Caro", "Ganga/Chollo", "Normal", "Lujo"], correctIndex: 1, explanation: "'Bargain' is 'ganga/chollo' - a product at a very good price." },
      { id: "ssq4", question: "What is 'sunscreen' in Spanish?", options: ["Gafas de sol", "Protector solar", "Sombrero", "Paraguas"], correctIndex: 1, explanation: "'Sunscreen' is 'protector solar' - cream to protect skin." },
      { id: "ssq5", question: "What does 'clearance' mean?", options: ["Limpieza", "Liquidacion", "Apertura", "Cierre"], correctIndex: 1, explanation: "'Clearance' means 'liquidacion' - selling all stock at low prices." },
    ],
    unlockThreshold: 4,
  },
  {
    id: "back-to-school",
    name: "Back to School",
    nameEs: "Vuelta al Cole",
    icon: "pencil",
    color: "#4169E1",
    bgGradient: "from-blue-100 to-indigo-50",
    description: "Prepare the window for the back-to-school season!",
    baseElements: [
      { id: "bts-pencil", name: "Pencil", nameEs: "Lapiz", category: "product", locked: false, unlockQuiz: false, svgIcon: "pencil", color: "#FFD700" },
      { id: "bts-notebook", name: "Notebook", nameEs: "Cuaderno", category: "product", locked: false, unlockQuiz: false, svgIcon: "notebook", color: "#4169E1" },
      { id: "bts-backpack", name: "Backpack", nameEs: "Mochila", category: "product", locked: false, unlockQuiz: false, svgIcon: "backpack", color: "#FF6347" },
    ],
    lockedElements: [
      { id: "bts-ruler", name: "Ruler", nameEs: "Regla", category: "product", locked: true, unlockQuiz: true, svgIcon: "ruler", color: "#DEB887" },
      { id: "bts-sale", name: "School SALE", nameEs: "REBAJAS cole", category: "sign", locked: true, unlockQuiz: true, svgIcon: "sale-sign", color: "#4169E1" },
      { id: "bts-abc", name: "ABC Letters", nameEs: "Letras ABC", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "abc", color: "#FF6347" },
    ],
    quiz: [
      { id: "bq1", question: "What does 'stationery' mean?", options: ["Estacion", "Material de oficina/papeleria", "Libreria", "Tienda"], correctIndex: 1, explanation: "'Stationery' means 'material de papeleria' - pens, paper, etc." },
      { id: "bq2", question: "What is 'eraser' in Spanish?", options: ["Borrador/Goma", "Lapiz", "Boligrafo", "Regla"], correctIndex: 0, explanation: "'Eraser' is 'borrador/goma' - used to rub out pencil marks." },
      { id: "bq3", question: "What does 'aisle' mean?", options: ["Isla", "Pasillo", "Sala", "Planta"], correctIndex: 1, explanation: "'Aisle' means 'pasillo' - the walkway between shelves in a shop." },
      { id: "bq4", question: "What is 'scissors' in Spanish?", options: ["Cuchillo", "Tijeras", "Cutter", "Navaja"], correctIndex: 1, explanation: "'Scissors' means 'tijeras' - used for cutting paper." },
      { id: "bq5", question: "What does 'refund' mean?", options: ["Reembolso/Devolucion", "Recargo", "Pago", "Cambio"], correctIndex: 0, explanation: "'Refund' means 'reembolso/devolucion' - getting money back." },
    ],
    unlockThreshold: 4,
  },
  {
    id: "halloween",
    name: "Halloween",
    nameEs: "Halloween",
    icon: "pumpkin",
    color: "#FF8C00",
    bgGradient: "from-orange-100 to-amber-50",
    description: "Create a spooky Halloween bookshop window!",
    baseElements: [
      { id: "hw-pumpkin", name: "Pumpkin", nameEs: "Calabaza", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "pumpkin", color: "#FF8C00" },
      { id: "hw-bat", name: "Bat", nameEs: "Murcielago", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "bat", color: "#2F2F2F" },
      { id: "hw-ghost", name: "Ghost", nameEs: "Fantasma", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "ghost", color: "#F5F5F5" },
    ],
    lockedElements: [
      { id: "hw-spider", name: "Spider Web", nameEs: "Telarana", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "spider-web", color: "#C0C0C0" },
      { id: "hw-sale", name: "Spooky SALE", nameEs: "REBAJAS terror", category: "sign", locked: true, unlockQuiz: true, svgIcon: "sale-sign", color: "#FF8C00" },
      { id: "hw-cat", name: "Black Cat", nameEs: "Gato negro", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "black-cat", color: "#2F2F2F" },
    ],
    quiz: [
      { id: "hq1", question: "What does 'trick or treat' mean?", options: ["Jugar o comer", "Truco o trato", "Dulce o salado", "Ir o venir"], correctIndex: 1, explanation: "'Trick or treat' means 'truco o trato' - children ask for sweets." },
      { id: "hq2", question: "What is 'costume' in Spanish?", options: ["Ropa", "Uniforme", "Disfraz", "Traje"], correctIndex: 2, explanation: "'Costume' means 'disfraz' - special clothes for celebrations." },
      { id: "hq3", question: "What does 'display stand' mean?", options: ["Estante de exhibicion", "Mesa", "Silla", "Espejo"], correctIndex: 0, explanation: "'Display stand' is 'estante de exhibicion' - shows products attractively." },
      { id: "hq4", question: "What is 'sweets/candy' in Spanish?", options: ["Fruta", "Galletas", "Caramelos/Golosinas", "Chocolate"], correctIndex: 2, explanation: "'Sweets/candy' are 'caramelos/golosinas'." },
      { id: "hq5", question: "What does 'spooky' mean?", options: ["Bonito", "Divertido", "Espeluznante", "Grande"], correctIndex: 2, explanation: "'Spooky' means 'espeluznante' - scary in a fun way." },
    ],
    unlockThreshold: 4,
  },
  {
    id: "black-friday",
    name: "Black Friday",
    nameEs: "Black Friday",
    icon: "tag",
    color: "#2F2F2F",
    bgGradient: "from-gray-100 to-slate-50",
    description: "Design the ultimate Black Friday deals window!",
    baseElements: [
      { id: "bf-tag", name: "Price Tag", nameEs: "Etiqueta", category: "sign", locked: false, unlockQuiz: false, svgIcon: "price-tag", color: "#FF0000" },
      { id: "bf-percent", name: "Percent Sign", nameEs: "Signo de porcentaje", category: "sign", locked: false, unlockQuiz: false, svgIcon: "percent", color: "#FFD700" },
      { id: "bf-bag", name: "Shopping Bag", nameEs: "Bolsa de compras", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "shopping-bag", color: "#2F2F2F" },
    ],
    lockedElements: [
      { id: "bf-mega", name: "MEGA SALE", nameEs: "MEGA REBAJAS", category: "sign", locked: true, unlockQuiz: true, svgIcon: "mega-sale", color: "#FF0000" },
      { id: "bf-star", name: "Star Burst", nameEs: "Estrella", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "star-burst", color: "#FFD700" },
      { id: "bf-arrow", name: "Arrow Sign", nameEs: "Flecha", category: "sign", locked: true, unlockQuiz: true, svgIcon: "arrow-sign", color: "#FF4500" },
    ],
    quiz: [
      { id: "bfq1", question: "What does 'bargain hunting' mean?", options: ["Cazar animales", "Buscar gangas", "Comprar caro", "Vender rapido"], correctIndex: 1, explanation: "'Bargain hunting' is 'buscar gangas' - looking for the best deals." },
      { id: "bfq2", question: "What is 'queue' in Spanish?", options: ["Pregunta", "Cola/Fila", "Puerta", "Calle"], correctIndex: 1, explanation: "'Queue' means 'cola/fila' - a line of people waiting." },
      { id: "bfq3", question: "What does 'sold out' mean?", options: ["En venta", "Agotado", "Nuevo", "Abierto"], correctIndex: 1, explanation: "'Sold out' means 'agotado' - no more stock available." },
      { id: "bfq4", question: "What is 'cash register'?", options: ["Dinero", "Caja registradora", "Banco", "Tarjeta"], correctIndex: 1, explanation: "'Cash register' is 'caja registradora' - the machine for payments." },
      { id: "bfq5", question: "What does 'wholesale' mean?", options: ["Minorista", "Al por mayor", "Individual", "Online"], correctIndex: 1, explanation: "'Wholesale' means 'al por mayor' - buying in large quantities." },
    ],
    unlockThreshold: 4,
  },
  {
    id: "christmas",
    name: "Christmas",
    nameEs: "Navidad",
    icon: "tree",
    color: "#228B22",
    bgGradient: "from-red-50 to-green-50",
    description: "Create a magical Christmas bookshop window!",
    baseElements: [
      { id: "xm-tree", name: "Christmas Tree", nameEs: "Arbol de Navidad", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "xmas-tree", color: "#228B22" },
      { id: "xm-star", name: "Star", nameEs: "Estrella", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "star", color: "#FFD700" },
      { id: "xm-gift", name: "Present", nameEs: "Regalo", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "present", color: "#FF0000" },
      { id: "xm-snow", name: "Snowflake", nameEs: "Copo de nieve", category: "decoration", locked: false, unlockQuiz: false, svgIcon: "snowflake", color: "#ADD8E6" },
    ],
    lockedElements: [
      { id: "xm-santa", name: "Santa Hat", nameEs: "Gorro de Papa Noel", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "santa-hat", color: "#FF0000" },
      { id: "xm-sale", name: "Xmas SALE", nameEs: "REBAJAS Navidad", category: "sign", locked: true, unlockQuiz: true, svgIcon: "sale-sign", color: "#228B22" },
      { id: "xm-candy", name: "Candy Cane", nameEs: "Baston de caramelo", category: "decoration", locked: true, unlockQuiz: true, svgIcon: "candy-cane", color: "#FF0000" },
    ],
    quiz: [
      { id: "xq1", question: "What does 'gift wrap' mean?", options: ["Papel de regalo/Envolver", "Cinta adhesiva", "Caja", "Bolsa"], correctIndex: 0, explanation: "'Gift wrap' means 'envolver en papel de regalo'." },
      { id: "xq2", question: "What is 'Boxing Day'?", options: ["Dia de boxeo", "Dia de rebajas despues de Navidad", "Dia del deporte", "Dia festivo"], correctIndex: 1, explanation: "'Boxing Day' (26 Dec) is famous for post-Christmas sales." },
      { id: "xq3", question: "What does 'loyalty card' mean?", options: ["Tarjeta de credito", "Tarjeta de fidelizacion", "Tarjeta regalo", "DNI"], correctIndex: 1, explanation: "'Loyalty card' is 'tarjeta de fidelizacion' - for regular customers." },
      { id: "xq4", question: "What is 'stocking' in Spanish?", options: ["Zapato", "Calcetin/Media de Navidad", "Guante", "Bufanda"], correctIndex: 1, explanation: "'Stocking' is 'calcetin/media de Navidad' - hung for Santa to fill." },
      { id: "xq5", question: "What does 'return policy' mean?", options: ["Politica de precios", "Politica de devolucion", "Horario", "Garantia"], correctIndex: 1, explanation: "'Return policy' is 'politica de devolucion' - rules for returning items." },
    ],
    unlockThreshold: 4,
  },
];
