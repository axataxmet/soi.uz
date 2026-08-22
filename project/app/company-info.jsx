/* Цифры страницы берутся из общего источника (siteFigures в home-page.jsx)
   и читаются геттером — в момент отрисовки, а не при загрузке файла: настройки
   из админки приезжают асинхронно, и при чтении на старте здесь навсегда
   застывали бы значения по умолчанию.
   Узбекская версия раньше несла свои числа («12» лет вместо расчёта от года
   основания) и расходилась с русской и английской. */
function _figs() { return window.siteFigures ? window.siteFigures() : { catalog: "2 800", brands: "120", regions: "14", years: "5" }; }

/* ИНДУСТРИЯ ЗДОРОВЬЯ — Company info pages with real content */

function buildInfoContent(contacts) {
return {
  service: {
    ru: { title: "Сервис и гарантия", sections: [
      { head: "Гарантийные обязательства", body: "На всё оборудование из нашего каталога предоставляется официальная гарантия производителя — 24 месяца. В гарантийный период устранение неисправностей, замена дефектных комплектующих и выезд инженера осуществляются бесплатно." },
      { head: "Наш сервисный центр", body: "Авторизованный сервисный центр ИНДУСТРИЯ ЗДОРОВЬЯ расположен в Ташкенте. Штат — 18 сертифицированных инженеров со специализацией по производителям Mindray, Dräger, Tuttnauer, BMT, Midmark и другим брендам портфеля.", list: ["Диагностика неисправностей — бесплатно", "Срок ремонта в гарантийный период — 5–7 рабочих дней", "Склад оригинальных запчастей и расходников", "Выездное обслуживание по всему Узбекистану", "Плановое техническое обслуживание по договору"] },
      { head: "Пусконаладка и обучение", body: "Для сложного оборудования (аппараты ИВЛ, наркозные, операционные столы, автоклавы класса B) наши инженеры выполняют монтаж, пусконаладку и проводят обучение медицинского персонала работе с техникой." },
      { head: "Сервисный договор", body: "По окончании гарантийного срока вы можете заключить договор планового технического обслуживания. Фиксированная стоимость, приоритетный выезд инженера, скидки на запчасти и расходные материалы." },
    ]},
    uz: { title: "Servis va kafolat", sections: [
      { head: "Kafolat majburiyatlari", body: "Katalogimizdan barcha uskunalarga ishlab chiqaruvchidan rasmiy kafolat — 24 oy beriladi. Kafolat muddatida nuqsonlarni bartaraf etish, almashtirishlar va muhandis chiqishi bepul amalga oshiriladi." },
      { head: "Bizning servis markazimiz", body: "SOG’LIQ INDUSTRIYASI vakolatli servis markazi Toshkentda joylashgan. Staffda Mindray, Dräger, Tuttnauer, BMT va boshqa brendlar bo'yicha ixtisoslashgan 18 sertifikatlangan muhandis bor.", list: ["Nosozliklarni diagnostika qilish — bepul", "Kafolat muddatida ta'mirlash muddati — 5–7 ish kuni", "Original ehtiyot qismlar va sarf materiallari ombori", "O'zbekiston bo'ylab tashrif xizmati", "Shartnoma bo'yicha rejalashtirilgan texnik xizmat"] },
    ]},
    en: { title: "Service & Warranty", sections: [
      { head: "Warranty terms", body: "All equipment from our catalogue carries an official 24-month manufacturer's warranty. During the warranty period, fault rectification, replacement of defective components and engineer visits are provided free of charge." },
      { head: "Our service centre", body: "The HEALTH INDUSTRY authorized service centre is located in Tashkent, staffed by 18 certified engineers specializing in Mindray, Dräger, Tuttnauer, BMT, Midmark and other brands.", list: ["Fault diagnostics — free of charge", "In-warranty repair lead time — 5–7 working days", "Stock of original spare parts and consumables", "On-site service across Uzbekistan", "Planned maintenance contracts available"] },
    ]}
  },
  shipping: {
    ru: { title: "Доставка и оплата", sections: [
      { head: "Сроки и регионы доставки", list: ["Ташкент (склад→клиника): 1–2 рабочих дня", "Ташкентская область и регионы-центры: 2–3 рабочих дня", "Отдалённые районы и кишлаки: 3–5 рабочих дней", "Доставка доступна во все 14 регионов РУз"] },
      { head: "Стоимость доставки", body: "Доставка бесплатна при заказе на сумму от 5 000 000 сум. При меньших суммах стоимость рассчитывается индивидуально в зависимости от габаритов, веса и адреса доставки. Крупногабаритное оборудование (операционные столы, кровати, автоклавы) — доставка специальным транспортом." },
      { head: "Способы оплаты", list: ["Безналичный расчёт (для юридических лиц по договору)", "UZCARD и HUMO (корпоративные карты)", "Онлайн-системы Payme и Click", "Государственный заказ (тендер, бюджетные закупки)", "Лизинг и рассрочка (для больниц и клиник)", "Частичная предоплата + остаток при получении"] },
      { head: "Документы при поставке", list: ["Счёт-фактура + товарная накладная", "Регистрационное удостоверение МЗ РУз", "Сертификат соответствия или декларация", "Паспорт изделия и инструкция на русском языке", "Гарантийный талон"] },
    ]},
    en: { title: "Delivery & Payment", sections: [
      { head: "Delivery times & regions", list: ["Tashkent (warehouse→clinic): 1–2 working days", "Tashkent region & regional centres: 2–3 working days", "Remote districts: 3–5 working days", "Delivery available to all 14 Uzbekistan regions"] },
      { head: "Delivery costs", body: "Free delivery on orders from 5,000,000 UZS. Below this threshold, cost is calculated individually based on size, weight and destination. Oversized equipment (operating tables, beds, autoclaves) is delivered by specialized transport." },
      { head: "Payment methods", list: ["Bank transfer (legal entities under contract)", "UZCARD and HUMO corporate cards", "Online systems Payme and Click", "Government procurement (tender, budget)", "Leasing and instalment plans", "Partial prepayment + balance on delivery"] },
    ]}
  },
  suppliers: {
    ru: { title: "Поставщикам", sections: [
      { head: "Станьте нашим партнёром", body: "ИНДУСТРИЯ ЗДОРОВЬЯ — дистрибьюторская платформа с прямым выходом на 500+ медицинских учреждений Узбекистана. Если вы производитель или официальный дистрибьютор медицинской техники, мы готовы рассмотреть партнёрство." },
      { head: "Что мы предлагаем партнёрам", list: ["Выход на базу из 500+ постоянных клиентов (больницы, клиники, частные центры)", "Тендерное сопровождение и помощь в госзакупках", "Поддержка в получении регистрационных удостоверений МЗ РУз", "Совместные маркетинговые активности и участие в выставках", "Складская логистика и сервисный центр", "Прозрачная отчётность по продажам"] },
      { head: "Требования к партнёрам", list: ["Наличие сертификата ISO 13485 или эквивалента", "Регистрационные удостоверения на продукцию (или помощь в их получении)", "Гарантия производителя на всю продукцию минимум 12 месяцев", "Наличие службы технической поддержки (или готовность к обучению наших инженеров)", "Конкурентоспособная ценовая политика"] },
      { head: "Как стать партнёром", body: `Заполните заявку или позвоните нам по номеру ${contacts.phone}. Менеджер по развитию партнёрской сети свяжется с вами в течение рабочего дня для первичного обсуждения.` },
    ]},
    en: { title: "For Suppliers", sections: [
      { head: "Become our partner", body: "HEALTH INDUSTRY is a distribution platform with direct access to 500+ medical institutions across Uzbekistan. If you are a manufacturer or authorized distributor of medical equipment, we invite you to explore a partnership." },
      { head: "What we offer partners", list: ["Access to a client base of 500+ hospitals, clinics and private centres", "Tender support and government procurement assistance", "Support in obtaining MoH Uzbekistan registration certificates", "Joint marketing activities and trade show participation", "Warehouse logistics and service centre", "Transparent sales reporting"] },
      { head: "Partner requirements", list: ["ISO 13485 certification or equivalent", "Product registration certificates (or willingness to obtain them)", "Minimum 12-month manufacturer's warranty on all products", "Technical support capacity or readiness to train our engineers", "Competitive pricing"] },
      { head: "How to join", body: `Fill out the application form or call us at ${contacts.phone}. Our partner development manager will contact you within one business day.` },
    ]}
  },
  privacy: {
    ru: { title: "Политика конфиденциальности", sections: [
      { head: "Общие положения", body: "Настоящая Политика обработки персональных данных разработана в соответствии с Законом Республики Узбекистан «О персональных данных» № ЗРУ-547 от 02.07.2019 и определяет порядок обработки и защиты персональных данных пользователей сайта ИНДУСТРИЯ ЗДОРОВЬЯ." },
      { head: "Какие данные мы собираем", list: ["Контактные данные: ФИО, наименование организации, телефон, e-mail — при оформлении запроса коммерческого предложения или регистрации", "Технические данные: cookie-файлы, IP-адрес, тип устройства и браузера — для аналитики и корректной работы сайта", "История просмотров и избранное — хранятся локально в вашем браузере"] },
      { head: "Цели обработки", list: ["Обработка заявок и подготовка коммерческих предложений", "Связь с клиентом по вопросам заказа, доставки и сервиса", "Улучшение работы сайта и аналитика", "Исполнение договорных обязательств"] },
      { head: "Хранение и локализация данных", body: "В соответствии с требованиями законодательства Республики Узбекистан о локализации, персональные данные граждан РУз обрабатываются и хранятся на серверах, расположенных на территории Республики Узбекистан. Данные хранятся в течение срока, необходимого для целей обработки, после чего удаляются." },
      { head: "Передача третьим лицам", body: "Мы не передаём персональные данные третьим лицам без согласия субъекта, за исключением случаев, предусмотренных законодательством РУз (запросы уполномоченных государственных органов)." },
      { head: "Ваши права", list: ["Получить информацию об обработке ваших данных", "Требовать уточнения, блокирования или удаления данных", "Отозвать согласие на обработку в любой момент", "Обратиться в уполномоченный орган по защите персональных данных"] },
      { head: "Cookie-файлы", body: "Сайт использует cookie для корректной работы и аналитики. Вы можете отключить cookie в настройках браузера, однако это может ограничить функциональность сайта. Управление согласием доступно через баннер при первом посещении." },
      { head: "Контакты по вопросам данных", body: `По всем вопросам обработки персональных данных обращайтесь: ${contacts.email}, ${contacts.phone}, ${contacts.address}.` },
    ]},
    uz: { title: "Maxfiylik siyosati", sections: [
      { head: "Umumiy qoidalar", body: "Ushbu shaxsiy ma'lumotlarni qayta ishlash siyosati O'zbekiston Respublikasining «Shaxsga doir ma'lumotlar to'g'risida»gi 02.07.2019 yildagi № O'RQ-547 sonli Qonuniga muvofiq ishlab chiqilgan va SOG’LIQ INDUSTRIYASI sayti foydalanuvchilarining shaxsiy ma'lumotlarini qayta ishlash va himoya qilish tartibini belgilaydi." },
      { head: "Qanday ma'lumotlarni yig'amiz", list: ["Aloqa ma'lumotlari: F.I.Sh., tashkilot nomi, telefon, e-mail — so'rov yoki ro'yxatdan o'tishda", "Texnik ma'lumotlar: cookie fayllar, IP-manzil, qurilma va brauzer turi — tahlil uchun", "Ko'rishlar tarixi va saralanganlar — brauzeringizda mahalliy saqlanadi"] },
      { head: "Qayta ishlash maqsadlari", list: ["Arizalarni qayta ishlash va tijorat takliflarini tayyorlash", "Buyurtma, yetkazib berish va servis bo'yicha mijoz bilan aloqa", "Sayt ishini yaxshilash va tahlil", "Shartnoma majburiyatlarini bajarish"] },
      { head: "Ma'lumotlarni saqlash va lokalizatsiya", body: "O'zbekiston Respublikasi qonunchiligining lokalizatsiya talablariga muvofiq, O'zR fuqarolarining shaxsiy ma'lumotlari O'zbekiston Respublikasi hududidagi serverlarda qayta ishlanadi va saqlanadi." },
      { head: "Uchinchi shaxslarga uzatish", body: "Biz shaxsiy ma'lumotlarni subyekt roziligisiz uchinchi shaxslarga uzatmaymiz, O'zR qonunchiligida nazarda tutilgan hollar bundan mustasno." },
      { head: "Sizning huquqlaringiz", list: ["Ma'lumotlaringizni qayta ishlash haqida ma'lumot olish", "Ma'lumotlarni aniqlashtirish, bloklash yoki o'chirishni talab qilish", "Rozilikni istalgan vaqtda qaytarib olish", "Vakolatli organga murojaat qilish"] },
      { head: "Cookie fayllar", body: "Sayt to'g'ri ishlashi va tahlil uchun cookie fayllaridan foydalanadi. Cookie'ni brauzer sozlamalarida o'chirishingiz mumkin, biroq bu sayt funksionalligini cheklashi mumkin." },
      { head: "Ma'lumotlar bo'yicha aloqa", body: `Shaxsiy ma'lumotlarni qayta ishlash bo'yicha barcha savollar uchun: ${contacts.email}, ${contacts.phone}, 100069, Toshkent, O'zbekiston, MKAD ko'chasi, 16-uy.` },
    ]},
    en: { title: "Privacy Policy", sections: [
      { head: "General provisions", body: "This Personal Data Processing Policy is developed in accordance with the Law of the Republic of Uzbekistan 'On Personal Data' No. ZRU-547 dated 02.07.2019 and defines how HEALTH INDUSTRY processes and protects the personal data of website users." },
      { head: "Data we collect", list: ["Contact data: full name, organization, phone, e-mail — when requesting a quote or registering", "Technical data: cookies, IP address, device and browser type — for analytics and proper site operation", "Browsing history and wishlist — stored locally in your browser"] },
      { head: "Purposes of processing", list: ["Processing requests and preparing quotes", "Communication regarding orders, delivery and service", "Improving the website and analytics", "Fulfilling contractual obligations"] },
      { head: "Data storage & localization", body: "In accordance with the data localization requirements of the Republic of Uzbekistan, personal data of Uzbek citizens is processed and stored on servers located within the Republic of Uzbekistan." },
      { head: "Transfer to third parties", body: "We do not transfer personal data to third parties without the subject's consent, except as provided by the legislation of Uzbekistan." },
      { head: "Your rights", list: ["Receive information about the processing of your data", "Request clarification, blocking or deletion of data", "Withdraw consent to processing at any time", "Contact the authorized data protection body"] },
      { head: "Cookies", body: "The site uses cookies for proper operation and analytics. You can disable cookies in your browser settings, though this may limit site functionality." },
      { head: "Data contacts", body: `For all personal data matters: ${contacts.email}, ${contacts.phone}, 100069, Tashkent, Uzbekistan, MKAD street, 16.` },
    ]},
  },
  offer: {
    ru: { title: "Публичная оферта", sections: [
      { head: "1. Общие положения", body: "Настоящий документ является публичной офертой (далее — Оферта) ООО «SOG’LIQ INDUSTRIYASI» и содержит все существенные условия поставки медицинского оборудования. Акцептом Оферты является оформление заказа или подписание спецификации/счёта." },
      { head: "2. Предмет договора", body: "Поставщик обязуется передать в собственность Покупателя медицинское оборудование и расходные материалы согласно согласованной спецификации, а Покупатель — принять и оплатить товар на условиях настоящей Оферты." },
      { head: "3. Цена и порядок расчётов", list: ["Цены указываются в сумах (UZS) с учётом НДС", "Оплата — банковским переводом по счёту, для госучреждений — через бюджетное финансирование", "Возможна рассрочка/лизинг по отдельному соглашению", "Цена фиксируется на момент выставления счёта и действует в течение срока его действия"] },
      { head: "4. Условия поставки", body: "Сроки поставки согласовываются индивидуально и указываются в спецификации. Поставка осуществляется во все регионы Республики Узбекистан. Право собственности и риски переходят к Покупателю в момент передачи товара." },
      { head: "5. Гарантии и ответственность", body: "Поставщик гарантирует соответствие товара регистрационным удостоверениям МЗ РУз и предоставляет официальную гарантию производителя. Стороны несут ответственность в соответствии с законодательством Республики Узбекистан." },
      { head: "6. Реквизиты поставщика", body: "ООО «SOG’LIQ INDUSTRIYASI», ИНН (СТИР): 300 000 000, 100069, г. Ташкент, ул. МКАД, д. 16. Полные банковские реквизиты предоставляются при заключении договора." },
    ]},
    uz: { title: "Ommaviy oferta", sections: [
      { head: "1. Umumiy qoidalar", body: "Ushbu hujjat «SOG’LIQ INDUSTRIYASI» MChJ ning ommaviy ofertasi bo'lib, tibbiy uskunalarni yetkazib berishning barcha muhim shartlarini o'z ichiga oladi. Ofertani aksept qilish — buyurtma rasmiylashtirish yoki spetsifikatsiya/hisob imzolashdir." },
      { head: "2. Shartnoma predmeti", body: "Yetkazib beruvchi kelishilgan spetsifikatsiyaga muvofiq tibbiy uskuna va sarf materiallarini Xaridor mulkiga topshirish, Xaridor esa tovarni qabul qilish va to'lash majburiyatini oladi." },
      { head: "3. Narx va hisob-kitob tartibi", list: ["Narxlar QQS hisobga olingan holda so'mda (UZS) ko'rsatiladi", "To'lov — hisob bo'yicha bank o'tkazmasi orqali", "Alohida kelishuv bo'yicha bo'lib to'lash/lizing mumkin", "Narx hisob chiqarilган paytda qayd etiladi"] },
      { head: "4. Yetkazib berish shartlari", body: "Yetkazib berish muddatlari individual kelishiladi. Yetkazib berish O'zbekiston Respublikasining barcha hududlariga amalga oshiriladi." },
      { head: "5. Kafolat va javobgarlik", body: "Yetkazib beruvchi tovarning O'zR SSV ro'yxatdan o'tkazish guvohnomalariga muvofiqligini kafolatlaydi va ishlab chiqaruvchining rasmiy kafolatini taqdim etadi." },
      { head: "6. Yetkazib beruvchi rekvizitlari", body: "«SOG’LIQ INDUSTRIYASI» MChJ, STIR: 300 000 000, 100069, Toshkent sh., MKAD ko'ch., 16-uy." },
    ]},
    en: { title: "Public Offer", sections: [
      { head: "1. General provisions", body: "This document is a public offer of HEALTH INDUSTRY LLC and contains all the essential terms for the supply of medical equipment. Acceptance of the offer is the placing of an order or signing of a specification/invoice." },
      { head: "2. Subject of the contract", body: "The Supplier undertakes to transfer ownership of medical equipment and consumables according to the agreed specification, and the Buyer to accept and pay for the goods." },
      { head: "3. Price and payment", list: ["Prices are stated in UZS including VAT", "Payment by bank transfer; budget financing for state institutions", "Instalments/leasing available under separate agreement", "Price is fixed at the time the invoice is issued"] },
      { head: "4. Delivery terms", body: "Delivery times are agreed individually. Delivery is carried out to all regions of the Republic of Uzbekistan." },
      { head: "5. Warranties and liability", body: "The Supplier guarantees compliance with MoH Uzbekistan registration certificates and provides the official manufacturer's warranty." },
      { head: "6. Supplier details", body: "HEALTH INDUSTRY LLC, TIN: 300 000 000, 100069, Tashkent, MKAD street, 16." },
    ]},
  },
  returns: {
    ru: { title: "Политика возврата и обмена", sections: [
      { head: "Право на возврат", body: "Возврат и обмен медицинского оборудования регулируется Законом Республики Узбекистан «О защите прав потребителей» и условиями договора поставки. Ввиду специфики медицинских изделий действует особый порядок." },
      { head: "Товар надлежащего качества", list: ["Оборудование в заводской упаковке, не бывшее в эксплуатации, можно вернуть в течение 10 дней", "Сохранены товарный вид, пломбы, комплектность и документы", "Расходные материалы и стерильные изделия возврату не подлежат по санитарным нормам"] },
      { head: "Товар ненадлежащего качества", body: "При обнаружении заводского дефекта в течение гарантийного срока производится бесплатный ремонт, замена или возврат средств. Срок рассмотрения — до 10 рабочих дней с момента обращения." },
      { head: "Порядок возврата", list: [`Направьте заявку на ${contacts.email} с указанием номера счёта`, "Приложите фото/описание дефекта и копии документов", "Менеджер согласует вывоз или передачу товара", "Возврат средств — на расчётный счёт в течение 10 банковских дней"] },
    ]},
    uz: { title: "Qaytarish va almashtirish siyosati", sections: [
      { head: "Qaytarish huquqi", body: "Tibbiy uskunalarni qaytarish va almashtirish O'zbekiston Respublikasining «Iste'molchilar huquqlarini himoya qilish to'g'risida»gi qonuni va yetkazib berish shartnomasi bilan tartibga solinadi." },
      { head: "Sifatli tovar", list: ["Zavod qadog'idagi, ishlatilmagan uskunani 10 kun ichida qaytarish mumkin", "Tovar ko'rinishi, plomba, butlik va hujjatlar saqlangan", "Sarf materiallar va steril mahsulotlar sanitariya normalari bo'yicha qaytarilmaydi"] },
      { head: "Sifatsiz tovar", body: "Kafolat muddatida zavod nuqsoni aniqlansa, bepul ta'mirlash, almashtirish yoki pul qaytarish amalga oshiriladi. Ko'rib chiqish muddati — 10 ish kunigacha." },
      { head: "Qaytarish tartibi", list: [`${contacts.email} ga hisob raqamini ko'rsatib ariza yuboring`, "Nuqson foto/tavsifi va hujjat nusxalarini ilova qiling", "Menejer tovarni olib ketishni kelishadi", "Pul qaytarish — 10 bank kuni ichida"] },
    ]},
    en: { title: "Return & Exchange Policy", sections: [
      { head: "Right of return", body: "Return and exchange of medical equipment is governed by the Law of the Republic of Uzbekistan 'On Consumer Protection' and the supply contract terms. A special procedure applies due to the nature of medical devices." },
      { head: "Goods of proper quality", list: ["Equipment in factory packaging, unused, may be returned within 10 days", "Appearance, seals, completeness and documents preserved", "Consumables and sterile items are non-returnable for sanitary reasons"] },
      { head: "Defective goods", body: "If a factory defect is found within the warranty period, free repair, replacement or refund is provided. Review period — up to 10 working days." },
      { head: "Return procedure", list: [`Send a request to ${contacts.email} with the invoice number`, "Attach photo/description of the defect and document copies", "A manager will arrange pickup or transfer", "Refund to the bank account within 10 banking days"] },
    ]},
  },
  service_reg: {
    ru: { title: "Сервисный регламент", sections: [
      { head: "Авторизованный сервисный центр", body: "ИНДУСТРИЯ ЗДОРОВЬЯ располагает собственным авторизованным сервисным центром в Ташкенте со штатом сертифицированных инженеров. Мы обслуживаем всё поставляемое оборудование на гарантийной и постгарантийной основе." },
      { head: "Виды обслуживания", list: ["Монтаж, пусконаладка и калибровка оборудования", "Плановое техническое обслуживание (ТО) по договору", "Гарантийный и постгарантийный ремонт", "Поставка оригинальных запчастей и расходных материалов", "Обучение медперсонала работе с техникой"] },
      { head: "Сроки реагирования", list: ["Приём заявок: пн–сб, 10:00–17:00", "Удалённая диагностика: в течение 1 рабочего дня", "Выезд инженера по Ташкенту: 1–2 рабочих дня", "Выезд в регионы: 2–5 рабочих дней"] },
      { head: "Регламентное ТО", body: "Для критичного оборудования (ИВЛ, наркозно-дыхательная аппаратура, стерилизаторы) рекомендуется заключение договора на регулярное техническое обслуживание с периодичностью согласно требованиям производителя и МЗ РУз." },
      { head: "Как оставить заявку", body: `Сервисная заявка: ${contacts.email} или ${contacts.phone}. Укажите модель, серийный номер и описание неисправности — это ускорит обработку.` },
    ]},
    uz: { title: "Servis reglamenti", sections: [
      { head: "Vakolatli servis markazi", body: "SOG’LIQ INDUSTRIYASI Toshkentda sertifikatlangan muhandislardan iborat o'z vakolatli servis markaziga ega. Biz yetkazib berilgan barcha uskunalarni kafolatli va kafolatdan keyingi asosda xizmat ko'rsatamiz." },
      { head: "Xizmat turlari", list: ["Montaj, ishga tushirish va kalibrlash", "Shartnoma bo'yicha rejali texnik xizmat (TX)", "Kafolatli va kafolatdan keyingi ta'mirlash", "Original ehtiyot qismlar yetkazib berish", "Tibbiy xodimlarni o'qitish"] },
      { head: "Javob berish muddatlari", list: ["Arizalarni qabul qilish: Du–Sh, 10:00–17:00", "Masofaviy diagnostika: 1 ish kuni ichida", "Toshkent bo'yicha muhandis chiqishi: 1–2 kun", "Hududlarga chiqish: 2–5 kun"] },
      { head: "Rejali TX", body: "Muhim uskunalar (IVL, narkoz apparati, sterilizatorlar) uchun muntazam texnik xizmat shartnomasini tuzish tavsiya etiladi." },
      { head: "Ariza qoldirish", body: `Servis arizasi: ${contacts.email} yoki ${contacts.phone}. Model, seriya raqami va nosozlik tavsifini ko'rsating.` },
    ]},
    en: { title: "Service Regulations", sections: [
      { head: "Authorized service centre", body: "HEALTH INDUSTRY operates its own authorized service centre in Tashkent staffed by certified engineers. We service all supplied equipment on a warranty and post-warranty basis." },
      { head: "Types of service", list: ["Installation, commissioning and calibration", "Scheduled maintenance under contract", "Warranty and post-warranty repair", "Supply of original spare parts and consumables", "Staff training"] },
      { head: "Response times", list: ["Request intake: Mon–Sat, 10:00–17:00", "Remote diagnostics: within 1 working day", "Engineer visit in Tashkent: 1–2 working days", "Regional visits: 2–5 working days"] },
      { head: "Scheduled maintenance", body: "For critical equipment (ventilators, anaesthesia machines, sterilizers) we recommend a regular maintenance contract per manufacturer and MoH requirements." },
      { head: "How to request service", body: `Service request: ${contacts.email} or ${contacts.phone}. Provide the model, serial number and fault description.` },
    ]},
  },
  licenses: {
    ru: { title: "Лицензии и сертификаты", sections: [
      { head: "Регистрационные удостоверения", body: "Всё поставляемое оборудование имеет регистрационные удостоверения Министерства здравоохранения Республики Узбекистан, подтверждающие право обращения медицинских изделий на территории РУз." },
      { head: "Сертификаты соответствия", body: "Продукция сопровождается сертификатами соответствия техническим регламентам, а также сертификатами качества и происхождения от заводов-изготовителей." },
      { head: "Документы компании", list: ["Свидетельство о государственной регистрации ООО «SOG’LIQ INDUSTRIYASI»", "Лицензия на оптовую/розничную реализацию медицинских изделий", "Авторизационные письма от производителей (дистрибьюторские соглашения)", "Сертификаты ISO системы менеджмента качества"] },
      { head: "Получить копии документов", body: `Полный пакет документов на конкретную позицию предоставляется по запросу при подготовке коммерческого предложения. Обращайтесь: ${contacts.email}.` },
    ]},
    uz: { title: "Litsenziya va sertifikatlar", sections: [
      { head: "Ro'yxatdan o'tkazish guvohnomalari", body: "Yetkazib beriladigan barcha uskunalar O'zbekiston Respublikasi Sog'liqni saqlash vazirligining ro'yxatdan o'tkazish guvohnomalariga ega." },
      { head: "Muvofiqlik sertifikatlari", body: "Mahsulot texnik reglamentlarga muvofiqlik sertifikatlari, shuningdek ishlab chiqaruvchilardan sifat va kelib chiqish sertifikatlari bilan ta'minlanadi." },
      { head: "Kompaniya hujjatlari", list: ["«SOG’LIQ INDUSTRIYASI» MChJ davlat ro'yxatidan o'tkazilganlik guvohnomasi", "Tibbiy mahsulotlarni sotish litsenziyasi", "Ishlab chiqaruvchilardan avtorizatsiya xatlari", "ISO sifat menejmenti sertifikatlari"] },
      { head: "Hujjat nusxalarini olish", body: `Aniq pozitsiya bo'yicha to'liq hujjatlar to'plami so'rov bo'yicha taqdim etiladi: ${contacts.email}.` },
    ]},
    en: { title: "Licenses & Certificates", sections: [
      { head: "Registration certificates", body: "All supplied equipment holds Ministry of Health of Uzbekistan registration certificates confirming the right to circulate medical devices in Uzbekistan." },
      { head: "Conformity certificates", body: "Products come with conformity certificates to technical regulations, as well as quality and origin certificates from manufacturers." },
      { head: "Company documents", list: ["Certificate of state registration of HEALTH INDUSTRY LLC", "License for wholesale/retail sale of medical devices", "Authorization letters from manufacturers (distribution agreements)", "ISO quality management system certificates"] },
      { head: "Obtain document copies", body: `A full document package for a specific item is provided on request when preparing a quote. Contact: ${contacts.email}.` },
    ]},
  },
  gov: {
    ru: { title: "Для государственных закупок", sections: [
      { head: "Надёжный поставщик для госсектора", body: "ИНДУСТРИЯ ЗДОРОВЬЯ — проверенный поставщик медицинского оборудования для государственных и бюджетных учреждений здравоохранения Республики Узбекистан. Мы работаем с государственными закупками в полном соответствии с законодательством." },
      { head: "Участие в тендерах и закупках", list: ["Участие в торгах на портале xarid.uzex.uz и других площадках", "Подготовка полного пакета тендерной документации", "Гарантийное обеспечение заявок и контрактов", "Соблюдение требований к локализации и регистрации медизделий"] },
      { head: "Документы для бюджетных организаций", list: ["Регистрационные удостоверения МЗ РУз на все позиции", "Сертификаты соответствия и происхождения", "Коммерческие предложения с фиксированными ценами", "Полный комплект бухгалтерских документов (счёт-фактура, накладная)"] },
      { head: "Условия для госучреждений", body: "Работаем по предоплате и постоплате через бюджетное финансирование, предоставляем рассрочку. Возможна поставка под конкретную спецификацию тендера с монтажом, пусконаладкой и обучением персонала." },
      { head: "Связаться по госзакупкам", body: `Отдел тендеров и госзакупок: ${contacts.email}, ${contacts.phone}. Направьте техническое задание — подготовим коммерческое предложение в течение 1 рабочего дня.` },
    ]},
    uz: { title: "Davlat xaridlari uchun", sections: [
      { head: "Davlat sektori uchun ishonchli yetkazib beruvchi", body: "SOG’LIQ INDUSTRIYASI — O'zbekiston Respublikasi davlat va byudjet sog'liqni saqlash muassasalari uchun tibbiy uskunalarning ishonchli yetkazib beruvchisi. Biz davlat xaridlari bilan qonunchilikка to'liq muvofiq ishlaymiz." },
      { head: "Tender va xaridlarda ishtirok", list: ["xarid.uzex.uz portalida va boshqa maydonlarda savdolarda ishtirok", "To'liq tender hujjatlarini tayyorlash", "Arizalar va shartnomalar kafolat ta'minoti", "Lokalizatsiya va ro'yxatga olish talablariga rioya qilish"] },
      { head: "Byudjet tashkilotlari uchun hujjatlar", list: ["Barcha pozitsiyalar bo'yicha SSV guvohnomalari", "Muvofiqlik va kelib chiqish sertifikatlari", "Belgilangan narxli tijorat takliflari", "To'liq buxgalteriya hujjatlari to'plami"] },
      { head: "Davlat muassasalari uchun shartlar", body: "Byudjet moliyalashtirish orqali oldindan va keyin to'lash bilan ishlaymiz, bo'lib to'lash taqdim etamiz. Aniq tender spetsifikatsiyasi bo'yicha montaj va o'qitish bilan yetkazib berish mumkin." },
      { head: "Davlat xaridlari bo'yicha aloqa", body: `Tender va davlat xaridlari bo'limi: ${contacts.email}, ${contacts.phone}.` },
    ]},
    en: { title: "For Government Procurement", sections: [
      { head: "A reliable supplier for the public sector", body: "HEALTH INDUSTRY is a trusted supplier of medical equipment for state and budget healthcare institutions of the Republic of Uzbekistan. We handle government procurement in full compliance with the law." },
      { head: "Tenders and procurement", list: ["Participation in tenders on xarid.uzex.uz and other platforms", "Preparation of complete tender documentation", "Bid and contract guarantees", "Compliance with localization and device registration requirements"] },
      { head: "Documents for budget organizations", list: ["MoH registration certificates for all items", "Conformity and origin certificates", "Quotes with fixed prices", "Full set of accounting documents (invoice, delivery note)"] },
      { head: "Terms for state institutions", body: "We work on prepayment and postpayment via budget financing and offer instalments. Supply to a specific tender specification with installation and staff training is available." },
      { head: "Procurement contacts", body: `Tender & government procurement department: ${contacts.email}, ${contacts.phone}.` },
    ]},
  }
};
}

