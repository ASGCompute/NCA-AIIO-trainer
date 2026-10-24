// Question bank. First option is always the correct one; options are shuffled at render time.
const Q = [];
function q(t, text, opts, ex) { Q.push({ t, d: 'd' + t.split('.')[0], text, opts, ex }); }

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
  ['A catalog of GPU-optimized containers, pretrained models, Helm charts and SDKs', 'A family of data center GPUs', 'A network congestion-control protocol', 'A liquid cooling standard'],
  'NGC — каталог (хаб) готового ПО: контейнеры PyTorch/TensorFlow, оптимизированные под GPU, предобученные модели, Helm-чарты. Экономит время на сборку окружения и гарантирует совместимость версий.');
q('1.1', 'Which NVIDIA software suite provides an enterprise-supported, certified, end-to-end platform of AI frameworks, tools and microservices for production use?',
  ['NVIDIA AI Enterprise', 'CUDA Toolkit', 'GeForce Experience', 'DGX OS'],
  'NVIDIA AI Enterprise — коммерческий набор ПО с поддержкой, сертификацией и стабильными ветками (включает NIM, NeMo, Triton, RAPIDS, GPU Operator). Работает в облаке, on‑prem и на виртуализации.');
q('1.1', 'In Kubernetes, which NVIDIA component automates installing the GPU driver, container toolkit, device plugin, DCGM exporter and MIG manager on GPU nodes?',
  ['NVIDIA GPU Operator', 'NVIDIA Network Operator', 'kube-proxy', 'Helm'],
  'GPU Operator разворачивает весь программный стек GPU в кластере Kubernetes как набор контейнеров. Network Operator делает то же для сетевого стека (RDMA, драйверы ConnectX). Helm — лишь менеджер пакетов, которым Operator часто ставят.');
q('1.1', 'What does the NVIDIA Container Toolkit do?',
  ['Lets container runtimes such as Docker or containerd access the host GPUs and driver', 'Builds container images from source code', 'Schedules containers across cluster nodes', 'Stores container images in a registry'],
  'Container Toolkit подключает GPU и библиотеки драйвера внутрь контейнера при запуске (например, docker run --gpus all). Драйвер стоит на хосте, а CUDA и фреймворки живут в контейнере.');
q('1.1', 'Which open-source suite accelerates data science pipelines on GPUs with pandas- and scikit-learn-like APIs?',
  ['RAPIDS', 'NeMo', 'Riva', 'DOCA'],
  'RAPIDS: cuDF (аналог pandas), cuML (аналог scikit-learn), cuGraph. Ускоряет подготовку данных и классический ML на GPU. NeMo — генеративный AI, Riva — речь, DOCA — DPU.');
q('1.1', 'In the layered NVIDIA AI software stack, which layer sits directly on top of the GPU hardware and allows the OS and CUDA to use it?',
  ['The NVIDIA GPU driver', 'The AI framework, such as PyTorch', 'The job scheduler', 'The Triton model repository'],
  'Порядок снизу вверх: железо → драйвер GPU → CUDA и библиотеки CUDA‑X (cuDNN, NCCL…) → фреймворки (PyTorch, TensorFlow) → приложения и сервисы (NIM, Triton). Это частый вопрос о стеке.');
q('1.1', 'DGX OS, the operating system shipped on DGX systems, is based on which distribution?',
  ['Ubuntu Linux with NVIDIA drivers and tools preinstalled', 'Windows Server', 'VMware ESXi', 'A proprietary real-time OS'],
  'DGX OS — это Ubuntu с предустановленными и протестированными драйверами, CUDA, DCGM, Docker и Container Toolkit. Также поддерживаются RHEL/Rocky с пакетами DGX Software Stack.');
q('1.1', 'A team wants GPU-optimized PyTorch with matching CUDA and cuDNN versions without building it themselves. What is the fastest path?',
  ['Pull the PyTorch container from NGC', 'Compile PyTorch from source on each node', 'Install the CPU-only PyTorch wheel', 'Use a generic Linux base image and add drivers inside it'],
  'Контейнеры NGC выходят ежемесячно и уже содержат согласованные версии CUDA, cuDNN, NCCL и фреймворка. Драйвер внутрь контейнера ставить не нужно: он остаётся на хосте.');

// 1.2 Training vs inference
q('1.2', 'Which statement best compares training and inference?',
  ['Training runs forward and backward passes iteratively over large datasets; inference runs only the forward pass on new data', 'Inference requires backpropagation; training does not', 'Training is latency-critical; inference is throughput-only', 'Both stages use exactly the same hardware and precision'],
  'Обучение: прямой проход + обратное распространение ошибки, много эпох, огромные данные, долгие задачи. Инференс: только прямой проход на обученной модели, важны задержка и стоимость запроса.');
q('1.2', 'Which metric is usually the most critical for real-time inference, such as a chatbot or fraud check?',
  ['Latency', 'Total training time', 'Number of epochs', 'Gradient size'],
  'Для онлайн‑инференса главное — задержка (latency), часто вместе с пропускной способностью (throughput). Эпохи и градиенты относятся к обучению.');
q('1.2', 'Why can inference often use lower precision, such as INT8, FP8 or FP4?',
  ['Weights are fixed, and quantization keeps acceptable accuracy while raising throughput and cutting memory', 'Inference needs backpropagation at low precision', 'Lower precision always increases accuracy', 'GPUs cannot run FP32 during inference'],
  'После обучения веса не меняются, поэтому их можно квантовать. Меньше бит — меньше памяти и больше операций в секунду на Tensor Cores при небольшой потере точности.');
q('1.2', 'Which workload benefits most from a large multi-node GPU cluster with a high-bandwidth, low-latency interconnect?',
  ['Training a large foundation model', 'Serving a small image classifier on an edge camera', 'Generating a nightly sales report', 'Hosting a static website'],
  'Обучение больших моделей требует сотен и тысяч GPU, которые постоянно обмениваются градиентами. Поэтому нужны NVLink внутри узла и InfiniBand или Spectrum‑X Ethernet между узлами.');
q('1.2', 'Which NVIDIA SDK optimizes trained models for inference with layer fusion, precision calibration and kernel auto-tuning?',
  ['TensorRT', 'NCCL', 'DCGM', 'Slurm'],
  'TensorRT — компилятор и runtime для инференса: сливает слои, квантует (FP8/INT8), подбирает лучшие ядра под конкретный GPU. Для LLM есть TensorRT‑LLM.');
q('1.2', 'Which NVIDIA software serves models from multiple frameworks, such as TensorRT, PyTorch, ONNX and TensorFlow, with dynamic batching and concurrent model execution?',
  ['Triton Inference Server', 'NeMo Framework', 'RAPIDS', 'Base Command Manager'],
  'Triton — открытый сервер инференса: много фреймворков, динамический батчинг, несколько моделей на одном GPU, метрики для Prometheus. Сейчас развивается в рамках NVIDIA Dynamo.');
q('1.2', 'What is dynamic batching in an inference server?',
  ['Grouping incoming requests on the server into batches to raise GPU utilization and throughput', 'Splitting one model across several GPUs', 'Changing the learning rate during training', 'Dropping requests when the GPU is busy'],
  'Сервер на мгновение копит запросы и отправляет их на GPU пачкой. Это повышает загрузку GPU и throughput ценой небольшой добавки к задержке.');
q('1.2', 'Training a model needs much more GPU memory than running inference on the same model mainly because training must also store:',
  ['Activations, gradients and optimizer states in addition to the weights', 'The inference request queue', 'A copy of the operating system', 'Only the input images'],
  'При обучении в памяти лежат веса, градиенты, состояния оптимизатора (у Adam — два дополнительных тензора на каждый вес) и активации для обратного прохода. Это в несколько раз больше, чем нужно для инференса.');
q('1.2', 'How is inference infrastructure typically scaled to serve more users?',
  ['Scale out with many model replicas behind a load balancer, autoscaled with demand', 'Run one giant synchronized job across all GPUs', 'Increase the number of training epochs', 'Disable batching'],
  'Инференс масштабируют горизонтально: больше реплик модели, балансировщик, автоскейлинг (например, в Kubernetes). Обучение, наоборот, — одна большая синхронная задача.');
q('1.2', 'What is the main benefit of mixed-precision training, using BF16 or FP16 with FP32 master weights, on Tensor Cores?',
  ['Faster training and lower memory use with comparable accuracy', 'Guaranteed higher accuracy than FP32', 'No need for training data', 'It disables Tensor Cores to save power'],
  'Смешанная точность считает большую часть операций в 16 битах на Tensor Cores, а критичные величины держит в FP32. Получаем ускорение в разы и экономию памяти без заметной потери качества.');
q('1.2', 'Which hardware characteristic matters most for training but is less critical for many inference deployments?',
  ['Fast GPU-to-GPU and node-to-node interconnect for gradient synchronization', 'Low power draw per card', 'Small physical size for edge placement', 'Video output ports'],
  'Обучение упирается в обмен градиентами между GPU, поэтому NVLink и InfiniBand критичны. Многие инференс‑задачи помещаются на один GPU, и для них важнее стоимость, энергопотребление и задержка.');

// 1.3 AI vs ML vs DL
q('1.3', 'How are AI, machine learning and deep learning related?',
  ['Deep learning is a subset of machine learning, which is a subset of AI', 'AI is a subset of deep learning', 'Machine learning and deep learning are unrelated fields', 'Deep learning is broader than AI'],
  'Матрёшка: AI (любые системы, имитирующие интеллект) ⊃ ML (обучение на данных вместо явных правил) ⊃ DL (многослойные нейронные сети).');
q('1.3', 'What distinguishes deep learning from traditional machine learning?',
  ['It uses multi-layer neural networks that learn features automatically from raw data and usually needs more data and compute', 'It relies only on hand-written rules', 'It needs no training data', 'It can run only on CPUs'],
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
  ['Models that create new content such as text, images or code by learning patterns from data', 'Systems that only classify inputs into fixed categories', 'Rule engines written by experts', 'Databases that store AI models'],
  'Генеративный AI создаёт новый контент: LLM пишут текст и код, диффузионные модели рисуют изображения. Это главный драйвер текущего спроса на GPU.');
q('1.3', 'Which neural network architecture underlies most modern large language models?',
  ['Transformer, based on self-attention', 'Decision tree', 'k-means', 'Naive Bayes'],
  'Трансформер (2017, «Attention Is All You Need») использует механизм self‑attention и хорошо параллелится на GPU. На нём построены GPT, Llama, Nemotron и другие.');
q('1.3', 'What does fine-tuning a model mean?',
  ['Adapting a pretrained model to a specific task or domain with a smaller additional dataset', 'Training a new model from scratch with random weights', 'Compressing a model for edge devices', 'Tuning the cooling system of the GPU server'],
  'Дообучение (fine‑tuning) берёт готовую предобученную модель и доучивает её на своих данных. Это намного дешевле обучения с нуля. Экономные варианты: LoRA, PEFT.');
q('1.3', 'What does Retrieval-Augmented Generation (RAG) do?',
  ['Adds relevant documents retrieved from a knowledge base to the LLM prompt so answers are grounded in that data', 'Retrains the LLM every time a document changes', 'Generates training data for image models', 'Encrypts the model weights'],
  'RAG: запрос → поиск похожих фрагментов в векторной базе → они добавляются в промпт → LLM отвечает по фактам. Знания обновляются без переобучения модели.');
