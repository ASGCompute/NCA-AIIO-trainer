// Question bank. First option is always the correct one; options are shuffled at render time.
const Q = [];
// key keeps the original wording so progress ids stay the same in every language
// okeys keeps the English options for the "EN" toggle; key may be passed to keep an old id after the wording is edited
function q(t, text, opts, ex, key) { Q.push({ t, d: 'd' + t.split('.')[0], key: key || text, orig: text, text: tr(text), okeys: opts, opts: opts.map(o => tr(o)), ex: tr(ex) }); }

// ───────── Domain 1 · Essential AI Knowledge (38%) ─────────
// 1.1 NVIDIA software stack
q('1.1', 'Which NVIDIA component is the parallel computing platform and programming model that lets developers use GPUs for general-purpose processing?',
  ['CUDA', 'TensorRT', 'DOCA', 'Triton Inference Server'],
  'CUDA — фундамент всего стека: платформа и модель программирования для вычислений общего назначения на GPU. TensorRT оптимизирует инференс, DOCA — SDK для DPU BlueField, Triton — сервер для обслуживания моделей.');
q('1.1', 'Which library provides GPU-accelerated primitives for deep neural networks, such as convolutions, pooling and activations, used by frameworks like PyTorch?',
  ['cuDNN', 'cuBLAS', 'NCCL', 'RAPIDS cuDF'],
  'cuDNN (CUDA Deep Neural Network library) содержит готовые быстрые реализации слоёв нейросетей. cuBLAS — линейная алгебра (матрицы), NCCL — коммуникации между GPU, cuDF — датафреймы.');
q('1.1', 'Which NVIDIA library handles multi-GPU and multi-node collective communication, such as all-reduce, during distributed training?',
  ['NCCL', 'cuDNN', 'DALI', 'TensorRT'],
  'NCCL (произносится «никл») реализует коллективные операции all-reduce, broadcast, all-gather поверх NVLink, PCIe, InfiniBand и RoCE. Без него распределённое обучение не синхронизирует градиенты эффективно.');
q('1.1', 'What is NVIDIA NGC?',
  ['A catalog of GPU-optimized software', 'A family of data center GPUs based on Hopper', 'A congestion-control protocol for RoCE and Spectrum-X fabrics', 'A cluster provisioning tool for DGX nodes'],
  'NGC — каталог (хаб) готового ПО: контейнеры PyTorch/TensorFlow, оптимизированные под GPU, предобученные модели, Helm-чарты. Экономит время на сборку окружения и гарантирует совместимость версий.');
q('1.1', 'Which NVIDIA software suite provides an enterprise-supported, certified, end-to-end platform of AI frameworks, tools and microservices for production use?',
  ['NVIDIA AI Enterprise', 'CUDA Toolkit', 'NVIDIA DOCA', 'DGX OS'],
  'NVIDIA AI Enterprise — коммерческий набор ПО с поддержкой, сертификацией и стабильными ветками (включает NIM, NeMo, Triton, RAPIDS, GPU Operator). Работает в облаке, on‑prem и на виртуализации.');
q('1.1', 'In Kubernetes, which NVIDIA component automates installing the GPU driver, container toolkit, device plugin, DCGM exporter and MIG manager on GPU nodes?',
  ['NVIDIA GPU Operator', 'NVIDIA Network Operator', 'kube-proxy', 'Helm'],
  'GPU Operator разворачивает весь программный стек GPU в кластере Kubernetes как набор контейнеров. Network Operator делает то же для сетевого стека (RDMA, драйверы ConnectX). Helm — лишь менеджер пакетов, которым Operator часто ставят.');
q('1.1', 'What does the NVIDIA Container Toolkit do?',
  ['Lets container runtimes access the host GPUs and driver', 'Builds GPU container images on each node', 'Schedules GPU containers across cluster nodes', 'Installs the GPU driver inside each container'],
  'Container Toolkit подключает GPU и библиотеки драйвера внутрь контейнера при запуске (например, docker run --gpus all). Драйвер стоит на хосте, а CUDA и фреймворки живут в контейнере.');
q('1.1', 'Which open-source suite accelerates data science pipelines on GPUs with pandas- and scikit-learn-like APIs?',
  ['RAPIDS', 'NeMo', 'DALI', 'cuOpt'],
  'RAPIDS: cuDF (аналог pandas), cuML (аналог scikit-learn), cuGraph. Ускоряет подготовку данных и классический ML на GPU. NeMo — генеративный AI, DALI — быстрая загрузка и предобработка данных для обучения, cuOpt — оптимизация маршрутов.');
q('1.1', 'In the layered NVIDIA AI software stack, which layer sits directly on top of the GPU hardware and allows the OS and CUDA to use it?',
  ['The NVIDIA GPU driver', 'The AI framework, such as PyTorch', 'The job scheduler', 'The Triton model repository'],
  'Порядок снизу вверх: железо → драйвер GPU → CUDA и библиотеки CUDA‑X (cuDNN, NCCL…) → фреймворки (PyTorch, TensorFlow) → приложения и сервисы (NIM, Triton). Это частый вопрос о стеке.');
q('1.1', 'DGX OS, the operating system shipped on DGX systems, is based on which distribution?',
  ['Ubuntu Linux with NVIDIA drivers and tools preinstalled', 'Red Hat CoreOS with a custom NVIDIA kernel', 'VMware ESXi with vGPU drivers preinstalled', 'A proprietary NVIDIA real-time Linux'],
  'DGX OS — это Ubuntu с предустановленными и протестированными драйверами, CUDA, DCGM, Docker и Container Toolkit. Также поддерживаются RHEL/Rocky с пакетами DGX Software Stack.');
q('1.1', 'A team wants GPU-optimized PyTorch with matching CUDA and cuDNN versions without building it themselves. What is the fastest path?',
  ['Pull the PyTorch container from NGC', 'Compile PyTorch from source on each node', 'Install the CPU-only PyTorch wheel', 'Use a generic Linux base image and add drivers inside it'],
  'Контейнеры NGC выходят ежемесячно и уже содержат согласованные версии CUDA, cuDNN, NCCL и фреймворка. Драйвер внутрь контейнера ставить не нужно: он остаётся на хосте.');

// 1.2 Training vs inference
q('1.2', 'Which statement best compares training and inference?',
  ['Training: forward and backward passes; inference: forward only', 'Inference runs forward and backward passes; training runs only the forward pass', 'Training is latency-critical; inference is only throughput-bound', 'Both run forward and backward passes, but inference uses fewer GPUs'],
  'Обучение: прямой проход + обратное распространение ошибки, много эпох, огромные данные, долгие задачи. Инференс: только прямой проход на обученной модели, важны задержка и стоимость запроса.');
q('1.2', 'Which metric is usually the most critical for real-time inference, such as a chatbot or fraud check?',
  ['Latency', 'Total training time', 'Number of epochs', 'Gradient size'],
  'Для онлайн‑инференса главное — задержка (latency), часто вместе с пропускной способностью (throughput). Эпохи и градиенты относятся к обучению.');
q('1.2', 'Why can inference often use lower precision, such as INT8, FP8 or FP4?',
  ['Weights are fixed, so quantization keeps acceptable accuracy with higher throughput', 'Inference stores gradients in INT8 to save memory bandwidth', 'Lower precision raises model accuracy because rounding reduces noise', 'Tensor Cores cannot execute FP16 or FP32 math during inference'],
  'После обучения веса не меняются, поэтому их можно квантовать. Меньше бит — меньше памяти и больше операций в секунду на Tensor Cores при небольшой потере точности.');
q('1.2', 'Which workload benefits most from a large multi-node GPU cluster with a high-bandwidth, low-latency interconnect?',
  ['Foundation model training', 'Serving a small image classifier on an edge camera', 'Generating a nightly sales report', 'Hosting a static website'],
  'Обучение больших моделей требует сотен и тысяч GPU, которые постоянно обмениваются градиентами. Поэтому нужны NVLink внутри узла и InfiniBand или Spectrum‑X Ethernet между узлами.');
q('1.2', 'Which NVIDIA SDK optimizes trained models for inference with layer fusion, precision calibration and kernel auto-tuning?',
  ['TensorRT', 'Triton Inference Server', 'cuDNN', 'NeMo'],
  'TensorRT — компилятор и runtime для инференса: сливает слои, квантует (FP8/INT8), подбирает самые быстрые GPU‑программы (kernels) под конкретный GPU. Для LLM есть TensorRT‑LLM.');
q('1.2', 'Which NVIDIA software serves models from multiple frameworks, such as TensorRT, PyTorch, ONNX and TensorFlow, with dynamic batching and concurrent model execution?',
  ['Triton Inference Server', 'NeMo Framework', 'RAPIDS', 'Base Command Manager'],
  'Triton — открытый сервер инференса: много фреймворков, динамический батчинг, несколько моделей на одном GPU, метрики для Prometheus. С 2025 года входит в платформу NVIDIA Dynamo и называется Dynamo Triton.');
q('1.2', 'What is dynamic batching in an inference server?',
  ['Grouping incoming requests into batches to raise throughput', 'Splitting one model across several GPUs so each GPU stores fewer weights', 'Increasing the training batch size as the learning rate decays', 'Dropping low-priority requests whenever the GPU queue is full'],
  'Сервер на мгновение копит запросы и отправляет их на GPU пачкой. Это повышает загрузку GPU и throughput ценой небольшой добавки к задержке.');
q('1.2', 'Training a model needs much more GPU memory than running inference on the same model mainly because training must also store:',
  ['Activations, gradients and optimizer states in addition to weights', 'The key-value cache for every user request in the queue', 'A full copy of the dataset in GPU memory', 'Weight copies at FP32, FP16 and INT8 for fallback'],
  'При обучении в памяти лежат веса, градиенты, состояния оптимизатора (у Adam — два дополнительных тензора на каждый вес) и активации для обратного прохода. Это в несколько раз больше, чем нужно для инференса.');
q('1.2', 'How is inference infrastructure typically scaled to serve more users?',
  ['Scale out with model replicas behind a load balancer and autoscaling', 'Run one synchronized job across all GPUs with all-reduce', 'Add pipeline stages so each request visits more GPUs', 'Grow the batch until one GPU serves every user'],
  'Инференс масштабируют горизонтально: больше реплик модели, балансировщик, автоскейлинг (например, в Kubernetes). Обучение, наоборот, — одна большая синхронная задача.');
q('1.2', 'What is the main benefit of mixed-precision training, using BF16 or FP16 with FP32 master weights, on Tensor Cores?',
  ['Faster, leaner training at similar accuracy', 'Higher final accuracy than FP32 in every case', 'Lower network traffic because gradients are not exchanged', 'Smaller datasets, because fewer samples are needed'],
  'Смешанная точность считает большую часть операций в 16 битах на Tensor Cores, а критичные величины держит в FP32. Получаем ускорение в разы и экономию памяти без заметной потери качества.');
q('1.2', 'Which hardware characteristic matters most for training but is less critical for many inference deployments?',
  ['Fast GPU-to-GPU and node-to-node interconnect', 'Low power draw per card for dense edge racks', 'Hardware video encoders for media pipelines', 'Large CPU caches for request preprocessing'],
  'Обучение упирается в обмен градиентами между GPU, поэтому NVLink и InfiniBand критичны. Многие инференс‑задачи помещаются на один GPU, и для них важнее стоимость, энергопотребление и задержка. Исключение — огромные LLM: их инференс тоже делят на много GPU (NVL72, NVIDIA Dynamo), и там интерконнект снова важен.');

// 1.3 AI vs ML vs DL
q('1.3', 'How are AI, machine learning and deep learning related?',
  ['Deep learning is a subset of machine learning, which is a subset of AI', 'Machine learning is a subset of deep learning, which is a subset of AI', 'AI is a subset of machine learning, which is a subset of deep learning', 'Deep learning and machine learning are separate subsets of AI'],
  'Матрёшка: AI (любые системы, имитирующие интеллект) включает ML (обучение на данных вместо явных правил), а ML включает DL (многослойные нейронные сети).');
q('1.3', 'What distinguishes deep learning from traditional machine learning?',
  ['Multi-layer neural networks learn features from raw data, needing more data and compute', 'Hand-engineered features feed decision trees, which need far less data, compute and tuning', 'Models learn from rewards instead of labels, needing a simulator', 'Rules written by experts replace training, needing no data'],
  'В классическом ML признаки часто придумывает человек (feature engineering). Глубокое обучение само извлекает признаки из сырых данных (пиксели, текст), но требует больше данных и вычислений, а значит, GPU.');
q('1.3', 'Training a model on examples where each input comes with the correct output label is called:',
  ['Supervised learning', 'Unsupervised learning', 'Reinforcement learning', 'Rule-based programming'],
  'Обучение с учителем (supervised): есть размеченные пары «вход → правильный ответ». Примеры: классификация изображений, прогноз цены.');
q('1.3', 'Grouping customers into segments when no labels exist is an example of:',
  ['Unsupervised learning', 'Supervised learning', 'Reinforcement learning', 'Transfer learning'],
  'Без учителя (unsupervised): модель сама ищет структуру в данных, например кластеризация (k‑means) или поиск аномалий.');
q('1.3', 'An agent that learns by taking actions and receiving rewards or penalties from its environment uses:',
  ['Reinforcement learning', 'Supervised learning', 'Unsupervised clustering', 'Linear regression'],
  'Обучение с подкреплением (RL): агент пробует действия и получает награду. Применяется в робототехнике, играх и при дообучении LLM (RLHF).');
q('1.3', 'What best describes generative AI?',
  ['Models that create new text, images or code', 'Models that classify inputs into a fixed set of categories', 'Models that detect anomalies in streams of telemetry', 'Models that rank items for recommendation systems'],
  'Генеративный AI создаёт новый контент: LLM пишут текст и код, диффузионные модели рисуют изображения. Это главный драйвер текущего спроса на GPU.');
q('1.3', 'Which neural network architecture underlies most modern large language models?',
  ['Transformer, based on self-attention', 'Recurrent network, based on LSTM cells', 'Convolutional network, based on filters', 'Gradient-boosted decision trees'],
  'Трансформер (2017, «Attention Is All You Need») использует механизм self‑attention и хорошо параллелится на GPU. На нём построены GPT, Llama, Nemotron и другие.');
q('1.3', 'What does fine-tuning a model mean?',
  ['Adapting a pretrained model to a task with a smaller extra dataset', 'Training a new model from scratch on the full dataset', 'Quantizing a model to INT8 so it fits on edge devices', 'Adding retrieved documents to the prompt at inference time'],
  'Дообучение (fine‑tuning) берёт готовую предобученную модель и доучивает её на своих данных. Это намного дешевле обучения с нуля. Экономные варианты: LoRA, PEFT.');
q('1.3', 'What does Retrieval-Augmented Generation (RAG) do?',
  ['Adds retrieved documents to the LLM prompt', 'Retrains the LLM whenever a document in the knowledge base changes', 'Generates synthetic documents to enlarge the training dataset', 'Compresses the LLM by removing rarely used attention heads'],
  'RAG: запрос → поиск похожих фрагментов в векторной базе → они добавляются в промпт → LLM отвечает по фактам. Знания обновляются без переобучения модели.');
q('1.3', 'Which is an example of classic machine learning rather than deep learning?',
  ['Gradient-boosted trees on tabular data', 'A convolutional neural network for image recognition', 'A transformer-based chatbot', 'A diffusion model that generates images'],
  'Градиентный бустинг (XGBoost и аналоги) на табличных данных — классический ML. CNN, трансформеры и диффузионные модели — это нейросети, то есть deep learning.');
q('1.3', 'What is "inference" in AI terminology?',
  ['Using a trained model on new data', 'Collecting and labeling training data', 'Updating model weights with backpropagation on labeled data', 'Designing a neural network architecture'],
  'Инференс — применение обученной модели: распознать картинку, ответить на вопрос, оценить транзакцию. Именно на инференс приходится основная нагрузка в продакшене.');

// 1.4 Factors behind AI growth
q('1.4', 'Which three factors are most often cited as driving the recent rapid progress and adoption of AI?',
  ['Abundant data, GPU computing and better algorithms', 'Cheaper disks, faster CPU clocks and more RAM slots', 'Faster internet, larger monitors and cloud email', 'New programming languages, compilers and operating systems'],
  'Три кита: данные (интернет, сенсоры), вычисления (GPU, ускорение в тысячи раз за десятилетие) и алгоритмы (глубокие сети, трансформеры). Плюс облака и открытые фреймворки.');
q('1.4', 'Why did GPUs become central to modern AI?',
  ['Neural networks are dominated by parallel matrix math that GPUs run fast', 'GPUs run at much higher clock speeds than server CPUs', 'GPUs have larger caches per core than server CPUs', 'GPUs run branch-heavy serial code better than CPUs'],
  'Обучение нейросети — это в основном умножение огромных матриц. GPU выполняют тысячи таких операций параллельно. Частота у GPU, наоборот, ниже, чем у CPU.');