function InfoBlock({ section, t, go, lang }) {
  return (
    <div className="info-block">
      {section.head && <h3>{section.head}</h3>}
      {section.body && <p>{section.body}</p>}
      {section.list && <ul>{section.list.map((li, i) => <li key={i}>{li}</li>)}</ul>}
      {section.stats && (
        <div className="info-stats">
          {section.stats.map((s, i) => (
            <div key={i} className="info-stat">
              <div className="is-n">{s.n}</div>
              <div className="is-l">{s.l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* PDF.js from CDN loaded once */
let _pdfjsLoaded = false;
function loadPdfJs(cb) {
  if (_pdfjsLoaded) { cb(); return; }
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  s.onload = () => {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    _pdfjsLoaded = true;
    cb();
  };
  document.head.appendChild(s);
}

function openDoc(href, e) {
  if (e) e.preventDefault();
  const ov = document.createElement("div");
  ov.className = "doc-overlay";
  ov.innerHTML =
    '<div class="doc-modal">' +
      '<div class="doc-modal-bar">' +
        '<span class="doc-modal-title">' + decodeURIComponent(href.split("/").pop()) + '</span>' +
        '<div class="doc-modal-actions">' +
          '<button class="doc-modal-prev" title="Предыдущая">&#8592;</button>' +
          '<span class="doc-modal-page">1 / 1</span>' +
          '<button class="doc-modal-next" title="Следующая">&#8594;</button>' +
          '<a class="doc-modal-dl">Скачать</a>' +
          '<button class="doc-modal-close" aria-label="Закрыть">&times;</button>' +
        '</div>' +
      '</div>' +
      '<div class="doc-modal-body"><div class="doc-modal-spin"></div></div>' +
    '</div>';
  document.body.appendChild(ov);
  document.body.style.overflow = "hidden";
  const close = () => {
    document.body.removeChild(ov);
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (ev) => {
    if (ev.key === "Escape") close();
    if (ev.key === "ArrowRight") renderPage(ov._page + 1);
    if (ev.key === "ArrowLeft")  renderPage(ov._page - 1);
  };
  document.addEventListener("keydown", onKey);
  ov.addEventListener("click", (ev) => { if (ev.target === ov) close(); });
  ov.querySelector(".doc-modal-close").addEventListener("click", close);
  ov.querySelector(".doc-modal-prev").addEventListener("click", () => renderPage(ov._page - 1));
  ov.querySelector(".doc-modal-next").addEventListener("click", () => renderPage(ov._page + 1));

  function renderPage(n) {
    if (!ov._pdf) return;
    n = Math.max(1, Math.min(n, ov._pdf.numPages));
    ov._page = n;
    ov.querySelector(".doc-modal-page").textContent = n + " / " + ov._pdf.numPages;
    ov._pdf.getPage(n).then(page => {
      const vp = page.getViewport({ scale: 1.6 });
      const body = ov.querySelector(".doc-modal-body");
      body.innerHTML = '<canvas class="doc-canvas"></canvas>';
      const canvas = body.querySelector("canvas");
      canvas.width = vp.width; canvas.height = vp.height;
      page.render({ canvasContext: canvas.getContext("2d"), viewport: vp });
    });
  }

  loadPdfJs(() => {
    fetch(href)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(buf => {
        const dl = ov.querySelector(".doc-modal-dl");
        const blob = new Blob([buf], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        dl.href = url; dl.download = href.split("/").pop();
        dl.addEventListener("click", (ev) => { ev.preventDefault(); const a=document.createElement("a"); a.href=url; a.download=href.split("/").pop(); a.click(); });
        return window.pdfjsLib.getDocument({ data: buf }).promise;
      })
      .then(pdf => {
        ov._pdf = pdf; ov._page = 1;
        renderPage(1);
      })
      .catch(() => {
        const body = ov.querySelector(".doc-modal-body");
        body.innerHTML = '<div class="doc-modal-err">Не удалось загрузить документ.<br><a href="' + href + '" target="_blank">Открыть в новой вкладке</a></div>';
      });
  });
}

function InfoPage({ t, lang, go, params }) {
  const key  = params.p || "about";
  const lv   = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const contacts = useSiteContacts();
  const INFO_CONTENT = buildInfoContent(contacts);
  /* Запасной раздел — «Сервис и гарантия»: прежний about удалён 22.08.2026 как
     дубль корпоративной /about, и обращение к нему давало undefined, а следом
     падение на data[lang]. */
  const data = INFO_CONTENT[key] || INFO_CONTENT.service;
  const page = data[lang] || data.ru || data.en;
  if (!page || !page.sections) {
    // contacts or fallback
    return (
      <div className="wrap" style={{ padding: "8px 0 60px" }}>
        <div className="crumb">
          <a onClick={() => go("home")}>{t.breadcrumb_home}</a>
          <Icon name="chevronRight" size={14} />
          <span className="cur">{page?.title || key}</span>
        </div>
        <div style={{ maxWidth: 1040 }}>
          <h1 className="info-title">{page?.title}</h1>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, maxWidth: 800 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: "var(--slate-900)" }}>{lv("Офис","Ofis","Office")}</h3>
              <div style={{ fontSize: 14, color: "var(--slate-600)", lineHeight: 1.8, marginBottom: 12 }}>
                {lv("100069, Ташкент, Узбекистан, ул. МКАД, д. 16","100069, Toshkent, Oʻzbekiston, MKAD koʻch., 16-uy","100069, Tashkent, Uzbekistan, MKAD st., 16")}
              </div>
              <div style={{ fontSize: 14, color: "var(--slate-600)", lineHeight: 1.8 }}>
                {lv("Пн–Сб, 8:00–17:00 (без перерывов)","Du–Sh, 8:00–17:00 (tanaffus yo'q)","Mon–Sat, 8:00–17:00 (no breaks)")}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: "var(--slate-900)" }}>{lv("Склад","Ombor","Warehouse")}</h3>
              <div style={{ fontSize: 14, color: "var(--slate-600)", lineHeight: 1.8, marginBottom: 12 }}>
                {lv("100069, Ташкент, Узбекистан, ул. МКАД, д. 16","100069, Toshkent, Oʻzbekiston, MKAD koʻch., 16-uy","100069, Tashkent, Uzbekistan, MKAD st., 16")}
              </div>
              <div style={{ fontSize: 14, color: "var(--slate-600)", lineHeight: 1.8, marginBottom: 6 }}>
                {lv("Выписка документов: пн–пт, 8:00–16:30","Hujjat chiqarish: Du–Ju, 8:00–16:30","Document issue: Mon–Fri, 8:00–16:30")}
              </div>
              <div style={{ fontSize: 14, color: "var(--slate-600)", lineHeight: 1.8 }}>
                {lv("Отгрузка: пн–пт, 8:00–17:00 (без перерывов)","Ombordan chiqarish: Du–Ju, 8:00–17:00 (tanaffus yo'q)","Warehouse shipment: Mon–Fri, 8:00–17:00 (no breaks)")}
              </div>
            </div>
          </div>
          <div style={{ maxWidth: 600, marginTop: 40 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: "var(--slate-900)" }}>{lv("Контакты по отделам","Bo'limlar bo'yicha kontaktlar","Contacts by department")}</h3>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--slate-700)", marginBottom: 6 }}>{lv("Приёмная","Qabul qilish","Reception")}</div>
              <div style={{ fontSize: 14, color: "var(--slate-600)" }}>{contacts.phone}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--slate-700)", marginBottom: 6 }}>{lv("Отдел продаж","Sotuvlar bo'limi","Sales department")}</div>
              <div style={{ fontSize: 14, color: "var(--slate-600)" }}>{contacts.phone2}</div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--slate-700)", marginBottom: 6 }}>{lv("Отдел сервиса","Servis bo'limi","Service department")}</div>
              <div style={{ fontSize: 14, color: "var(--slate-600)" }}>+998 (77) 223-00-01</div>
            </div>
            <div style={{ fontSize: 14, color: "var(--slate-600)", lineHeight: 1.8, marginBottom: 24 }}>
              <strong>{lv("E-mail","E-mail","Email")}:</strong><br />
              {contacts.email}
            </div>
            <button className="btn btn-primary" onClick={() => window.__openQuote && window.__openQuote()}>
              <Icon name="phone" size={18} />{t.cta_btn}
            </button>
          </div>
          <div style={{ marginTop: 48, maxWidth: 520 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: "var(--slate-900)" }}>{lv("Документы","Hujjatlar","Documents")}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr" }}>
              {[
                { label: lv("Карточка компании","Kompaniya kartasi","Company card"), href: window.__asset("assets/company-card.pdf") },
                { label: lv("Регистрационные документы","Ro'yxatga olish hujjatlari","Registration documents"), group: true },
                { label: lv("Свидетельство о регистрации","Ro'yxatga olish guvohnomasi","Registration certificate"), href: window.__asset("assets/registration.pdf"), sub: true },
                { label: lv("Сведения о юридическом лице","Yuridik shaxs to'g'risidagi ma'lumotlar","Legal entity information"), href: window.__asset("assets/egrul.pdf"), sub: true },
                { label: lv("Договор-оферта поставки","Yetkazib berish ofertasi","Supply offer contract"), href: window.__asset("assets/supply-contract.pdf") },
                { label: lv("Гарантийные условия","Kafolat shartlari","Warranty terms"), view: "service" },
                { label: lv("Условия сервисного обслуживания","Servis xizmati shartlari","Service terms"), view: "service_reg" },
              ].map((d,i) => (
                d.group ? (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:9, padding:"11px 0", borderBottom:"1px solid var(--line)", fontSize:14, fontWeight:700, color:"var(--slate-900)" }}>
                    <Icon name="doc" size={18} style={{color:"var(--blue-600)"}} />
                    <span style={{ flex:1 }}>{d.label}</span>
                  </div>
                ) : d.href ? (
                  <a key={i} href={d.href} target="_blank" rel="noopener" onClick={(e)=>openDoc(d.href,e)} style={{ display:"flex", alignItems:"center", gap:9, padding:"11px 0", paddingLeft: d.sub ? 27 : 0, borderBottom:"1px solid var(--line)", fontSize: d.sub ? 13.5 : 14, color:"var(--ink)", textDecoration:"none", cursor:"pointer" }}>
                    {!d.sub && <Icon name="doc" size={18} style={{color:"var(--blue-600)"}} />}
                    <span style={{ flex:1 }}>{d.label}</span>
                    <Icon name="download" size={14} style={{color:"var(--slate-400)"}} />
                  </a>
                ) : (
                  <div key={i} onClick={() => go("info", { p: d.view })} style={{ display:"flex", alignItems:"center", gap:9, padding:"11px 0", borderBottom:"1px solid var(--line)", fontSize:14, cursor:"pointer" }}>
                    <Icon name="doc" size={18} style={{color:"var(--blue-600)"}} />
                    <span style={{ flex:1 }}>{d.label}</span>
                    <Icon name="chevronRight" size={14} style={{color:"var(--slate-400)"}} />
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ padding: "8px 0 60px" }}>
      <div className="crumb">
        <a onClick={() => go("home")}>{t.breadcrumb_home}</a>
        <Icon name="chevronRight" size={14} />
        <span className="cur">{page.title}</span>
      </div>
      <div className="info-layout">
        <div className="info-main">
          <h1 className="info-title">{page.title}</h1>
          {page.sections.map((s, i) => <InfoBlock key={i} section={s} t={t} go={go} lang={lang} />)}
          {(key === "service" || key === "service_reg") ? (
            <button className="btn btn-primary" style={{ marginTop: 32 }} onClick={() => window.__openQuote && window.__openQuote()}>
              <Icon name="wrench" size={18} />{lv("Заявка в сервис","Servisga ariza","Service request")}
            </button>
          ) : (
          <button className="btn btn-primary" style={{ marginTop: 32 }} onClick={() => window.__openQuote && window.__openQuote()}>
            <Icon name="phone" size={18} />{t.cta_btn}
          </button>
          )}
        </div>
        <aside className="info-side">
          <div className="info-side-card">
            <h4>{lv("Нужна консультация?","Maslahat kerakmi?","Need advice?")}</h4>
            <p>{lv("Наши менеджеры помогут подобрать оборудование и подготовят КП за 1 день.","Menejerlarimiz uskuna tanlashga yordam beradi va 1 kunda KP tayyorlaydi.","Our managers will help select equipment and prepare a quote in 1 day.")}</p>
            <a className="nav-phone" href={telHref(contacts.phone)} style={{ marginTop:12, display:"flex", gap:8, color:"var(--ink)", fontWeight:800, fontSize:17 }}>
              <Icon name="phone" size={18} style={{color:"var(--blue-600)"}} />{contacts.phone}
            </a>
          </div>
          <div className="info-side-card" style={{ marginTop:16 }}>
            <h4>{lv("Документы","Hujjatlar","Documents")}</h4>
            {[
              { label: lv("Карточка компании","Kompaniya kartasi","Company card"), href: window.__asset("assets/company-card.pdf") },
              { label: lv("Регистрационные документы","Ro'yxatga olish hujjatlari","Registration documents"), group: true },
              { label: lv("Свидетельство о регистрации","Ro'yxatga olish guvohnomasi","Registration certificate"), href: window.__asset("assets/registration.pdf"), sub: true },
              { label: lv("Сведения о юридическом лице","Yuridik shaxs to'g'risidagi ma'lumotlar","Legal entity information"), href: window.__asset("assets/egrul.pdf"), sub: true },
              { label: lv("Договор-оферта поставки","Yetkazib berish ofertasi","Supply offer contract"), href: window.__asset("assets/supply-contract.pdf") },
              { label: lv("Гарантийные условия","Kafolat shartlari","Warranty terms"), href: null, view: "service" },
              { label: lv("Условия сервисного обслуживания","Servis xizmati shartlari","Service terms"), href: null, view: "service_reg" },
            ].map((d,i) => (
              d.group ? (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 0", borderBottom:"1px solid var(--line)", fontSize:14, fontWeight:700, color:"var(--slate-900)" }}>
                  <Icon name="doc" size={18} style={{color:"var(--blue-600)"}} />
                  <span style={{ flex:1 }}>{d.label}</span>
                </div>
              ) : d.href ? (
                <a key={i} href={d.href} target="_blank" rel="noopener" onClick={(e)=>openDoc(d.href,e)} style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 0", paddingLeft: d.sub ? 27 : 0, borderBottom:"1px solid var(--line)", fontSize: d.sub ? 13.5 : 14, color:"var(--ink)", textDecoration:"none", cursor:"pointer" }}>
                  {!d.sub && <Icon name="doc" size={18} style={{color:"var(--blue-600)"}} />}
                  <span style={{ flex:1 }}>{d.label}</span>
                  <Icon name="download" size={14} style={{color:"var(--slate-400)"}} />
                </a>
              ) : (
                <div key={i} onClick={() => go("info", { p: d.view })} style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 0", borderBottom:"1px solid var(--line)", fontSize:14, cursor:"pointer" }}>
                  <Icon name="doc" size={18} style={{color:"var(--blue-600)"}} />
                  <span style={{ flex:1 }}>{d.label}</span>
                  <Icon name="chevronRight" size={14} style={{color:"var(--slate-400)"}} />
                </div>
              )
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { InfoPage, buildInfoContent });
