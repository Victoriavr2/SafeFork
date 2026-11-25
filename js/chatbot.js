
// =============================================
// SAFEFORK IA - ASSISTENTE ALIMENTAR
// Hugging Face + Transformers.js + WebGPU
// Chunking + Embeddings + Busca Semântica
// =============================================

window.safeForkIA = {

  modelo: null,
  base: [],
  chunks: [],
  vetores: [],
  dispositivo: null,
  carregando: false,
  pronto: false,
  processando: false,
  eventosConfigurados: false,

  // =========================================
  // STATUS E CONTROLES
  // =========================================

  atualizarStatus(texto) {
    const status = document.getElementById('ia-status');

    if (status) {
      status.textContent = texto;
    }
  },

  habilitarControles(habilitado) {
    const controles = document.querySelectorAll(
      '#ia-pergunta, #ia-enviar, #ia-limpar, .ia-sugestao'
    );

    controles.forEach(elemento => {
      elemento.disabled = !habilitado;
    });
  },

  // =========================================
  // VERIFICAR WEBGPU
  // =========================================

  async verificarWebGPU() {
    try {
      if (!navigator.gpu) return false;

      const adapter = await navigator.gpu.requestAdapter();

      return Boolean(adapter);

    } catch (erro) {
      console.warn('WebGPU indisponível:', erro);
      return false;
    }
  },

  // =========================================
  // CARREGAR BASE ALIMENTAR
  // =========================================

  async carregarBase() {

    this.atualizarStatus(
      '📚 Carregando base de conhecimento alimentar...'
    );

    const resposta = await fetch(
      './data/base-alimentar.json'
    );

    if (!resposta.ok) {
      throw new Error(
        'Não foi possível carregar a base alimentar.'
      );
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados) || dados.length === 0) {
      throw new Error('Base alimentar inválida ou vazia.');
    }

    this.base = dados;

    console.log(
      'SafeFork IA - Registros carregados:',
      this.base.length
    );
  },

  // =========================================
  // NORMALIZAR TEXTOS
  // =========================================

  normalizarTexto(texto) {

    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  },

  // =========================================
  // ETAPA 06 - CHUNKING
  // =========================================

  criarChunks() {

    this.chunks = [];

    for (const registro of this.base) {

      for (const pergunta of registro.perguntas) {

        this.chunks.push({

          id: registro.id,

          texto:
            `Ingrediente: ${registro.ingrediente}. ` +
            `Assunto: ${registro.alergeno}. ` +
            `Pergunta: ${pergunta} ` +
            `Informação: ${registro.resposta}`,

          registro: registro

        });
      }
    }

    console.log(
      'SafeFork IA - Total de chunks:',
      this.chunks.length
    );
  },

  // =========================================
  // ETAPA 06 - GERAR EMBEDDINGS
  // =========================================

  async gerarVetor(texto, tipo = 'query') {

    const resultado = await this.modelo(
      `${tipo}: ${texto}`,
      {
        pooling: 'mean',
        normalize: true
      }
    );

    const vetor = Array.from(resultado.data);

    if (
      vetor.length !== 384 ||
      !vetor.every(Number.isFinite)
    ) {
      throw new Error('Vetor inválido.');
    }

    return vetor;
  },

  // Vetorizar todos os trechos da base

  async vetorizarBase() {

    this.vetores = [];

    for (let i = 0; i < this.chunks.length; i++) {

      this.atualizarStatus(
        `🧠 Vetorizando conhecimento: ` +
        `${i + 1}/${this.chunks.length}`
      );

      const chunk = this.chunks[i];

      const vetor = await this.gerarVetor(
        chunk.texto,
        'passage'
      );

      this.vetores.push({

        id: chunk.id,
        registro: chunk.registro,
        vetor: vetor

      });
    }

    console.log(
      'SafeFork IA - Vetores criados:',
      this.vetores.length
    );

    console.log(
      'SafeFork IA - Dimensão:',
      this.vetores[0]?.vetor.length
    );
  },

  // =========================================
  // ETAPA 07 - SIMILARIDADE DE COSSENO
  // =========================================

  similaridadeCosseno(a, b) {

    if (a.length !== b.length) return 0;

    let produto = 0;
    let normaA = 0;
    let normaB = 0;

    for (let i = 0; i < a.length; i++) {

      produto += a[i] * b[i];
      normaA += a[i] * a[i];
      normaB += b[i] * b[i];

    }

    if (normaA === 0 || normaB === 0) return 0;

    return produto /
      (Math.sqrt(normaA) * Math.sqrt(normaB));
  },

  // =========================================
  // ETAPA 08 - VALIDAR PERGUNTAS
  // =========================================

  validarPergunta(pergunta, registro) {

    const texto = this.normalizarTexto(pergunta);

    // Verificar perguntas cadastradas na base

    const perguntaConhecida = registro.perguntas.some(
      p => this.normalizarTexto(p) === texto
    );

    if (perguntaConhecida) return true;

    // Variações de ingredientes aceitas

    const ingredientes = {

      1: ['farinha de trigo', 'trigo'],

      2: ['leite de coco'],

      3: ['tofu'],

      4: ['polvilho', 'polvilho doce', 'polvilho azedo'],

      5: ['leite de vaca', 'leite comum'],

      6: ['leite sem lactose', 'leite zero lactose'],

      7: ['aveia', 'farinha de aveia', 'flocos de aveia'],

      8: ['albumina de ovo'],

      9: ['amendoim'],

      10: ['cevada'],

      11: ['centeio', 'farinha de centeio'],

      12: ['contaminacao cruzada', 'pode conter']

    };

    // Assuntos aceitos para cada registro

    const assuntos = {

      1: ['gluten'],

      2: ['lactose'],

      3: ['soja'],

      4: ['gluten'],

      5: ['lactose'],

      6: ['proteina do leite', 'proteinas do leite',
          'alergia ao leite', 'aplv'],

      7: ['gluten', 'celiaca', 'celiaco'],

      8: ['ovo', 'proteina do ovo'],

      9: ['castanha', 'castanhas', 'leguminosa'],

      10: ['gluten'],

      11: ['gluten'],

      12: ['contaminacao cruzada', 'pode conter']

    };

    // Aceitar apenas perguntas simples e reconhecidas.
    // Evita extrapolar para produtos ou situações
    // que não existem na base.

    const listaIngredientes = ingredientes[registro.id] || [];
    const listaAssuntos = assuntos[registro.id] || [];

    const modelos = [];

    for (const ingrediente of listaIngredientes) {

      for (const assunto of listaAssuntos) {

        modelos.push(
          `${ingrediente} tem ${assunto}`,
          `${ingrediente} contem ${assunto}`,
          `o ${ingrediente} tem ${assunto}`,
          `a ${ingrediente} tem ${assunto}`,
          `o ${ingrediente} contem ${assunto}`,
          `a ${ingrediente} contem ${assunto}`,
          `tem ${assunto} no ${ingrediente}`,
          `tem ${assunto} na ${ingrediente}`,
          `existe ${assunto} no ${ingrediente}`,
          `existe ${assunto} na ${ingrediente}`
        );
      }
    }

    return modelos.includes(texto);
  },

  // =========================================
  // ETAPA 07 - BUSCA SEMÂNTICA
  // =========================================

  async buscarResposta(pergunta) {

    const vetorPergunta = await this.gerarVetor(
      pergunta,
      'query'
    );

    const resultados = this.vetores.map(item => ({

      registro: item.registro,

      similaridade: this.similaridadeCosseno(
        vetorPergunta,
        item.vetor
      )

    }));

    resultados.sort(
      (a, b) => b.similaridade - a.similaridade
    );

    // Remover registros duplicados

    const unicos = [];
    const ids = new Set();

    for (const item of resultados) {

      if (!ids.has(item.registro.id)) {

        ids.add(item.registro.id);
        unicos.push(item);

      }
    }

    console.log(
      'SafeFork IA - Resultados da busca:',
      unicos.slice(0, 3)
    );

    // Verificar os resultados mais relevantes

    const candidatos = unicos.filter(item =>

      item.similaridade >= 0.75 &&
      this.validarPergunta(
        pergunta,
        item.registro
      )

    );

    // Não responder se houver dúvida
    // sobre o registro correto.

    if (candidatos.length !== 1) {
      return null;
    }

    return candidatos[0];
  },

  // =========================================
  // ETAPA 08 - EXIBIR MENSAGENS
  // =========================================

  adicionarMensagem(tipo, texto, registro = null) {

    const area = document.getElementById(
      'ia-mensagens'
    );

    if (!area) return;

    const mensagem = document.createElement('div');

    mensagem.className =
      `ia-mensagem ia-${tipo}`;

    const titulo = document.createElement('strong');

    titulo.textContent = tipo === 'usuario'
      ? 'Você'
      : '🤖 SafeFork IA';

    mensagem.appendChild(titulo);

    const paragrafo = document.createElement('p');

    paragrafo.textContent = texto;

    mensagem.appendChild(paragrafo);

    // Exibir referência da informação

    if (registro && registro.fonte && registro.url) {

      const fonte = document.createElement('small');

      fonte.className = 'ia-fonte';

      fonte.appendChild(
        document.createTextNode('📚 Referência: ')
      );

      const link = document.createElement('a');

      link.textContent = registro.fonte;

      try {

        const url = new URL(registro.url);

        if (url.protocol === 'https:') {

          link.href = url.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';

        }

      } catch (erro) {
        console.warn('Referência inválida.');
      }

      fonte.appendChild(link);

      mensagem.appendChild(fonte);
    }

    area.appendChild(mensagem);

    area.scrollTop = area.scrollHeight;

    return mensagem;
  },

  // =========================================
  // PROCESSAR PERGUNTA DO USUÁRIO
  // =========================================

  async enviarPergunta(pergunta) {

    pergunta = String(pergunta || '').trim();

    if (
      !pergunta ||
      pergunta.length > 300 ||
      !this.pronto ||
      this.processando
    ) {
      return;
    }

    this.processando = true;

    this.habilitarControles(false);

    this.adicionarMensagem(
      'usuario',
      pergunta
    );

    const campo = document.getElementById(
      'ia-pergunta'
    );

    if (campo) campo.value = '';

    const pensando = this.adicionarMensagem(
      'assistente',
      '🔎 Consultando a base de conhecimento...'
    );

    try {

      const resultado = await this.buscarResposta(
        pergunta
      );

      if (pensando) pensando.remove();

      if (!resultado) {

        this.adicionarMensagem(
          'assistente',
          'Não encontrei informações suficientes ' +
          'na minha base de conhecimento para ' +
          'responder a essa pergunta com confiança. ' +
          'Confira o rótulo do alimento ou consulte ' +
          'um profissional especializado.'
        );

      } else {

        this.adicionarMensagem(
          'assistente',
          resultado.registro.resposta,
          resultado.registro
        );

        console.log(
          'SafeFork IA - Similaridade:',
          resultado.similaridade
        );

      }

    } catch (erro) {

      if (pensando) pensando.remove();

      console.error(
        'Erro ao processar pergunta:',
        erro
      );

      this.adicionarMensagem(
        'assistente',
        'Não consegui processar sua pergunta. ' +
        'Tente novamente.'
      );

    } finally {

      this.processando = false;

      this.habilitarControles(this.pronto);

    }
  },

  // =========================================
  // LIMPAR CONVERSA
  // =========================================

  limparConversa() {

    if (this.processando) return;

    const area = document.getElementById(
      'ia-mensagens'
    );

    if (!area) return;

    area.replaceChildren();

    this.adicionarMensagem(
      'assistente',
      'Olá! Sou seu assistente alimentar. ' +
      'Posso ajudar você a entender ingredientes, ' +
      'alergênicos e restrições alimentares. ' +
      'Como posso ajudar você hoje? 🌿'
    );

    const campo = document.getElementById(
      'ia-pergunta'
    );

    if (campo) campo.value = '';
  },

  // =========================================
  // CONFIGURAR EVENTOS DOS BOTÕES
  // =========================================

  configurarEventos() {

    if (this.eventosConfigurados) return;

    const formulario = document.getElementById(
      'ia-form'
    );

    const campo = document.getElementById(
      'ia-pergunta'
    );

    if (!formulario || !campo) {

      throw new Error(
        'Interface do chatbot não encontrada.'
      );

    }

    formulario.addEventListener(
      'submit',
      evento => {

        evento.preventDefault();

        this.enviarPergunta(campo.value);

      }
    );

    document.querySelectorAll(
      '.ia-sugestao'
    ).forEach(botao => {

      botao.addEventListener(
        'click',
        () => {

          this.enviarPergunta(
            botao.dataset.pergunta
          );

        }
      );

    });

    const limpar = document.getElementById(
      'ia-limpar'
    );

    if (limpar) {

      limpar.addEventListener(
        'click',
        () => this.limparConversa()
      );

    }

    this.eventosConfigurados = true;
  },

  // =========================================
  // INICIALIZAR INTELIGÊNCIA ARTIFICIAL
  // =========================================

  async iniciar() {

    if (this.pronto || this.carregando) return;

    this.carregando = true;

    this.habilitarControles(false);

    try {

      this.atualizarStatus(
        '⏳ Verificando compatibilidade do dispositivo...'
      );

      const suportaGPU = await this.verificarWebGPU();

      this.dispositivo = suportaGPU
        ? 'webgpu'
        : 'wasm';

      this.atualizarStatus(
        '⏳ Carregando biblioteca de inteligência artificial...'
      );

      const { pipeline, env } = await import(
        'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2'
      );

      env.allowLocalModels = false;
      env.useBrowserCache = true;

      await this.carregarBase();

      this.criarChunks();

      const carregarModelo = async dispositivo => {

        return await pipeline(

          'feature-extraction',

          'Xenova/multilingual-e5-small',

          {

            device: dispositivo,

            dtype: 'q8',

            progress_callback: progresso => {

              if (
                progresso.status === 'progress' &&
                Number.isFinite(progresso.progress)
              ) {

                const percentual = Math.round(
                  progresso.progress
                );

                this.atualizarStatus(
                  `⬇️ Baixando arquivo do modelo: ${percentual}%`
                );

              }
            }
          }
        );
      };

      this.atualizarStatus(
        '⏳ Preparando modelo de inteligência artificial...'
      );

      try {

        this.modelo = await carregarModelo(
          this.dispositivo
        );

        await this.testarModelo();

        await this.vetorizarBase();

      } catch (erroGPU) {

        if (this.dispositivo !== 'webgpu') {
          throw erroGPU;
        }

        console.warn(
          'Falha no WebGPU. Tentando CPU:',
          erroGPU
        );

        if (this.modelo) {

          try {

            await this.modelo.dispose();

          } catch (erro) {
            console.warn(erro);
          }
        }

        this.modelo = null;

        this.dispositivo = 'wasm';

        this.atualizarStatus(
          '⚠️ WebGPU indisponível. Tentando CPU...'
        );

        this.modelo = await carregarModelo('wasm');

        await this.testarModelo();

        await this.vetorizarBase();

      }

      this.configurarEventos();

      this.pronto = true;

      const modo = this.dispositivo === 'webgpu'
        ? 'WebGPU (GPU)'
        : 'CPU (WASM)';

      this.atualizarStatus(
        `🟢 IA pronta | ${modo} | ` +
        `${this.base.length} registros | ` +
        `${this.vetores.length} vetores`
      );

      // Liberar perguntas e botões

      this.habilitarControles(true);

      console.log(
        'SafeFork IA inicializado com sucesso.',
        this.dispositivo
      );

    } catch (erro) {

      console.error(
        'Erro no SafeFork IA:',
        erro
      );

      this.pronto = false;

      if (this.modelo) {

        try {
          await this.modelo.dispose();
        } catch (erro) {
          console.warn(erro);
        }

      }

      this.modelo = null;
      this.vetores = [];

      this.atualizarStatus(
        '🔴 Não foi possível iniciar a IA. ' +
        'Verifique a conexão ou a compatibilidade ' +
        'do dispositivo. Saia da tela e tente novamente.'
      );

      this.habilitarControles(false);

    } finally {

      this.carregando = false;

    }
  },

  // =========================================
  // TESTE INICIAL DO MODELO
  // =========================================

  async testarModelo() {

    this.atualizarStatus(
      '🧠 Testando processamento do modelo...'
    );

    const vetor = await this.gerarVetor(
      'Farinha de trigo contém glúten?',
      'query'
    );

    console.log(
      'SafeFork IA - Dimensão do vetor:',
      vetor.length
    );

    console.log(
      'SafeFork IA - Vetor de teste:',
      vetor
    );

    return vetor;
  }

};