q('1.3', 'Which is an example of classic machine learning rather than deep learning?',
  ['A gradient-boosted decision tree model on tabular data', 'A convolutional neural network for image recognition', 'A transformer-based chatbot', 'A diffusion model that generates images'],
  'Градиентный бустинг (XGBoost и аналоги) на табличных данных — классический ML. CNN, трансформеры и диффузионные модели — это нейросети, то есть deep learning.');
q('1.3', 'What is "inference" in AI terminology?',
  ['Using a trained model to make predictions on new data', 'Collecting and labeling training data', 'Updating model weights with backpropagation', 'Designing a neural network architecture'],
  'Инференс — применение обученной модели: распознать картинку, ответить на вопрос, оценить транзакцию. Именно на инференс приходится основная нагрузка в продакшене.');

// 1.4 Factors behind AI growth
q('1.4', 'Which three factors are most often cited as driving the recent rapid progress and adoption of AI?',
  ['Massive data availability, GPU-accelerated computing and algorithmic advances such as transformers', 'Cheaper hard drives, faster CPUs and more RAM slots', 'Better monitors, keyboards and mice', 'Programming languages, compilers and operating systems'],
  'Три кита: данные (интернет, сенсоры), вычисления (GPU, ускорение в тысячи раз за десятилетие) и алгоритмы (глубокие сети, трансформеры). Плюс облака и открытые фреймворки.');
q('1.4', 'Why did GPUs become central to modern AI?',
  ['Neural network training is dominated by massively parallel matrix math, which GPUs run far faster than CPUs', 'GPUs have higher clock speeds than CPUs', 'GPUs have more cache per core than CPUs', 'GPUs run the operating system more efficiently'],
  'Обучение нейросети — это в основном умножение огромных матриц. GPU выполняют тысячи таких операций параллельно. Частота у GPU, наоборот, ниже, чем у CPU.');
q('1.4', 'How have open-source frameworks such as PyTorch and TensorFlow accelerated AI adoption?',
  ['They lower the barrier to entry so developers can build models without writing low-level GPU code', 'They replace the need for GPUs', 'They provide free cloud hardware', 'They remove the need for training data'],
  'Фреймворки скрывают CUDA за удобным Python‑API и автоматически используют cuDNN, NCCL и другие библиотеки. Разработчик пишет модель, а не GPU‑ядра.');
q('1.4', 'Which observed trend in LLM development drives demand for ever-larger AI infrastructure?',
  ['Scaling laws: model quality improves predictably with more parameters, data and compute', 'Smaller models always outperform larger ones', 'Training cost falls to zero as models grow', 'Data quality no longer matters'],
  'Законы масштабирования: больше параметров, данных и вычислений → предсказуемо лучшее качество. Добавьте к этому рост инференса (рассуждающие модели, агенты), и спрос на «AI‑фабрики» растёт.');
q('1.4', 'How has cloud computing contributed to AI adoption?',
  ['It gives on-demand access to GPU resources without large upfront capital investment', 'It made GPUs unnecessary', 'It eliminated the need for data preparation', 'It guarantees lower cost than on-prem at any utilization'],
  'Облако позволяет начать за минуты и платить по факту. Но при постоянной высокой загрузке on‑prem часто выходит дешевле, поэтому вариант «всегда дешевле» неверен.');

// 1.5 Use cases and industries
q('1.5', 'A hospital wants to accelerate medical imaging analysis and genomics workflows. Which NVIDIA platform targets healthcare?',
  ['NVIDIA Clara', 'NVIDIA Metropolis', 'NVIDIA DRIVE', 'NVIDIA Riva'],
  'Clara — платформа для здравоохранения: медицинская визуализация (MONAI), геномика (Parabricks), открытие лекарств (BioNeMo).');
q('1.5', 'A city wants to analyze traffic camera video to improve safety and traffic flow. Which NVIDIA platform fits?',
  ['NVIDIA Metropolis', 'NVIDIA Clara', 'NVIDIA Merlin', 'NVIDIA cuOpt'],
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
  ['Real-time fraud detection on transactions', 'Physically accurate factory digital twins', 'Protein structure prediction', 'Autonomous vehicle path planning'],
  'В финансах типичны: антифрод в реальном времени, оценка рисков, алгоритмическая торговля, ассистенты на LLM. Остальные варианты относятся к промышленности, медицине и транспорту.');
q('1.5', 'Which NVIDIA library accelerates route optimization problems, such as vehicle routing for logistics?',
  ['NVIDIA cuOpt', 'NVIDIA cuDNN', 'NVIDIA Riva', 'NVIDIA NCCL'],
  'cuOpt — GPU‑ускоренная оптимизация маршрутов и решение задач линейного и смешанного программирования для логистики и цепочек поставок.');

// 1.6 NVIDIA solutions
q('1.6', 'What are NVIDIA NIM microservices?',
  ['Prebuilt, optimized inference containers for AI models that expose industry-standard APIs and run anywhere', 'Network interface modules for DGX servers', 'A cluster job scheduler', 'Hardware management controllers'],
  'NIM — готовые контейнеры для инференса моделей (LLM, речь, зрение) с OpenAI‑совместимым API. Внутри уже оптимизированные движки (TensorRT‑LLM и другие). Входят в AI Enterprise.');
q('1.6', 'Which NVIDIA framework is used to build, customize and deploy generative AI models, including LLM fine-tuning and guardrails?',
  ['NVIDIA NeMo', 'NVIDIA RAPIDS', 'NVIDIA DOCA', 'NVIDIA DCGM'],
  'NeMo — фреймворк и набор микросервисов для полного цикла генеративного AI: подготовка данных (Curator), обучение и дообучение, оценка, guardrails.');
q('1.6', 'What is NVIDIA DGX Cloud?',
  ['An AI platform with NVIDIA infrastructure and software, offered as a service through cloud partners', 'A consumer gaming streaming service', 'A cloud storage product for backups', 'A firmware update server for DGX systems'],
  'DGX Cloud — инфраструктура и ПО NVIDIA для обучения и инференса, размещённые у облачных партнёров и доступные по подписке. Позволяет получить «DGX как сервис».');
q('1.6', 'Which NVIDIA software provisions, manages and monitors on-premises AI and HPC clusters, and was formerly known as Bright Cluster Manager?',
  ['NVIDIA Base Command Manager', 'NVIDIA Fleet Command', 'NVIDIA Omniverse', 'NVIDIA Triton'],
  'Base Command Manager (BCM, бывший Bright) разворачивает ОС на узлах, настраивает Slurm или Kubernetes, мониторит кластер. Fleet Command управляет AI на периферии (edge).');
q('1.6', 'Which NVIDIA offering securely deploys and manages AI applications across many distributed edge locations?',
  ['NVIDIA Fleet Command', 'NVIDIA Base Command Manager', 'NVIDIA NGC', 'NVIDIA Quantum-2'],
  'Fleet Command — облачная панель для развёртывания и обновления AI‑приложений на тысячах edge‑серверов (магазины, заводы, больницы).');
q('1.6', 'What is NVIDIA Run:ai mainly used for?',
  ['Kubernetes-based GPU orchestration with resource pooling, quotas and fractional GPU sharing', 'Designing printed circuit boards', 'Configuring InfiniBand switches', 'Rendering 3D scenes'],
  'Run:ai объединяет GPU кластера в общий пул, распределяет их по командам с квотами и приоритетами, умеет делить GPU на доли. Цель — поднять утилизацию дорогих GPU.');
q('1.6', 'What is NVIDIA DGX SuperPOD?',
  ['A turnkey reference architecture combining DGX systems, networking, storage and software for large-scale AI', 'A single workstation GPU', 'A cloud-only inference API', 'A liquid coolant product'],
  'SuperPOD — проверенная архитектура «под ключ» для крупных AI‑кластеров: DGX‑узлы, InfiniBand или Ethernet‑фабрика, сертифицированное хранилище, Base Command Manager, Mission Control.');
q('1.6', 'What is NVIDIA DGX BasePOD?',
  ['A reference architecture for building smaller DGX clusters with partner storage and networking', 'A single DGX system with eight GPUs', 'A desktop development kit', 'A consumer GPU product'],
  'BasePOD — референсная архитектура для кластеров от нескольких до десятков DGX с хранилищем партнёров. SuperPOD — следующий, более крупный и «под ключ» уровень.');

// 1.7 AI lifecycle software
q('1.7', 'What is the typical order of stages in an AI workflow?',
  ['Data preparation → model training → optimization and validation → deployment (inference) → monitoring and retraining', 'Deployment → training → data preparation → monitoring', 'Training → data collection → deployment → validation', 'Monitoring → deployment → training → data preparation'],
  'Жизненный цикл: данные → обучение → оптимизация и проверка → развёртывание → мониторинг, а при дрейфе — снова обучение. Это цикл, а не прямая.');
q('1.7', 'Which stage of an AI project typically consumes the most data scientist time?',
  ['Data collection, cleaning and preparation', 'Writing the inference API', 'Buying GPUs', 'Choosing a logo for the model'],
  'Подготовка данных традиционно занимает основную часть времени (часто называют до 80%). Для ускорения используют RAPIDS и NeMo Curator.');
q('1.7', 'What is MLOps?',
  ['Practices and tools that automate and manage the ML lifecycle: versioning, CI/CD, deployment, monitoring and retraining', 'A type of GPU memory', 'A low-level CUDA instruction set', 'A data center cooling metric'],
  'MLOps — это DevOps для машинного обучения: версии данных и моделей, автоматические пайплайны, мониторинг качества в продакшене, переобучение.');
q('1.7', 'A deployed model becomes less accurate over time because real-world data has changed. This is called:',
  ['Model drift', 'Overclocking', 'Thermal throttling', 'Gradient clipping'],
  'Дрейф модели (data/concept drift): распределение входных данных меняется, и качество падает. Лечится мониторингом и переобучением.');
q('1.7', 'Why are containers widely used across AI development and deployment?',
  ['They package frameworks, libraries and dependencies consistently so the same environment runs from laptop to production', 'They make GPUs run faster than bare metal', 'They replace the need for a GPU driver on the host', 'They provide hardware-level isolation identical to MIG'],
  'Контейнер = воспроизводимое окружение. Одинаково работает у разработчика, в кластере и в продакшене. Драйвер GPU при этом всё равно нужен на хосте.');
q('1.7', 'Which NVIDIA library moves data loading and augmentation to the GPU to remove CPU bottlenecks in training pipelines?',
  ['NVIDIA DALI', 'NVIDIA NCCL', 'NVIDIA Riva', 'NVIDIA cuOpt'],
  'DALI (Data Loading Library) декодирует и аугментирует изображения, видео и аудио на GPU. Помогает, когда GPU простаивают в ожидании данных от CPU.');
q('1.7', 'Why is checkpointing important during long training runs?',
  ['It periodically saves model state so training can resume after a failure instead of restarting', 'It increases model accuracy by itself', 'It reduces GPU power consumption', 'It encrypts the training data'],
  'Обучение может идти недели на тысячах GPU, и сбой узла неизбежен. Чекпоинты позволяют продолжить с последнего сохранения. Это создаёт пиковую нагрузку на запись в хранилище.');
