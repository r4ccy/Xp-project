class CRCStudio {
  constructor() {
    this.currentScreen = 'inicio';
    this.allCards = [];
  }

  async init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const pills = document.querySelectorAll('.npill');
    pills.forEach((pill, index) => {
      const screenIds = ['inicio', 'crc', 'anal'];
      pill.addEventListener('click', () => this.show(screenIds[index]));
    });

    const searchInput = document.getElementById('srch');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.filterCards());
    }

    const btnAdd = document.querySelector('.btn-add');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => this.openNewCardModal());
    }
  }
  async loadCards() {
    try {
      const tarjetas = await TarjetaCRCService.obtenerTodas();
      if (tarjetas && tarjetas.length > 0) {
        const uniqueCards = new Map();
        tarjetas.forEach(t => {
          const nombre = (t.nombre || '').trim();
          if (!nombre) return;
          const key = nombre.toLowerCase();
          if (uniqueCards.has(key)) return;

          const responsibilitiesArray = Array.isArray(t.responsabilidades)
            ? t.responsabilidades.map(r => r.descripcion || r)
            : [];
          const collaboratorsArray = Array.isArray(t.colaboradores)
            ? t.colaboradores
            : [];

          uniqueCards.set(key, {
            nombre,
            responsabilidades: responsibilitiesArray,
            colaboradores: collaboratorsArray,
            responsabilidadesCount: typeof t.responsabilidades === 'number'
              ? t.responsabilidades
              : responsibilitiesArray.length,
            colaboradoresCount: typeof t.colaboradores === 'number'
              ? t.colaboradores
              : collaboratorsArray.length
          });
        });
        this.allCards = Array.from(uniqueCards.values());
      } else {
        this.allCards = [];
      }
    } catch (error) {
      console.warn('No se pudo obtener tarjetas del backend:', error);
      this.allCards = [];
    }

    this.renderCards();
  }

  renderCards() {
    const container = document.getElementById('cards-container');
    if (!container) return;

    container.innerHTML = '';

    if (!this.allCards || this.allCards.length === 0) {
      container.innerHTML = `<div class="message-card">No hay tarjetas para mostrar.</div>`;
      return;
    }

    this.allCards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'crc-card';

      const nameElement = document.createElement('div');
      nameElement.className = 'cc-name';
      nameElement.textContent = card.nombre;

      const respElement = document.createElement('div');
      respElement.className = 'cc-resp';
      const respCount = typeof card.responsabilidadesCount === 'number'
        ? card.responsabilidadesCount
        : Array.isArray(card.responsabilidades)
          ? card.responsabilidades.length
          : 0;
      const colCount = typeof card.colaboradoresCount === 'number'
        ? card.colaboradoresCount
        : Array.isArray(card.colaboradores)
          ? card.colaboradores.length
          : 0;
      respElement.textContent = `${respCount} responsabilidades · ${colCount} colaboradores`;

      const footer = document.createElement('div');
      footer.className = 'cc-footer';
      const actions = document.createElement('div');
      actions.className = 'cc-acts';

      const viewButton = document.createElement('button');
      viewButton.className = 'btn-xs btn-ver';
      viewButton.textContent = 'Ver';
      viewButton.addEventListener('click', e => {
        e.stopPropagation();
        this.viewCard(card.nombre);
      });

      const editButton = document.createElement('button');
      editButton.className = 'btn-xs btn-edit';
      editButton.textContent = 'Editar';
      editButton.addEventListener('click', e => {
        e.stopPropagation();
        this.editCard(card.nombre);
      });

      actions.appendChild(viewButton);
      actions.appendChild(editButton);
      footer.appendChild(actions);

      cardElement.appendChild(nameElement);
      cardElement.appendChild(respElement);
      cardElement.appendChild(footer);

      container.appendChild(cardElement);
    });
  }

  /**
   * Cambia la pantalla visible
   */
  show(screenId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(s => {
      s.style.display = 'none';
      s.classList.remove('active');
    });

    // Actualizar pills
    document.querySelectorAll('.npill').forEach(p => p.classList.remove('on'));

    // Mostrar pantalla seleccionada
    const screenMap = {
      'inicio': 's-inicio',
      'crc': 's-crc',
      'anal': 's-anal'
    };

    const screenElement = document.getElementById(screenMap[screenId]);
    if (screenElement) {
      screenElement.style.display = 'block';
      screenElement.classList.add('active');
      
      // Si es la pantalla de CRC, cargar tarjetas
      if (screenId === 'crc') {
        this.loadCards();
      }
    }

    // Marcar pill como activa
    const pillIndex = ['inicio', 'crc', 'anal'].indexOf(screenId);
    if (pillIndex !== -1) {
      document.querySelectorAll('.npill')[pillIndex].classList.add('on');
    }

    this.currentScreen = screenId;
  }

  /**
   * Filtra tarjetas por búsqueda
   */
  filterCards() {
    const query = document.getElementById('srch').value.toLowerCase();
    const cards = document.querySelectorAll('.crc-card');

    cards.forEach(card => {
      const cardName = card.querySelector('.cc-name').textContent.toLowerCase();
      card.style.display = cardName.includes(query) ? '' : 'none';
    });
  }

  /**
   * Abre el modal para crear nueva tarjeta
   */
  openNewCardModal() {
    if (typeof crcModal !== 'undefined') {
      crcModal.openModal();
    }
  }

  /**
   * Maneja la acción Ver de una tarjeta
   */
  async viewCard(cardName) {
    try {
      const tarjeta = await TarjetaCRCService.obtener(cardName);
      if (!tarjeta) {
        throw new Error('Tarjeta no encontrada');
      }
      crcModal.openViewModal(tarjeta);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }

  /**
   * Maneja la acción Editar de una tarjeta
   */
  async editCard(cardName) {
    try {
      const tarjeta = await TarjetaCRCService.obtener(cardName);
      if (!tarjeta) {
        throw new Error('Tarjeta no encontrada');
      }
      crcModal.openEditModal(tarjeta);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
}

// Instancia global
const crcStudio = new CRCStudio();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  crcStudio.init();
});