q('1.4', 'How have open-source frameworks such as PyTorch and TensorFlow accelerated AI adoption?',
  ['They let developers build models without writing low-level GPU code', 'They let models train without GPUs at comparable speed', 'They give free cloud GPUs to every registered developer', 'They remove the need for labeled training data'],
  'Фреймворки скрывают CUDA за удобным Python‑API и автоматически используют cuDNN, NCCL и другие библиотеки. Разработчик пишет модель, а не низкоуровневые программы для GPU (kernels).');
q('1.4', 'Which observed trend in LLM development drives demand for ever-larger AI infrastructure?',
  ['Scaling laws: quality improves predictably with parameters, data and compute', 'Moore\'s law: CPU transistor counts double every two years', 'Amdahl\'s law: the serial part of a program limits speedup', 'Diminishing returns: larger models stopped improving after 2020'],
  'Законы масштабирования: больше параметров, данных и вычислений → предсказуемо лучшее качество. Добавь к этому рост инференса (рассуждающие модели, агенты), и спрос на «AI‑фабрики» растёт.');
q('1.4', 'How has cloud computing contributed to AI adoption?',
  ['On-demand GPUs without large upfront investment', 'Lower cost than on-premises at any level of utilization', 'Elimination of data preparation and labeling work', 'Free GPU capacity for all research and production workloads'],
  'Облако позволяет начать за минуты и платить по факту. Но при постоянной высокой загрузке on‑prem часто выходит дешевле, поэтому вариант «всегда дешевле» неверен.');

// 1.5 Use cases and industries
q('1.5', 'A hospital wants to accelerate medical imaging analysis and genomics workflows. Which NVIDIA platform targets healthcare?',
  ['NVIDIA Clara', 'NVIDIA Metropolis', 'NVIDIA DRIVE', 'NVIDIA Riva'],
  'Clara — платформа для здравоохранения: медицинская визуализация (MONAI), геномика (Parabricks), открытие лекарств (BioNeMo).');
q('1.5', 'A city wants to analyze traffic camera video to improve safety and traffic flow. Which NVIDIA platform fits?',
  ['NVIDIA Metropolis', 'NVIDIA Clara', 'NVIDIA Isaac', 'NVIDIA Omniverse'],
  'Metropolis — видеоаналитика и «умные пространства»: умные города, ритейл, промышленный контроль. Работает вместе с DeepStream SDK.');
q('1.5', 'A company is developing and simulating autonomous robots. Which NVIDIA platform is designed for robotics?',
  ['NVIDIA Isaac', 'NVIDIA Riva', 'NVIDIA Morpheus', 'NVIDIA Merlin'],
  'Isaac — робототехника: Isaac Sim (симуляция на Omniverse), Isaac Lab, модели для роботов. Обучение роботов в симуляции безопаснее и дешевле.');
q('1.5', 'A manufacturer wants a physically accurate 3D digital twin of its factory. Which NVIDIA platform fits?',
  ['NVIDIA Omniverse', 'NVIDIA Triton', 'NVIDIA RAPIDS', 'NVIDIA Fleet Command'],
  'Omniverse — платформа для 3D‑симуляции и цифровых двойников на базе OpenUSD. Используется для заводов, складов и даже проектирования ЦОД.');
q('1.5', 'Which NVIDIA SDK provides speech recognition, text-to-speech and translation for conversational AI?',
  ['NVIDIA Riva', 'NVIDIA Clara', 'NVIDIA Isaac', 'NVIDIA DOCA'],
  'Riva — речевой AI: ASR (распознавание), TTS (синтез), перевод. Применяется в колл‑центрах и голосовых ассистентах.');
q('1.5', 'Which NVIDIA framework is built for AI-driven cybersecurity, such as real-time anomaly and phishing detection?',
  ['NVIDIA Morpheus', 'NVIDIA Merlin', 'NVIDIA Omniverse', 'NVIDIA Metropolis'],
  'Morpheus — кибербезопасность на GPU: анализ сетевой телеметрии в реальном времени, поиск аномалий, фишинга, утечек. Может использовать данные с DPU BlueField.');
q('1.5', 'An e-commerce company needs large-scale recommender systems. Which NVIDIA framework targets this?',
  ['NVIDIA Merlin', 'NVIDIA Riva', 'NVIDIA Isaac', 'NVIDIA Clara'],
  'Merlin — фреймворк для рекомендательных систем: подготовка данных, обучение огромных embedding‑таблиц, инференс.');
q('1.5', 'Which NVIDIA platform is used to develop autonomous vehicles, from in-car compute to simulation?',
  ['NVIDIA DRIVE', 'NVIDIA Metropolis', 'NVIDIA Clara', 'NVIDIA Morpheus'],
  'DRIVE — автономный транспорт: бортовые компьютеры (DRIVE Thor/Orin), ПО и симуляция.');
q('1.5', 'Which is a common AI use case in financial services?',
  ['Real-time fraud detection', 'Physically accurate factory digital twins', 'Protein structure prediction', 'Autonomous vehicle path planning'],
  'В финансах типичны: антифрод в реальном времени, оценка рисков, алгоритмическая торговля, ассистенты на LLM. Остальные варианты относятся к промышленности, медицине и транспорту.');
q('1.5', 'Which NVIDIA library accelerates route optimization problems, such as vehicle routing for logistics?',
  ['NVIDIA cuOpt', 'NVIDIA cuDNN', 'NVIDIA Riva', 'NVIDIA NCCL'],
  'cuOpt — GPU‑ускоренная оптимизация маршрутов и решение задач линейного и смешанного программирования для логистики и цепочек поставок.');

// 1.6 NVIDIA solutions
q('1.6', 'What are NVIDIA NIM microservices?',
  ['Optimized inference containers with standard APIs', 'Prebuilt training containers that fine-tune models on DGX Cloud', 'Network interface modules that connect DGX nodes to the fabric', 'Kubernetes operators that install GPU drivers on worker nodes'],
  'NIM — готовые контейнеры для инференса моделей (LLM, речь, зрение) с OpenAI‑совместимым API. Внутри уже оптимизированные движки (TensorRT‑LLM и другие). Входят в AI Enterprise.');
q('1.6', 'Which NVIDIA framework is used to build, customize and deploy generative AI models, including LLM fine-tuning and guardrails?',
  ['NVIDIA NeMo', 'NVIDIA RAPIDS', 'NVIDIA DOCA', 'NVIDIA DCGM'],
  'NeMo — фреймворк и набор микросервисов для полного цикла генеративного AI: подготовка данных (Curator), обучение и дообучение, оценка, guardrails.');
q('1.6', 'What is NVIDIA DGX Cloud?',
  ['NVIDIA AI infrastructure as a service via cloud partners', 'A public cloud region owned and operated only by NVIDIA for game streaming', 'A cloud storage service for datasets and model checkpoints', 'A firmware and driver update service for on-premises DGX systems'],
  'DGX Cloud — инфраструктура и ПО NVIDIA для обучения и инференса, размещённые у облачных партнёров и доступные по подписке. Позволяет получить «DGX как сервис».');
q('1.6', 'Which NVIDIA software provisions, manages and monitors on-premises AI and HPC clusters, and was formerly known as Bright Cluster Manager?',
  ['NVIDIA Base Command Manager', 'NVIDIA Fleet Command', 'NVIDIA Run:ai', 'NVIDIA Mission Control'],
  'Base Command Manager (BCM, бывший Bright) разворачивает ОС на узлах, настраивает Slurm или Kubernetes, мониторит кластер. Fleet Command управляет AI на периферии (edge).');
q('1.6', 'Which NVIDIA offering securely deploys and manages AI applications across many distributed edge locations?',
  ['NVIDIA Fleet Command', 'NVIDIA Base Command Manager', 'NVIDIA NGC', 'NVIDIA Quantum-2'],
  'Fleet Command — облачная панель для развёртывания и обновления AI‑приложений на тысячах edge‑серверов (магазины, заводы, больницы).');
q('1.6', 'What is NVIDIA Run:ai mainly used for?',
  ['GPU orchestration on Kubernetes with pooling, quotas and fractional GPUs', 'Provisioning OS images onto DGX nodes over PXE', 'Managing InfiniBand subnets and computing fabric routes', 'Deploying AI applications to remote edge locations'],
  'Run:ai объединяет GPU кластера в общий пул, распределяет их по командам с квотами и приоритетами, умеет делить GPU на доли. Цель — поднять утилизацию дорогих GPU.');
q('1.6', 'What is NVIDIA DGX SuperPOD?',
  ['A turnkey DGX reference architecture', 'A single liquid-cooled rack of 72 Blackwell GPUs acting as one NVLink domain', 'A cloud service for renting DGX capacity by the hour', 'A reference design for small clusters using partner storage only'],
  'SuperPOD — проверенная архитектура «под ключ» для крупных AI‑кластеров: DGX‑узлы, InfiniBand или Ethernet‑фабрика, сертифицированное хранилище, Base Command Manager, Mission Control.');
q('1.6', 'What is NVIDIA DGX BasePOD?',
  ['A reference design for smaller DGX clusters', 'A turnkey architecture for thousands of GPUs built from Scalable Units', 'A single DGX system with eight GPUs and four NVSwitches', 'A desktop AI development system with one Grace Blackwell chip'],
  'BasePOD — референсная архитектура для кластеров от нескольких до десятков DGX с хранилищем партнёров. SuperPOD — следующий, более крупный и «под ключ» уровень.');

// 1.7 AI lifecycle software
q('1.7', 'What is the typical order of stages in an AI workflow?',
  ['Data prep → training → optimization → deployment → monitoring', 'Training → data prep → deployment → optimization → monitoring', 'Data prep → deployment → training → monitoring → optimization', 'Optimization → data prep → training → monitoring → deployment'],
  'Жизненный цикл: данные → обучение → оптимизация и проверка → развёртывание → мониторинг, а при дрейфе — снова обучение. Это цикл, а не прямая.');
q('1.7', 'Which stage of an AI project typically consumes the most data scientist time?',
  ['Data collection and preparation', 'Model deployment and API integration', 'Hyperparameter tuning and model selection', 'Model monitoring and drift detection'],
  'Подготовка данных традиционно занимает основную часть времени (часто называют до 80%). Для ускорения используют RAPIDS и NeMo Curator.');
q('1.7', 'What is MLOps?',
  ['Practices that automate the ML lifecycle, from versioning to monitoring', 'CUDA libraries that tune ML operators for Tensor Cores', 'An NVIDIA service that runs ML operations on DGX Cloud', 'A benchmark suite that measures ML operations per second'],
  'MLOps — это DevOps для машинного обучения: версии данных и моделей, автоматические пайплайны, мониторинг качества в продакшене, переобучение.');
q('1.7', 'A deployed model becomes less accurate over time because real-world data has changed. This is called:',
  ['Model drift', 'Overclocking', 'Thermal throttling', 'Gradient clipping'],
  'Дрейф модели (data/concept drift): распределение входных данных меняется, и качество падает. Лечится мониторингом и переобучением.');
q('1.7', 'Why are containers widely used across AI development and deployment?',
  ['They package dependencies so the same environment runs everywhere', 'They make GPU kernels run faster than on bare metal', 'They remove the need for a GPU driver on the host', 'They give each process MIG-like hardware isolation'],
  'Контейнер = воспроизводимое окружение. Одинаково работает у разработчика, в кластере и в продакшене. Драйвер GPU при этом всё равно нужен на хосте.');
q('1.7', 'Which NVIDIA library moves data loading and augmentation to the GPU to remove CPU bottlenecks in training pipelines?',
  ['NVIDIA DALI', 'NVIDIA NCCL', 'NVIDIA Riva', 'NVIDIA cuOpt'],
  'DALI (Data Loading Library) декодирует и аугментирует изображения, видео и аудио на GPU. Помогает, когда GPU простаивают в ожидании данных от CPU.');
q('1.7', 'Why is checkpointing important during long training runs?',
  ['It saves model state so training can resume after a failure', 'It raises accuracy by averaging saved weights', 'It reduces GPU power by pausing idle layers', 'It validates the model on a held-out dataset'],
  'Обучение может идти недели на тысячах GPU, и сбой узла неизбежен. Чекпоинты позволяют продолжить с последнего сохранения. Это создаёт пиковую нагрузку на запись в хранилище.');
q('1.7', 'After training, a team converts the model with TensorRT and deploys it with Triton. Which lifecycle stage are they in?',
  ['Optimization and deployment', 'Data preparation and labeling', 'Distributed training and checkpointing', 'Monitoring and drift detection'],
  'TensorRT — оптимизация модели, Triton — её обслуживание. Это этап развёртывания для инференса.');

// 1.8 GPU vs CPU
q('1.8', 'What is the core architectural difference between CPUs and GPUs?',
  ['CPUs: few complex cores for serial work; GPUs: many simple cores for throughput', 'CPUs: thousands of simple cores for parallel throughput; GPUs: few complex cores for low latency', 'CPUs and GPUs have the same cores, but GPUs run at higher clock speeds', 'CPUs handle only integer math, while GPUs handle only floating-point math'],
  'CPU — несколько десятков мощных ядер, большие кэши, предсказание ветвлений: быстрая последовательная логика. GPU — тысячи простых ядер: огромная параллельная пропускная способность.');
q('1.8', 'What are Tensor Cores?',
  ['GPU units for fast mixed-precision matrix math', 'CPU cores that manage tensor memory allocation for frameworks like PyTorch', 'Memory stacks next to the GPU die that store tensors', 'Units on the NIC that compress tensors for all-reduce'],
  'Tensor Cores (впервые в Volta) выполняют умножение матриц со сложением за один шаг. Форматы добавлялись по поколениям: FP16 в Volta, TF32 и BF16 в Ampere, FP8 в Hopper, FP4 в Blackwell. Именно они дают основной прирост в AI.');
q('1.8', 'What is HBM on a data center GPU?',
  ['Stacked memory beside the GPU die', 'Host-based memory in the server DIMMs, shared with the CPU over PCIe', 'A hardware block that manages GPU power and clock speeds', 'A heat-based monitoring sensor on the GPU baseboard'],
  'HBM (HBM3/HBM3e) — стековая память рядом с кристаллом GPU с пропускной способностью в несколько ТБ/с. H100 — 80 ГБ HBM3, H200 — 141 ГБ HBM3e.');
q('1.8', 'Which task is better suited to a CPU than a GPU?',
  ['The OS and branch-heavy serial logic', 'Large dense matrix multiplications', 'Training a convolutional neural network', 'Batch inference on thousands of images'],
  'CPU силён в последовательной, ветвящейся логике: ОС, управление, I/O. Всё, что сводится к параллельной математике над большими массивами, лучше на GPU.');
q('1.8', 'What is a Streaming Multiprocessor (SM) in an NVIDIA GPU?',
  ['The GPU\'s basic block of CUDA and Tensor Cores', 'A separate controller that streams training data from NVMe storage to the GPU', 'The NVSwitch chip that connects GPUs inside a DGX system', 'The video engine that encodes and decodes media streams'],
  'GPU состоит из множества SM. В каждом — CUDA‑ядра, Tensor Cores, регистры, общая память. В H100 SXM 132 SM.');
q('1.8', 'What is the main role of the CPU in a GPU-accelerated AI server?',
  ['Running the OS, preparing data and orchestrating GPU work', 'Doing the matrix math while GPUs handle I/O', 'Routing NVLink traffic between the GPUs', 'Replacing the network adapters for RDMA traffic'],
  'CPU «кормит» GPU: читает и готовит данные, запускает ядра, управляет I/O. Слабый CPU или медленное хранилище легко оставят дорогие GPU без работы.');
q('1.8', 'What does the NVIDIA Grace Hopper Superchip combine?',
  ['Grace CPU + Hopper GPU over NVLink-C2C', 'Two Hopper GPUs linked by NVLink on one module', 'An x86 CPU and a Hopper GPU linked by PCIe Gen5', 'A Hopper GPU and a BlueField DPU on one PCIe card with shared memory'],
  'GH200: CPU Grace (Arm) + GPU Hopper, связанные NVLink‑C2C на 900 ГБ/с с общей когерентной памятью. GB200 — то же для Blackwell (1 Grace + 2 Blackwell).');
q('1.8', 'How do GPUs hide memory access latency?',
  ['By keeping many warps in flight and switching while others wait', 'With big branch predictors and huge caches per core', 'By running at much higher clock speeds than CPUs', 'By prefetching the entire dataset into registers'],
  'GPU держит тысячи потоков и мгновенно переключается на готовые warp‑ы, пока другие ждут память. CPU для этого опирается на большие кэши и предсказание ветвлений.');
q('1.8', 'What does the Transformer Engine introduced with the Hopper architecture do?',
  ['Uses FP8 where safe to speed up transformers', 'Splits transformer layers across GPUs for tensor parallelism over NVLink', 'Caches attention keys and values in host memory', 'Compiles transformer models into TensorRT engines'],
  'Transformer Engine автоматически выбирает FP8 или FP16 по слоям трансформера, ускоряя LLM. В Blackwell второе поколение добавило FP4.');

// ───────── Domain 2 · AI Infrastructure (40%) ─────────
// 2.1 Hardware for training
q('2.1', 'How many GPUs does an NVIDIA DGX H100 system contain?',
  ['8', '4', '16', '2'],
  'DGX H100 (и DGX H200, DGX B200) — 8 GPU в одном корпусе, связанных через NVSwitch. Число 8 — классика экзамена.');