q('1.7', 'After training, a team converts the model with TensorRT and deploys it with Triton. Which lifecycle stage are they in?',
  ['Optimization and deployment for inference', 'Data labeling', 'Exploratory data analysis', 'Hyperparameter search'],
  'TensorRT — оптимизация модели, Triton — её обслуживание. Это этап развёртывания для инференса.');

// 1.8 GPU vs CPU
q('1.8', 'What is the core architectural difference between CPUs and GPUs?',
  ['CPUs have fewer, more complex cores optimized for low-latency serial work; GPUs have thousands of simpler cores optimized for parallel throughput', 'GPUs have fewer cores but higher clock speeds', 'CPUs are designed only for graphics', 'There is no meaningful difference'],
  'CPU — несколько десятков мощных ядер, большие кэши, предсказание ветвлений: быстрая последовательная логика. GPU — тысячи простых ядер: огромная параллельная пропускная способность.');
q('1.8', 'What are Tensor Cores?',
  ['Specialized GPU units that accelerate matrix multiply-accumulate operations in mixed precision', 'CPU cores that manage tensors in memory', 'Memory chips stacked on the GPU', 'Network ports on a DGX system'],
  'Tensor Cores (с архитектуры Volta) выполняют умножение матриц со сложением за один шаг в FP16/BF16/TF32/FP8/FP4. Именно они дают основной прирост в AI.');
q('1.8', 'What is HBM on a data center GPU?',
  ['High Bandwidth Memory stacked close to the GPU die, providing terabytes per second of bandwidth', 'A type of hard disk for model storage', 'A host bus management protocol', 'A heat-based monitoring sensor'],
  'HBM (HBM3/HBM3e) — стековая память рядом с кристаллом GPU с пропускной способностью в несколько ТБ/с. H100 — 80 ГБ HBM3, H200 — 141 ГБ HBM3e.');
q('1.8', 'Which task is better suited to a CPU than a GPU?',
  ['Running the operating system and branch-heavy sequential logic', 'Large matrix multiplications', 'Training a convolutional neural network', 'Batch inference on thousands of images'],
  'CPU силён в последовательной, ветвящейся логике: ОС, управление, I/O. Всё, что сводится к параллельной математике над большими массивами, лучше на GPU.');
q('1.8', 'What is a Streaming Multiprocessor (SM) in an NVIDIA GPU?',
  ['The GPU building block containing CUDA cores, Tensor Cores, registers and shared memory', 'A separate CPU on the motherboard', 'A network switch inside the GPU', 'A cooling fan controller'],
  'GPU состоит из множества SM. В каждом — CUDA‑ядра, Tensor Cores, регистры, общая память. В H100 SXM 132 SM.');
q('1.8', 'What is the main role of the CPU in a GPU-accelerated AI server?',
  ['Running the OS, preprocessing and loading data, and orchestrating work for the GPUs', 'Performing most of the neural network math', 'Replacing the network adapters', 'Cooling the GPUs'],
  'CPU «кормит» GPU: читает и готовит данные, запускает ядра, управляет I/O. Слабый CPU или медленное хранилище легко оставят дорогие GPU без работы.');
q('1.8', 'What does the NVIDIA Grace Hopper Superchip combine?',
  ['An Arm-based Grace CPU and a Hopper GPU connected by coherent NVLink-C2C', 'Two x86 CPUs on one board', 'A GPU and a DPU on one PCIe card', 'Eight GPUs with an NVSwitch'],
  'GH200: CPU Grace (Arm) + GPU Hopper, связанные NVLink‑C2C на 900 ГБ/с с общей когерентной памятью. GB200 — то же для Blackwell (1 Grace + 2 Blackwell).');
q('1.8', 'How do GPUs hide memory access latency?',
  ['By keeping many threads (warps) in flight and switching between them while others wait for memory', 'By using very large branch predictors', 'By running at much higher clock speeds than CPUs', 'By avoiding memory access entirely'],
  'GPU держит тысячи потоков и мгновенно переключается на готовые warp‑ы, пока другие ждут память. CPU для этого опирается на большие кэши и предсказание ветвлений.');
q('1.8', 'What does the Transformer Engine introduced with the Hopper architecture do?',
  ['Dynamically uses FP8 and 16-bit precision to accelerate transformer training and inference', 'Converts CPUs into GPUs', 'Compresses network packets', 'Manages liquid cooling flow'],
  'Transformer Engine автоматически выбирает FP8 или FP16 по слоям трансформера, ускоряя LLM. В Blackwell второе поколение добавило FP4.');

// ───────── Domain 2 · AI Infrastructure (40%) ─────────
// 2.1 Hardware for training
q('2.1', 'How many GPUs does an NVIDIA DGX H100 system contain?',
  ['8', '4', '16', '2'],
  'DGX H100 (и DGX B200) — 8 GPU в одном корпусе, связанных через NVSwitch. Число 8 — классика экзамена.');
q('2.1', 'What is the total GPU memory of a DGX H100 system?',
  ['640 GB (8 × 80 GB HBM3)', '80 GB', '1.5 TB', '256 GB'],
  '8 GPU × 80 ГБ = 640 ГБ HBM3. Для сравнения: DGX H200 — 1128 ГБ, DGX B200 — около 1,44 ТБ.');
q('2.1', 'When selecting GPUs to train an LLM with billions of parameters, which factors matter most?',
  ['GPU memory capacity and bandwidth plus fast GPU-to-GPU interconnect', 'Number of display outputs', 'CPU clock speed alone', 'Hard drive spin speed'],
  'Модель, градиенты и состояния оптимизатора должны поместиться в память, а GPU должны быстро обмениваться данными. Поэтому смотрят на объём и скорость HBM и на NVLink/InfiniBand.');
q('2.1', 'How do SXM and PCIe GPU form factors differ?',
  ['SXM modules mount on a baseboard with NVLink/NVSwitch and higher power limits; PCIe cards fit standard slots with lower power', 'PCIe GPUs always have more memory', 'SXM is only for consumer gaming', 'PCIe GPUs connect through NVSwitch by default'],
  'SXM: максимальная мощность (H100 SXM до 700 Вт) и полносвязный NVLink через NVSwitch — для обучения. PCIe: стандартные серверы, меньше энергопотребление, гибкость — часто для инференса.');
q('2.1', 'Which technology lets GPUs within a server communicate at much higher bandwidth than PCIe?',
  ['NVLink', 'SATA', 'USB4', 'Ethernet over copper'],
  'NVLink — прямой высокоскоростной канал GPU↔GPU. В H100: 900 ГБ/с на GPU, примерно в 7 раз больше PCIe Gen5.');
q('2.1', 'What is the role of NVSwitch?',
  ['It connects many GPUs over NVLink so every GPU can talk to every other at full NVLink bandwidth', 'It switches power between redundant PSUs', 'It routes Ethernet traffic between racks', 'It converts PCIe to SATA'],
  'NVSwitch — коммутатор для NVLink: полносвязная топология all‑to‑all внутри узла, а в GB200 NVL72 — на всю стойку из 72 GPU.');
q('2.1', 'What NVLink bandwidth per GPU does fourth-generation NVLink on H100 provide?',
  ['900 GB/s', '64 GB/s', '600 GB/s', '1.8 TB/s'],
  'Поколения: A100 (NVLink 3) — 600 ГБ/с, H100 (NVLink 4) — 900 ГБ/с, Blackwell (NVLink 5) — 1,8 ТБ/с. PCIe Gen5 x16 — около 128 ГБ/с в обе стороны.');
q('2.1', 'What is NVIDIA GB200 NVL72?',
  ['A liquid-cooled rack with 36 Grace CPUs and 72 Blackwell GPUs acting as one NVLink domain', 'A PCIe card with 72 GB of memory', 'An InfiniBand switch with 72 ports', 'An edge AI module'],
  'GB200 NVL72: 72 GPU Blackwell + 36 CPU Grace в одной стойке, все GPU связаны NVLink через NVSwitch как «один огромный GPU». Только жидкостное охлаждение, порядка 120+ кВт на стойку.');
q('2.1', 'Which storage approach is typically recommended for large-scale AI training data?',
  ['A high-performance parallel or shared file system, often with local NVMe caching', 'Tape libraries', 'A single NAS over 1 GbE', 'USB drives attached to each node'],
  'Обучению нужен высокий параллельный throughput на чтение и быстрая запись чекпоинтов: Lustre, IBM Storage Scale, WEKA, DDN, VAST и т. п. плюс локальные NVMe как кэш.');
q('2.1', 'What does NVIDIA GPUDirect Storage provide?',
  ['A direct DMA path between storage and GPU memory that bypasses the CPU bounce buffer', 'A cloud backup service for checkpoints', 'A RAID controller built into the GPU', 'Compression for model weights'],
  'GPUDirect Storage передаёт данные с NVMe или NVMe‑oF напрямую в память GPU, минуя буфер в RAM процессора. Меньше задержка, выше throughput, меньше нагрузка на CPU.');
q('2.1', 'A retailer needs low-power AI inference in stores with limited space and cooling. Which hardware fits best?',
  ['Compact, low-power GPUs or edge modules such as L4 or Jetson', 'A DGX SuperPOD in each store', 'GB200 NVL72 racks', 'Mainframe CPUs'],
  'На периферии важны энергопотребление и размер. L4 (около 72 Вт) или модули Jetson подходят для видеоаналитики и небольших моделей. SuperPOD — для обучения в ЦОД.');
q('2.1', 'What is the main purpose of the eight ConnectX-7 400 Gb/s ports in a DGX H100?',
  ['Compute fabric: GPU-to-GPU traffic between nodes, roughly one port per GPU', 'Connecting monitors', 'Out-of-band BMC management', 'Charging UPS batteries'],
  'В DGX H100 8 портов ConnectX‑7 по 400 Гб/с образуют вычислительную фабрику (east‑west) — по одному на GPU. Для хранилища и in‑band управления используются BlueField‑3, а BMC идёт по отдельному 1 GbE.');

// 2.2 Scaling GPU infrastructure
q('2.2', 'What is the difference between scaling up and scaling out GPU infrastructure?',
  ['Scale up adds more or bigger GPUs within a node or NVLink domain; scale out adds more nodes over a network', 'Scale up adds nodes; scale out adds memory', 'They mean the same thing', 'Scale out only applies to storage'],
  'Scale‑up: больше GPU в одном NVLink‑домене (узел, стойка NVL72). Scale‑out: больше узлов, связанных InfiniBand или Ethernet.');
q('2.2', 'In data-parallel training, what happens?',
  ['Each GPU holds a full copy of the model and processes a different slice of data; gradients are synchronized with all-reduce', 'Each GPU holds a different layer of the model', 'Only one GPU trains while the others idle', 'The dataset is copied to the CPU only'],
  'Data parallelism: копия модели на каждом GPU, разные батчи, после шага — all‑reduce градиентов через NCCL. Самый распространённый способ масштабирования.');
q('2.2', 'When is model parallelism (tensor or pipeline parallelism) required?',
  ['When the model is too large to fit in a single GPU memory', 'When the dataset is very small', 'When using CPUs only', 'When running inference on a phone'],
  'Если модель не влезает в один GPU, её режут: tensor parallelism (части слоёв на разных GPU, лучше внутри NVLink‑домена) и pipeline parallelism (разные слои на разных GPU).');
