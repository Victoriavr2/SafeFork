
// =============================================
// SAFEFORK IA - ASSISTENTE ALIMENTAR
// Hugging Face + Transformers.js + WebGPU
// =============================================

window.safeForkIA = {

  modelo: null,
  base: [],
  vetores: [],
  dispositivo: null,
  carregando: false,
  pronto: false,

  // Atualizar status da inteligência artificial
  atualizarStatus(texto) {
    const status = document.getElementById('ia-status');

    if (status) {
      status.textContent = texto;
    }
  },

  // Habilitar ou desabilitar controles
  habilitarControles(habilitado) {
    const controles = document.querySelectorAll(
      '#ia-pergunta, #ia-enviar, #ia-limpar, .ia-sugestao'
    );

    controles.forEach(elemento => {
      elemento.disabled = !habilitado;
    });
  },

  // Verificar compatibilidade com WebGPU
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

  // Carregar base de conhecimento alimentar
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

  // Inicializar inteligência artificial
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

      // Carregar a biblioteca somente ao acessar a IA
      this.atualizarStatus(
        '⏳ Carregando biblioteca de inteligência artificial...'
      );

      const { pipeline, env } = await import(
        'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2'
      );

      env.allowLocalModels = false;
      env.useBrowserCache = true;

      await this.carregarBase();

      // Configuração do modelo
      const carregarModelo = async (dispositivo) => {

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

        // Testar se o modelo consegue processar texto
        await this.testarModelo();

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
          '⚠️ WebGPU indisponível. Tentando processamento por CPU...'
        );

        this.modelo = await carregarModelo('wasm');

        await this.testarModelo();

      }

      this.pronto = true;

      const modo = this.dispositivo === 'webgpu'
        ? 'WebGPU (GPU)'
        : 'CPU (WASM)';

      this.atualizarStatus(
        `🟢 Modelo carregado | ${modo} | ${this.base.length} registros`
      );

      console.log(
        'SafeFork IA inicializado com sucesso.',
        this.dispositivo
      );

      // Os controles serão habilitados
      // após implementar a busca semântica.

    } catch (erro) {

      console.error('Erro no SafeFork IA:', erro);

      this.pronto = false;
      this.modelo = null;

      this.atualizarStatus(
        '🔴 Não foi possível iniciar a IA. Verifique a conexão ou a compatibilidade do dispositivo. Saia da tela e tente novamente.'
      );

      this.habilitarControles(false);

    } finally {

      this.carregando = false;

    }
  },

  // Teste inicial de vetorização
  async testarModelo() {

    this.atualizarStatus(
      '🧠 Testando processamento do modelo...'
    );

    const resultado = await this.modelo(
      'query: Farinha de trigo contém glúten?',
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