q('2.1', 'What is the total GPU memory of a DGX H100 system?',
  ['640 GB (8 × 80 GB HBM3)', '320 GB (8 × 40 GB HBM2e)', '1,128 GB (8 × 141 GB HBM3e)', '1,440 GB (8 × 180 GB HBM3e)'],
  '8 GPU × 80 ГБ = 640 ГБ HBM3. Для сравнения: DGX H200 — 1128 ГБ, DGX B200 — около 1,44 ТБ.');
q('2.1', 'When selecting GPUs to train an LLM with billions of parameters, which factors matter most?',
  ['GPU memory and fast GPU-to-GPU links', 'CPU core count and clock speed plus large local disks for the dataset', 'Video encode engines and display outputs per GPU', 'Low idle power and a small PCIe form factor'],
  'Модель, градиенты и состояния оптимизатора должны поместиться в память, а GPU должны быстро обмениваться данными. Поэтому смотрят на объём и скорость HBM и на NVLink/InfiniBand.');
q('2.1', 'How do SXM and PCIe GPU form factors differ?',
  ['SXM: baseboard with NVLink/NVSwitch and higher power; PCIe: standard slots', 'PCIe uses a baseboard with NVSwitch and higher power limits; SXM fits standard slots', 'SXM is for workstations; PCIe is only for liquid-cooled racks', 'They differ only in memory size; power and interconnect are the same'],
  'SXM: максимальная мощность (H100 SXM до 700 Вт) и полносвязный NVLink через NVSwitch — для обучения. PCIe: стандартные серверы, меньше энергопотребление, гибкость — часто для инференса.');
q('2.1', 'Which technology lets GPUs within a server communicate at much higher bandwidth than PCIe?',
  ['NVLink', 'SATA', 'USB4', 'Ethernet over copper'],
  'NVLink — прямой высокоскоростной канал GPU↔GPU. В H100: 900 ГБ/с на GPU, примерно в 7 раз больше PCIe Gen5.');
q('2.1', 'What is the role of NVSwitch?',
  ['Links all GPUs over NVLink so each pair talks at full bandwidth', 'Connects nodes over InfiniBand so every server reaches the storage fabric', 'Switches power between redundant supplies when one of them fails', 'Converts NVLink traffic to PCIe so CPUs can read GPU memory'],
  'NVSwitch — коммутатор для NVLink: полносвязная топология all‑to‑all внутри узла, а в GB200 NVL72 — на всю стойку из 72 GPU.');
q('2.1', 'What NVLink bandwidth per GPU does fourth-generation NVLink on H100 provide?',
  ['900 GB/s', '64 GB/s', '600 GB/s', '1.8 TB/s'],
  'Поколения: A100 (NVLink 3) — 600 ГБ/с, H100 (NVLink 4) — 900 ГБ/с, Blackwell (NVLink 5) — 1,8 ТБ/с. PCIe Gen5 x16 — около 128 ГБ/с в обе стороны.');
q('2.1', 'What is NVIDIA GB200 NVL72?',
  ['A liquid-cooled rack of 36 Grace CPUs and 72 Blackwell GPUs in one NVLink domain', 'An air-cooled server with 8 Blackwell GPUs, 2 x86 CPUs and 72 TB of NVMe', 'A 72-port XDR InfiniBand switch for scale-out fabrics', 'A cluster of 72 DGX systems connected by Spectrum-X'],
  'GB200 NVL72: 72 GPU Blackwell + 36 CPU Grace в одной стойке, все GPU связаны NVLink через NVSwitch как «один огромный GPU». Только жидкостное охлаждение, порядка 120+ кВт на стойку.');
q('2.1', 'Which storage approach is typically recommended for large-scale AI training data?',
  ['A high-performance parallel file system, often with local NVMe caching', 'A cheap object store on the management network', 'A single NAS appliance shared over 10 GbE', 'Local disks on each node with no shared storage'],
  'Обучению нужен высокий параллельный throughput на чтение и быстрая запись чекпоинтов: Lustre, IBM Storage Scale, WEKA, DDN, VAST и т. п. плюс локальные NVMe как кэш.');
q('2.1', 'What does NVIDIA GPUDirect Storage provide?',
  ['A direct DMA path between storage and GPU memory, bypassing the CPU bounce buffer', 'A direct NVLink path between GPUs in different nodes, bypassing the InfiniBand switch', 'A RAID controller inside the GPU that stripes data across NVMe drives', 'A cache in GPU memory that stores the operating system image'],
  'GPUDirect Storage передаёт данные с NVMe или NVMe‑oF напрямую в память GPU, минуя буфер в RAM процессора. Меньше задержка, выше throughput, меньше нагрузка на CPU.');
q('2.1', 'A retailer needs low-power AI inference in stores with limited space and cooling. Which hardware fits best?',
  ['Compact low-power GPUs such as L4 or Jetson', 'A DGX B200 system in each store\'s back office', 'A GB200 NVL72 rack shared by all stores', 'H100 SXM servers with direct-to-chip liquid cooling in each store'],
  'На периферии важны энергопотребление и размер. L4 (около 72 Вт) или модули Jetson подходят для видеоаналитики и небольших моделей. DGX и стойки NVL72 — для обучения в ЦОД.');
q('2.1', 'What is the main purpose of the eight ConnectX-7 400 Gb/s ports in a DGX H100?',
  ['Compute fabric for GPU-to-GPU traffic between nodes', 'Storage fabric for reading datasets and checkpoints', 'In-band management for OS and cluster services', 'Out-of-band management for BMC access'],
  'В DGX H100 8 однопортовых ConnectX‑7 по 400 Гб/с образуют вычислительную фабрику (east‑west) — по одному на GPU. Физически они выведены на 4 двухпортовых (twin‑port) разъёма OSFP: 4 × 2 = 8 × 400G. Для хранилища и in‑band управления стоят ещё 2 двухпортовые карты (ConnectX‑7, в ранних спецификациях — BlueField‑3), а BMC идёт по отдельному порту 1 GbE.');

// 2.2 Scaling GPU infrastructure
q('2.2', 'What is the difference between scaling up and scaling out GPU infrastructure?',
  ['Up: more GPUs in a node or NVLink domain; out: more nodes over a network', 'Scale up adds more nodes over a network; scale out adds more GPUs within a node', 'Scale up adds storage; scale out adds GPU memory', 'Scale up is for inference; scale out is only for training'],
  'Scale‑up: больше GPU в одном NVLink‑домене (узел, стойка NVL72). Scale‑out: больше узлов, связанных InfiniBand или Ethernet.');
q('2.2', 'In data-parallel training, what happens?',
  ['Full model copy per GPU, different data, all-reduced gradients', 'Each GPU holds different layers and passes activations to the next GPU in sequence', 'Each GPU holds a slice of every layer and exchanges partial results every layer', 'One GPU computes gradients and broadcasts updated weights to all others'],
  'Data parallelism: копия модели на каждом GPU, разные батчи, после шага — all‑reduce градиентов через NCCL. Самый распространённый способ масштабирования.');
q('2.2', 'When is model parallelism (tensor or pipeline parallelism) required?',
  ['When the model does not fit in a single GPU\'s memory', 'When the dataset does not fit on a single node\'s disk', 'When the job needs fewer GPUs than one node has', 'When training runs on CPUs instead of GPUs'],
  'Если модель не влезает в один GPU, её режут: tensor parallelism (части слоёв на разных GPU, лучше внутри NVLink‑домена) и pipeline parallelism (разные слои на разных GPU).');
q('2.2', 'In the DGX SuperPOD reference architecture with DGX H100 systems, how many DGX systems form one Scalable Unit (SU)?',
  ['32', '4', '8', '128'],
  'SU (Scalable Unit) = 32 узла DGX H100 = 256 GPU. SuperPOD строится из нескольких SU, например 4 SU = 128 узлов = 1024 GPU.');
q('2.2', 'A team adds more GPU nodes but training speed barely improves. What is the most likely cause?',
  ['Gradient synchronization is bottlenecked by an insufficient network', 'The GPUs have too much memory for the model', 'The model is too large to benefit from more GPUs', 'The CPUs have too many cores for the data loaders'],
  'При масштабировании растёт доля времени на обмен градиентами. Если сеть медленная или с потерями, GPU ждут друг друга, и эффективность масштабирования падает.');
q('2.2', 'Which approach best scales an inference service to handle many more users?',
  ['Add model replicas with load balancing and autoscaling', 'Add pipeline stages so each request uses more GPUs', 'Train the model for more epochs before deployment', 'Use one large batch that combines all users\' requests'],
  'Инференс масштабируют горизонтально. Маленькие модели можно ещё и уплотнить на одном GPU с помощью MIG.');
q('2.2', 'Why are tensor-parallel groups usually kept within a single NVLink domain?',
  ['It exchanges data every layer, needing top bandwidth', 'Tensor parallelism exchanges data once per epoch and needs little bandwidth', 'NVLink is cheaper per port than InfiniBand or Ethernet', 'InfiniBand cannot carry GPU memory traffic at all'],
  'Tensor parallelism обменивается данными на каждом слое, поэтому ему нужен NVLink. Data и pipeline parallelism меньше чувствительны и идут между узлами по InfiniBand или Ethernet.');
q('2.2', 'What is the advantage of building clusters from repeatable Scalable Units?',
  ['Predictable performance and faster growth with validated blocks', 'Lower power, since all units share one cooling loop', 'No need for a compute fabric between the units', 'Freedom to mix any GPU generations inside one unit'],
  'Типовой блок (SU) уже спроектирован и протестирован: сеть, питание, кабели. Кластер растёт кирпичиками с предсказуемым результатом.');

// 2.3 Power and cooling
q('2.3', 'How is Power Usage Effectiveness (PUE) calculated?',
  ['Total facility power divided by IT equipment power', 'IT equipment power divided by total facility power', 'GPU power divided by CPU power', 'Cooling power multiplied by IT power'],
  'PUE = вся мощность ЦОД / мощность IT‑оборудования. Пример: 1,5 МВт всего, 1 МВт IT → PUE 1,5. Чем ближе к 1,0, тем эффективнее.');
q('2.3', 'What does a PUE of 1.0 mean?',
  ['All facility power goes to IT equipment, with no overhead', 'Cooling uses as much power as IT equipment', 'IT equipment uses half of the total facility power', 'The facility returns as much power as it consumes'],
  'PUE 1,0 — теоретический идеал: никаких потерь на охлаждение и преобразование. Современные ЦОД достигают примерно 1,1–1,4.');
q('2.3', 'Approximately what is the maximum power consumption of one DGX H100 system?',
  ['About 10.2 kW', 'About 1 kW', 'About 50 kW', 'About 500 W'],
  'DGX H100 потребляет до ~10,2 кВт. Значит, 4 системы в стойке — это 40+ кВт, а обычная корпоративная стойка рассчитана на 5–15 кВт.');
q('2.3', 'Why is liquid cooling increasingly required for AI data centers?',
  ['Rack power density is beyond what air can remove efficiently', 'Liquid cooling is required to enable NVLink between GPUs', 'Air cooling cannot keep GPU memory within its rated humidity range', 'Liquid cooling raises GPU voltages for higher clock speeds'],
  'AI‑стойки уходят в десятки и сотни кВт (GB200 NVL72 — 120+ кВт). Воздухом столько тепла не отвести, поэтому нужно жидкостное охлаждение direct‑to‑chip.');
q('2.3', 'What is direct-to-chip liquid cooling?',
  ['Cold plates remove heat at the chip with coolant', 'Servers are fully submerged in a dielectric fluid inside an immersion tank', 'A liquid-cooled coil on the rack door cools the exhaust air', 'Chilled air is ducted directly onto each chip from the floor'],
  'На горячие чипы ставятся холодные пластины с жидкостью, тепло уходит через CDU в контур здания. Эффективнее воздуха и позволяет очень высокую плотность.');
q('2.3', 'What is the purpose of hot aisle / cold aisle containment?',
  ['Keep hot exhaust air from mixing with cold intake air', 'Keep GPU servers separate from storage servers', 'Keep power cables separate from network cables', 'Keep liquid-cooled racks separate from air-cooled racks'],
  'Стойки ставят «лицом к лицу» и «спиной к спине», а коридоры изолируют. Холодный воздух идёт на вход серверов, горячий не возвращается на вход.');
q('2.3', 'What does N+1 redundancy mean for power or cooling components?',
  ['One spare unit, so one failure causes no outage', 'Two fully independent power paths, each able to carry the full load alone', 'One component shared across N separate data centers', 'N components plus one spare kept in a warehouse off site'],
  'N+1: нужно N блоков, ставят N+1, чтобы пережить отказ одного. 2N — полное дублирование (две независимые линии A/B).');
q('2.3', 'What does a 2N power design provide?',
  ['Two independent full-load paths', 'One extra UPS module beyond what the load requires', 'Two power supplies per server sharing one utility feed and one UPS', 'Half the required capacity on each of two feeds'],
  '2N: два независимых пути питания, каждый тянет всю нагрузку. Серверы подключают двумя блоками питания к разным фидерам.');
q('2.3', 'A data center designed for 8 kW per rack plans to install four DGX H100 systems per rack. What is the main concern?',
  ['The rack would need over 40 kW, exceeding its power and cooling design', 'The rack would run out of network ports for the 400 Gb/s compute fabric', 'The rack would be too short to hold four 8U systems', 'The rack would need InfiniBand instead of Ethernet'],
  '4 × ~10,2 кВт ≈ 41 кВт против 8 кВт по проекту. Нужно либо меньше систем на стойку, либо модернизация питания и охлаждения.');
q('2.3', 'What is a rear-door heat exchanger?',
  ['A liquid coil on the rack door that cools exhaust air', 'A cold plate on each GPU connected to a coolant distribution unit in the row', 'A backup chiller that starts when the main chiller fails', 'A fan wall at the rear of the room that pulls hot air outside'],
  'Теплообменник на задней двери стойки охлаждает горячий воздух жидкостью прямо на выходе. Промежуточный шаг между чистым воздухом и direct‑to‑chip.');
q('2.3', 'Which unit expresses the cooling load that must be removed from a rack?',
  ['Kilowatts of heat', 'Gigabits per second of airflow through the front of the rack', 'Rack units (U) of space occupied by servers', 'Liters of coolant per GPU per hour'],
  'Почти вся потреблённая электроэнергия превращается в тепло: стойка на 40 кВт выделяет ~40 кВт тепла. Его иногда выражают в BTU/ч (1 кВт ≈ 3412 BTU/ч).');

// 2.4 On-prem vs cloud
q('2.4', 'What is a key advantage of running AI workloads in the public cloud?',
  ['Elastic, pay-as-you-go capacity with no upfront capital cost', 'Lowest total cost at sustained 24/7 utilization', 'Full physical control of the hardware and network', 'Guaranteed data residency inside your own building and network'],
  'Облако: быстрый старт, эластичность, OpEx вместо CapEx, доступ к новому железу. Но при постоянной полной загрузке оно часто дороже собственного кластера.');
q('2.4', 'What is a key advantage of on-premises AI infrastructure?',
  ['Lower cost at high use, full data control', 'No upfront investment, with pay-as-you-go pricing per GPU-hour', 'Instant scaling to thousands of GPUs on demand', 'No need to plan power, cooling or floor space'],
  'On‑prem выгоден при стабильной высокой загрузке, строгих требованиях к данным и необходимости полного контроля. Минусы: CapEx, сроки поставки, эксплуатация силами своей команды.');
q('2.4', 'A startup has unpredictable, bursty GPU needs and limited capital. What is usually the best fit?',
  ['Cloud GPU instances', 'Building a dedicated data center', 'Buying a DGX SuperPOD', 'CPU-only servers'],
  'При непредсказуемой нагрузке и малом капитале облако позволяет платить только за использованное и не замораживать деньги в оборудовании.');
q('2.4', 'A bank must keep data in-country and runs steady 24/7 training. What is often the best fit?',
  ['On-premises or hybrid infrastructure', 'Only a public cloud region abroad', 'Laptops for each data scientist', 'A free-tier cloud account'],
  'Суверенитет данных и стабильная загрузка указывают на on‑prem или гибрид: базовая нагрузка дома, пики при необходимости в облаке (если позволяет регулятор).');
q('2.4', 'Which is a common challenge of large-scale AI in the public cloud?',
  ['Egress fees, capacity limits and high cost at scale', 'No access to current-generation data center GPUs', 'Inability to run containers or Kubernetes', 'No support for high-speed networking between instances'],
  'Типичные сложности облака: плата за выгрузку данных (egress), дефицит GPU, рост счетов при масштабе и «гравитация данных» (большие данные дорого перемещать).');
q('2.4', 'What is cloud bursting in a hybrid AI strategy?',
  ['Running baseline work on-premises and sending peaks to the cloud', 'Moving all workloads permanently from on-premises to the cloud', 'Running baseline work in the cloud and sending peaks on-premises', 'Shutting down cloud instances at night to save cost'],
  'Cloud bursting: базовая нагрузка на своём кластере, пики уходят в облако. Сочетает экономию on‑prem и эластичность облака.');