q('2.2', 'In the DGX SuperPOD reference architecture with DGX H100 systems, how many DGX systems form one Scalable Unit (SU)?',
  ['32', '4', '8', '128'],
  'SU (Scalable Unit) = 32 узла DGX H100 = 256 GPU. SuperPOD строится из нескольких SU, например 4 SU = 128 узлов = 1024 GPU.');
q('2.2', 'A team adds more GPU nodes but training speed barely improves. What is the most likely cause?',
  ['Communication overhead from gradient synchronization over an insufficient network', 'Too much GPU memory', 'The model is too small to need GPUs at all', 'Too many CPU cores'],
  'При масштабировании растёт доля времени на обмен градиентами. Если сеть медленная или с потерями, GPU ждут друг друга, и эффективность масштабирования падает.');
q('2.2', 'Which approach best scales an inference service to handle many more users?',
  ['Add model replicas horizontally with load balancing and autoscaling', 'Increase the number of training epochs', 'Use one larger batch for all users combined', 'Turn off the load balancer'],
  'Инференс масштабируют горизонтально. Маленькие модели можно ещё и уплотнить на одном GPU с помощью MIG.');
q('2.2', 'Why are tensor-parallel groups usually kept within a single NVLink domain?',
  ['Tensor parallelism exchanges data every layer and needs the highest bandwidth and lowest latency', 'NVLink is cheaper than PCIe', 'InfiniBand cannot carry GPU data', 'It reduces storage requirements'],
  'Tensor parallelism обменивается данными на каждом слое, поэтому ему нужен NVLink. Data и pipeline parallelism меньше чувствительны и идут между узлами по InfiniBand или Ethernet.');
q('2.2', 'What is the advantage of building clusters from repeatable Scalable Units?',
  ['Predictable performance and simpler, faster expansion using validated building blocks', 'It removes the need for networking', 'It allows mixing any random hardware', 'It eliminates cooling requirements'],
  'Типовой блок (SU) уже спроектирован и протестирован: сеть, питание, кабели. Кластер растёт кирпичиками с предсказуемым результатом.');

// 2.3 Power and cooling
q('2.3', 'How is Power Usage Effectiveness (PUE) calculated?',
  ['Total facility power divided by IT equipment power', 'IT equipment power divided by total facility power', 'GPU power divided by CPU power', 'Cooling power multiplied by IT power'],
  'PUE = вся мощность ЦОД / мощность IT‑оборудования. Пример: 1,5 МВт всего, 1 МВт IT → PUE 1,5. Чем ближе к 1,0, тем эффективнее.');
q('2.3', 'What does a PUE of 1.0 mean?',
  ['All facility power goes to IT equipment, with no overhead for cooling or power conversion', 'The data center uses no power', 'Cooling consumes as much power as IT', 'The data center is at half capacity'],
  'PUE 1,0 — теоретический идеал: никаких потерь на охлаждение и преобразование. Современные ЦОД достигают примерно 1,1–1,4.');
q('2.3', 'Approximately what is the maximum power consumption of one DGX H100 system?',
  ['About 10.2 kW', 'About 1 kW', 'About 50 kW', 'About 500 W'],
  'DGX H100 потребляет до ~10,2 кВт. Значит, 4 системы в стойке — это 40+ кВт, а обычная корпоративная стойка рассчитана на 5–15 кВт.');
q('2.3', 'Why is liquid cooling increasingly required for AI data centers?',
  ['Rack power densities now exceed what air cooling can remove efficiently', 'Liquid cooling is required by the CUDA license', 'Air cooling damages GPUs', 'Liquid cooling makes GPUs run at higher voltages'],
  'AI‑стойки уходят в десятки и сотни кВт (GB200 NVL72 — 120+ кВт). Воздухом столько тепла не отвести, поэтому нужно жидкостное охлаждение direct‑to‑chip.');
q('2.3', 'What is direct-to-chip liquid cooling?',
  ['Cold plates on GPUs and CPUs carry coolant that removes heat at the source', 'Spraying water directly on servers', 'Placing ice packs in the rack', 'Using bigger fans at the front of the rack'],
  'На горячие чипы ставятся холодные пластины с жидкостью, тепло уходит через CDU в контур здания. Эффективнее воздуха и позволяет очень высокую плотность.');
q('2.3', 'What is the purpose of hot aisle / cold aisle containment?',
  ['Prevent hot exhaust air from mixing with cold intake air, improving cooling efficiency', 'Separate GPU and CPU servers', 'Store spare parts', 'Route network cables'],
  'Стойки ставят «лицом к лицу» и «спиной к спине», а коридоры изолируют. Холодный воздух идёт на вход серверов, горячий не возвращается на вход.');
q('2.3', 'What does N+1 redundancy mean for power or cooling components?',
  ['One more component than needed, so a single failure does not cause an outage', 'Twice as many components as needed', 'No redundancy at all', 'One component shared by N data centers'],
  'N+1: нужно N блоков, ставят N+1, чтобы пережить отказ одного. 2N — полное дублирование (две независимые линии A/B).');
q('2.3', 'What does a 2N power design provide?',
  ['Two fully independent power paths (A and B feeds), each able to carry the full load', 'Half the needed power capacity', 'One extra UPS module', 'Power from two different GPUs'],
  '2N: два независимых пути питания, каждый тянет всю нагрузку. Серверы подключают двумя блоками питания к разным фидерам.');
q('2.3', 'A data center designed for 8 kW per rack plans to install four DGX H100 systems per rack. What is the main concern?',
  ['The rack would need over 40 kW, exceeding the power and cooling design', 'Not enough network ports', 'The racks are the wrong color', 'GPUs cannot be mounted in racks'],
  '4 × ~10,2 кВт ≈ 41 кВт против 8 кВт по проекту. Нужно либо меньше систем на стойку, либо модернизация питания и охлаждения.');
q('2.3', 'What is a rear-door heat exchanger?',
  ['A liquid-cooled coil on the back of a rack that removes heat from server exhaust air', 'A backup generator', 'A fan inside each GPU', 'A firewall appliance'],
  'Теплообменник на задней двери стойки охлаждает горячий воздух жидкостью прямо на выходе. Промежуточный шаг между чистым воздухом и direct‑to‑chip.');
q('2.3', 'Which unit expresses the cooling load that must be removed from a rack?',
  ['Kilowatts (kW) of heat, roughly equal to the electrical power the rack consumes', 'Gigabits per second', 'Rack units (U)', 'Teraflops'],
  'Почти вся потреблённая электроэнергия превращается в тепло: стойка на 40 кВт выделяет ~40 кВт тепла. Его иногда выражают в BTU/ч (1 кВт ≈ 3412 BTU/ч).');

// 2.4 On-prem vs cloud
q('2.4', 'What is a key advantage of running AI workloads in the public cloud?',
  ['Elasticity and fast start with pay-as-you-go pricing and no upfront capital cost', 'Always the lowest cost at sustained 24/7 utilization', 'Full physical control of the hardware', 'Guaranteed data residency in your own building'],
  'Облако: быстрый старт, эластичность, OpEx вместо CapEx, доступ к новому железу. Но при постоянной полной загрузке оно часто дороже собственного кластера.');
q('2.4', 'What is a key advantage of on-premises AI infrastructure?',
  ['Lower total cost at sustained high utilization, plus full control over data and hardware', 'No upfront investment', 'Instant scaling to unlimited GPUs', 'No need for power or cooling planning'],
  'On‑prem выгоден при стабильной высокой загрузке, строгих требованиях к данным и необходимости полного контроля. Минусы: CapEx, сроки поставки, эксплуатация силами своей команды.');
q('2.4', 'A startup has unpredictable, bursty GPU needs and limited capital. What is usually the best fit?',
  ['Cloud GPU instances', 'Building a dedicated data center', 'Buying a DGX SuperPOD', 'CPU-only servers'],
  'При непредсказуемой нагрузке и малом капитале облако позволяет платить только за использованное и не замораживать деньги в оборудовании.');
q('2.4', 'A bank must keep data in-country and runs steady 24/7 training. What is often the best fit?',
  ['On-premises or hybrid infrastructure', 'Only a public cloud region abroad', 'Laptops for each data scientist', 'A free-tier cloud account'],
  'Суверенитет данных и стабильная загрузка указывают на on‑prem или гибрид: базовая нагрузка дома, пики при необходимости в облаке (если позволяет регулятор).');
q('2.4', 'Which is a common challenge of large-scale AI in the public cloud?',
  ['Data egress fees, GPU capacity availability and rising cost at scale', 'No access to modern GPUs', 'Inability to run containers', 'Lack of any networking'],
  'Типичные сложности облака: плата за выгрузку данных (egress), дефицит GPU, рост счетов при масштабе и «гравитация данных» (большие данные дорого перемещать).');
q('2.4', 'What is cloud bursting in a hybrid AI strategy?',
  ['Running baseline workloads on-premises and sending peak demand to the cloud', 'Moving all workloads permanently to the cloud', 'Overclocking cloud GPUs', 'Deleting cloud resources after hours'],
  'Cloud bursting: базовая нагрузка на своём кластере, пики уходят в облако. Сочетает экономию on‑prem и эластичность облака.');
q('2.4', 'Buying servers for an on-premises cluster is typically classified as which type of expense?',
  ['Capital expenditure (CapEx)', 'Operational expenditure (OpEx)', 'Marketing expense', 'Licensing-only expense'],
  'Покупка оборудования — CapEx (амортизируется годами). Аренда облака — OpEx (ежемесячные платежи).');

// 2.5 Accelerated cluster components
q('2.5', 'Which four networks are defined in the DGX SuperPOD reference architecture?',
  ['Compute fabric, storage fabric, in-band management and out-of-band management', 'Wi-Fi, Bluetooth, cellular and satellite', 'Only a single shared Ethernet network', 'Internet, intranet, extranet and VPN'],
  'Четыре сети SuperPOD: вычислительная фабрика (GPU↔GPU, InfiniBand), фабрика хранения, in‑band управление (Ethernet для ОС и сервисов) и out‑of‑band управление (BMC).');
q('2.5', 'What is the role of head (management) nodes in an AI cluster?',
  ['Run cluster management services such as provisioning, scheduler controllers and monitoring', 'Run all the training jobs', 'Provide liquid cooling', 'Act as storage disks'],
  'Управляющие узлы держат сервисы кластера: Base Command Manager, контроллер Slurm или control plane Kubernetes, мониторинг. Работа с GPU идёт на вычислительных узлах.');
q('2.5', 'Which set lists the core components of an accelerated computing cluster?',
  ['GPU compute nodes, high-speed fabric, shared storage, and management and scheduling software', 'Laptops, Wi-Fi, USB drives and spreadsheets', 'CPUs only, with local disks and no network', 'Monitors, keyboards and printers'],
  'Кластер = вычислительные узлы с GPU + быстрая сеть + общее хранилище + ПО (провижининг, планировщик, мониторинг) + питание и охлаждение.');
q('2.5', 'Why do organizations use NVIDIA reference architectures such as DGX BasePOD and SuperPOD?',
  ['Validated designs reduce deployment risk and time and deliver predictable performance', 'They are required to install CUDA', 'They remove the need for storage', 'They work only in the public cloud'],
  'Референсные архитектуры уже протестированы NVIDIA и партнёрами: топология сети, хранилище, ПО. Меньше рисков и быстрее запуск.');
