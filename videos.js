// Free YouTube material, grouped like the exam blueprint.
// v: [id, title, channel, length, start seconds?]; list: playlist id; q: YouTube search query for a topic.
const YT = (id, s) => 'https://www.youtube.com/watch?v=' + id + (s ? '&t=' + s + 's' : '');
const YTL = id => 'https://www.youtube.com/playlist?list=' + id;
const YTQ = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);

const VIDEOS = {
  courses: [
    { id: 'fcc', u: YT('0WjfKQdfeMU'), t: tr('Полный бесплатный курс NCA‑AIIO'), ch: 'freeCodeCamp.org', len: tr('≈ 4 ч'),
      parts: [[tr('Введение'), 0], [tr('Основы AI'), 919], [tr('Железо'), 8892], [tr('Эксплуатация'), 12486]] },
    { id: 'pl79', u: YTL('PLBfufR7vyJJ5nM4LzG6eW5JffG8E_xlux'), t: tr('Курс по темам короткими роликами'), ch: tr('Плейлист'), len: tr('79 видео') },
    { id: 'cba', u: YTL('PLFR3p8fW9K1_oHvOcDfDGxKXL_iKWC1Y8'), t: 'Complete Certification Exam Course', ch: 'Cloud Brewery Academy', len: tr('47 видео') },
  ],
  prep: [
    { id: 'tt', u: YT('QBxw3gO3KVk'), t: tr('Как я сдал NCA‑AIIO: формат, темы, ресурсы'), ch: 'ThoughtfulTechy Cloud', len: tr('20 мин') },
    { id: 'aj', u: YT('kE49-QHZ2tE'), t: tr('Как готовиться и сдать NCA‑AIIO'), ch: 'Abdul Jabbar', len: tr('10 мин') },
  ],
  // Jumps straight to the part of a long video that covers the domain
  domain: {
    d1: [['fcc1', YT('0WjfKQdfeMU', 919), tr('Курс: основы и ускоренные вычисления'), tr('2 ч 13 мин')], ['tt1', YT('QBxw3gO3KVk', 351), tr('Разбор домена: AI Knowledge'), tr('3 мин')], ['aj1', YT('kE49-QHZ2tE', 324), tr('Коротко о домене'), tr('1 мин')]],
    d2: [['fcc2', YT('0WjfKQdfeMU', 8892), tr('Курс: железо NVIDIA'), tr('1 ч')], ['tt2', YT('QBxw3gO3KVk', 525), tr('Разбор домена: Infrastructure'), tr('2 мин')], ['aj2', YT('kE49-QHZ2tE', 388), tr('Коротко о домене'), tr('1 мин')]],
    d3: [['fcc3', YT('0WjfKQdfeMU', 12486), tr('Курс: ускорение AI и эксплуатация GPU'), tr('≈ 30 мин')], ['tt3', YT('QBxw3gO3KVk', 647), tr('Разбор домена: Operations'), tr('2 мин')], ['aj3', YT('kE49-QHZ2tE', 449), tr('Коротко о домене'), tr('1,5 мин')]],
  },
  // Exact videos where we have one, otherwise a focused YouTube search
  topic: {
    '1.1': { q: 'NVIDIA CUDA-X AI software stack NGC AI Enterprise explained' },
    '1.2': { q: 'AI training vs inference explained' },
    '1.3': { q: 'AI vs machine learning vs deep learning explained' },
    '1.4': { q: 'accelerated computing why AI is growing GPUs explained' },
    '1.5': { q: 'NVIDIA AI use cases industries healthcare robotics' },
    '1.6': { q: 'NVIDIA NeMo Triton TensorRT NIM explained', v: [['nim', YT('l8_fVTWmkNA'), 'Deploy AI Models to Production with NVIDIA NIM', 'Prompt Engineering', tr('12 мин')]] },
    '1.7': { q: 'machine learning lifecycle MLOps explained' },
    '1.8': { q: 'CPU vs GPU explained parallel computing tensor cores' },
    '2.1': { q: 'NVIDIA DGX H100 B200 system overview' },
    '2.2': { q: 'NVLink NVSwitch explained multi GPU scaling' },
    '2.3': { q: 'AI data center liquid cooling direct to chip PUE' },
    '2.4': { q: 'on premises vs cloud GPU AI infrastructure cost' },
    '2.5': { q: 'NVIDIA DGX SuperPOD architecture explained' },
    '2.6': { q: 'AI data center power density rack requirements' },
    '2.7': { q: 'AI data center network fabric rail optimized east west' },
    '2.8': { q: 'RDMA RoCE vs InfiniBand explained' },
    '2.9': { q: 'NVIDIA Quantum InfiniBand Spectrum-X Ethernet AI networking' },
    '2.10': { q: 'NVIDIA BlueField DPU explained DOCA' },
    '3.1': { q: 'NVIDIA Base Command Manager cluster management' },
    '3.2': { q: 'Slurm vs Kubernetes GPU scheduling' },
    '3.3': { q: 'nvidia-smi DCGM GPU monitoring tutorial' },
    '3.4': { q: 'NVIDIA MIG vs vGPU vs time slicing' },
  },
};
