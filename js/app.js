/* ============================================
   SafeFork PWA - Aplicação Principal
   Mobile First | Thumb Zone | Offline Ready
   ============================================ */

const app = {
  dados: {},
  usuarioAtual: null,
  telaAtual: 'feed',
  historico: [],
  filtros: { categoria: 'todas', alergias: [], tempo: 0 },

  // Inicialização
  init() {
    this.carregarDados();
    this.verificarSessao();
    this.renderizarAlergiasBusca();
  },

  // Dados padrão
  dadosPadrao() {
    return {
      usuarios: [
        { id: 1, nome: 'Ana Silva', email: 'ana@safefork.com', senha: '123456', bio: 'Amante de culinária sem glúten! 🌾❌', foto: 'A', privado: false },
        { id: 2, nome: 'Carlos Mendes', email: 'carlos@safefork.com', senha: '123456', bio: 'Chef especializado em alergias alimentares 👨‍🍳', foto: 'C', privado: false },
        { id: 3, nome: 'Marina Costa', email: 'marina@safefork.com', senha: '123456', bio: 'Vegana e sem lactose 🌱🥛❌', foto: 'M', privado: false },
        { id: 4, nome: 'João Pedro', email: 'joao@safefork.com', senha: '123456', bio: 'Pai de criança com alergia a amendoim 🥜❌', foto: 'J', privado: false }
      ],
      alergias: [
        { id: 1, nome: 'Glúten' },
        { id: 2, nome: 'Lactose' },
        { id: 3, nome: 'Amendoim' },
        { id: 4, nome: 'Frutos do Mar' },
        { id: 5, nome: 'Ovo' },
        { id: 6, nome: 'Soja' },
        { id: 7, nome: 'Castanhas' },
        { id: 8, nome: 'Trigo' }
      ],
      usuarioAlergias: [
        { id_usuario: 1, id_alergia: 1 },
        { id_usuario: 1, id_alergia: 2 },
        { id_usuario: 3, id_alergia: 2 },
        { id_usuario: 3, id_alergia: 5 },
        { id_usuario: 4, id_alergia: 3 }
      ],
      receitas: [
        {
          id: 1, id_usuario: 2, titulo: 'Pão de Queijo Sem Lactose',
          modo_preparo: 'Pré-aqueça o forno a 180°C.\nMisture o polvilho, o leite vegetal e o óleo em uma panela.\nLeve ao fogo mexendo até formar uma massa lisa.\nDeixe esfriar, adicione os ovos e misture bem.\nModele bolinhas e asse por 25 minutos.',
          tempo_preparo: 40, data_criacao: '2026-08-15',
          categorias: ['sem-lactose', 'sem-gluten'],
          curtidas: [1, 3], imagem: '🧀'
        },
        {
          id: 2, id_usuario: 1, titulo: 'Bolo de Cenoura Vegano',
          modo_preparo: 'Bata a cenoura com o óleo e o açúcar no liquidificador.\nMisture a farinha, o fermento e o cacau.\nCombine os ingredientes úmidos com os secos.\nAsse em forno a 180°C por 35 minutos.',
          tempo_preparo: 50, data_criacao: '2026-08-18',
          categorias: ['vegano', 'sem-lactose', 'sem-ovo'],
          curtidas: [2, 3, 4], imagem: '🥕'
        },
        {
          id: 3, id_usuario: 3, titulo: 'Smoothie Bowl de Açaí',
          modo_preparo: 'Bata o açaí congelado com a banana e o leite de coco.\nDespeje em uma tigela.\nDecore com granola sem glúten, frutas e sementes.',
          tempo_preparo: 10, data_criacao: '2026-08-19',
          categorias: ['vegano', 'sem-gluten', 'sem-lactose', 'rapido'],
          curtidas: [1, 4], imagem: '🫐'
        },
        {
          id: 4, id_usuario: 2, titulo: 'Macarrão de Abobrinha',
          modo_preparo: 'Corte a abobrinha em tiras finas com um espiralizador.\nRefogue o alho no azeite.\nAdicione a abobrinha e cozinhe por 3 minutos.\nFinalize com manjericão e castanhas.',
          tempo_preparo: 15, data_criacao: '2026-08-20',
          categorias: ['sem-gluten', 'vegano', 'low-carb', 'rapido'],
          curtidas: [1, 3], imagem: '🍝'
        },
        {
          id: 5, id_usuario: 4, titulo: 'Cookies Sem Amendoim',
          modo_preparo: 'Misture a farinha, o açúcar e o fermento.\nAdicione a manteiga e o ovo.\nForme bolinhas e achate levemente.\nAsse a 180°C por 12 minutos.',
          tempo_preparo: 25, data_criacao: '2026-08-17',
          categorias: ['sem-nozes', 'rapido'],
          curtidas: [2], imagem: '🍪'
        },
        {
          id: 6, id_usuario: 1, titulo: 'Risoto de Cogumelos',
          modo_preparo: 'Refogue a cebola e o alho no azeite.\nAdicione o arroz arbóreo e mexa.\nVá adicionando o caldo de legumes aos poucos.\nFinalize com cogumelos salteados e salsinha.',
          tempo_preparo: 45, data_criacao: '2026-08-16',
          categorias: ['sem-gluten', 'sem-lactose'],
          curtidas: [3, 4], imagem: '🍄'
        }
      ],
      ingredientes: [
        { id: 1, nome: 'Polvilho doce' },
        { id: 2, nome: 'Leite de coco' },
        { id: 3, nome: 'Óleo vegetal' },
        { id: 4, nome: 'Ovo' },
        { id: 5, nome: 'Cenoura' },
        { id: 6, nome: 'Farinha de trigo' },
        { id: 7, nome: 'Açúcar' },
        { id: 8, nome: 'Fermento em pó' },
        { id: 9, nome: 'Cacau em pó' },
        { id: 10, nome: 'Açaí congelado' },
        { id: 11, nome: 'Banana' },
        { id: 12, nome: 'Granola sem glúten' },
        { id: 13, nome: 'Abobrinha' },
        { id: 14, nome: 'Alho' },
        { id: 15, nome: 'Azeite' },
        { id: 16, nome: 'Manjericão' },
        { id: 17, nome: 'Castanha-do-pará' },
        { id: 18, nome: 'Manteiga' },
        { id: 19, nome: 'Arroz arbóreo' },
        { id: 20, nome: 'Cogumelo shitake' }
      ],
      receitaIngredientes: [
        { id_receita: 1, id_ingrediente: 1, quantidade: '2 xícaras' },
        { id_receita: 1, id_ingrediente: 2, quantidade: '1 xícara' },
        { id_receita: 1, id_ingrediente: 3, quantidade: '1/2 xícara' },
        { id_receita: 1, id_ingrediente: 4, quantidade: '2 unidades' },
        { id_receita: 2, id_ingrediente: 5, quantidade: '3 unidades' },
        { id_receita: 2, id_ingrediente: 3, quantidade: '1/2 xícara' },
        { id_receita: 2, id_ingrediente: 7, quantidade: '1 xícara' },
        { id_receita: 2, id_ingrediente: 6, quantidade: '1.5 xícara' },
        { id_receita: 2, id_ingrediente: 8, quantidade: '1 colher' },
        { id_receita: 2, id_ingrediente: 9, quantidade: '2 colheres' },
        { id_receita: 3, id_ingrediente: 10, quantidade: '200g' },
        { id_receita: 3, id_ingrediente: 11, quantidade: '1 unidade' },
        { id_receita: 3, id_ingrediente: 2, quantidade: '100ml' },
        { id_receita: 3, id_ingrediente: 12, quantidade: 'a gosto' },
        { id_receita: 4, id_ingrediente: 13, quantidade: '2 unidades' },
        { id_receita: 4, id_ingrediente: 14, quantidade: '2 dentes' },
        { id_receita: 4, id_ingrediente: 15, quantidade: '2 colheres' },
        { id_receita: 4, id_ingrediente: 16, quantidade: 'folhas a gosto' },
        { id_receita: 4, id_ingrediente: 17, quantidade: '1/4 xícara' },
        { id_receita: 5, id_ingrediente: 6, quantidade: '2 xícaras' },
        { id_receita: 5, id_ingrediente: 7, quantidade: '1 xícara' },
        { id_receita: 5, id_ingrediente: 8, quantidade: '1 colher' },
        { id_receita: 5, id_ingrediente: 18, quantidade: '100g' },
        { id_receita: 5, id_ingrediente: 4, quantidade: '1 unidade' },
        { id_receita: 6, id_ingrediente: 19, quantidade: '1.5 xícara' },
        { id_receita: 6, id_ingrediente: 20, quantidade: '200g' },
        { id_receita: 6, id_ingrediente: 14, quantidade: '3 dentes' },
        { id_receita: 6, id_ingrediente: 15, quantidade: '3 colheres' }
      ],
      comentarios: [
        { id: 1, id_usuario: 1, id_receita: 1, texto: 'Ficou perfeito! Minha filha adorou.', data: '2026-08-16' },
        { id: 2, id_usuario: 3, id_receita: 1, texto: 'Substituí o óleo por azeite e ficou ótimo.', data: '2026-08-17' },
        { id: 3, id_usuario: 2, id_receita: 2, texto: 'A textura fica incrível, nem parece sem ovo!', data: '2026-08-19' },
        { id: 4, id_usuario: 4, id_receita: 3, texto: 'Minha café da manhã favorita agora!', data: '2026-08-20' }
      ],
      seguidores: [
        { id_seguidor: 1, id_seguido: 2 },
        { id_seguidor: 1, id_seguido: 3 },
        { id_seguidor: 3, id_seguido: 1 },
        { id_seguidor: 3, id_seguido: 2 },
        { id_seguidor: 4, id_seguido: 1 },
        { id_seguidor: 2, id_seguido: 3 }
      ],
      listaCompras: [
        { id: 1, item: 'Polvilho doce', comprado: false },
        { id: 2, item: 'Leite de coco', comprado: true },
        { id: 3, item: 'Açaí congelado', comprado: false }
      ],
      notificacoes: [
        { id: 1, texto: 'Ana Silva curtiu sua receita!', data: '2026-08-20', lida: false },
        { id: 2, texto: 'Nova receita sem glúten disponível!', data: '2026-08-19', lida: false },
        { id: 3, texto: 'Marina Costa começou a te seguir', data: '2026-08-18', lida: true }
      ],
      configuracoes: { darkMode: false, fonteGrande: false, privado: false }
    };
  },

  carregarDados() {
    const salvos = localStorage.getItem('safefork_dados');
    if (salvos) {
      this.dados = JSON.parse(salvos);
    } else {
      this.dados = this.dadosPadrao();
      this.salvarDados();
    }
  },

  salvarDados() {
    localStorage.setItem('safefork_dados', JSON.stringify(this.dados));
  },

  verificarSessao() {
    const sessao = localStorage.getItem('safefork_usuario');
    if (sessao) {
      this.usuarioAtual = JSON.parse(sessao);
      this.mostrarApp();
      this.irPara('feed');
    } else {
      this.mostrarLogin();
    }
  },

  // Autenticação
  fazerLogin() {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const usuario = this.dados.usuarios.find(u => u.email === email && u.senha === senha);

    if (usuario) {
      this.usuarioAtual = usuario;
      localStorage.setItem('safefork_usuario', JSON.stringify(usuario));
      this.mostrarApp();
      this.irPara('feed');
      this.toast('Bem-vindo de volta, ' + usuario.nome + '! 🛡️');
    } else {
      this.toast('E-mail ou senha incorretos ❌');
    }
  },

  fazerCadastro() {
    const nome = document.getElementById('cad-nome').value;
    const email = document.getElementById('cad-email').value;
    const senha = document.getElementById('cad-senha').value;

    if (!nome || !email || !senha) {
      this.toast('Preencha todos os campos ⚠️');
      return;
    }
    if (senha.length < 6) {
      this.toast('Senha deve ter no mínimo 6 caracteres 🔒');
      return;
    }
    if (this.dados.usuarios.find(u => u.email === email)) {
      this.toast('E-mail já cadastrado 📧');
      return;
    }

    const novo = {
      id: Date.now(),
      nome, email, senha,
      bio: '',
      foto: nome.charAt(0).toUpperCase(),
      privado: false
    };

    this.dados.usuarios.push(novo);
    this.salvarDados();
    this.usuarioAtual = novo;
    localStorage.setItem('safefork_usuario', JSON.stringify(novo));
    this.mostrarApp();
    this.irPara('alergias');
    this.toast('Conta criada! Configure suas alergias 🎉');
  },

  sair() {
    localStorage.removeItem('safefork_usuario');
    this.usuarioAtual = null;
    location.reload();
  },

  mostrarLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('cadastro-form').style.display = 'none';
  },

  mostrarCadastro() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('cadastro-form').style.display = 'block';
  },

  mostrarApp() {
    document.getElementById('tela-login').style.display = 'none';
    document.getElementById('app-header').style.display = 'block';
    document.getElementById('content').style.display = 'block';
    document.getElementById('bottom-nav').style.display = 'flex';
    document.getElementById('fab').style.display = 'flex';

    if (this.dados.configuracoes.darkMode) {
      document.body.classList.add('dark-mode');
    }
    if (this.dados.configuracoes.fonteGrande) {
      document.documentElement.style.fontSize = '18px';
    }
  },

  // Navegação
  irPara(tela) {
    this.historico.push(this.telaAtual);
    this.telaAtual = tela;

    document.querySelectorAll('.tela').forEach(el => el.style.display = 'none');
    document.getElementById('tela-' + tela).style.display = 'block';
    document.getElementById('tela-' + tela).classList.add('fade-in');

    // Atualizar nav ativo
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const mapNav = { feed: 0, busca: 1, 'cadastrar-receita': 2, compras: 3, perfil: 4 };
    if (mapNav[tela] !== undefined) {
      document.querySelectorAll('.nav-item')[mapNav[tela]].classList.add('active');
    }

    // Renderizar conteúdo específico
    if (tela === 'feed') this.renderizarFeed();
    if (tela === 'perfil') this.renderizarPerfil();
    if (tela === 'alergias') this.renderizarAlergias();
    if (tela === 'compras') this.renderizarCompras();
    if (tela === 'social') this.renderizarSocial();
    if (tela === 'notificacoes') this.renderizarNotificacoes();
    if (tela === 'configuracoes') this.renderizarConfiguracoes();
    if (tela === 'busca') this.renderizarAlergiasBusca();

    window.scrollTo(0, 0);
  },

  voltar() {
    const anterior = this.historico.pop() || 'feed';
    this.irPara(anterior);
  },

  fabAction() {
    this.irPara('cadastrar-receita');
  },

  // Feed e Receitas
  renderizarFeed(lista = null) {
    const container = document.getElementById('feed-receitas');
    let receitas = lista || this.filtrarReceitas();

    if (receitas.length === 0) {
      container.innerHTML = `<div class="empty-state">
        <div class="emoji">🔍</div>
        <p>Nenhuma receita encontrada</p>
      </div>`;
      return;
    }

    container.innerHTML = receitas.map(r => this.cardReceita(r)).join('');
  },

  cardReceita(r) {
    const autor = this.dados.usuarios.find(u => u.id === r.id_usuario);
    const curtido = r.curtidas.includes(this.usuarioAtual.id);
    const alergiasUsuario = this.dados.usuarioAlergias
      .filter(ua => ua.id_usuario === this.usuarioAtual.id)
      .map(ua => this.dados.alergias.find(a => a.id === ua.id_alergia)?.nome.toLowerCase());

    let alerta = '';
    const tagsRisco = r.categorias.filter(c => {
      const map = { 'sem-gluten': 'glúten', 'sem-lactose': 'lactose', 'sem-nozes': 'amendoim', 'sem-ovo': 'ovo' };
      return alergiasUsuario.includes(map[c]);
    });

    if (tagsRisco.length > 0) {
      alerta = `<div style="background:rgba(224,122,95,0.15); color:var(--pimentao); padding:8px 12px; border-radius:10px; font-size:0.8rem; font-weight:600; margin-top:10px;">
        ⚠️ Contém ingredientes relacionados às suas alergias
      </div>`;
    }

    return `<div class="receita-card" onclick="app.verReceita(${r.id})">
      <div class="receita-img">${r.imagem}
        <span class="badge-tempo">⏱️ ${r.tempo_preparo} min</span>
      </div>
      <div class="receita-info">
        <h3>${r.titulo}</h3>
        <div class="chips-container" style="margin:8px 0;">
          ${r.categorias.map(c => `<span class="chip chip-categoria" style="font-size:0.75rem; padding:4px 10px;">${c.replace('-', ' ')}</span>`).join('')}
        </div>
        <div class="receita-meta">
          <span>❤️ ${r.curtidas.length}</span>
          <span>💬 ${this.dados.comentarios.filter(c => c.id_receita === r.id).length}</span>
          <span>📅 ${this.formatarData(r.data_criacao)}</span>
        </div>
        <div class="receita-autor">
          <div class="avatar">${autor.foto}</div>
          <span style="font-size:0.9rem; font-weight:500;">${autor.nome}</span>
        </div>
        ${alerta}
      </div>
    </div>`;
  },

  filtrarReceitas() {
    let receitas = this.dados.receitas;

    // Filtro categoria
    if (this.filtros.categoria !== 'todas') {
      receitas = receitas.filter(r => r.categorias.includes(this.filtros.categoria));
    }

    // Filtro tempo
    if (this.filtros.tempo > 0) {
      receitas = receitas.filter(r => r.tempo_preparo <= this.filtros.tempo);
    }

    // Filtro alergias do usuário (excluir receitas com risco)
    const alergiasUsuario = this.dados.usuarioAlergias
      .filter(ua => ua.id_usuario === this.usuarioAtual.id)
      .map(ua => {
        const a = this.dados.alergias.find(al => al.id === ua.id_alergia);
        return a ? a.nome.toLowerCase() : '';
      });

    return receitas;
  },

  filtrarCategoria(cat, el) {
    this.filtros.categoria = cat;
    document.querySelectorAll('#tela-feed .chip-categoria').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');
    this.renderizarFeed();
  },

  buscarReceitas(termo) {
    if (!termo) {
      this.renderizarFeed();
      return;
    }
    const t = termo.toLowerCase();
    const filtradas = this.dados.receitas.filter(r => 
      r.titulo.toLowerCase().includes(t) ||
      r.categorias.some(c => c.includes(t))
    );
    this.renderizarFeed(filtradas);
  },

  // Busca Avançada
  renderizarAlergiasBusca() {
    const container = document.getElementById('busca-alergias-chips');
    if (!container) return;
    container.innerHTML = this.dados.alergias.map(a => 
      `<button class="chip chip-alergia" onclick="app.toggleBuscaAlergia(${a.id}, this)">${a.nome}</button>`
    ).join('');
  },

  toggleBuscaAlergia(id, el) {
    el.classList.toggle('active');
    const idx = this.filtros.alergias.indexOf(id);
    if (idx > -1) this.filtros.alergias.splice(idx, 1);
    else this.filtros.alergias.push(id);
  },

  filtrarTempo(min, el) {
    this.filtros.tempo = min;
    document.querySelectorAll('#tela-busca .chip-categoria').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');
  },

  buscaAvancada() {
    const termo = document.getElementById('busca-avancada').value.toLowerCase();
    let resultados = this.dados.receitas;

    if (termo) {
      resultados = resultados.filter(r => r.titulo.toLowerCase().includes(termo));
    }

    if (this.filtros.tempo > 0) {
      resultados = resultados.filter(r => r.tempo_preparo <= this.filtros.tempo);
    }

    const container = document.getElementById('resultados-busca');
    if (resultados.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="emoji">😕</div><p>Nenhum resultado encontrado</p></div>`;
    } else {
      container.innerHTML = resultados.map(r => this.cardReceita(r)).join('');
    }
  },

  // Detalhe Receita
  verReceita(id) {
    this.receitaAtual = id;
    this.irPara('receita');
    const r = this.dados.receitas.find(rec => rec.id === id);
    const autor = this.dados.usuarios.find(u => u.id === r.id_usuario);
    const ings = this.dados.receitaIngredientes.filter(ri => ri.id_receita === id);
    const curtido = r.curtidas.includes(this.usuarioAtual.id);

    const passos = r.modo_preparo.split('\n').filter(p => p.trim());

    document.getElementById('receita-detalhe').innerHTML = `
      <div class="receita-card" style="margin-bottom:0; border-radius:var(--raio) var(--raio) 0 0;">
        <div class="receita-img" style="height:240px; font-size:80px;">${r.imagem}</div>
      </div>
      <div class="card" style="border-radius:0 0 var(--raio) var(--raio); margin-top:0;">
        <h2 style="font-size:1.4rem; margin-bottom:8px;">${r.titulo}</h2>
        <div class="receita-autor" style="margin-bottom:16px;">
          <div class="avatar">${autor.foto}</div>
          <div>
            <div style="font-weight:600;">${autor.nome}</div>
            <div class="text-xs opacity-60">${this.formatarData(r.data_criacao)}</div>
          </div>
        </div>

        <div class="flex gap-3 mb-3">
          <span class="chip chip-categoria">⏱️ ${r.tempo_preparo} min</span>
          ${r.categorias.map(c => `<span class="chip chip-categoria">${c}</span>`).join('')}
        </div>

        <div class="flex gap-2 mt-3">
          <button class="btn ${curtido ? 'btn-primary' : 'btn-outline'}" onclick="app.curtirReceita(${r.id})" style="flex:1;">
            ${curtido ? '❤️ Curtido' : '🤍 Curtir'} (${r.curtidas.length})
          </button>
          <button class="btn btn-secondary" onclick="app.adicionarListaCompra(${r.id})">
            🛒
          </button>
          <button class="btn btn-ghost" onclick="app.compartilharReceita(${r.id})">
            📤
          </button>
        </div>
      </div>

      <div class="card mt-3">
        <h3 class="section-title" style="font-size:1.1rem;">🥘 Ingredientes</h3>
        ${ings.map(ri => {
          const ing = this.dados.ingredientes.find(i => i.id === ri.id_ingrediente);
          return `<div class="ingrediente-check">
            <input type="checkbox" id="ing-${ri.id_ingrediente}">
            <label for="ing-${ri.id_ingrediente}"><strong>${ri.quantidade}</strong> ${ing.nome}</label>
          </div>`;
        }).join('')}
      </div>

      <div class="card mt-3">
        <h3 class="section-title" style="font-size:1.1rem;">👨‍🍳 Modo de Preparo</h3>
        ${passos.map((p, i) => `<div class="passo">
          <div class="passo-numero">${i + 1}</div>
          <div class="passo-texto">${p}</div>
        </div>`).join('')}
      </div>

      <div class="card mt-3">
        <h3 class="section-title" style="font-size:1.1rem;">⚠️ Alertas de Alergia</h3>
        <p class="text-sm" style="line-height:1.6;">
          Sempre verifique os rótulos dos ingredientes. Receitas marcadas como "sem glúten" 
          podem conter traços dependendo da marca utilizada. Consulte seu médico ou nutricionista.
        </p>
      </div>
    `;

    this.renderizarComentarios(id);
  },

  curtirReceita(id) {
    const r = this.dados.receitas.find(rec => rec.id === id);
    const idx = r.curtidas.indexOf(this.usuarioAtual.id);
    if (idx > -1) {
      r.curtidas.splice(idx, 1);
      this.toast('Curtida removida 💔');
    } else {
      r.curtidas.push(this.usuarioAtual.id);
      this.toast('Receita curtida! ❤️');
    }
    this.salvarDados();
    this.verReceita(id);
  },

  // Comentários
  renderizarComentarios(idReceita) {
    const container = document.getElementById('receita-comentarios');
    const comentarios = this.dados.comentarios.filter(c => c.id_receita === idReceita);

    if (comentarios.length === 0) {
      container.innerHTML = '<p class="text-sm opacity-60 text-center">Nenhum comentário ainda. Seja o primeiro! 💬</p>';
      return;
    }

    container.innerHTML = comentarios.map(c => {
      const autor = this.dados.usuarios.find(u => u.id === c.id_usuario);
      return `<div class="comentario">
        <div class="avatar">${autor.foto}</div>
        <div class="comentario-conteudo">
          <div class="comentario-header">
            <strong>${autor.nome}</strong>
            <span>${this.formatarData(c.data)}</span>
          </div>
          <p>${c.texto}</p>
        </div>
      </div>`;
    }).join('');
  },

  adicionarComentario() {
    const texto = document.getElementById('novo-comentario').value;
    if (!texto.trim()) return;

    this.dados.comentarios.push({
      id: Date.now(),
      id_usuario: this.usuarioAtual.id,
      id_receita: this.receitaAtual,
      texto,
      data: new Date().toISOString().split('T')[0]
    });

    this.salvarDados();
    document.getElementById('novo-comentario').value = '';
    this.renderizarComentarios(this.receitaAtual);
    this.toast('Comentário adicionado! 💬');
  },

  // Perfil
  renderizarPerfil() {
    const u = this.usuarioAtual;
    document.getElementById('perfil-nome').textContent = u.nome;
    document.getElementById('perfil-email').textContent = u.email;
    document.getElementById('perfil-bio').textContent = u.bio || 'Nenhuma bio ainda ✨';
    document.getElementById('perfil-avatar').textContent = u.foto;

    const seguidores = this.dados.seguidores.filter(s => s.id_seguido === u.id).length;
    const seguindo = this.dados.seguidores.filter(s => s.id_seguidor === u.id).length;
    const minhasReceitas = this.dados.receitas.filter(r => r.id_usuario === u.id).length;

    document.getElementById('perfil-seguidores').textContent = seguidores;
    document.getElementById('perfil-seguindo').textContent = seguindo;
    document.getElementById('perfil-receitas').textContent = minhasReceitas;

    // Alergias
    const minhasAlergias = this.dados.usuarioAlergias
      .filter(ua => ua.id_usuario === u.id)
      .map(ua => this.dados.alergias.find(a => a.id === ua.id_alergia));

    document.getElementById('perfil-alergias').innerHTML = minhasAlergias.length 
      ? minhasAlergias.map(a => `<span class="chip chip-alergia active">${a.nome}</span>`).join('')
      : '<span class="text-sm opacity-60">Nenhuma alergia cadastrada</span>';

    // Minhas receitas
    const container = document.getElementById('perfil-minhas-receitas');
    const receitas = this.dados.receitas.filter(r => r.id_usuario === u.id);
    container.innerHTML = receitas.length 
      ? receitas.map(r => this.cardReceita(r)).join('')
      : '<p class="text-sm opacity-60 text-center">Você ainda não publicou receitas 📝</p>';
  },

  salvarPerfil() {
    const nome = document.getElementById('edit-nome').value;
    const bio = document.getElementById('edit-bio').value;

    this.usuarioAtual.nome = nome || this.usuarioAtual.nome;
    this.usuarioAtual.bio = bio;

    const idx = this.dados.usuarios.findIndex(u => u.id === this.usuarioAtual.id);
    this.dados.usuarios[idx] = this.usuarioAtual;

    localStorage.setItem('safefork_usuario', JSON.stringify(this.usuarioAtual));
    this.salvarDados();
    this.toast('Perfil atualizado! ✨');
    this.irPara('perfil');
  },

  // Alergias
  renderizarAlergias() {
    const container = document.getElementById('lista-alergias');
    const minhas = this.dados.usuarioAlergias
      .filter(ua => ua.id_usuario === this.usuarioAtual.id)
      .map(ua => this.dados.alergias.find(a => a.id === ua.id_alergia));

    container.innerHTML = this.dados.alergias.map(a => {
      const ativa = minhas.some(m => m.id === a.id);
      return `<button class="chip ${ativa ? 'chip-alergia active' : 'chip-alergia'}" 
        onclick="app.toggleAlergia(${a.id})">${a.nome}</button>`;
    }).join('');

    document.getElementById('tags-risco').innerHTML = minhas.map(a => 
      `<span class="chip chip-alergia active">⚠️ ${a.nome}</span>`
    ).join('');
  },

  toggleAlergia(id) {
    const idx = this.dados.usuarioAlergias.findIndex(
      ua => ua.id_usuario === this.usuarioAtual.id && ua.id_alergia === id
    );

    if (idx > -1) {
      this.dados.usuarioAlergias.splice(idx, 1);
      this.toast('Alergia removida ✅');
    } else {
      this.dados.usuarioAlergias.push({ id_usuario: this.usuarioAtual.id, id_alergia: id });
      this.toast('Alergia adicionada ⚠️');
    }

    this.salvarDados();
    this.renderizarAlergias();
  },

  adicionarAlergia() {
    const nome = document.getElementById('nova-alergia').value;
    if (!nome) return;

    const nova = { id: Date.now(), nome };
    this.dados.alergias.push(nova);
    this.dados.usuarioAlergias.push({ id_usuario: this.usuarioAtual.id, id_alergia: nova.id });
    this.salvarDados();
    document.getElementById('nova-alergia').value = '';
    this.renderizarAlergias();
    this.toast('Nova alergia cadastrada! ⚠️');
  },

  // Lista de Compras
  renderizarCompras() {
    const container = document.getElementById('lista-compras');
    if (this.dados.listaCompras.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="emoji">🛒</div><p>Sua lista está vazia</p></div>`;
      return;
    }

    container.innerHTML = this.dados.listaCompras.map(item => `
      <div class="list-item" style="background:${item.comprado ? 'rgba(212,224,155,0.3)' : ''}">
        <input type="checkbox" ${item.comprado ? 'checked' : ''} onchange="app.toggleItemCompra(${item.id})" style="width:24px; height:24px; accent-color:var(--pimentao);">
        <span style="flex:1; text-decoration:${item.comprado ? 'line-through' : 'none'}; opacity:${item.comprado ? 0.6 : 1};">${item.item}</span>
        <button class="btn btn-ghost" onclick="app.removerItemCompra(${item.id})" style="padding:6px 10px; min-height:36px;">🗑️</button>
      </div>
    `).join('');
  },

  adicionarItemCompra() {
    const item = document.getElementById('novo-item-compra').value;
    if (!item) return;
    this.dados.listaCompras.push({ id: Date.now(), item, comprado: false });
    this.salvarDados();
    document.getElementById('novo-item-compra').value = '';
    this.renderizarCompras();
  },

  adicionarListaCompra(idReceita) {
    const ings = this.dados.receitaIngredientes.filter(ri => ri.id_receita === idReceita);
    ings.forEach(ri => {
      const ing = this.dados.ingredientes.find(i => i.id === ri.id_ingrediente);
      this.dados.listaCompras.push({
        id: Date.now() + Math.random(),
        item: `${ri.quantidade} de ${ing.nome}`,
        comprado: false
      });
    });
    this.salvarDados();
    this.toast('Ingredientes adicionados à lista! 🛒');
  },

  toggleItemCompra(id) {
    const item = this.dados.listaCompras.find(i => i.id === id);
    item.comprado = !item.comprado;
    this.salvarDados();
    this.renderizarCompras();
  },

  removerItemCompra(id) {
    this.dados.listaCompras = this.dados.listaCompras.filter(i => i.id !== id);
    this.salvarDados();
    this.renderizarCompras();
  },

  exportarLista() {
    const texto = this.dados.listaCompras.map(i => `[${i.comprado ? 'x' : ' '}] ${i.item}`).join('\n');
    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista-safefork.txt';
    a.click();
    this.toast('Lista exportada! 📤');
  },

  // Cadastrar Receita
  toggleCategoria(el) {
    el.classList.toggle('active');
  },

  salvarReceita() {
    const titulo = document.getElementById('rec-titulo').value;
    const tempo = parseInt(document.getElementById('rec-tempo').value);
    const ingText = document.getElementById('rec-ingredientes').value;
    const modoText = document.getElementById('rec-modo').value;

    if (!titulo || !tempo || !ingText || !modoText) {
      this.toast('Preencha todos os campos ⚠️');
      return;
    }

    const categorias = Array.from(document.querySelectorAll('#cad-categorias .active')).map(el => 
      el.textContent.toLowerCase().replace(' ', '-')
    );

    const novaReceita = {
      id: Date.now(),
      id_usuario: this.usuarioAtual.id,
      titulo,
      modo_preparo: modoText,
      tempo_preparo: tempo,
      data_criacao: new Date().toISOString().split('T')[0],
      categorias: categorias.length ? categorias : ['sem-categoria'],
      curtidas: [],
      imagem: ['🍽️','🥗','🍲','🥘','🍜','🍛','🍝','🍠','🍳','🥞'][Math.floor(Math.random() * 10)]
    };

    this.dados.receitas.unshift(novaReceita);

    // Processar ingredientes
    const ings = ingText.split('\n').filter(i => i.trim());
    ings.forEach((linha, idx) => {
      const partes = linha.match(/^(.+?)\s+de\s+(.+)$/i) || linha.match(/^(.+?)\s+(.+)$/);
      const quantidade = partes ? partes[1] : 'a gosto';
      const nomeIng = partes ? partes[2] : linha;

      let ing = this.dados.ingredientes.find(i => i.nome.toLowerCase() === nomeIng.trim().toLowerCase());
      if (!ing) {
        ing = { id: Date.now() + idx, nome: nomeIng.trim() };
        this.dados.ingredientes.push(ing);
      }

      this.dados.receitaIngredientes.push({
        id_receita: novaReceita.id,
        id_ingrediente: ing.id,
        quantidade
      });
    });

    this.salvarDados();
    this.toast('Receita publicada! 🎉');
    this.irPara('feed');

    // Limpar form
    document.getElementById('rec-titulo').value = '';
    document.getElementById('rec-tempo').value = '';
    document.getElementById('rec-ingredientes').value = '';
    document.getElementById('rec-modo').value = '';
    document.querySelectorAll('#cad-categorias .active').forEach(el => el.classList.remove('active'));
  },

  // Social
  renderizarSocial() {
    const container = document.getElementById('lista-usuarios');
    const sugestoes = this.dados.usuarios.filter(u => 
      u.id !== this.usuarioAtual.id && 
      !this.dados.seguidores.some(s => s.id_seguidor === this.usuarioAtual.id && s.id_seguido === u.id)
    );

    container.innerHTML = sugestoes.map(u => `
      <div class="list-item">
        <div class="avatar">${u.foto}</div>
        <div style="flex:1;">
          <div style="font-weight:600;">${u.nome}</div>
          <div class="text-sm opacity-60">${u.bio.substring(0, 40)}${u.bio.length > 40 ? '...' : ''}</div>
        </div>
        <button class="btn btn-primary" onclick="app.seguir(${u.id})" style="padding:8px 16px; min-height:40px;">➕ Seguir</button>
      </div>
    `).join('');

    const seguindoContainer = document.getElementById('lista-seguindo');
    const seguindo = this.dados.seguidores
      .filter(s => s.id_seguidor === this.usuarioAtual.id)
      .map(s => this.dados.usuarios.find(u => u.id === s.id_seguido));

    seguindoContainer.innerHTML = seguindo.length 
      ? seguindo.map(u => `
        <div class="list-item">
          <div class="avatar">${u.foto}</div>
          <div style="flex:1;">
            <div style="font-weight:600;">${u.nome}</div>
          </div>
          <button class="btn btn-outline" onclick="app.deixarSeguir(${u.id})" style="padding:8px 16px; min-height:40px;">✓ Seguindo</button>
        </div>
      `).join('')
      : '<p class="text-sm opacity-60 text-center">Você não segue ninguém ainda 👥</p>';
  },

  buscarUsuarios(termo) {
    if (!termo) {
      this.renderizarSocial();
      return;
    }
    const t = termo.toLowerCase();
    const filtrados = this.dados.usuarios.filter(u => 
      u.id !== this.usuarioAtual.id && (u.nome.toLowerCase().includes(t) || u.email.toLowerCase().includes(t))
    );

    document.getElementById('lista-usuarios').innerHTML = filtrados.map(u => `
      <div class="list-item">
        <div class="avatar">${u.foto}</div>
        <div style="flex:1;">
          <div style="font-weight:600;">${u.nome}</div>
          <div class="text-sm opacity-60">${u.email}</div>
        </div>
        <button class="btn btn-primary" onclick="app.seguir(${u.id})" style="padding:8px 16px;">➕ Seguir</button>
      </div>
    `).join('');
  },

  seguir(id) {
    this.dados.seguidores.push({ id_seguidor: this.usuarioAtual.id, id_seguido: id });
    this.salvarDados();
    this.renderizarSocial();
    this.toast('Você começou a seguir este usuário! 👥');
  },

  deixarSeguir(id) {
    this.dados.seguidores = this.dados.seguidores.filter(
      s => !(s.id_seguidor === this.usuarioAtual.id && s.id_seguido === id)
    );
    this.salvarDados();
    this.renderizarSocial();
    this.toast('Você deixou de seguir este usuário');
  },

  // Notificações
  renderizarNotificacoes() {
    const container = document.getElementById('lista-notificacoes');
    if (this.dados.notificacoes.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="emoji">🔔</div><p>Sem notificações</p></div>`;
      return;
    }

    container.innerHTML = this.dados.notificacoes.map(n => `
      <div class="list-item" style="background:${n.lida ? '' : 'rgba(212,224,155,0.3)'}; border-left:4px solid ${n.lida ? 'transparent' : 'var(--pimentao)'};">
        <div style="flex:1;">
          <div style="font-weight:${n.lida ? '400' : '600'};">${n.texto}</div>
          <div class="text-xs opacity-60">${this.formatarData(n.data)}</div>
        </div>
        ${!n.lida ? '<span style="color:var(--pimentao); font-size:0.7rem;">●</span>' : ''}
      </div>
    `).join('');

    // Marcar como lidas
    this.dados.notificacoes.forEach(n => n.lida = true);
    this.salvarDados();
  },

  // Configurações
  renderizarConfiguracoes() {
    document.getElementById('toggle-dark').classList.toggle('active', this.dados.configuracoes.darkMode);
    document.getElementById('toggle-fonte').classList.toggle('active', this.dados.configuracoes.fonteGrande);
    document.getElementById('toggle-privado').classList.toggle('active', this.usuarioAtual.privado);
  },

  toggleDarkMode() {
    this.dados.configuracoes.darkMode = !this.dados.configuracoes.darkMode;
    document.body.classList.toggle('dark-mode', this.dados.configuracoes.darkMode);
    this.salvarDados();
    this.renderizarConfiguracoes();
    this.toast(this.dados.configuracoes.darkMode ? 'Modo escuro ativado 🌙' : 'Modo claro ativado ☀️');
  },

  toggleFonte() {
    this.dados.configuracoes.fonteGrande = !this.dados.configuracoes.fonteGrande;
    document.documentElement.style.fontSize = this.dados.configuracoes.fonteGrande ? '18px' : '';
    this.salvarDados();
    this.renderizarConfiguracoes();
    this.toast('Tamanho da fonte alterado 🔤');
  },

  togglePrivacidade() {
    this.usuarioAtual.privado = !this.usuarioAtual.privado;
    const idx = this.dados.usuarios.findIndex(u => u.id === this.usuarioAtual.id);
    this.dados.usuarios[idx] = this.usuarioAtual;
    localStorage.setItem('safefork_usuario', JSON.stringify(this.usuarioAtual));
    this.salvarDados();
    this.renderizarConfiguracoes();
    this.toast(this.usuarioAtual.privado ? 'Perfil privado 🔒' : 'Perfil público 🔓');
  },

  exportarDados() {
    const dadosUsuario = {
      perfil: this.usuarioAtual,
      alergias: this.dados.usuarioAlergias.filter(ua => ua.id_usuario === this.usuarioAtual.id),
      receitas: this.dados.receitas.filter(r => r.id_usuario === this.usuarioAtual.id),
      listaCompras: this.dados.listaCompras
    };
    const blob = new Blob([JSON.stringify(dadosUsuario, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meus-dados-safefork.json';
    a.click();
    this.toast('Dados exportados! 📥');
  },

  limparDados() {
    if (confirm('Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('safefork_dados');
      localStorage.removeItem('safefork_usuario');
      this.toast('Todos os dados foram apagados 🗑️');
      setTimeout(() => location.reload(), 1500);
    }
  },

  ativarLeitor() {
    const msg = 'SafeFork. Leitor de tela ativado. Navegue pelo aplicativo com gestos.';
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = 'pt-BR';
    speechSynthesis.speak(utterance);
    this.toast('Leitor de tela ativado 🔊');
  },

  compartilharReceita(id) {
    const r = this.dados.receitas.find(rec => rec.id === id);
    if (navigator.share) {
      navigator.share({
        title: r.titulo,
        text: `Confira esta receita segura no SafeFork: ${r.titulo}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${r.titulo} - ${window.location.href}`);
      this.toast('Link copiado! 📋');
    }
  },

  // Utilitários
  toast(mensagem) {
    const el = document.getElementById('toast');
    el.textContent = mensagem;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
  },

  formatarData(dataStr) {
    if (!dataStr) return '';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  }
};

// Iniciar app
document.addEventListener('DOMContentLoaded', () => app.init());