q('2.5', 'In a DGX H100, what are the BlueField-3 DPUs primarily used for?',
  ['Storage and in-band management networking, offloading those tasks from the host', 'GPU-to-GPU NVLink communication', 'Displaying video output', 'Cooling control'],
  'В DGX H100 два BlueField‑3 обслуживают сеть хранения и in‑band управление, а ConnectX‑7 — вычислительную фабрику. Это разделение трафика по назначению.');
q('2.5', 'Why is shared storage important in a multi-node training cluster?',
  ['All nodes must read the same datasets and write checkpoints to a common location', 'GPUs cannot have local memory', 'It replaces the need for a network', 'It powers the compute nodes'],
  'Все узлы читают один и тот же датасет и пишут чекпоинты туда, откуда задачу можно продолжить на любых узлах.');

// 2.6 Facility requirements
q('2.6', 'Which facility factors should be assessed first before deploying high-density AI systems?',
  ['Power capacity, cooling capacity, floor weight rating and space', 'Paint color and lighting brand', 'Number of meeting rooms', 'Office Wi-Fi speed'],
  'Перед установкой проверяют: сколько кВт можно подать на стойку, сколько тепла отвести, выдержит ли пол вес, есть ли место и кабельные трассы.');
q('2.6', 'Why must floor loading be checked when installing DGX systems?',
  ['Fully populated AI racks are very heavy and may exceed the floor weight rating', 'GPUs are sensitive to floor color', 'Raised floors block NVLink signals', 'It is only needed for tape libraries'],
  'Один DGX H100 весит около 130 кг. Стойка с несколькими системами и жидкостным охлаждением может весить больше тонны, что важно для фальшпола.');
q('2.6', 'What do ASHRAE guidelines provide for data centers?',
  ['Recommended temperature and humidity ranges for IT equipment environments', 'GPU programming standards', 'Network cabling color codes', 'Software licensing rules'],
  'ASHRAE публикует термальные рекомендации для ЦОД: допустимые диапазоны температуры и влажности на входе оборудования.');
q('2.6', 'Why is three-phase power common in high-density data centers?',
  ['It delivers more power more efficiently to racks than single-phase', 'It is required by the CUDA driver', 'It reduces network latency', 'It eliminates the need for UPS'],
  'Трёхфазное питание передаёт больше мощности на тех же проводниках и лучше подходит для стоек на десятки кВт.');
q('2.6', 'Why are optical fiber links with transceivers common for 400 Gb/s connections between racks?',
  ['They support high speeds over longer distances than copper DAC cables', 'They are always cheaper than copper', 'They need no power at all', 'Copper cannot carry any data'],
  'Медные DAC‑кабели хороши на коротких дистанциях (внутри стойки, несколько метров). Между стойками на 400G используют оптику с трансиверами.');
q('2.6', 'What role does a UPS play in a data center facility?',
  ['It provides short-term battery power and power conditioning during utility interruptions until generators start', 'It cools the servers', 'It routes network traffic', 'It stores model checkpoints'],
  'ИБП (UPS) держит нагрузку на батареях несколько минут при пропадании сети и сглаживает качество питания, пока не запустятся дизель‑генераторы.');

// 2.7 Networking requirements for AI
q('2.7', 'What is east-west traffic in a data center?',
  ['Server-to-server traffic inside the data center, such as GPU-to-GPU communication', 'Traffic between users on the internet and the data center', 'Wireless traffic in offices', 'Traffic between power feeds'],
  'East‑west — трафик внутри ЦОД между серверами. При обучении он доминирует (обмен градиентами). North‑south — трафик между ЦОД и внешним миром (запросы пользователей).');
q('2.7', 'Why does distributed AI training need a high-bandwidth, low-latency and lossless network?',
  ['GPUs synchronize frequently, so packet loss or delay stalls every GPU in the job', 'Training data is always streamed from the internet', 'GPUs cannot store any data locally', 'Lossless networks use less electricity'],
  'Синхронная задача ждёт самого медленного участника. Одна потеря пакета или затор тормозит все GPU, поэтому важна «хвостовая» задержка (tail latency).');
q('2.7', 'What is a rail-optimized network topology?',
  ['NIC number N on every node connects to the same leaf switch (rail N), minimizing hops for collective operations', 'All nodes connect to a single switch with one cable', 'Each GPU uses Wi-Fi', 'Networks laid along rail tracks'],
  'Rail‑optimized: порт GPU0 каждого узла идёт в «рельс» 0, GPU1 — в рельс 1 и т. д. Трафик между одинаковыми GPU разных узлов проходит через один коммутатор.');
q('2.7', 'What does a non-blocking fat-tree network provide?',
  ['Full bisection bandwidth, so any node can communicate with any other at full rate simultaneously', 'A single path between all nodes', 'Wireless coverage', 'Lower power usage by blocking traffic'],
  'Fat‑tree без переподписки (1:1) даёт полную бисекционную полосу. Для обучающих фабрик это стандарт.');
q('2.7', 'What is RDMA?',
  ['Remote Direct Memory Access: transferring data between hosts memory-to-memory, bypassing the CPU and OS kernel', 'A type of hard disk RAID', 'A GPU cooling method', 'A Kubernetes scheduling algorithm'],
  'RDMA передаёт данные напрямую из памяти одного узла в память другого, минуя ядро ОС и CPU. Результат — микросекундные задержки и минимальная нагрузка на CPU. Есть в InfiniBand и RoCE.');
q('2.7', 'What does GPUDirect RDMA enable?',
  ['The network adapter reads and writes GPU memory directly, without staging data in host memory', 'GPUs to connect to Wi-Fi', 'CPUs to run CUDA kernels', 'Storage to be encrypted'],
  'GPUDirect RDMA: ConnectX работает с памятью GPU напрямую. Нет лишних копий через RAM процессора, ниже задержка между GPU разных узлов.');
q('2.7', 'Which traffic type best describes users sending inference requests to an AI service from outside the data center?',
  ['North-south', 'East-west', 'NVLink', 'Out-of-band'],
  'Запросы снаружи внутрь (пользователи → сервис) — north‑south. Обмен между серверами внутри — east‑west.');
q('2.7', 'Why is the compute fabric typically separated from the storage and management networks?',
  ['So storage and management traffic do not interfere with latency-sensitive GPU-to-GPU communication', 'Because GPUs cannot use Ethernet', 'To reduce the number of servers', 'Because storage needs Wi-Fi'],
  'Разделение сетей изолирует трафик: чтение датасета или бэкап не мешает all‑reduce. Это повышает предсказуемость производительности и безопасность.');

// 2.8 Data center networking protocols
q('2.8', 'What is RoCE v2?',
  ['RDMA over Converged Ethernet, carried in UDP/IP packets so it is routable across Layer 3', 'A Wi-Fi standard', 'An InfiniBand-only routing protocol', 'A GPU memory type'],
  'RoCE v2 переносит RDMA поверх Ethernet в UDP/IP, поэтому маршрутизируется. RoCE v1 работал только в пределах одного L2‑домена.');
q('2.8', 'Which Ethernet mechanisms are used to make the network lossless for RoCE?',
  ['Priority Flow Control (PFC) and Explicit Congestion Notification (ECN)', 'Spanning Tree Protocol and VLANs', 'DHCP and DNS', 'NAT and port forwarding'],
  'PFC приостанавливает отправку по приоритету при заполнении буферов, ECN помечает пакеты при заторе, чтобы источник снизил скорость (DCQCN). Вместе они дают «безпотерьный» Ethernet для RDMA.');
q('2.8', 'What does the InfiniBand Subnet Manager do?',
  ['Discovers the fabric topology, assigns addresses (LIDs) and computes routing tables', 'Encrypts all traffic', 'Assigns IP addresses through DHCP', 'Monitors GPU temperature'],
  'Subnet Manager (например, в составе NVIDIA UFM или на коммутаторе) — «мозг» IB‑фабрики: находит устройства, выдаёт LID, рассчитывает маршруты. Без него IB‑сеть не работает.');
q('2.8', 'How does InfiniBand avoid packet loss?',
  ['Credit-based link-level flow control: a sender transmits only when the receiver has buffer space', 'By resending every packet twice', 'By using larger cables', 'By slowing all links to 1 Gb/s'],
  'В InfiniBand отправитель шлёт данные только при наличии «кредитов», то есть свободного буфера у получателя. Поэтому сеть изначально без потерь, в отличие от Ethernet, где это настраивают через PFC/ECN.');
q('2.8', 'What is NVIDIA SHARP?',
  ['In-network computing that performs collective aggregation, such as all-reduce, inside the switches', 'A GPU cooling system', 'A storage compression format', 'A Kubernetes plugin for GPUs'],
  'SHARP (Scalable Hierarchical Aggregation and Reduction Protocol) выполняет редукцию прямо в коммутаторах InfiniBand. Данных по сети ходит меньше, all‑reduce ускоряется.');
q('2.8', 'What characterizes a spine-leaf network architecture?',
  ['Every leaf switch connects to every spine switch, giving predictable low latency and easy scale-out', 'All servers connect in a single ring', 'Each server has its own internet line', 'There is only one switch'],
  'Spine‑leaf: серверы подключаются к leaf, каждый leaf соединён со всеми spine. Любые два сервера разделяет одинаковое число хопов. Это база для fat‑tree в ЦОД.');
q('2.8', 'Which statement correctly compares RDMA with traditional TCP/IP networking?',
  ['RDMA bypasses the kernel networking stack, giving lower latency and much lower CPU overhead', 'TCP/IP always has lower latency than RDMA', 'RDMA requires more CPU cycles per byte', 'RDMA works only over Wi-Fi'],
  'TCP/IP проходит через ядро ОС с копированием буферов и тратит CPU. RDMA разгружает CPU и снижает задержку на порядок.');
q('2.8', 'What is the main purpose of VLANs or VRFs in data center networks?',
  ['Logically segment network traffic, for example separating tenants or management from production', 'Increase link speed to 800 Gb/s', 'Provide lossless flow control', 'Cool the switches'],
  'VLAN и VRF логически разделяют трафик на одной физической сети: арендаторов, управление, хранение. На скорость и потери они не влияют.');

// 2.9 High-speed network options
q('2.9', 'What is the per-port speed of InfiniBand NDR?',
  ['400 Gb/s', '100 Gb/s', '200 Gb/s', '800 Gb/s'],
  'Поколения InfiniBand: EDR — 100, HDR — 200, NDR — 400, XDR — 800 Гб/с на порт. Мнемоника: E‑H‑N‑X, каждое следующее вдвое быстрее.');
q('2.9', 'What is NVIDIA Spectrum-X?',
  ['An Ethernet platform for AI combining Spectrum-4 switches and BlueField-3 SuperNICs with adaptive routing and congestion control', 'An InfiniBand subnet manager', 'A GPU architecture', 'A storage file system'],
  'Spectrum‑X — Ethernet, оптимизированный под AI: коммутаторы Spectrum‑4 и SuperNIC BlueField‑3, адаптивная маршрутизация, контроль заторов, изоляция производительности. Даёт RoCE‑производительность, близкую к InfiniBand.');