q('2.4', 'Buying servers for an on-premises cluster is typically classified as which type of expense?',
  ['Capital expenditure (CapEx)', 'Operational expenditure (OpEx)', 'Marketing expense', 'Licensing-only expense'],
  'Покупка оборудования — CapEx (амортизируется годами). Аренда облака — OpEx (ежемесячные платежи).');

// 2.5 Accelerated cluster components
q('2.5', 'Which four networks are defined in the DGX SuperPOD reference architecture?',
  ['Compute fabric, storage fabric, in-band management, out-of-band management', 'Compute fabric, NVLink fabric, internet uplink, wireless management network', 'Storage fabric, backup network, VPN, guest network', 'In-band management, out-of-band management, NVLink, PCIe'],
  'Четыре сети SuperPOD: вычислительная фабрика (GPU↔GPU, InfiniBand), фабрика хранения, in‑band управление (Ethernet для ОС и сервисов) и out‑of‑band управление (BMC).');
q('2.5', 'What is the role of head (management) nodes in an AI cluster?',
  ['Run provisioning, scheduler control and monitoring services', 'Run the largest training jobs', 'Provide the storage fabric for datasets and checkpoints', 'Act as InfiniBand switches for the compute fabric'],
  'Управляющие узлы держат сервисы кластера: Base Command Manager, контроллер Slurm или control plane Kubernetes, мониторинг. Работа с GPU идёт на вычислительных узлах.');
q('2.5', 'Which set lists the core components of an accelerated computing cluster?',
  ['GPU nodes, fast fabric, shared storage, management software', 'GPU nodes, Wi-Fi access points, USB storage, and spreadsheets', 'CPU-only nodes, local disks, a single switch, and no scheduler', 'GPU nodes, desktop monitors, office printers, and corporate email servers'],
  'Кластер = вычислительные узлы с GPU + быстрая сеть + общее хранилище + ПО (провижининг, планировщик, мониторинг) + питание и охлаждение.');
q('2.5', 'Why do organizations use NVIDIA reference architectures such as DGX BasePOD and SuperPOD?',
  ['Validated designs reduce deployment risk and time with predictable performance', 'They are required by the CUDA license to run GPU workloads', 'They remove the need for shared storage in the cluster', 'They let any mix of hardware vendors run with guaranteed, certified performance'],
  'Референсные архитектуры уже протестированы NVIDIA и партнёрами: топология сети, хранилище, ПО. Меньше рисков и быстрее запуск.');
q('2.5', 'Besides the eight 400 Gb/s cluster ports, a DGX H100 has two dual-port network cards. What are they primarily used for?',
  ['Storage and in-band management networking', 'GPU-to-GPU NVLink communication inside the system', 'Out-of-band BMC access', 'Video output to monitors'],
  'В DGX H100 восемь портов ConnectX‑7 отданы вычислительной фабрике, а две двухпортовые карты (по руководству пользователя ConnectX‑7, в ранних спецификациях BlueField‑3) обслуживают сеть хранения и in‑band управление. BMC подключается отдельно по 1 GbE. Это разделение трафика по назначению.');
q('2.5', 'Why is shared storage important in a multi-node training cluster?',
  ['All nodes share datasets and checkpoints', 'GPUs cannot keep any data in their local HBM memory', 'Shared storage replaces the compute fabric between nodes', 'Shared storage provides power redundancy to compute nodes during outages'],
  'Все узлы читают один и тот же датасет и пишут чекпоинты туда, откуда задачу можно продолжить на любых узлах.');

// 2.6 Facility requirements
q('2.6', 'Which facility factors should be assessed first before deploying high-density AI systems?',
  ['Power, cooling, floor load and space', 'Network vendor, switch color, cable brand, rack labels and naming scheme', 'Office space, meeting rooms, parking and lighting', 'Software licenses, user accounts, email and VPN'],
  'Перед установкой проверяют: сколько кВт можно подать на стойку, сколько тепла отвести, выдержит ли пол вес, есть ли место и кабельные трассы.');
q('2.6', 'Why must floor loading be checked when installing DGX systems?',
  ['Fully populated AI racks are heavy and may exceed the floor rating', 'Raised floors interfere with NVLink and InfiniBand signal integrity', 'GPU fans need a minimum floor height for airflow', 'Floor tiles must be grounded for InfiniBand cables'],
  'Один DGX H100 весит около 130 кг. Стойка с несколькими системами и жидкостным охлаждением может весить больше тонны, что важно для фальшпола.');
q('2.6', 'What do ASHRAE guidelines provide for data centers?',
  ['Recommended temperature and humidity ranges for IT equipment', 'Electrical wiring standards for three-phase power distribution', 'Fire suppression rules for lithium-ion UPS batteries', 'Structured cabling standards for fiber and copper'],
  'ASHRAE публикует термальные рекомендации для ЦОД: допустимые диапазоны температуры и влажности на входе оборудования.');
q('2.6', 'Why is three-phase power common in high-density data centers?',
  ['It delivers more power more efficiently to high-density racks', 'GPU drivers need it for boost clocks', 'It removes the need for a UPS and generators', 'It reduces network latency between racks'],
  'Трёхфазное питание передаёт больше мощности на тех же проводниках и лучше подходит для стоек на десятки кВт.');
q('2.6', 'Why are optical fiber links with transceivers common for 400 Gb/s connections between racks?',
  ['They carry high speeds farther than copper', 'They are always cheaper per port than copper DAC cables of any length', 'They need no power at either end of the link', 'Copper cables cannot carry RDMA traffic at all'],
  'Медные DAC‑кабели хороши на коротких дистанциях (внутри стойки, несколько метров). Между стойками на 400G используют оптику с трансиверами.');
q('2.6', 'What role does a UPS play in a data center facility?',
  ['Provides short-term battery power and conditioning until generators start', 'Powers the site for days, replacing generators', 'Converts AC power to DC inside each GPU', 'Balances the load between the A and B power feeds'],
  'ИБП (UPS) держит нагрузку на батареях несколько минут при пропадании сети и сглаживает качество питания, пока не запустятся дизель‑генераторы.');

// 2.7 Networking requirements for AI
q('2.7', 'What is east-west traffic in a data center?',
  ['Traffic between servers in the same site', 'Traffic between users and the data center', 'Traffic between two separate data centers', 'Traffic on the out-of-band management network'],
  'East‑west — трафик внутри ЦОД между серверами. При обучении он доминирует (обмен градиентами). North‑south — трафик между ЦОД и внешним миром (запросы пользователей).');
q('2.7', 'Why does distributed AI training need a high-bandwidth, low-latency and lossless network?',
  ['GPUs sync often, so any loss or delay stalls the whole job', 'Training data is streamed live from the internet during each step', 'GPUs cannot keep data in local memory between steps', 'Lossless networks draw less power than standard Ethernet'],
  'Синхронная задача ждёт самого медленного участника. Одна потеря пакета или затор тормозит все GPU, поэтому важна «хвостовая» задержка (tail latency).');
q('2.7', 'What is a rail-optimized network topology?',
  ['NIC N of every node goes to leaf switch N', 'All NICs of one node connect to the same leaf switch', 'Every node connects directly to every other node', 'Nodes connect in a ring so traffic passes each node in turn'],
  'Rail‑optimized: порт GPU0 каждого узла идёт в «рельс» 0, GPU1 — в рельс 1 и т. д. Трафик между одинаковыми GPU разных узлов проходит через один коммутатор.');
q('2.7', 'What does a non-blocking fat-tree network provide?',
  ['Full bisection bandwidth for all nodes at once', 'A single deterministic path between nodes to avoid any packet reordering', 'Lower cost by oversubscribing uplinks 4:1 to the spine', 'Automatic encryption of traffic between leaf switches'],
  'Fat‑tree без переподписки (1:1) даёт полную бисекционную полосу. Для обучающих фабрик это стандарт.');
q('2.7', 'What is RDMA?',
  ['Direct memory-to-memory transfer between hosts, bypassing CPU and kernel', 'A RAID mode that mirrors disks across remote storage arrays', 'A routing protocol for equal-cost leaf-spine paths', 'A driver mode that lets CPUs execute CUDA kernels'],
  'RDMA передаёт данные напрямую из памяти одного узла в память другого, минуя ядро ОС и CPU. Результат — микросекундные задержки и минимальная нагрузка на CPU. Есть в InfiniBand и RoCE.');
q('2.7', 'What does GPUDirect RDMA enable?',
  ['The NIC accesses GPU memory directly', 'The GPU reads NVMe storage directly, without a CPU bounce buffer in host memory', 'GPUs in one node share memory over NVLink-C2C', 'The CPU accesses GPU memory as if it were system RAM'],
  'GPUDirect RDMA: ConnectX работает с памятью GPU напрямую. Нет лишних копий через RAM процессора, ниже задержка между GPU разных узлов.');
q('2.7', 'Which traffic type best describes users sending inference requests to an AI service from outside the data center?',
  ['North-south', 'East-west', 'NVLink', 'Out-of-band'],
  'Запросы снаружи внутрь (пользователи → сервис) — north‑south. Обмен между серверами внутри — east‑west.');
q('2.7', 'Why is the compute fabric typically separated from the storage and management networks?',
  ['To keep storage and management traffic off GPU traffic', 'Because GPUs can communicate only over InfiniBand, never Ethernet', 'To reduce the number of servers needed in each rack', 'Because storage traffic requires wireless connections'],
  'Разделение сетей изолирует трафик: чтение датасета или бэкап не мешает all‑reduce. Это повышает предсказуемость производительности и безопасность.');

// 2.8 Data center networking protocols
q('2.8', 'What is RoCE v2?',
  ['RDMA over Ethernet in UDP/IP packets, routable at Layer 3', 'RDMA over Converged Ethernet in Layer 2 frames, limited to one subnet', 'An InfiniBand routing protocol that runs on the Subnet Manager', 'A TCP offload engine that accelerates iSCSI storage traffic'],
  'RoCE v2 переносит RDMA поверх Ethernet в UDP/IP, поэтому маршрутизируется. RoCE v1 работал только в пределах одного L2‑домена.');
q('2.8', 'Which Ethernet mechanisms are used to make the network lossless for RoCE?',
  ['Priority Flow Control (PFC) and Explicit Congestion Notification (ECN)', 'Spanning Tree Protocol (STP) and Link Aggregation Control Protocol (LACP)', 'Equal-Cost Multipath (ECMP) and Virtual LANs (VLANs)', 'Quality of Service marking (DSCP) and Jumbo Frames'],
  'PFC приостанавливает отправку по приоритету при заполнении буферов, ECN помечает пакеты при заторе, чтобы источник снизил скорость (DCQCN). Вместе они дают «беспотерьный» Ethernet для RDMA.');
q('2.8', 'What does the InfiniBand Subnet Manager do?',
  ['Discovers topology, assigns LIDs and computes routing tables', 'Assigns IP addresses to hosts through DHCP leases', 'Encrypts traffic between host channel adapters', 'Runs all-reduce inside the switches'],
  'Subnet Manager (например, в составе NVIDIA UFM или на коммутаторе) — «мозг» IB‑фабрики: находит устройства, выдаёт LID, рассчитывает маршруты. Без него IB‑сеть не работает.');
q('2.8', 'How does InfiniBand avoid packet loss?',
  ['Credit-based link-level flow control: send only when the receiver has buffer space', 'Priority Flow Control pauses: switches pause senders when buffers fill', 'Forward error correction: each packet carries enough redundant data to rebuild any losses', 'Duplicate transmission: every packet is sent twice over different paths'],
  'В InfiniBand отправитель шлёт данные только при наличии «кредитов», то есть свободного буфера у получателя. Поэтому сеть изначально без потерь, в отличие от Ethernet, где это настраивают через PFC/ECN.');
q('2.8', 'What is NVIDIA SHARP?',
  ['All-reduce aggregation inside the switches', 'A congestion-control algorithm for RoCE traffic on Spectrum-X Ethernet switches', 'A storage protocol that streams data directly into GPU memory', 'A Kubernetes scheduler plugin for topology-aware placement'],
  'SHARP (Scalable Hierarchical Aggregation and Reduction Protocol) выполняет редукцию прямо в коммутаторах InfiniBand. Данных по сети ходит меньше, all‑reduce ускоряется.');
q('2.8', 'What characterizes a spine-leaf network architecture?',
  ['Every leaf links to every spine: predictable hops, easy scale-out', 'Every server connects to every spine, removing the need for leaf switches', 'Switches connect in a ring, and traffic travels around it in one direction', 'One core switch connects all servers, with no intermediate layers'],
  'Spine‑leaf: серверы подключаются к leaf, каждый leaf соединён со всеми spine. Любые два сервера разделяет одинаковое число хопов. Это база для fat‑tree в ЦОД.');
q('2.8', 'Which statement correctly compares RDMA with traditional TCP/IP networking?',
  ['RDMA bypasses the kernel, cutting latency and CPU load', 'TCP/IP bypasses the kernel stack, cutting latency below RDMA', 'RDMA needs more CPU cycles per byte because it copies buffers', 'RDMA and TCP/IP have identical latency and CPU overhead'],
  'TCP/IP проходит через ядро ОС с копированием буферов и тратит CPU. RDMA разгружает CPU и снижает задержку на порядок.');
q('2.8', 'What is the main purpose of VLANs or VRFs in data center networks?',
  ['Logically segment traffic, such as tenants or management', 'Make Ethernet lossless for RDMA traffic', 'Increase link speed by bonding several physical ports together', 'Aggregate gradients inside the switches'],
  'VLAN и VRF логически разделяют трафик на одной физической сети: арендаторов, управление, хранение. На скорость и потери они не влияют.');

// 2.9 High-speed network options
q('2.9', 'What is the per-port speed of InfiniBand NDR?',
  ['400 Gb/s', '100 Gb/s', '200 Gb/s', '800 Gb/s'],
  'Поколения InfiniBand: EDR — 100, HDR — 200, NDR — 400, XDR — 800 Гб/с на порт. Мнемоника: E‑H‑N‑X, каждое следующее вдвое быстрее.');
q('2.9', 'What is NVIDIA Spectrum-X?',
  ['AI Ethernet: Spectrum switches and SuperNICs with adaptive routing', 'AI InfiniBand: Quantum-2 switches and ConnectX HCAs with SHARP offload', 'A GPU architecture that succeeded Hopper for inference', 'A parallel file system optimized for AI checkpoints'],
  'Spectrum‑X — Ethernet, оптимизированный под AI: коммутаторы Spectrum‑4 или Spectrum‑X800 и SuperNIC (BlueField‑3 или ConnectX‑8), адаптивная маршрутизация, контроль заторов, изоляция производительности. Даёт RoCE‑производительность, близкую к InfiniBand.');
q('2.9', 'What is NVIDIA Quantum-2?',
  ['The NDR-generation InfiniBand switch platform', 'An Ethernet switch family for campus and office networks', 'A quantum computing processor', 'A liquid cooling unit'],
  'Quantum‑2 — платформа коммутаторов InfiniBand NDR (400 Гб/с). Следующее поколение — Quantum‑X800 (XDR, 800 Гб/с).');
q('2.9', 'When is InfiniBand typically preferred over Ethernet for an AI cluster?',
  ['Large training clusters needing top performance and native RDMA', 'Multi-tenant clouds that must reuse existing Ethernet operations', 'Inference services that mostly carry north-south web traffic', 'Small edge sites where cost matters more than latency'],
  'InfiniBand — максимальная производительность, нативный RDMA, SHARP, без потерь «из коробки». Ethernet (Spectrum‑X) выбирают за знакомую эксплуатацию, мультиарендность и интеграцию с существующей сетью.');
q('2.9', 'What are NVIDIA ConnectX adapters?',
  ['High-speed NICs for InfiniBand and Ethernet', 'GPU baseboards that connect eight SXM modules through four NVSwitch chips', 'Power distribution units with per-outlet monitoring', 'Optical transceivers that plug into OSFP switch ports'],
  'ConnectX (сейчас ConnectX‑7 и ConnectX‑8) — сетевые адаптеры NVIDIA (бывший Mellanox) с поддержкой IB и Ethernet, RDMA и GPUDirect.');
q('2.9', 'How do NVLink and InfiniBand differ in their typical role?',
  ['NVLink inside a node or rack; InfiniBand between nodes', 'InfiniBand connects GPUs within a node or rack; NVLink connects separate nodes', 'NVLink connects storage; InfiniBand connects management ports', 'They are the same technology under two brand names'],
  'NVLink — сверхбыстрая связь GPU внутри узла или стойки NVL72. InfiniBand или Ethernet — связь между узлами по всему кластеру.');
q('2.9', 'Approximately how many gigabytes per second can a 400 Gb/s link carry?',
  ['About 50 GB/s', 'About 400 GB/s', 'About 4 GB/s', 'About 3,200 GB/s'],
  'Гигабиты делим на 8: 400 Гб/с ÷ 8 = 50 ГБ/с. Не путайте Gb (биты, сети) и GB (байты, NVLink и память).');
