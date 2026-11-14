// Материал Артура из Portfolio_Artur_Przed_Po.html: три проекта, по два кадра, у каждого кадра база 3D (before) и постобработка AI (after).
// Польские названия и подписи дословно из его файла, английские переведены 12.11.2026 (язык pl и en — слово владельца).
// pos — точка кадрирования для узких и вертикальных окон.
window.ARTUR = {
  name: 'Artur Panin',
  first: 'Artur', last: 'Panin',
  role: 'Images Portfolio',
  projects: [
    {
      id: 'settlement', no: '01',
      name: { pl: 'Osiedle mieszkaniowe', en: 'Residential Estate' }, short: { pl: 'Osiedle', en: 'Estate' },
      frames: [
        { img: 'settlement-1', code: '09 / F1', title: { pl: 'Ujęcie frontalne w stylistyce pracowni', en: 'Frontal view in the studio’s style' }, pos: '50% 60%' },
        { img: 'settlement-2', code: '24 / H1', title: { pl: 'Widok z góry', en: 'Aerial view' }, pos: '55% 50%' }
      ]
    },
    {
      id: 'pergola', no: '02',
      name: { pl: 'Dom z pergolą', en: 'House with a Pergola' }, short: { pl: 'Pergola', en: 'Pergola' },
      frames: [
        { img: 'pergola-1', code: '01', title: { pl: 'Elewacja ogrodowa, ujęcie frontalne', en: 'Garden elevation, frontal view' }, pos: '68% 55%' },
        { img: 'pergola-2', code: '02', title: { pl: 'Wejście z bliska, frontalnie', en: 'Entrance close-up, frontal' }, pos: '42% 50%' }
      ]
    },
    {
      id: 'klenovaya', no: '03',
      name: { pl: 'Dom Klonowy', en: 'Maple House' }, short: { pl: 'Klonowy', en: 'Maple' },
      frames: [
        { img: 'klenovaya-1', code: '03', title: { pl: 'Elewacja ogrodowa w osi', en: 'Garden elevation on axis' }, pos: '50% 50%' },
        { img: 'klenovaya-2', code: '19', title: { pl: 'Biała bryła i drewno', en: 'White volume and timber' }, pos: '45% 40%' }
      ]
    }
  ]
};
window.ARTUR.byId = id => window.ARTUR.projects.find(p => p.id === id) || window.ARTUR.projects[0];
window.ARTUR.src = (img, kind, small) => `assets/${img}-${kind}${small ? '-800' : ''}.jpg`;
window.ARTUR.allFrames = () => window.ARTUR.projects.flatMap(p => p.frames.map((f, i) => ({ ...f, project: p, index: i })));