q('2.9', 'What is NVIDIA Quantum-2?',
  ['The NDR 400 Gb/s InfiniBand switch platform', 'An Ethernet switch for office networks', 'A quantum computing processor', 'A liquid cooling unit'],
  'Quantum‑2 — платформа коммутаторов InfiniBand NDR (400 Гб/с). Следующее поколение — Quantum‑X800 (XDR, 800 Гб/с).');
q('2.9', 'When is InfiniBand typically preferred over Ethernet for an AI cluster?',
  ['For large training clusters needing the highest performance and lowest latency with native RDMA', 'For connecting office laptops', 'When only north-south web traffic matters', 'When no RDMA is needed'],
  'InfiniBand — максимальная производительность, нативный RDMA, SHARP, без потерь «из коробки». Ethernet (Spectrum‑X) выбирают за знакомую эксплуатацию, мультиарендность и интеграцию с существующей сетью.');
q('2.9', 'What are NVIDIA ConnectX adapters?',
  ['High-speed network adapters (NICs/HCAs) that support InfiniBand and Ethernet with RDMA', 'GPU memory modules', 'Power distribution units', 'Rack-mounted displays'],
  'ConnectX (сейчас ConnectX‑7 и ConnectX‑8) — сетевые адаптеры NVIDIA (бывший Mellanox) с поддержкой IB и Ethernet, RDMA и GPUDirect.');
q('2.9', 'How do NVLink and InfiniBand differ in their typical role?',
  ['NVLink connects GPUs within a node or rack (scale-up); InfiniBand connects nodes across the cluster (scale-out)', 'NVLink connects storage; InfiniBand connects monitors', 'They are identical technologies', 'InfiniBand is used only inside a single GPU'],
  'NVLink — сверхбыстрая связь GPU внутри узла или стойки NVL72. InfiniBand или Ethernet — связь между узлами по всему кластеру.');
q('2.9', 'Approximately how many gigabytes per second can a 400 Gb/s link carry?',
  ['About 50 GB/s', 'About 400 GB/s', 'About 4 GB/s', 'About 3,200 GB/s'],
  'Гигабиты делим на 8: 400 Гб/с ÷ 8 = 50 ГБ/с. Не путайте Gb (биты, сети) и GB (байты, NVLink и память).');
q('2.9', 'What is a BlueField-3 SuperNIC primarily optimized for?',
  ['Accelerating east-west AI network traffic in Spectrum-X Ethernet fabrics', 'Running the host operating system', 'Storing model checkpoints', 'Driving displays'],
  'SuperNIC — вариант BlueField‑3, заточенный под GPU‑трафик east‑west в AI‑фабриках Spectrum‑X (RoCE, адаптивная маршрутизация). Классический DPU шире: инфраструктурные сервисы, безопасность, хранение.');

// 2.10 DPU
q('2.10', 'What is a DPU (Data Processing Unit)?',
  ['A programmable processor combining a high-speed NIC, Arm cores and accelerators to offload networking, storage and security from the host CPU', 'A GPU designed for gaming', 'A type of power supply', 'A disk storage controller only'],
  'DPU (NVIDIA BlueField) = сетевой адаптер + Arm‑ядра + аппаратные ускорители. Выполняет инфраструктурные задачи вместо CPU хоста.');
q('2.10', 'What is a key benefit of using BlueField DPUs in a data center?',
  ['They free host CPU cores and isolate infrastructure services from tenant workloads for zero-trust security', 'They double the GPU memory', 'They replace the need for GPUs', 'They eliminate cooling requirements'],
  'Две главные выгоды: освобождение CPU (сеть, хранение, шифрование уходят на DPU) и изоляция — инфраструктура работает отдельно от ОС арендатора, даже если хост скомпрометирован.');
q('2.10', 'Which NVIDIA SDK is used to program BlueField DPUs?',
  ['DOCA', 'CUDA', 'NeMo', 'RAPIDS'],
  'DOCA — SDK для DPU, как CUDA для GPU. Библиотеки для сетей, хранения, безопасности и телеметрии.');
q('2.10', 'Which three processor types are often described as the pillars of the modern accelerated data center?',
  ['CPU, GPU and DPU', 'CPU, HDD and SSD', 'GPU, PSU and UPS', 'NIC, BMC and PDU'],
  'Формула NVIDIA: CPU — общие вычисления, GPU — ускоренные вычисления, DPU — обработка данных и инфраструктуры.');
q('2.10', 'Which task would typically be offloaded to a DPU?',
  ['Software-defined networking such as Open vSwitch, encryption and storage virtualization', 'Training a neural network', 'Rendering 3D graphics', 'Running the user application code'],
  'Классические задачи DPU: виртуальные коммутаторы (OVS), межсетевой экран, шифрование IPsec/TLS, NVMe‑oF и виртуализация хранения, телеметрия.');
q('2.10', 'In a multi-tenant cloud, why does running infrastructure services on a DPU improve security?',
  ['Services run in a separate trust domain from the host OS, so a compromised tenant cannot tamper with them', 'DPUs have no network access', 'DPUs encrypt the GPU memory', 'It disables root access for administrators'],
  'DPU — отдельный компьютер со своей ОС. Политики безопасности и сети работают на нём, и арендатор с правами root на хосте не может их отключить.');

// ───────── Domain 3 · AI Operations (22%) ─────────
// 3.1 Data center management and monitoring
q('3.1', 'What is a Baseboard Management Controller (BMC)?',
  ['An independent controller for out-of-band monitoring and management, such as power control, sensors and remote console, even when the OS is down', 'A GPU scheduler', 'A storage controller for NVMe drives', 'A Kubernetes add-on'],
  'BMC — отдельный микроконтроллер на материнской плате со своей сетью. Позволяет включать и выключать сервер, смотреть датчики, открывать удалённую консоль, даже если ОС зависла.');
q('3.1', 'Which protocols are commonly used to communicate with a BMC?',
  ['IPMI and Redfish', 'SMTP and POP3', 'HTTP/3 and QUIC only', 'NFS and SMB'],
  'IPMI — старый стандарт, Redfish — современный REST/JSON API для управления серверами. Оба работают через out‑of‑band сеть.');
q('3.1', 'What is the purpose of an out-of-band (OOB) management network?',
  ['A separate network to reach BMCs and device management ports, independent of production data networks', 'A backup internet connection for users', 'The main GPU-to-GPU fabric', 'A Wi-Fi network for visitors'],
  'OOB‑сеть (обычно 1 GbE) даёт доступ к BMC и консолям коммутаторов, даже если основная сеть или ОС не работают.');
q('3.1', 'Which functions does NVIDIA Base Command Manager provide?',
  ['Node provisioning with OS images, cluster monitoring, health checks and workload manager setup', 'Training LLMs from scratch', 'Designing GPU chips', 'Selling cloud capacity'],
  'BCM: разворачивает образы ОС на сотнях узлов, ставит и настраивает Slurm или Kubernetes, мониторит и проверяет здоровье кластера.');
q('3.1', 'How are Prometheus and Grafana commonly used in GPU cluster monitoring?',
  ['Prometheus collects time-series metrics, for example from DCGM Exporter, and Grafana visualizes them in dashboards with alerts', 'They schedule GPU jobs', 'They provision OS images', 'They replace the GPU driver'],
  'Классическая связка: DCGM Exporter → Prometheus (сбор и хранение метрик) → Grafana (дашборды и алерты).');
q('3.1', 'Which is a good example of proactive monitoring in an AI data center?',
  ['Alerting when GPU temperature exceeds a threshold or correctable ECC errors start rising', 'Waiting for users to report slow jobs', 'Checking hardware only once a year', 'Disabling logs to save disk space'],
  'Проактивный мониторинг ловит проблему до сбоя: пороги по температуре, рост ECC‑ошибок, XID‑события, падение пропускной способности NVLink.');
q('3.1', 'Why is centralized log collection important in large GPU clusters?',
  ['It correlates events such as XID errors and hardware faults across many nodes for faster troubleshooting', 'It makes GPUs faster', 'It reduces power usage', 'It replaces the scheduler'],
  'На сотнях узлов вручную читать логи невозможно. Централизованный сбор (syslog, Elastic, Loki) позволяет искать закономерности, например одинаковые XID на одной стойке.');
q('3.1', 'What is NVIDIA Mission Control?',
  ['Software for operating AI factories such as DGX SuperPOD, automating cluster operations, health monitoring and workload recovery', 'A GPU overclocking utility', 'A game streaming service', 'A firmware for InfiniBand cables'],
  'Mission Control — ПО для эксплуатации «AI‑фабрик» на DGX SuperPOD и GB200: автоматизация операций, мониторинг здоровья, автоматическое восстановление задач. Включает Base Command Manager и Run:ai.');

// 3.2 Orchestration and job scheduling
q('3.2', 'What is Slurm?',
  ['An open-source workload manager for HPC and AI clusters that allocates resources and queues and schedules batch jobs', 'A GPU driver', 'A container image format', 'A network protocol'],
  'Slurm — стандарт планировщиков для HPC и обучения: очередь заданий, выделение узлов и GPU, приоритеты. Используется в большинстве DGX SuperPOD.');
q('3.2', 'Which Slurm command submits a batch job script?',
  ['sbatch', 'squeue', 'scancel', 'sinfo'],
  'sbatch — отправить скрипт в очередь. srun — запустить шаг или интерактивно. squeue — посмотреть очередь. scancel — отменить. sinfo — состояние узлов и партиций.');
q('3.2', 'Which Slurm command shows jobs that are pending and running in the queue?',
  ['squeue', 'sbatch', 'srun', 'scontrol reboot'],
  'squeue показывает очередь заданий и их статус (PD — ожидает, R — выполняется).');
q('3.2', 'How do you request GPUs for a Slurm job?',
  ['Using generic resources (GRES), for example --gres=gpu:8', 'Using --cpus=gpu', 'By editing /etc/hosts', 'Slurm cannot allocate GPUs'],
  'GPU в Slurm — это GRES (Generic RESource). Пример: sbatch --nodes=2 --gres=gpu:8 train.sh. Есть и новые опции вроде --gpus.');
q('3.2', 'What is Kubernetes mainly designed for?',
  ['Orchestrating containers: deploying, scaling and self-healing containerized applications', 'Monitoring GPU temperature only', 'Configuring BMC firmware', 'Compiling CUDA code'],
  'Kubernetes — оркестратор контейнеров: развёртывание, масштабирование, перезапуск упавших подов. Хорош для инференс‑сервисов и микросервисов.');
q('3.2', 'How does a Kubernetes pod request a GPU?',
  ['By specifying the resource nvidia.com/gpu in its resource limits, exposed by the NVIDIA device plugin', 'By setting the pod name to "gpu"', 'By mounting /dev/null', 'GPUs are assigned to every pod automatically'],
  'Device plugin объявляет ресурс nvidia.com/gpu на узле, а под запрашивает его в resources.limits (например, nvidia.com/gpu: 1). Планировщик ставит под на узел со свободным GPU.');
q('3.2', 'Which statement best describes when Slurm or Kubernetes is typically chosen?',
  ['Slurm for batch, multi-node training jobs; Kubernetes for containerized services such as inference', 'Slurm only for web servers; Kubernetes only for HPC', 'Both are only for storage', 'Neither can schedule GPUs'],
  'Slurm — пакетные задачи и обучение на многих узлах (HPC‑стиль). Kubernetes — сервисы, инференс, MLOps‑пайплайны. На практике их часто совмещают (Run:ai, Slinky и т. п.).');