q('2.9', 'What is a BlueField-3 SuperNIC primarily optimized for?',
  ['Accelerating east-west AI traffic in Spectrum-X Ethernet fabrics', 'Hosting tenant VMs on its Arm cores', 'Serving as the BMC for out-of-band management', 'Storing datasets locally for GPUDirect Storage'],
  'SuperNIC (BlueField‑3 SuperNIC или ConnectX‑8 SuperNIC на 800 Гб/с) заточен под GPU‑трафик east‑west в AI‑фабриках Spectrum‑X (RoCE, адаптивная маршрутизация). Классический DPU шире: инфраструктурные сервисы, безопасность, хранение.');

// 2.10 DPU
q('2.10', 'What is a DPU (Data Processing Unit)?',
  ['A NIC with Arm cores that offloads networking, storage and security', 'A GPU without display outputs for inference', 'A CPU socket dedicated to running the hypervisor', 'A storage controller that manages NVMe RAID arrays'],
  'DPU (NVIDIA BlueField) = сетевой адаптер + Arm‑ядра + аппаратные ускорители. Выполняет инфраструктурные задачи вместо CPU хоста.');
q('2.10', 'What is a key benefit of using BlueField DPUs in a data center?',
  ['Frees host CPU cores and isolates infrastructure from tenants', 'Doubles available GPU memory by pooling HBM across the network', 'Replaces GPUs for training small models', 'Removes the need for a top-of-rack switch'],
  'Две главные выгоды: освобождение CPU (сеть, хранение, шифрование уходят на DPU) и изоляция — инфраструктура работает отдельно от ОС арендатора, даже если хост скомпрометирован.');
q('2.10', 'Which NVIDIA SDK is used to program BlueField DPUs?',
  ['DOCA', 'CUDA', 'NeMo', 'RAPIDS'],
  'DOCA — SDK для DPU, как CUDA для GPU. Библиотеки для сетей, хранения, безопасности и телеметрии.');
q('2.10', 'Which three processor types are often described as the pillars of the modern accelerated data center?',
  ['CPU, GPU and DPU', 'CPU, HDD and SSD', 'GPU, PSU and UPS', 'NIC, BMC and PDU'],
  'Формула NVIDIA: CPU — общие вычисления, GPU — ускоренные вычисления, DPU — обработка данных и инфраструктуры.');
q('2.10', 'Which task would typically be offloaded to a DPU?',
  ['Software-defined networking and encryption', 'Training neural networks and running large-batch inference', 'Rendering 3D graphics for virtual workstations', 'Running the user\'s application business logic'],
  'Классические задачи DPU: виртуальные коммутаторы (OVS), межсетевой экран, шифрование IPsec/TLS, NVMe‑oF и виртуализация хранения, телеметрия.');
q('2.10', 'In a multi-tenant cloud, why does running infrastructure services on a DPU improve security?',
  ['Services run in a separate trust domain that a compromised host cannot tamper with', 'DPUs disconnect tenants from the network automatically whenever an attack is detected', 'DPUs encrypt GPU memory so tenants cannot read each other\'s models', 'Running on a DPU removes root access from all host administrators'],
  'DPU — отдельный компьютер со своей ОС. Политики безопасности и сети работают на нём, и арендатор с правами root на хосте не может их отключить.');

// ───────── Domain 3 · AI Operations (22%) ─────────
// 3.1 Data center management and monitoring
q('3.1', 'What is a Baseboard Management Controller (BMC)?',
  ['Out-of-band controller for power and console', 'An agent running in the host OS that reports GPU and CPU metrics to Prometheus', 'A controller that manages NVMe RAID arrays on the server', 'A Kubernetes add-on that restarts failed GPU pods'],
  'BMC — отдельный микроконтроллер на материнской плате со своей сетью. Позволяет включать и выключать сервер, смотреть датчики, открывать удалённую консоль, даже если ОС зависла.');
q('3.1', 'Which protocols are commonly used to communicate with a BMC?',
  ['IPMI and Redfish', 'SMTP and POP3', 'HTTP/3 and QUIC only', 'NFS and SMB'],
  'IPMI — старый стандарт, Redfish — современный REST/JSON API для управления серверами. Оба работают через out‑of‑band сеть. BMC в DGX H100 поддерживает Redfish, IPMI, SNMP, KVM и веб‑интерфейс.');
q('3.1', 'What is the purpose of an out-of-band (OOB) management network?',
  ['A separate network to reach BMCs and device management ports', 'A backup internet uplink for users when the main one fails', 'The primary fabric for GPU-to-GPU traffic between nodes', 'A network that carries storage traffic to the parallel file system'],
  'OOB‑сеть (обычно 1 GbE) даёт доступ к BMC и консолям коммутаторов, даже если основная сеть или ОС не работают.');
q('3.1', 'Which functions does NVIDIA Base Command Manager provide?',
  ['Node provisioning, cluster monitoring, health checks and workload manager setup', 'LLM training and fine-tuning on DGX Cloud', 'InfiniBand subnet management and adaptive routing', 'GPU partitioning into MIG instances inside virtual machines'],
  'BCM: разворачивает образы ОС на сотнях узлов, ставит и настраивает Slurm или Kubernetes, мониторит и проверяет здоровье кластера.');
q('3.1', 'How are Prometheus and Grafana commonly used in GPU cluster monitoring?',
  ['Prometheus stores metrics (e.g., from DCGM Exporter); Grafana shows dashboards and alerts', 'Prometheus schedules GPU jobs on the cluster; Grafana provisions node OS images and drivers', 'Prometheus collects logs; Grafana runs GPU health diagnostics', 'Prometheus manages the IB subnet; Grafana configures BMCs'],
  'Классическая связка: DCGM Exporter → Prometheus (сбор и хранение метрик) → Grafana (дашборды и алерты).');
q('3.1', 'Which is a good example of proactive monitoring in an AI data center?',
  ['Alerting when temperature or correctable ECC errors rise', 'Waiting for users to report slow jobs before investigating the affected nodes', 'Reviewing hardware health once a year during maintenance', 'Disabling verbose logs on nodes to save disk space'],
  'Проактивный мониторинг ловит проблему до сбоя: пороги по температуре, рост ECC‑ошибок, XID‑события, падение пропускной способности NVLink.');
q('3.1', 'Why is centralized log collection important in large GPU clusters?',
  ['It correlates XID errors and hardware faults across many nodes', 'It speeds up GPU kernels by cutting disk writes', 'It lowers power use by turning off local logging', 'It replaces the scheduler\'s job accounting database'],
  'На сотнях узлов вручную читать логи невозможно. Централизованный сбор (syslog, Elastic, Loki) позволяет искать закономерности, например одинаковые XID на одной стойке.');
q('3.1', 'What is NVIDIA Mission Control?',
  ['Software that runs AI factory operations, health checks and job recovery', 'A utility that sets GPU clocks and power limits', 'An InfiniBand fabric manager that computes routing tables', 'A cloud console for renting DGX Cloud capacity'],
  'Mission Control — ПО для эксплуатации «AI‑фабрик» на DGX SuperPOD и GB200: автоматизация операций, мониторинг здоровья, автоматическое восстановление задач. Включает Base Command Manager и Run:ai.');

// 3.2 Orchestration and job scheduling
q('3.2', 'What is Slurm?',
  ['An open-source workload manager that queues and schedules batch jobs on clusters', 'An open-source orchestrator for web microservices', 'An NVIDIA tool that provisions OS images onto cluster nodes', 'A monitoring agent that exports GPU metrics to Prometheus'],
  'Slurm — стандарт планировщиков для HPC и обучения: очередь заданий, выделение узлов и GPU, приоритеты. Используется в большинстве DGX SuperPOD.');
q('3.2', 'Which Slurm command submits a batch job script?',
  ['sbatch', 'squeue', 'scancel', 'sinfo'],
  'sbatch — отправить скрипт в очередь. srun — запустить шаг или интерактивно. squeue — посмотреть очередь. scancel — отменить. sinfo — состояние узлов и партиций.');
q('3.2', 'Which Slurm command shows jobs that are pending and running in the queue?',
  ['squeue', 'sbatch', 'srun', 'scontrol reboot'],
  'squeue показывает очередь заданий и их статус (PD — ожидает, R — выполняется).');
q('3.2', 'How do you request GPUs for a Slurm job?',
  ['Generic resources (GRES), e.g., --gres=gpu:8', 'Node features, e.g., --constraint=gpu8 --exclusive', 'CPU binding, e.g., --cpu-bind=gpu', 'Memory flags, e.g., --mem=gpu:80G'],
  'GPU в Slurm — это GRES (Generic RESource). Пример: sbatch --nodes=2 --gres=gpu:8 train.sh. Есть и новые опции вроде --gpus.');
q('3.2', 'What is Kubernetes mainly designed for?',
  ['Orchestrating containers', 'Queueing batch jobs and allocating whole bare-metal nodes for HPC', 'Provisioning bare-metal OS images onto servers', 'Monitoring GPU health with active diagnostics'],
  'Kubernetes — оркестратор контейнеров: развёртывание, масштабирование, перезапуск упавших подов. Хорош для инференс‑сервисов и микросервисов.');
q('3.2', 'How does a Kubernetes pod request a GPU?',
  ['Request nvidia.com/gpu in resource limits via the device plugin', 'Set the gpu: true label in the pod metadata', 'Mount /dev/nvidia0 as a privileged hostPath volume in the pod spec', 'Add --gres=gpu:1 to the container command'],
  'Device plugin объявляет ресурс nvidia.com/gpu на узле, а под запрашивает его в resources.limits (например, nvidia.com/gpu: 1). Планировщик ставит под на узел со свободным GPU.');
q('3.2', 'Which statement best describes when Slurm or Kubernetes is typically chosen?',
  ['Slurm for batch multi-node training; Kubernetes for containerized services', 'Slurm for containerized services; Kubernetes for batch multi-node training', 'Slurm only for storage jobs; Kubernetes only for networking', 'Both are interchangeable and neither supports GPUs'],
  'Slurm — пакетные задачи и обучение на многих узлах (HPC‑стиль). Kubernetes — сервисы, инференс, MLOps‑пайплайны. На практике их часто совмещают (Run:ai, Slinky и т. п.).');
q('3.2', 'What is gang scheduling?',
  ['All of a job\'s resources at once, or none', 'Running several small jobs on one GPU in turns', 'Starting short jobs in idle gaps of the schedule without delaying others', 'Pausing low-priority jobs so urgent jobs can run'],
  'Распределённому обучению нужны все узлы сразу. Gang scheduling запускает задачу, только когда доступны все ресурсы, иначе часть GPU простаивала бы в ожидании.');
q('3.2', 'Which tools let Slurm jobs run containers unprivileged on DGX clusters?',
  ['Pyxis and Enroot', 'Docker Swarm and Compose', 'Ansible and Terraform', 'Prometheus and Grafana'],
  'Enroot превращает образы контейнеров в непривилегированные «песочницы», а плагин Pyxis добавляет в srun опцию --container-image.');
q('3.2', 'Which scheduler feature lets a high-priority job take resources from lower-priority running jobs?',
  ['Preemption', 'Backfill', 'Checkpointing', 'Port forwarding'],
  'Preemption: высокоприоритетная задача вытесняет низкоприоритетную (приостанавливает или перезапускает её). Поэтому важны чекпоинты.');
q('3.2', 'What is backfill scheduling?',
  ['Running small jobs in idle gaps without delaying others', 'Pausing lower-priority jobs to free resources for urgent ones', 'Restarting failed jobs automatically from their last checkpoint on healthy nodes', 'Allocating all nodes of a job at once or none of them'],
  'Backfill берёт короткие задачи из очереди и запускает их в «дырах» расписания, не задерживая крупные приоритетные задачи. Повышает утилизацию.');
q('3.2', 'What is a Slurm partition?',
  ['A node group acting as a queue with limits', 'A disk partition on the head node that stores job scripts and outputs', 'A MIG slice of a GPU assigned to one job', 'A VLAN that isolates one user\'s job traffic'],
  'Партиция (partition) — логическая очередь из группы узлов со своими лимитами: например, «debug» с коротким временем и «train» с узлами DGX.');
q('3.2', 'Why use a job scheduler in a shared GPU cluster instead of letting users log in to nodes directly?',
  ['To maximize utilization, enforce fair sharing and queue work', 'To make GPU kernels run faster on each node', 'Because GPUs cannot start without a scheduler', 'To avoid installing containers and drivers on the compute nodes'],
  'Планировщик честно делит ресурсы, ставит задачи в очередь, не даёт двум пользователям занять один GPU и поднимает общую утилизацию.');

// 3.3 GPU monitoring metrics
q('3.3', 'Which command-line tool quickly shows GPU utilization, memory, temperature and running processes on a node?',
  ['nvidia-smi', 'top', 'ibstat', 'squeue'],
  'nvidia-smi — первая команда при проверке GPU: загрузка, память, температура, мощность, процессы, MIG‑режим.');
q('3.3', 'nvidia-smi is built on which NVIDIA library?',
  ['NVML (NVIDIA Management Library)', 'DCGM (Data Center GPU Manager)', 'CUPTI (CUDA Profiling Tools Interface)', 'NCCL (NVIDIA Collective Communications Library)'],
  'NVML — C‑библиотека для мониторинга и управления GPU. На ней построены nvidia-smi и частично DCGM.');
q('3.3', 'What is NVIDIA DCGM?',
  ['Cluster-scale GPU monitoring and diagnostics', 'A library for collective communication between GPUs across nodes, such as all-reduce', 'A Kubernetes operator that installs GPU drivers on nodes', 'A profiler that shows CUDA kernel timelines for one process'],
  'DCGM — инструмент для GPU в масштабе ЦОД: телеметрия, проверки здоровья, диагностика (dcgmi diag), политики и оповещения, интеграция с Kubernetes и Slurm.');
q('3.3', 'Which command runs active GPU health diagnostics with DCGM?',
  ['dcgmi diag', 'nvidia-smi topo -m', 'squeue', 'kubectl get pods'],
  'dcgmi diag -r 1/2/3/4 — диагностика разной глубины: от быстрой проверки (секунды) до длительных стресс‑тестов. topo -m показывает топологию, а не здоровье.');
q('3.3', 'What does DCGM Exporter do?',
  ['Exposes GPU metrics in Prometheus format', 'Exports trained models to ONNX format', 'Exports node logs to a central syslog server', 'Exports MIG profiles to the device plugin'],
  'DCGM Exporter отдаёт метрики GPU по HTTP для Prometheus. В Kubernetes его ставит GPU Operator.');
q('3.3', 'What are XID errors?',
  ['Error events from the NVIDIA driver in the system log', 'Error codes recorded by the BMC in the IPMI system event log', 'Error counters on InfiniBand switch ports', 'Exit codes returned by failed Slurm jobs'],
  'XID — коды ошибок драйвера NVIDIA в dmesg/syslog. Например, XID 79 — GPU «отвалился от шины», XID 13/31 — часто ошибки приложения. Ошибки памяти: на старых GPU это XID 48 (двойная ECC‑ошибка), а на A100/H100 и новее — XID 94/95 (ошибка локализована или нет) и 63/64 (row remapping). Проверка: nvidia-smi -q -d ROW_REMAPPER.');
q('3.3', 'A GPU shows a growing number of uncorrectable (double-bit) ECC errors. What does this indicate?',
  ['Failing memory: drain the GPU, check remapping, consider RMA', 'Normal wear that the driver fixes automatically; no action needed', 'A network misconfiguration on the compute fabric', 'A job allocating more memory than the GPU has'],
  'Корректируемые ошибки ECC исправляются на лету. Некорректируемые означают повреждение данных и деградацию памяти: GPU выводят из работы (drain). На A100/H100 драйвер переназначает сбойные строки памяти (row remapping), после этого нужен сброс GPU или перезагрузка узла. Если резервные строки закончились, GPU отправляют на замену (RMA).');
q('3.3', 'nvidia-smi reports 100% GPU utilization, yet training is slow. Why can this metric be misleading?',
  ['It counts time any kernel ran, not how busy SMs and Tensor Cores are', 'It measures memory used by processes, not the time kernels were running', 'It averages all GPUs in the node, hiding idle ones', 'It counts only Tensor Core work and ignores CUDA cores'],
  '«GPU‑Util» — доля времени, когда на GPU выполнялась хотя бы одна программа‑ядро (CUDA kernel). Даже крошечный kernel даёт 100%. Реальную загрузку показывают профилировочные метрики DCGM: SM Activity, SM Occupancy, Tensor Pipe Active.');
q('3.3', 'Which is a common cause of low GPU utilization during training?',
  ['A data loading bottleneck', 'GPU memory bandwidth that is much higher than the model actually needs', 'Too many Tensor Cores for the chosen batch size', 'An NVLink connection that is faster than PCIe'],
  'GPU простаивает, если данные не успевают: медленное хранилище, слабая предобработка на CPU, маленький батч, ожидание сети. Решения: DALI, кэш на NVMe, больше воркеров загрузки.');
q('3.3', 'What is thermal throttling on a GPU?',
  ['The GPU lowers clocks when it gets too hot', 'The GPU raises clocks when it is cool', 'The driver blocks new jobs until the GPU cools down', 'The BMC powers off the GPU when it overheats'],
  'При перегреве GPU снижает частоты (HW/SW Thermal Slowdown), чтобы не повредить чип. Упор в лимит мощности (SW Power Cap) — отдельная причина снижения частот, это не thermal throttling. Обе причины видно в nvidia-smi -q -d PERFORMANCE (clocks event reasons).');