q('3.2', 'What is gang scheduling?',
  ['Allocating all resources a multi-node job needs at the same time, or none, so partial allocations do not waste GPUs', 'Running all jobs on one GPU', 'Randomly assigning jobs to nodes', 'Scheduling jobs only at night'],
  'Распределённому обучению нужны все узлы сразу. Gang scheduling запускает задачу, только когда доступны все ресурсы, иначе часть GPU простаивала бы в ожидании.');
q('3.2', 'Which tools let Slurm jobs run containers unprivileged on DGX clusters?',
  ['Pyxis and Enroot', 'Docker Swarm and Compose', 'Ansible and Terraform', 'Prometheus and Grafana'],
  'Enroot превращает образы контейнеров в непривилегированные «песочницы», а плагин Pyxis добавляет в srun опцию --container-image.');
q('3.2', 'Which scheduler feature lets a high-priority job take resources from lower-priority running jobs?',
  ['Preemption', 'Backfill', 'Checkpointing', 'Port forwarding'],
  'Preemption: высокоприоритетная задача вытесняет низкоприоритетную (приостанавливает или перезапускает её). Поэтому важны чекпоинты.');
q('3.2', 'What is backfill scheduling?',
  ['Running smaller jobs in idle gaps as long as they do not delay higher-priority jobs', 'Filling disks with backups', 'Restarting failed jobs automatically', 'Overclocking idle GPUs'],
  'Backfill берёт короткие задачи из очереди и запускает их в «дырах» расписания, не задерживая крупные приоритетные задачи. Повышает утилизацию.');
q('3.2', 'What is a Slurm partition?',
  ['A logical group of nodes acting as a queue with its own limits and policies', 'A disk partition on the head node', 'A MIG instance', 'A VLAN'],
  'Партиция (partition) — логическая очередь из группы узлов со своими лимитами: например, «debug» с коротким временем и «train» с узлами DGX.');
q('3.2', 'Why use a job scheduler in a shared GPU cluster instead of letting users log in to nodes directly?',
  ['To maximize utilization, enforce fair sharing and queue work instead of manual coordination', 'To make GPUs run faster', 'Because GPUs cannot run without a scheduler', 'To avoid using containers'],
  'Планировщик честно делит ресурсы, ставит задачи в очередь, не даёт двум пользователям занять один GPU и поднимает общую утилизацию.');

// 3.3 GPU monitoring metrics
q('3.3', 'Which command-line tool quickly shows GPU utilization, memory, temperature and running processes on a node?',
  ['nvidia-smi', 'top', 'ifconfig', 'squeue'],
  'nvidia-smi — первая команда при проверке GPU: загрузка, память, температура, мощность, процессы, MIG‑режим.');
q('3.3', 'nvidia-smi is built on which NVIDIA library?',
  ['NVML (NVIDIA Management Library)', 'NCCL', 'cuDNN', 'DOCA'],
  'NVML — C‑библиотека для мониторинга и управления GPU. На ней построены nvidia-smi и частично DCGM.');
q('3.3', 'What is NVIDIA DCGM?',
  ['Data Center GPU Manager: a suite for monitoring, health checks, diagnostics and policy management of GPUs at cluster scale', 'A deep learning framework', 'A network switch OS', 'A cloud billing tool'],
  'DCGM — инструмент для GPU в масштабе ЦОД: телеметрия, проверки здоровья, диагностика (dcgmi diag), политики и оповещения, интеграция с Kubernetes и Slurm.');
q('3.3', 'Which command runs active GPU health diagnostics with DCGM?',
  ['dcgmi diag', 'nvidia-smi topo -m', 'squeue', 'kubectl get pods'],
  'dcgmi diag -r 1/2/3/4 — диагностика разной глубины: от быстрой проверки (секунды) до длительных стресс‑тестов. topo -m показывает топологию, а не здоровье.');
q('3.3', 'What does DCGM Exporter do?',
  ['Exposes GPU metrics in Prometheus format for monitoring systems', 'Exports trained models to ONNX', 'Copies data to cloud storage', 'Updates GPU firmware'],
  'DCGM Exporter отдаёт метрики GPU по HTTP для Prometheus. В Kubernetes его ставит GPU Operator.');
q('3.3', 'What are XID errors?',
  ['Error events reported by the NVIDIA driver in the system log that indicate hardware, driver or application problems', 'Encryption keys for GPUs', 'Kubernetes pod identifiers', 'InfiniBand port numbers'],
  'XID — коды ошибок драйвера NVIDIA в dmesg/syslog. Например, XID 79 — GPU «отвалился от шины», XID 48 — двойная ECC‑ошибка, XID 13/31 — часто ошибки приложения.');
q('3.3', 'A GPU shows a growing number of uncorrectable (double-bit) ECC errors. What does this indicate?',
  ['Failing GPU memory that needs attention, such as a reset, row remapping check or replacement', 'Normal behavior that can be ignored', 'A network misconfiguration', 'The job is using too little memory'],
  'Корректируемые ошибки ECC исправляются на лету. Некорректируемые означают повреждение данных и признак деградации памяти: GPU нужно вывести из работы и проверить (row remapping, RMA).');
q('3.3', 'nvidia-smi reports 100% GPU utilization, yet training is slow. Why can this metric be misleading?',
  ['It measures the percentage of time any kernel was running, not how fully the SMs and Tensor Cores are used', 'It measures fan speed', 'It counts network packets', 'It always reports 100% when MIG is enabled'],
  '«GPU‑Util» — доля времени, когда работало хотя бы одно ядро. Даже крошечное ядро даёт 100%. Реальную загрузку показывают профилировочные метрики DCGM: SM Activity, SM Occupancy, Tensor Pipe Active.');
q('3.3', 'Which is a common cause of low GPU utilization during training?',
  ['A data loading bottleneck from slow storage I/O or CPU preprocessing', 'Too many Tensor Cores', 'GPU memory that is too fast', 'An optimal batch size'],
  'GPU простаивает, если данные не успевают: медленное хранилище, слабая предобработка на CPU, маленький батч, ожидание сети. Решения: DALI, кэш на NVMe, больше воркеров загрузки.');
q('3.3', 'What is thermal throttling on a GPU?',
  ['The GPU lowers its clocks when temperature or power limits are reached, reducing performance', 'The GPU increases its clocks when hot', 'A security lock on the GPU', 'A network rate limit'],
  'При перегреве или упоре в лимит мощности GPU снижает частоты. Причина в охлаждении или в power cap. Смотрите nvidia-smi -q -d PERFORMANCE (clock throttle reasons).');
q('3.3', 'What does the command nvidia-smi topo -m show?',
  ['The interconnect topology matrix between GPUs and NICs, such as NVLink or PCIe paths', 'The job queue', 'GPU fan curves', 'Container images'],
  'nvidia-smi topo -m показывает, как связаны GPU и сетевые карты: NV# (NVLink), PIX/PXB (через PCIe‑коммутатор), SYS (через CPU). Полезно при диагностике производительности.');
q('3.3', 'Which set of metrics is most important to monitor on data center GPUs?',
  ['Utilization, memory usage, temperature, power, clocks, ECC/XID errors and NVLink/PCIe throughput', 'Screen resolution and refresh rate', 'Keyboard latency and mouse DPI', 'Office temperature only'],
  'Базовый набор метрик GPU: загрузка, память, температура, мощность, частоты, ошибки (ECC, XID), пропускная способность интерконнекта.');
q('3.3', 'How can an administrator cap the power draw of a GPU?',
  ['Set a power limit with nvidia-smi -pl', 'Unplug one of its fans', 'Delete the CUDA toolkit', 'Disable ECC'],
  'nvidia-smi -pl <ватт> задаёт лимит мощности. Это помогает уложиться в бюджет питания стойки ценой части производительности.');

// 3.4 Virtualization
q('3.4', 'What is Multi-Instance GPU (MIG)?',
  ['Hardware partitioning of one GPU into up to seven isolated instances, each with dedicated compute, memory and cache', 'Linking multiple GPUs into one larger GPU', 'A software time-sharing scheduler', 'A GPU overclocking mode'],
  'MIG делит GPU (A100, H100, H200, B200 и др.) на изолированные экземпляры со своими SM, памятью и кэшем. Гарантированное качество обслуживания и защита от «шумных соседей».');
q('3.4', 'What is the maximum number of MIG instances on an A100 or H100 GPU?',
  ['7', '2', '4', '16'],
  'До 7 экземпляров (например, профиль 1g.10gb на H100 80GB). На A30 — до 4.');
q('3.4', 'How does MIG differ from time-slicing for GPU sharing?',
  ['MIG gives hardware isolation and guaranteed resources; time-slicing shares the whole GPU in turns without memory isolation', 'Time-slicing offers stronger isolation than MIG', 'They are identical', 'MIG works only on consumer GPUs'],
  'MIG — физическое разделение: своя память и SM, сбой или нагрузка одного не влияет на другого. Time‑slicing — процессы по очереди пользуются всем GPU, памятью делятся без изоляции.');
q('3.4', 'What is NVIDIA vGPU software?',
  ['Software that lets multiple virtual machines share a physical GPU through the hypervisor using vGPU profiles', 'A cloud-only GPU rental service', 'A GPU cooling controller', 'A tool for compiling CUDA'],
  'NVIDIA vGPU (в составе AI Enterprise или vGPU for Compute) позволяет нескольким ВМ делить GPU через гипервизор с профилями памяти. Требует лицензии и совместимых драйверов на хосте и в гостевой ОС.');
q('3.4', 'What is GPU passthrough in a virtualized environment?',
  ['Assigning an entire physical GPU directly to a single VM for near bare-metal performance, without sharing', 'Sharing one GPU across 32 VMs', 'Running GPU code on the CPU', 'Moving GPUs between data centers'],
  'Passthrough (PCIe passthrough, VFIO) отдаёт весь GPU одной ВМ. Производительность почти как на «железе», но GPU не делится.');
q('3.4', 'Which workload is best suited to MIG?',
  ['Many small inference services or development notebooks that each need guaranteed, isolated resources', 'Training one huge model across 1,000 GPUs', 'Workloads that need the full memory of 8 GPUs', 'CPU-only batch jobs'],
  'MIG идеален, когда задачи маленькие и не загружают целый GPU: инференс небольших моделей, Jupyter‑ноутбуки, CI. Для больших обучающих задач GPU нужен целиком.');
q('3.4', 'Which considerations matter when virtualizing GPU infrastructure?',
  ['Performance overhead, licensing, driver compatibility between host and guest, and right-sizing vGPU or MIG profiles', 'Monitor size and keyboard layout', 'Only the color of the server', 'None, virtualization has no trade-offs'],
  'Виртуализация GPU — компромисс: небольшие накладные расходы, лицензии vGPU, согласование версий драйверов хоста и гостя, выбор профилей, возможности live migration.');
q('3.4', 'How do containers differ from virtual machines?',
  ['Containers share the host kernel and are lightweight; VMs run a full guest OS on a hypervisor with stronger isolation', 'Containers include a full guest OS', 'VMs share the host kernel', 'There is no difference'],
  'Контейнеры легче и стартуют за секунды, но делят ядро хоста. ВМ тяжелее, со своей ОС и более сильной изоляцией. Часто их комбинируют: Kubernetes внутри ВМ.');
q('3.4', 'In Kubernetes, what is the main drawback of GPU time-slicing compared to MIG?',
  ['No memory or fault isolation between workloads sharing the GPU', 'It requires InfiniBand', 'It only works on CPUs', 'It disables CUDA'],
  'При time‑slicing все поды видят всю память GPU: один может занять её целиком или уронить соседей. MIG даёт аппаратную изоляцию.');
q('3.4', 'What must be enabled on a GPU before creating MIG instances?',
  ['MIG mode, for example with nvidia-smi -mig 1, followed by creating GPU and compute instances', 'ECC must be disabled', 'NVLink must be removed', 'The GPU must be in a VM'],
  'Сначала включают MIG‑режим (nvidia-smi -i 0 -mig 1, может потребоваться сброс GPU), затем создают GPU Instances и Compute Instances по профилям. В Kubernetes это делает MIG Manager из GPU Operator.');
// Flashcards: [topic, term, back (RU)]
const G = [
  ['1.1','CUDA','Платформа и модель программирования NVIDIA для вычислений общего назначения на GPU. Основа всего стека.'],
  ['1.1','cuDNN','Библиотека примитивов глубокого обучения (свёртки, нормализация, активации) для фреймворков.'],
  ['1.1','NCCL','Коллективные коммуникации между GPU и узлами: all‑reduce, all‑gather, broadcast.'],
  ['1.1','NGC','Каталог GPU‑оптимизированных контейнеров, моделей и Helm‑чартов.'],
  ['1.1','NVIDIA AI Enterprise','Коммерческий набор AI‑ПО с поддержкой и сертификацией: NIM, NeMo, Triton, RAPIDS, GPU Operator.'],
  ['1.1','GPU Operator','Автоматически ставит в Kubernetes драйвер, Container Toolkit, device plugin, DCGM Exporter, MIG Manager.'],
  ['1.1','Container Toolkit','Даёт контейнерам доступ к GPU хоста (docker run --gpus all).'],
  ['1.1','RAPIDS','Data science на GPU: cuDF (как pandas), cuML (как scikit‑learn), cuGraph.'],
  ['1.2','TensorRT','Оптимизатор и runtime инференса: слияние слоёв, квантование FP8/INT8, автоподбор ядер.'],
  ['1.2','Triton Inference Server','Сервер инференса для многих фреймворков: динамический батчинг, несколько моделей на GPU.'],
  ['1.2','Dynamic batching','Сервер собирает входящие запросы в пачки, чтобы поднять загрузку GPU и throughput.'],
  ['1.2','Mixed precision','Обучение в BF16/FP16 на Tensor Cores с мастер‑весами в FP32: быстрее и экономнее по памяти.'],
  ['1.2','Quantization','Перевод весов в меньшую разрядность (INT8, FP8, FP4) для быстрого и дешёвого инференса.'],
  ['1.3','AI ⊃ ML ⊃ DL','AI — общая область; ML — обучение на данных; DL — многослойные нейросети, сами извлекают признаки.'],
  ['1.3','Supervised / Unsupervised / RL','С учителем — размеченные данные; без учителя — поиск структуры; с подкреплением — награды за действия.'],
  ['1.3','Transformer','Архитектура на self‑attention, основа LLM. Хорошо параллелится на GPU.'],
  ['1.3','Fine-tuning','Дообучение предобученной модели на небольшом наборе своих данных (LoRA, PEFT).'],
  ['1.3','RAG','Поиск релевантных документов в векторной базе и добавление их в промпт LLM.'],
  ['1.4','Три драйвера AI','Данные + вычисления на GPU + алгоритмы (трансформеры). Плюс облака и открытые фреймворки.'],
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
  ['1.8','HBM','Стековая память рядом с GPU, ТБ/с пропускной способности. H100 — 80 ГБ, H200 — 141 ГБ.'],
  ['1.8','SM','Streaming Multiprocessor — строительный блок GPU (CUDA‑ядра, Tensor Cores, память).'],
  ['1.8','Grace Hopper / NVLink-C2C','CPU Grace + GPU Hopper, когерентная связь NVLink‑C2C 900 ГБ/с.'],
  ['2.1','DGX H100','8× H100 SXM, 640 ГБ HBM3, 4× NVSwitch, 8× ConnectX‑7 400G, 2× BlueField‑3, ~10,2 кВт.'],
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
  ['2.3','Direct-to-chip','Холодные пластины на чипах, тепло уходит жидкостью через CDU.'],
  ['2.3','N+1 vs 2N','N+1 — один запасной компонент; 2N — полностью дублированные независимые пути A/B.'],
  ['2.3','Hot/cold aisle','Изоляция горячего и холодного коридоров, чтобы воздух не смешивался.'],
  ['2.4','Облако','Быстрый старт, эластичность, OpEx. Минусы: egress, дефицит GPU, цена при масштабе.'],
  ['2.4','On-prem','Дешевле при постоянной высокой загрузке, контроль и суверенитет данных. Минусы: CapEx, сроки, эксплуатация.'],
  ['2.4','Cloud bursting','База на своём кластере, пики уходят в облако.'],
  ['2.5','4 сети SuperPOD','Compute fabric, storage fabric, in‑band management, out‑of‑band management.'],
  ['2.6','Требования к площадке','Мощность, охлаждение, нагрузка на пол (DGX ~130 кг), место, кабели, ASHRAE.'],
  ['2.7','East-west / North-south','East‑west — внутри ЦОД между серверами; north‑south — между ЦОД и внешним миром.'],
  ['2.7','Rail-optimized','Порт N каждого узла подключён к одному leaf‑коммутатору «рельса» N.'],
  ['2.7','RDMA','Передача данных память‑в‑память между узлами в обход CPU и ядра ОС.'],
  ['2.7','GPUDirect RDMA','Сетевая карта читает и пишет память GPU напрямую.'],
  ['2.8','RoCE v2','RDMA поверх Ethernet в UDP/IP, маршрутизируемый. Нужны PFC + ECN.'],
  ['2.8','PFC / ECN','PFC — пауза по приоритету при заполнении буфера; ECN — пометка о заторе, источник снижает скорость.'],
  ['2.8','Subnet Manager','Мозг InfiniBand: топология, адреса LID, маршруты (например, в UFM).'],
  ['2.8','Credit-based flow control','InfiniBand шлёт только при свободном буфере у получателя, поэтому без потерь.'],
  ['2.8','SHARP','Редукция (all‑reduce) прямо в коммутаторах InfiniBand.'],
  ['2.9','IB поколения','EDR 100 → HDR 200 → NDR 400 → XDR 800 Гб/с.'],
  ['2.9','Quantum-2 / Quantum-X800','Коммутаторы InfiniBand NDR 400G / XDR 800G.'],
  ['2.9','Spectrum-X','AI‑Ethernet: Spectrum‑4 + SuperNIC BlueField‑3, адаптивная маршрутизация, контроль заторов.'],
  ['2.9','Gb/s → GB/s','Делим на 8: 400 Гб/с ≈ 50 ГБ/с.'],
  ['2.10','DPU','NIC + Arm‑ядра + ускорители. Сеть, хранение, безопасность вместо CPU хоста.'],
  ['2.10','BlueField / DOCA','BlueField — DPU NVIDIA; DOCA — его SDK (как CUDA для GPU).'],
  ['2.10','Выгоды DPU','Освобождает ядра CPU, изолирует инфраструктуру от арендатора (zero trust).'],
  ['3.1','BMC','Отдельный контроллер для out‑of‑band управления: питание, датчики, консоль. IPMI и Redfish.'],
  ['3.1','OOB network','Отдельная сеть управления к BMC, работает при упавшей ОС или основной сети.'],
  ['3.1','Prometheus + Grafana','Сбор метрик (DCGM Exporter → Prometheus) и дашборды с алертами (Grafana).'],
  ['3.2','Slurm: команды','sbatch — отправить; srun — запустить; squeue — очередь; scancel — отменить; sinfo — узлы.'],
  ['3.2','Slurm GRES','Запрос GPU: --gres=gpu:8.'],
  ['3.2','K8s GPU','resources.limits: nvidia.com/gpu: 1 (через device plugin).'],
  ['3.2','Gang scheduling','Выделять все ресурсы многоузловой задачи сразу или никакие.'],
  ['3.2','Pyxis + Enroot','Непривилегированные контейнеры в задачах Slurm.'],
  ['3.2','Preemption / Backfill','Preemption — вытеснение низкоприоритетных; backfill — мелкие задачи в «дырах» расписания.'],
  ['3.3','nvidia-smi / NVML','CLI для состояния GPU, построен на NVML. topo -m — топология; -pl — лимит мощности.'],
  ['3.3','DCGM','Мониторинг, проверки здоровья, диагностика (dcgmi diag), политики для GPU в масштабе ЦОД.'],
  ['3.3','XID','Коды ошибок драйвера NVIDIA в системном логе (dmesg).'],
  ['3.3','ECC','Коррекция ошибок памяти. Рост некорректируемых ошибок — признак сбоя памяти GPU.'],
  ['3.3','GPU-Util ≠ эффективность','GPU‑Util — доля времени работы ядра. Смотрите SM Activity и Tensor Active в DCGM.'],
  ['3.4','MIG','До 7 изолированных экземпляров на A100/H100 со своими SM, памятью и кэшем.'],
  ['3.4','Time-slicing','Поочерёдное использование GPU без изоляции памяти.'],
  ['3.4','vGPU','Совместное использование GPU несколькими ВМ через гипервизор, профили, лицензия.'],
  ['3.4','Passthrough','Весь GPU одной ВМ, производительность почти как на «железе».'],
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
    ['AI, ML, DL', ['AI ⊃ ML ⊃ DL', 'Supervised (метки), unsupervised (кластеры), reinforcement (награды)', 'Генеративный AI: LLM на трансформерах, диффузия. Fine‑tuning и RAG — способы адаптации']],
    ['Решения по отраслям', ['Clara — медицина · Metropolis — видеоаналитика · Isaac — роботы · Omniverse — цифровые двойники', 'Riva — речь · Morpheus — кибербезопасность · Merlin — рекомендации · DRIVE — авто · cuOpt — логистика', 'NIM — готовые инференс‑контейнеры · NeMo — генеративный AI · Run:ai — оркестрация GPU · BCM — управление кластером · Fleet Command — edge']],
    ['GPU и CPU', ['CPU: десятки мощных ядер, кэши, ветвления, ОС и I/O', 'GPU: тысячи ядер, SM, Tensor Cores, HBM, сокрытие задержек за счёт множества потоков', 'Transformer Engine: FP8 в Hopper, FP4 в Blackwell']],
  ],
  d2: [
    ['Ключевые цифры', ['DGX H100: 8 GPU, 640 ГБ, ~10,2 кВт, 8× ConnectX‑7 400G, 2× BlueField‑3', 'NVLink: 600 (A100) → 900 (H100) → 1800 ГБ/с (Blackwell)', 'InfiniBand: EDR 100 → HDR 200 → NDR 400 → XDR 800 Гб/с', 'SuperPOD SU: 32 узла DGX H100 = 256 GPU', 'GB200 NVL72: 72 GPU + 36 Grace, жидкость, ~120+ кВт', 'MIG: до 7 экземпляров']],
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