q('3.3', 'What does the command nvidia-smi topo -m show?',
  ['The NVLink/PCIe path matrix between GPUs and NICs', 'The temperature and power trend of each GPU over the last hour', 'The MIG instances and profiles configured on each GPU', 'The processes and memory usage on each GPU'],
  'nvidia-smi topo -m показывает, как связаны GPU и сетевые карты: NV# — NVLink, PIX — через один PCIe‑коммутатор, PXB — через несколько, PHB — через host bridge процессора, NODE — внутри одного NUMA‑узла, SYS — между сокетами CPU (самый медленный путь). Помогает при диагностике производительности и выборе NIC для каждого GPU.');
q('3.3', 'Which set of metrics is most important to monitor on data center GPUs?',
  ['Utilization, memory, temperature, power, clocks, ECC/XID, NVLink/PCIe', 'CPU frequency, disk SMART, fan RPM, BIOS version, OS uptime', 'Screen resolution, refresh rate, color depth, HDR mode', 'Office temperature, humidity, lighting level, door access'],
  'Базовый набор метрик GPU: загрузка, память, температура, мощность, частоты, ошибки (ECC, XID), пропускная способность интерконнекта.');
q('3.3', 'How can an administrator cap the power draw of a GPU?',
  ['nvidia-smi -pl <watts>', 'nvidia-smi -mig 1', 'nvidia-smi topo -m', 'dcgmi diag -r 3'],
  'nvidia-smi -pl <ватт> задаёт лимит мощности. Это помогает уложиться в бюджет питания стойки ценой части производительности.');

// 3.4 Virtualization
q('3.4', 'What is Multi-Instance GPU (MIG)?',
  ['Hardware partitioning of one GPU into isolated instances', 'Software time-sharing of a GPU between processes in turns', 'Linking several GPUs into one larger logical GPU over NVLink and NVSwitch', 'Sharing a GPU between VMs through hypervisor vGPU profiles'],
  'MIG делит GPU (A100, H100, H200, B200 и др.) на изолированные экземпляры со своими SM, памятью и кэшем. Гарантированное качество обслуживания и защита от «шумных соседей».');
q('3.4', 'What is the maximum number of MIG instances on an A100 or H100 GPU?',
  ['7', '2', '4', '16'],
  'До 7 экземпляров (например, профиль 1g.10gb на H100 80GB). На A30 — до 4.');
q('3.4', 'How does MIG differ from time-slicing for GPU sharing?',
  ['MIG gives hardware isolation; time-slicing shares the whole GPU in turns', 'Time-slicing gives hardware isolation; MIG shares the whole GPU in turns', 'Both give hardware isolation, but MIG needs a hypervisor', 'Both share the GPU in turns, but MIG adds memory limits'],
  'MIG — физическое разделение: своя память и SM, сбой или нагрузка одного не влияет на другого. Time‑slicing — процессы по очереди пользуются всем GPU, памятью делятся без изоляции.');
q('3.4', 'What is NVIDIA vGPU software?',
  ['Lets multiple VMs share a physical GPU through the hypervisor with profiles', 'Lets multiple containers share a GPU in turns without memory or fault isolation', 'Lets one VM use several GPUs as a single logical device', 'Lets a CPU emulate a GPU for development workloads'],
  'NVIDIA vGPU (в составе AI Enterprise или vGPU for Compute) позволяет нескольким ВМ делить GPU через гипервизор с профилями памяти. Требует лицензии и совместимых драйверов на хосте и в гостевой ОС.');
q('3.4', 'What is GPU passthrough in a virtualized environment?',
  ['A whole GPU dedicated to one VM', 'Sharing one physical GPU across many VMs with time-sliced vGPU profiles', 'Partitioning one GPU into isolated MIG instances for VMs', 'Migrating a running VM\'s GPU state to another host'],
  'Passthrough (PCIe passthrough, VFIO) отдаёт весь GPU одной ВМ. Производительность почти как на «железе», но GPU не делится.');
q('3.4', 'Which workload is best suited to MIG?',
  ['Many small inference services or notebooks needing isolated resources', 'One large model trained across a thousand GPUs', 'A training job that needs the combined memory of all eight GPUs in a node', 'CPU-only batch jobs that need many cores'],
  'MIG идеален, когда задачи маленькие и не загружают целый GPU: инференс небольших моделей, Jupyter‑ноутбуки, CI. Для больших обучающих задач GPU нужен целиком.');
q('3.4', 'Which considerations matter when virtualizing GPU infrastructure?',
  ['Overhead, licensing, host/guest driver compatibility and right-sized profiles', 'Only the hypervisor brand, since GPUs perform identically under every hypervisor', 'Only GPU memory size, since licensing does not apply to vGPU', 'None, because virtualization adds no overhead or constraints'],
  'Виртуализация GPU — компромисс: небольшие накладные расходы, лицензии vGPU, согласование версий драйверов хоста и гостя, выбор профилей, возможности live migration.');
q('3.4', 'How do containers differ from virtual machines?',
  ['Containers share the host kernel; VMs run a full guest OS on a hypervisor', 'VMs share the host kernel; containers run a full guest OS on a hypervisor', 'Containers need a hypervisor; VMs run directly on the host kernel', 'Both share the host kernel, but VMs add GPU isolation'],
  'Контейнеры легче и стартуют за секунды, но делят ядро хоста. ВМ тяжелее, со своей ОС и более сильной изоляцией. Часто их комбинируют: Kubernetes внутри ВМ.');
q('3.4', 'In Kubernetes, what is the main drawback of GPU time-slicing compared to MIG?',
  ['No memory or fault isolation between workloads sharing the GPU', 'It requires InfiniBand between all worker nodes', 'It limits each GPU to exactly seven workloads', 'It needs a vGPU license on every node'],
  'При time‑slicing все поды видят всю память GPU: один может занять её целиком или уронить соседей. MIG даёт аппаратную изоляцию.');
q('3.4', 'What must be enabled on a GPU before creating MIG instances?',
  ['MIG mode first, then GPU and compute instances', 'Time-slicing in the device plugin, then replicas per GPU', 'vGPU mode in the hypervisor, then VM profiles', 'ECC disabled, then NVLink removed from the GPU'],
  'Сначала включают MIG‑режим (nvidia-smi -i 0 -mig 1, может потребоваться сброс GPU), затем создают GPU Instances и Compute Instances по профилям. В Kubernetes это делает MIG Manager из GPU Operator.');
// Coverage additions after the v5 content audit (course units on energy-efficient computing, DGX platform, storage)
q('1.8', 'Which NVIDIA GPU architecture introduced the H100 and H200 data center GPUs?',
  ['Hopper', 'Ampere', 'Blackwell', 'Volta'],
  'Поколения: Volta (V100) → Ampere (A100) → Hopper (H100, H200) → Blackwell (B200, GB200). Ada Lovelace — L4 и L40S. Названия архитектур часто встречаются в вариантах ответа.');
q('1.8', 'How much HBM3e memory does a single NVIDIA H200 GPU provide?',
  ['141 GB', '80 GB', '40 GB', '288 GB'],
  'H200 — тот же Hopper, но со 141 ГБ HBM3e и примерно 4,8 ТБ/с. Больше памяти — больше модели и длиннее контекст на одном GPU. DGX H200: 8 × 141 = 1128 ГБ.', 'How much HBM3e memory does a single NVIDIA H200 GPU provide, compared with 80 GB on H100?');
q('1.5', 'Which is a typical use of large language models in an enterprise?',
  ['Summaries, Q&A on company data, code', 'Tuning fan curves, power limits and clocks on GPU servers in the data center', 'Computing InfiniBand routes and assigning LIDs', 'Provisioning operating system images onto nodes'],
  'Типичные задачи LLM: чат‑ассистенты, суммаризация, поиск ответов по корпоративным данным (часто через RAG), генерация и объяснение кода, перевод.');
q('2.1', 'Approximately what is the maximum system power of an NVIDIA DGX B200?',
  ['About 14.3 kW', 'About 10.2 kW', 'About 3 kW', 'About 120 kW'],
  'DGX B200 (8 GPU Blackwell, 1440 ГБ HBM3e) потребляет до ~14,3 кВт, DGX H100 — до ~10,2 кВт, целая стойка GB200 NVL72 — порядка 120 кВт. Мощность растёт с каждым поколением, поэтому планирование питания так важно.');
q('2.1', 'Which CPUs and system memory does a DGX H100 use?',
  ['Two Intel Xeon Platinum 8480C CPUs, 2 TB memory', 'One Arm Grace CPU with 480 GB of LPDDR5X memory', 'Two AMD EPYC 9654 CPUs with 1 TB of memory', 'Two Intel Xeon Platinum 8570 CPUs with 4 TB of memory'],
  'DGX H100: 2 × Intel Xeon 8480C (по 56 ядер) и 2 ТБ памяти. Плюс 2 × 1,92 ТБ NVMe под ОС (RAID 1) и 8 × 3,84 ТБ NVMe под кэш данных (RAID 0).');
q('2.1', 'What is the purpose of the eight internal NVMe U.2 drives in a DGX H100 (about 30 TB in RAID 0)?',
  ['A fast local data cache near the GPUs', 'Mirrored boot drives for the operating system and logs', 'Firmware storage for the BMC and NVSwitches', 'Long-term archive storage for finished models'],
  'Внутренние NVMe (8 × 3,84 ТБ в RAID 0) — быстрый локальный кэш датасета. ОС стоит на отдельных 2 × 1,92 ТБ M.2 в RAID 1. Общее хранилище при этом всё равно нужно для данных и чекпоинтов.');
q('2.3', 'Why is GPU-accelerated computing considered more energy efficient than CPU-only computing for AI workloads?',
  ['It finishes the work much faster, so energy per job is lower', 'GPUs draw less power than CPUs at all times, even at full load', 'GPUs need no cooling at typical loads', 'CPUs cannot enter low-power idle states'],
  'Энергоэффективность — это работа на ватт, а не мощность одного устройства. GPU потребляет больше, но заканчивает задачу во много раз быстрее, поэтому энергии на задачу уходит меньше.');
q('2.3', 'How does direct-to-chip liquid cooling improve data center energy efficiency?',
  ['Liquid moves heat far better than air, cutting fan and chiller power', 'Liquid raises GPU clocks permanently without using any additional power', 'Liquid removes the need for power supplies in servers', 'Liquid lowers network latency between adjacent racks'],
  'Жидкость переносит тепло в тысячи раз эффективнее воздуха. Меньше вентиляторов и чиллеров, можно использовать более тёплую воду, а значит, ниже PUE и больше мощности остаётся на IT.');
q('2.3', 'Which metric best compares the energy efficiency of AI systems?',
  ['Performance per watt', 'Peak power draw of the whole rack in kilowatts at full load', 'Number of power supplies per server', 'Maximum fan speed under full load'],
  'Сравнивают производительность на ватт: FLOPS/Вт, токены/с на ватт, энергию на обучение модели. Пиковая мощность сама по себе ничего не говорит об эффективности.');
q('2.5', 'Why is storage throughput a scaling concern for AI training clusters?',
  ['More GPUs need storage to feed data and absorb checkpoints fast enough', 'GPUs cannot read data from storage without CPU copies', 'Storage traffic shares NVLink bandwidth with gradients', 'Larger clusters need less data per GPU'],
  'Чем больше GPU, тем больше суммарный поток чтения датасета и тем крупнее пиковые записи чекпоинтов. Медленное хранилище оставляет GPU без работы. Помогают параллельные ФС, локальный NVMe‑кэш и GPUDirect Storage.');
q('3.1', 'Which interfaces does the BMC on a DGX H100 support for remote management?',
  ['Redfish, IPMI, SNMP, KVM and a web interface', 'Slurm, Kubernetes and the Run:ai interface', 'SSH to the host OS only, through the compute fabric', 'InfiniBand verbs and RDMA over the cluster ports'],
  'BMC DGX H100 подключается по выделенному порту 1 GbE и поддерживает Redfish, IPMI, SNMP, удалённый KVM и веб‑интерфейс. Через него управляют питанием, смотрят датчики и логи, обновляют прошивки.');
q('3.2', 'What is the role of MLOps orchestration tools in an AI cluster?',
  ['Automating ML pipelines from data to deployment', 'Replacing GPU drivers and CUDA libraries on nodes', 'Managing power and cooling in the data center', 'Computing routes and assigning LIDs in the InfiniBand compute fabric'],
  'Оркестрация MLOps (Kubeflow, Run:ai, Airflow и др.) автоматизирует цепочку: данные → обучение → оценка → развёртывание → мониторинг. Планировщик решает, где и когда запускать каждый шаг.');
// Flashcards: [topic, term, back (RU)]
// ───────── Added after the QA review: gaps and thin topics ─────────
q('1.2', 'During LLM inference, what is the KV cache?',
  ['Saved attention keys/values of past tokens, reused per new token', 'A copy of the model weights kept in CPU memory between user requests', 'A key-value database that stores user prompts for audits', 'A cache of gradients from the last training run'],
  'KV‑кэш хранит ключи и значения механизма внимания для уже обработанных токенов. Новый токен не пересчитывает весь контекст, но кэш занимает много памяти GPU, особенно при длинном контексте и многих пользователях.');
q('1.2', 'In LLM inference, how do the prefill and decode phases differ?',
  ['Prefill processes the prompt in parallel; decode generates tokens one by one', 'Prefill generates tokens one by one; decode processes the prompt in parallel', 'Prefill loads the weights from disk; decode writes the answer to disk', 'Prefill runs on the CPU; decode runs on the GPU'],
  'Prefill обрабатывает весь промпт сразу и упирается в вычисления. Decode выдаёт ответ по одному токену и упирается в пропускную способность памяти. NVIDIA Dynamo умеет разносить эти фазы на разные GPU (disaggregated serving).');
q('1.2', 'What does TF32 on Ampere and newer Tensor Cores provide?',
  ['Faster FP32-like math with no code changes', 'Exact FP64 results for every scientific simulation', 'A 4-bit number format used only for LLM inference', 'A file format for saving TensorFlow checkpoints'],
  'TF32 — формат Tensor Cores с диапазоном FP32 и 10‑битной мантиссой, как у FP16. Фреймворки включают его для матричных операций автоматически, и FP32‑код ускоряется в разы без изменений.');
q('1.2', 'Why is BF16 often preferred over FP16 for training?',
  ['It keeps FP32\'s exponent range, so it rarely overflows', 'It has more mantissa bits, so it is more precise than FP32', 'It uses half the memory of FP16', 'It works only on CPUs, freeing the GPU'],
  'BF16 (bfloat16) хранит 8 бит экспоненты, как FP32, поэтому у него тот же диапазон чисел и почти не бывает переполнений. У FP16 больше бит мантиссы, но узкий диапазон, и ему нужен loss scaling.');
q('1.6', 'How does NVIDIA NIM relate to Triton and TensorRT-LLM?',
  ['NIM bundles a model with such engines into a ready API container', 'NIM replaces CUDA, so neither Triton nor TensorRT-LLM is needed', 'NIM is a training framework, while Triton and TensorRT-LLM are for data prep', 'NIM is the hardware; Triton and TensorRT-LLM are cloud regions'],
  'NIM — готовый микросервис: внутри модель и оптимизированные движки инференса (TensorRT‑LLM, Triton, vLLM и др.), снаружи стандартный API. Triton и TensorRT‑LLM можно использовать и отдельно, собирая сервис самому.');
q('2.1', 'Which NVIDIA data center GPU generation follows Blackwell (B200/B300) on the roadmap?',
  ['Rubin', 'Hopper', 'Ampere', 'Volta'],
  'Порядок поколений: Volta → Ampere (A100) → Hopper (H100/H200) → Blackwell (B200, GB200) и Blackwell Ultra (B300, GB300) → Rubin (платформа Vera Rubin). Hopper и Ampere — предыдущие поколения.');
q('2.1', 'What is NVIDIA GB300 NVL72?',
  ['A Blackwell Ultra version of the NVL72 rack with more HBM per GPU', 'An air-cooled 8-GPU Hopper server for small inference sites', 'A 300-port InfiniBand switch', 'A storage appliance for GPUDirect Storage'],
  'GB300 NVL72 — стойка того же формата, что GB200 NVL72 (72 GPU, 36 CPU Grace, один NVLink‑домен, жидкостное охлаждение), но на Blackwell Ultra: больше HBM3e на GPU (до 288 ГБ) и выше производительность в FP4.');
q('1.1', 'How is NVIDIA AI Enterprise typically licensed?',
  ['Per GPU, as a subscription with enterprise support', 'Free of charge for any production use, without support', 'Per CPU socket, bundled with the operating system', 'Per user account on NGC, with no GPU limit'],
  'NVIDIA AI Enterprise лицензируется на GPU: подписка (обычно на 1–5 лет) или бессрочная лицензия, с поддержкой. С некоторыми системами (например, DGX и H100 PCIe) подписка идёт в комплекте. В облачных маркетплейсах можно платить по часам.');
q('3.3', 'On HGX/DGX systems with NVSwitch, which service must run to set up the NVLink fabric so GPUs can talk to each other?',
  ['NVIDIA Fabric Manager', 'NVIDIA Subnet Manager', 'DCGM Exporter', 'Slurm controller (slurmctld)'],
  'На системах с NVSwitch (HGX/DGX H100 и др.) NVLink‑фабрику настраивает служба nvidia-fabricmanager. Если она не запущена или её версия не совпадает с драйвером, CUDA‑задачи не стартуют. Subnet Manager относится к InfiniBand, а не к NVLink.');
q('3.3', 'Why do admins enable persistence mode on Linux GPU servers?',
  ['It keeps the driver loaded between jobs', 'It saves the contents of GPU memory across node reboots', 'It locks the GPU to a single user', 'It keeps the fans at full speed'],
  'Без persistence mode драйвер выгружается, когда GPU никто не использует, и каждый новый запуск ждёт инициализации. Режим держит драйвер загруженным. Сейчас для этого рекомендуют демон nvidia-persistenced (раньше — nvidia-smi -pm 1).');
q('3.3', 'What can DCGM policies do?',
  ['Alert or act on events such as XID or ECC errors', 'Change the Slurm queue priority of running jobs', 'Rewrite model code to use less GPU memory', 'Automatically order replacement GPUs from NVIDIA'],
  'Политики DCGM следят за условиями (ошибки ECC, XID, перегрев, превышение мощности, ошибки PCIe/NVLink) и при срабатывании отправляют уведомление или выполняют действие. А dcgmi health запускает фоновые проверки здоровья подсистем GPU.');
q('3.2', 'A GPU node shows errors. How does an admin stop new Slurm jobs from landing on it while current jobs finish?',
  ['Set the node to DRAIN with scontrol', 'Cancel every job in the partition with scancel', 'Delete the node from the DNS server', 'Lower its priority in squeue'],
  'scontrol update nodename=<узел> state=DRAIN reason="..." — узел дорабатывает текущие задачи и не берёт новые. После ремонта его возвращают командой state=RESUME. В sinfo такой узел виден как drng или drain.');
q('1.4', 'Why did transformers speed up AI progress so much?',
  ['They train in parallel, which suits GPUs', 'They need no training data at all', 'They run only on CPUs, cutting hardware cost', 'They replaced neural networks with decision trees'],
  'Трансформеры (2017) обрабатывают всю последовательность параллельно через механизм внимания, а не по одному слову, как RNN. Это идеально ложится на тысячи ядер GPU и позволило обучать модели на огромных объёмах текста.');
q('1.4', 'What is a key reason enterprises are adopting generative AI now?',
  ['Ready pretrained models and APIs lower the entry cost', 'Generative AI no longer needs GPUs', 'Regulations require every company to train its own LLM', 'Data preparation is no longer needed'],
  'Сегодня не нужно обучать модель с нуля: есть готовые предобученные модели, NIM, облачные API, fine‑tuning и RAG. Порог входа и время до результата резко снизились.');
q('2.4', 'Which factor most often favors the public cloud for an AI project?',
  ['Short or unpredictable demand that needs a fast start', 'Strict data residency in the company\'s own building', 'Steady 24/7 utilization for several years', 'A need for custom liquid cooling in its own racks'],
  'Облако выигрывает, когда нагрузка короткая, пиковая или непредсказуемая: не нужно покупать железо и ждать поставки. При постоянной высокой загрузке годами обычно дешевле on‑prem.');
q('2.4', 'What does data gravity mean for AI infrastructure planning?',
  ['Big data is hard to move, so compute goes to it', 'Heavy servers need reinforced floors', 'Data always flows from the cloud to on-premises', 'GPUs slow down when storage is far from the rack'],
  'Data gravity: чем больше данных, тем дороже и дольше их перемещать (egress, время передачи). Поэтому вычисления часто размещают там, где уже лежат данные.');
q('2.5', 'Which nodes typically handle user logins, code editing and job submission in an AI cluster?',
  ['Login nodes', 'GPU compute nodes', 'Storage nodes', 'InfiniBand switches'],
  'Пользователи заходят на login‑узлы: пишут код, готовят данные и отправляют задачи (sbatch). Сами вычисления идут на GPU‑узлах, а служебные сервисы кластера — на head‑узлах.');
q('2.5', 'In a DGX BasePOD or SuperPOD, what is the storage fabric for?',
  ['Feeding GPUs data and saving checkpoints fast', 'Carrying GPU-to-GPU gradient traffic inside each node', 'Connecting BMCs for out-of-band management', 'Giving users internet access'],
  'Отдельная storage fabric даёт GPU‑узлам высокий параллельный throughput к общему хранилищу: чтение датасетов и быструю запись чекпоинтов. Градиенты между GPU идут по compute fabric, а BMC — по OOB‑сети.');
q('2.6', 'What should be checked before installing DGX systems on a raised floor?',
  ['The floor load rating and the delivery path', 'The color of the floor tiles', 'Wi-Fi signal strength across the whole data hall', 'The number of desks nearby'],
  'DGX весит около 130 кг, а полная AI‑стойка — больше тонны. Нужно проверить допустимую нагрузку на фальшпол и весь путь доставки: двери, лифты, пандусы.');
q('2.6', 'Why must cable paths and lengths be planned carefully in an AI cluster?',
  ['High-speed links have strict length and bend limits', 'Cables change the GPU clock speed', 'Longer cables always raise NVLink bandwidth between nodes', 'Cable color determines the network protocol'],
  'В AI‑кластере сотни и тысячи кабелей 400G/800G. У меди (DAC) длина всего несколько метров, у оптики есть ограничения на изгиб и чистоту разъёмов. Плохая укладка ещё и мешает обдуву и обслуживанию.');
q('2.10', 'Which NVIDIA product family provides DPUs?',
  ['BlueField', 'ConnectX-7', 'Quantum-2', 'Grace'],
  'BlueField — семейство DPU NVIDIA (BlueField‑2, BlueField‑3). ConnectX — сетевые адаптеры без своего Arm‑процессора, Quantum — коммутаторы InfiniBand, Grace — CPU.');
q('2.10', 'What does zero-trust isolation with a DPU mean?',
  ['Security runs on the DPU, out of the host\'s reach', 'The host CPU checks every packet by itself', 'All tenants share one administrator password for simplicity', 'The DPU turns off encryption to save power'],
  'Firewall, шифрование и контроль доступа работают на DPU, в отдельном домене доверия. Даже если ОС хоста взломана, злоумышленник не может отключить эти защиты.');

const G = [
  ['1.1','CUDA','Платформа и модель программирования NVIDIA для вычислений общего назначения на GPU. Основа всего стека.'],
  ['1.1','cuDNN','Библиотека примитивов глубокого обучения (свёртки, нормализация, активации) для фреймворков.'],
  ['1.1','NCCL','NVIDIA Collective Communications Library: обмен данными между GPU и узлами (all‑reduce, all‑gather, broadcast).'],
  ['1.1','NGC','NVIDIA GPU Cloud: каталог GPU‑оптимизированных контейнеров, моделей и Helm‑чартов.'],
  ['1.1','NVIDIA AI Enterprise','Коммерческий набор AI‑ПО с поддержкой и сертификацией: NIM, NeMo, Triton, RAPIDS, GPU Operator.'],
  ['1.1','GPU Operator','Автоматически ставит в Kubernetes драйвер, Container Toolkit, device plugin, DCGM Exporter, MIG Manager.'],
  ['1.1','Container Toolkit','Даёт контейнерам доступ к GPU хоста (docker run --gpus all).'],
  ['1.1','RAPIDS','Data science на GPU: cuDF (как pandas), cuML (как scikit‑learn), cuGraph.'],
  ['1.2','TensorRT','Оптимизатор и runtime инференса: слияние слоёв, квантование FP8/INT8, автоподбор самых быстрых GPU‑программ (kernels).'],
  ['1.2','Triton Inference Server','Сервер инференса для многих фреймворков: динамический батчинг, несколько моделей на GPU. С 2025 года называется NVIDIA Dynamo Triton.'],
  ['1.2','Dynamic batching','Сервер собирает входящие запросы в пачки, чтобы поднять загрузку GPU и throughput.'],
  ['1.2','Mixed precision','Обучение в BF16/FP16 на Tensor Cores с мастер‑весами в FP32: быстрее и экономнее по памяти.'],
  ['1.2','Quantization','Перевод весов в меньшую разрядность (INT8, FP8, FP4) для быстрого и дешёвого инференса.'],
  ['1.3','AI, ML и DL','ML — часть AI, DL — часть ML (как матрёшка). AI — общая область, ML учится на данных, DL — многослойные нейросети, которые сами находят признаки.'],
  ['1.3','Supervised / Unsupervised / RL','С учителем — размеченные данные; без учителя — поиск структуры; с подкреплением — награды за действия.'],
  ['1.3','Transformer','Архитектура на self‑attention, основа LLM. Хорошо параллелится на GPU.'],
  ['1.3','Fine-tuning','Дообучение готовой модели на небольшом наборе своих данных. LoRA и PEFT — способы менять лишь малую часть весов.'],
  ['1.3','RAG','Retrieval‑Augmented Generation: найти нужные документы в векторной базе и добавить их в промпт LLM. Модель не переобучают.'],
  ['1.4','Три причины роста AI','Данные + вычисления на GPU + алгоритмы (трансформеры). Плюс облака и открытые фреймворки.'],
  ['1.4','Scaling laws','Качество моделей предсказуемо растёт с параметрами, данными и вычислениями.'],
  ['1.5','Clara','Здравоохранение: медицинская визуализация (MONAI), геномика (Parabricks), BioNeMo.'],
  ['1.5','Metropolis','Видеоаналитика: умные города, ритейл, промышленность (вместе с DeepStream).'],
  ['1.5','Isaac','Робототехника: симуляция Isaac Sim, обучение роботов.'],
  ['1.5','Omniverse','3D‑симуляция и цифровые двойники на OpenUSD.'],
  ['1.5','Riva / Morpheus / Merlin','Riva — речь; Morpheus — кибербезопасность; Merlin — рекомендательные системы.'],
  ['1.5','DRIVE / cuOpt','DRIVE — автономные автомобили; cuOpt — оптимизация маршрутов и логистики.'],
  ['1.6','NIM','Готовые контейнеры для инференса моделей со стандартным (OpenAI‑совместимым) API.'],
  ['1.6','NeMo','Фреймворк полного цикла генеративного AI: данные, обучение, дообучение, guardrails.'],
  ['1.6','Base Command Manager','Провижининг, мониторинг и управление on‑prem кластерами (бывший Bright Cluster Manager).'],
  ['1.6','Fleet Command','Развёртывание и управление AI на множестве edge‑площадок.'],
  ['1.6','Run:ai','Оркестрация GPU в Kubernetes: пул ресурсов, квоты, дробные GPU.'],
  ['1.6','DGX Cloud','Инфраструктура и ПО NVIDIA как сервис у облачных партнёров.'],
  ['1.7','Жизненный цикл AI','Данные → обучение → оптимизация и проверка → развёртывание → мониторинг и переобучение.'],
  ['1.7','DALI','Загрузка и аугментация данных на GPU, убирает узкое место на CPU.'],
  ['1.7','Model drift','Падение качества модели из‑за изменения реальных данных. Нужен мониторинг и переобучение.'],
  ['1.8','CPU vs GPU','CPU: мало сложных ядер, низкая задержка, последовательная логика. GPU: тысячи простых ядер, параллельная пропускная способность.'],
  ['1.8','Tensor Cores','Блоки умножения‑сложения матриц в смешанной точности. Главный ускоритель AI.'],
  ['1.8','HBM','High Bandwidth Memory: стековая память рядом с GPU, ТБ/с пропускной способности. H100 — 80 ГБ, H200 — 141 ГБ.'],
  ['1.8','SM','Streaming Multiprocessor — строительный блок GPU (CUDA‑ядра, Tensor Cores, память).'],
  ['1.8','Grace Hopper / NVLink-C2C','CPU Grace + GPU Hopper, когерентная связь NVLink‑C2C 900 ГБ/с.'],
  ['2.1','DGX H100','8× H100 SXM, 640 ГБ HBM3, 4× NVSwitch, 2× Xeon 8480C, ~10,2 кВт, ~130 кг.'],
  ['2.1','DGX B200','8× Blackwell, 1440 ГБ HBM3e, NVLink 5 (1,8 ТБ/с на GPU), ~14,3 кВт.'],
  ['1.8','Поколения GPU','Ampere — A100; Hopper — H100/H200; Blackwell — B200/GB200; Ada Lovelace — L4/L40S.'],
  ['2.3','Энергоэффективность','Ускоренные вычисления делают ту же работу быстрее и с меньшей энергией; меряют производительность на ватт.'],
  ['2.1','NVLink по поколениям','A100 — 600 ГБ/с, H100 — 900 ГБ/с, Blackwell — 1,8 ТБ/с на GPU.'],
  ['2.1','NVSwitch','Коммутатор NVLink: связь всех GPU со всеми на полной скорости.'],
  ['2.1','GB200 NVL72','72 GPU Blackwell + 36 CPU Grace, один NVLink‑домен, жидкостное охлаждение, стойка ~120+ кВт.'],
  ['2.1','SXM vs PCIe','SXM — плата с NVLink/NVSwitch и высокой мощностью; PCIe — стандартный слот, меньше мощность.'],
  ['2.1','GPUDirect Storage','Прямой DMA между хранилищем и памятью GPU, минуя буфер в RAM процессора.'],
  ['2.2','Scale-up vs scale-out','Scale‑up — больше GPU в NVLink‑домене; scale‑out — больше узлов по сети.'],
  ['2.2','Data / Tensor / Pipeline parallel','Data — копия модели на каждом GPU; Tensor — делим слои (внутри NVLink); Pipeline — разные слои на разных GPU.'],
  ['2.2','Scalable Unit (SU)','Блок DGX SuperPOD: 32 узла DGX H100 = 256 GPU.'],
  ['2.3','PUE','Вся мощность ЦОД / мощность IT. Идеал 1,0; хорошие ЦОД 1,1–1,4.'],
  ['2.3','Плотность стоек','Обычная стойка 5–15 кВт; AI‑стойка 40–130+ кВт.'],
  ['2.3','Direct-to-chip','Холодные пластины на чипах, тепло уходит жидкостью через CDU (Coolant Distribution Unit — блок распределения охлаждающей жидкости).'],
  ['2.3','N+1 vs 2N','N+1 — один запасной компонент; 2N — полностью дублированные независимые пути A/B.'],
  ['2.3','Hot/cold aisle','Изоляция горячего и холодного коридоров, чтобы воздух не смешивался.'],
  ['2.4','Облако','Быстрый старт, эластичность, оплата по факту (OpEx — операционные расходы). Минусы: egress (плата за выгрузку данных), дефицит GPU, цена при масштабе.'],
  ['2.4','On-prem','Дешевле при постоянной высокой загрузке, контроль и суверенитет данных. Минусы: CapEx (крупные вложения заранее), сроки, эксплуатация.'],
  ['2.4','Cloud bursting','База на своём кластере, пики уходят в облако.'],
  ['2.5','4 сети SuperPOD','Compute fabric, storage fabric, in‑band management, out‑of‑band management.'],
  ['2.6','Требования к площадке','Мощность, охлаждение, нагрузка на пол (DGX ~130 кг), место, кабели, климат по ASHRAE (рекомендации по температуре и влажности).'],
  ['2.7','East-west / North-south','East‑west — внутри ЦОД между серверами; north‑south — между ЦОД и внешним миром.'],
  ['2.7','Rail-optimized','Порт N каждого узла подключён к одному leaf‑коммутатору «рельса» N.'],
  ['2.7','RDMA','Remote Direct Memory Access: передача данных из памяти в память между узлами в обход CPU и ядра ОС (kernel).'],
  ['2.7','GPUDirect RDMA','Сетевая карта читает и пишет память GPU напрямую.'],
  ['2.8','RoCE v2','RDMA over Converged Ethernet: RDMA поверх Ethernet в пакетах UDP/IP, маршрутизируется между подсетями. Нужны PFC + ECN.'],
  ['2.8','PFC / ECN','PFC — пауза по приоритету при заполнении буфера; ECN — пометка о заторе, источник снижает скорость.'],
  ['2.8','Subnet Manager','Мозг InfiniBand: находит топологию, раздаёт адреса LID (Local ID) и считает маршруты (например, в UFM).'],
  ['2.8','Credit-based flow control','InfiniBand шлёт только при свободном буфере у получателя, поэтому без потерь.'],
  ['2.8','SHARP','Scalable Hierarchical Aggregation and Reduction Protocol: all‑reduce прямо в коммутаторах InfiniBand.'],
  ['2.9','IB поколения','EDR 100 → HDR 200 → NDR 400 → XDR 800 Гб/с.'],
  ['2.9','Quantum-2 / Quantum-X800','Коммутаторы InfiniBand NDR 400G / XDR 800G.'],
  ['2.9','Spectrum-X','AI‑Ethernet: коммутаторы Spectrum‑4 или Spectrum‑X800 + SuperNIC (BlueField‑3 или ConnectX‑8), адаптивная маршрутизация, контроль заторов.'],
  ['2.9','Gb/s → GB/s','Делим на 8: 400 Гб/с ≈ 50 ГБ/с.'],
  ['2.10','DPU','Data Processing Unit: сетевая карта + ядра Arm + ускорители. Берёт на себя сеть, хранение и безопасность вместо CPU хоста.'],
  ['2.10','BlueField / DOCA','BlueField — DPU NVIDIA; DOCA — его SDK (как CUDA для GPU).'],
  ['2.10','Выгоды DPU','Освобождает ядра CPU, изолирует инфраструктуру от арендатора (zero trust).'],
  ['3.1','BMC','Baseboard Management Controller: отдельный контроллер для out‑of‑band управления — питание, датчики, консоль. Протоколы IPMI и Redfish.'],
  ['3.1','OOB network','Отдельная сеть управления к BMC, работает при упавшей ОС или основной сети.'],
  ['3.1','Prometheus + Grafana','Сбор метрик (DCGM Exporter → Prometheus) и дашборды с алертами (Grafana).'],
  ['3.2','Slurm: команды','sbatch — отправить; srun — запустить; squeue — очередь; scancel — отменить; sinfo — узлы.'],
  ['3.2','Slurm GRES','Запрос GPU: --gres=gpu:8.'],
  ['3.2','K8s GPU','В Kubernetes (K8s) GPU просят так: resources.limits: nvidia.com/gpu: 1 (ресурс объявляет device plugin).'],
  ['3.2','Gang scheduling','Выделять все ресурсы многоузловой задачи сразу или никакие.'],
  ['3.2','Pyxis + Enroot','Непривилегированные контейнеры в задачах Slurm.'],
  ['3.2','Preemption / Backfill','Preemption — вытеснение низкоприоритетных; backfill — мелкие задачи в «дырах» расписания.'],
  ['3.3','nvidia-smi / NVML','CLI для состояния GPU, построен на NVML. topo -m — топология; -pl — лимит мощности.'],
  ['3.3','DCGM','Data Center GPU Manager: мониторинг, проверки здоровья, диагностика (dcgmi diag), политики для GPU в масштабе ЦОД.'],
  ['3.3','XID','Коды ошибок драйвера NVIDIA в системном логе (dmesg). На H100: 94/95 — ошибки памяти, 63/64 — row remapping, 79 — GPU пропал с шины.'],
  ['3.3','ECC','Error‑Correcting Code: коррекция ошибок памяти. Рост некорректируемых ошибок — признак сбоя памяти GPU.'],
  ['3.3','GPU-Util ≠ эффективность','GPU‑Util — доля времени, когда работала хоть одна программа‑ядро (CUDA kernel). Смотри SM Activity и Tensor Active в DCGM.'],
  ['3.4','MIG','Multi‑Instance GPU: до 7 изолированных экземпляров на A100/H100, у каждого свои SM, память и кэш.'],
  ['3.4','Time-slicing','Поочерёдное использование GPU без изоляции памяти.'],
  ['3.4','vGPU','Совместное использование GPU несколькими ВМ через гипервизор, профили, лицензия.'],
  ['3.4','Passthrough','Весь GPU одной ВМ, производительность почти как на «железе».'],
  ['1.2','Обучение vs инференс','Обучение: forward + backward, много GPU, важны память и интерконнект. Инференс: только forward, важны задержка, throughput и цена запроса.'],
  ['1.2','KV‑кэш','Ключи и значения внимания для прошлых токенов. Ускоряет генерацию, но занимает много памяти GPU.'],
  ['1.2','Prefill / decode','Prefill — весь промпт сразу (упор в вычисления); decode — по токену (упор в память).'],
  ['1.2','BF16 / TF32','BF16 — диапазон FP32 в 16 битах, удобен для обучения. TF32 — ускоряет FP32‑код на Tensor Cores без правок.'],
  ['2.1','DGX H100: сеть','8× ConnectX‑7 400G для вычислительной фабрики (по одному на GPU), 2 двухпортовые карты для хранения и in‑band, BMC 1 GbE.'],
  ['2.1','Blackwell Ultra и Rubin','Blackwell Ultra — B300 и GB300 NVL72 (больше HBM3e). Следующее поколение — Rubin (Vera Rubin).'],
  ['2.5','Head, login и compute','Head — службы кластера; login — вход пользователей и отправка задач; compute — GPU‑узлы, где идут расчёты.'],
  ['2.5','Общее хранилище','Все узлы читают одни датасеты и пишут чекпоинты в одно место (параллельная ФС по storage fabric).'],
  ['2.6','Кабели: медь и оптика','DAC (медь) — дёшево, но лишь несколько метров; оптика — дальше, между стойками. Планируй длины и изгибы.'],
  ['2.6','UPS и генераторы','UPS держит нагрузку минуты, пока не запустятся дизель‑генераторы. Генераторы работают часами.'],
  ['3.3','Fabric Manager','Служба nvidia-fabricmanager настраивает NVLink‑фабрику на системах с NVSwitch. Без неё CUDA‑задачи не стартуют.'],
  ['3.3','Persistence mode','Держит драйвер загруженным между задачами (демон nvidia-persistenced), чтобы не ждать инициализации.'],
  ['3.2','DRAIN в Slurm','scontrol update … state=DRAIN: узел доделывает задачи и не берёт новые. Вернуть — state=RESUME.'],
];

const DOMAINS = {
  d1: { name: 'Essential AI Knowledge', ru: 'Основы AI', w: 38, exam: 19 },
  d2: { name: 'AI Infrastructure', ru: 'Инфраструктура', w: 40, exam: 20 },
  d3: { name: 'AI Operations', ru: 'Эксплуатация', w: 22, exam: 11 },
};
const TOPICS = {
  '1.1': 'Программный стек NVIDIA', '1.2': 'Обучение и инференс', '1.3': 'AI, ML и DL', '1.4': 'Почему AI растёт',
  '1.5': 'Сценарии и отрасли', '1.6': 'Решения NVIDIA', '1.7': 'Жизненный цикл AI', '1.8': 'GPU и CPU',
  '2.1': 'Железо для обучения', '2.2': 'Масштабирование GPU', '2.3': 'Питание и охлаждение', '2.4': 'On‑prem и облако',
  '2.5': 'Компоненты кластера', '2.6': 'Требования к площадке', '2.7': 'Сеть для AI', '2.8': 'Сетевые протоколы',
  '2.9': 'Высокоскоростные сети', '2.10': 'DPU',
  '3.1': 'Управление и мониторинг', '3.2': 'Оркестрация и планировщики', '3.3': 'Метрики GPU', '3.4': 'Виртуализация',
};

// Cheat sheet: per domain, list of [heading, [bullets]]
const NOTES = {
  d1: [
    ['Стек снизу вверх', ['Железо (GPU, DPU, NIC) → драйвер → CUDA + CUDA‑X (cuDNN, cuBLAS, NCCL, DALI) → фреймворки (PyTorch, TensorFlow) → платформы (NeMo, RAPIDS) → инференс (TensorRT, Triton, NIM)', 'Упаковка и доставка: NGC (каталог) и NVIDIA AI Enterprise (поддержка, сертификация)', 'Kubernetes: GPU Operator, Network Operator, Container Toolkit']],
    ['Обучение и инференс', ['Обучение: forward + backward, огромные данные, много GPU и узлов, важны память и интерконнект, BF16/FP16/FP8', 'Инференс: только forward, важны задержка, throughput и стоимость, INT8/FP8/FP4, масштаб горизонтально', 'Обучение ест больше памяти: веса + градиенты + состояния оптимизатора + активации']],
    ['AI, ML, DL', ['ML — часть AI, DL — часть ML (матрёшка)', 'Supervised (метки), unsupervised (кластеры), reinforcement (награды)', 'Генеративный AI: LLM на трансформерах, диффузия. Fine‑tuning и RAG — способы адаптации']],
    ['Решения по отраслям', ['Clara — медицина · Metropolis — видеоаналитика · Isaac — роботы · Omniverse — цифровые двойники', 'Riva — речь · Morpheus — кибербезопасность · Merlin — рекомендации · DRIVE — авто · cuOpt — логистика', 'NIM — готовые инференс‑контейнеры · NeMo — генеративный AI · Run:ai — оркестрация GPU · BCM — управление кластером · Fleet Command — edge']],
    ['GPU и CPU', ['CPU: десятки мощных ядер, кэши, ветвления, ОС и I/O', 'GPU: тысячи ядер, SM, Tensor Cores, HBM, сокрытие задержек за счёт множества потоков', 'Transformer Engine: FP8 в Hopper, FP4 в Blackwell']],
    ['Почему AI растёт', ['Три причины: данные, вычисления на GPU, новые алгоритмы (трансформеры)', 'Законы масштабирования: больше параметров, данных и вычислений → лучше качество', 'Готовые модели, NIM, облачные API, fine‑tuning и RAG снижают порог входа']],
    ['Жизненный цикл AI', ['Данные → обучение → оптимизация (TensorRT) → развёртывание (Triton, NIM) → мониторинг', 'Подготовка данных занимает больше всего времени (RAPIDS, DALI, NeMo Curator)', 'Чекпоинты спасают долгое обучение; дрейф модели лечат мониторингом и переобучением', 'MLOps: версии, CI/CD, автоматические пайплайны; контейнеры из NGC']],
  ],
  d2: [
    ['Ключевые цифры', ['DGX H100: 8 GPU, 640 ГБ, ~10,2 кВт, 8× ConnectX‑7 400G (фабрика) + 2 карты для хранения/in‑band, BMC 1 GbE', 'DGX B200: 8 GPU Blackwell, 1440 ГБ, ~14,3 кВт', 'NVLink: 600 (A100) → 900 (H100) → 1800 ГБ/с (Blackwell)', 'InfiniBand: EDR 100 → HDR 200 → NDR 400 → XDR 800 Гб/с', 'SuperPOD SU: 32 узла DGX H100 = 256 GPU', 'GB200 NVL72: 72 GPU + 36 Grace, жидкость, ~120+ кВт', 'MIG: до 7 экземпляров']],
    ['Масштабирование', ['Scale‑up — NVLink/NVSwitch внутри узла или стойки', 'Scale‑out — InfiniBand или Spectrum‑X Ethernet между узлами', 'Data parallel — all‑reduce градиентов; tensor parallel — внутри NVLink‑домена; pipeline — между узлами']],
    ['Питание и охлаждение', ['PUE = вся мощность / IT‑мощность', 'Обычная стойка 5–15 кВт, AI 40–130+ кВт → жидкостное охлаждение', 'Direct‑to‑chip, rear‑door, hot/cold aisle', 'N+1 — один запасной; 2N — два независимых пути A/B', 'Площадка: мощность, охлаждение, вес на пол, место, ASHRAE, трёхфазное питание']],
    ['Сеть', ['4 сети: compute, storage, in‑band, out‑of‑band', 'East‑west доминирует при обучении; north‑south — запросы пользователей', 'Rail‑optimized fat‑tree без переподписки', 'RDMA, GPUDirect RDMA, GPUDirect Storage', 'InfiniBand: Subnet Manager, credit‑based flow control, SHARP', 'RoCE v2: UDP/IP, нужен lossless через PFC + ECN']],
    ['DPU', ['BlueField = NIC + Arm + ускорители; программируется через DOCA', 'Разгружает CPU: OVS, шифрование, NVMe‑oF, firewall', 'Изоляция инфраструктуры от арендатора (zero trust)', 'CPU + GPU + DPU — три столпа ЦОД']],
    ['On‑prem и облако', ['Облако: эластичность, быстрый старт, OpEx; минусы — egress, дефицит GPU, цена на масштабе', 'On‑prem: дешевле при высокой загрузке, контроль данных; минусы — CapEx, сроки, своя эксплуатация', 'Гибрид и cloud bursting']],
  ],
  d3: [
    ['Управление', ['BMC + IPMI/Redfish через OOB‑сеть: питание, датчики, консоль', 'Base Command Manager: провижининг, мониторинг, настройка Slurm/K8s', 'Mission Control: эксплуатация AI‑фабрик', 'DCGM Exporter → Prometheus → Grafana']],
    ['Планировщики', ['Slurm: sbatch, srun, squeue, scancel, sinfo; GPU через --gres=gpu:N; партиции', 'Kubernetes: nvidia.com/gpu через device plugin; GPU Operator', 'Gang scheduling, preemption, backfill, fair share', 'Pyxis + Enroot — контейнеры в Slurm; Run:ai — пул GPU в K8s']],
    ['Метрики GPU', ['nvidia-smi (NVML): utilization, memory, temp, power, clocks, процессы; topo -m; -pl', 'DCGM: dcgmi diag -r 1…4, политики, профилировочные метрики', 'XID в dmesg; рост некорректируемых ECC → выводить GPU', 'GPU‑Util 100% ≠ полная загрузка SM', 'Низкая утилизация: данные, CPU, маленький батч, сеть']],
    ['Виртуализация', ['MIG: аппаратная изоляция, до 7 экземпляров, гарантированный QoS', 'Time‑slicing: по очереди, без изоляции памяти', 'vGPU: ВМ делят GPU через гипервизор, профили, лицензия', 'Passthrough: весь GPU одной ВМ', 'Учесть: накладные расходы, лицензии, совместимость драйверов, размер профилей']],
  ],
};

// Plain-language glossary for newcomers: the words that appear in questions from the very first lesson.
const BASICS = [
  ['GPU', 'Графический процессор: тысячи простых ядер считают одновременно. Главный «двигатель» AI.'],
  ['CPU', 'Центральный процессор: несколько мощных ядер для логики, операционной системы и управления.'],
  ['DPU', 'Data Processing Unit: сетевая карта со своим процессором. Берёт на себя сеть, хранение и безопасность, разгружая CPU.'],
  ['Tensor Core', 'Блок внутри GPU NVIDIA, который очень быстро перемножает матрицы — основную операцию нейросетей.'],
  ['HBM', 'High Bandwidth Memory: сверхбыстрая память прямо рядом с чипом GPU.'],
  ['NVLink / NVSwitch', 'Быстрые «провода» NVIDIA между GPU внутри сервера или стойки. Намного быстрее PCIe.'],
  ['PCIe', 'Стандартная шина внутри компьютера, к ней подключаются видеокарты, диски и сетевые карты.'],
  ['Node', 'Узел: один сервер, например DGX с восемью GPU.'],
  ['Cluster', 'Кластер: много узлов, соединённых сетью и работающих как одна система.'],
  ['Rack', 'Стойка: шкаф, в котором стоят серверы, коммутаторы и блоки питания.'],
  ['InfiniBand', 'Сеть для суперкомпьютеров с очень низкой задержкой. Соединяет узлы AI-кластера.'],
  ['Ethernet / RoCE', 'Обычная сеть как в офисе. RoCE позволяет передавать по ней данные напрямую в память, как в InfiniBand.'],
  ['RDMA', 'Remote Direct Memory Access: один сервер пишет данные прямо в память другого, минуя процессор.'],
  ['Latency / Throughput', 'Задержка — сколько ждать один ответ. Пропускная способность — сколько данных или запросов проходит за секунду.'],
  ['Training', 'Обучение: модель много раз смотрит на данные и подстраивает свои веса. Долго и требует много GPU.'],
  ['Inference', 'Инференс: готовая модель отвечает на новые запросы. Нужны скорость и низкая задержка.'],
  ['Weights / Model', 'Веса — числа внутри нейросети, которые она выучила. Модель — это архитектура плюс веса.'],
  ['Gradient', 'Градиент: подсказка, куда и насколько менять каждый вес, чтобы ошибка стала меньше.'],
  ['LLM', 'Large Language Model: большая языковая модель вроде чат-ботов, обученная на огромных объёмах текста.'],
  ['FP32 / FP16 / FP8', 'Форматы чисел: сколько бит на одно число. Меньше бит — быстрее и меньше памяти, но ниже точность.'],
  ['CUDA', 'Платформа NVIDIA, через которую программы используют GPU для вычислений.'],
  ['Container', 'Контейнер: программа вместе со всеми библиотеками в одной упаковке, запускается одинаково везде.'],
  ['Kubernetes', 'Система, которая запускает контейнеры на многих серверах и следит, чтобы они работали.'],
  ['Slurm', 'Планировщик задач в кластере: ставит задания в очередь и выдаёт им GPU и узлы.'],
  ['MIG', 'Multi-Instance GPU: деление одного большого GPU на несколько маленьких изолированных частей.'],
  ['PUE', 'Power Usage Effectiveness: вся энергия ЦОД, делённая на энергию серверов. Чем ближе к 1,0, тем лучше.'],
];

// Localize the shared tables in place (tr is identity for Russian)
G.forEach(g => { g[3] = g[1]; g[1] = tr(g[1]); g[2] = tr(g[2]); });
Object.values(DOMAINS).forEach(d => { d.name = tr(d.name); d.ru = tr(d.ru); });
Object.keys(TOPICS).forEach(k => { TOPICS[k] = tr(TOPICS[k]); });
Object.values(NOTES).forEach(list => list.forEach(n => { n[0] = tr(n[0]); n[1] = n[1].map(b => tr(b)); }));
BASICS.forEach(b => { b[1] = tr(b[1]); });
