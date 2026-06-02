class CRCModal {
  constructor() {
    this.tags = {
      responsabilidades: [],
      colaboradores: []
    };
    this.currentMode = 'create';
    this.currentCardName = null;
  }

  showNotice(message, type = 'error') {
    const notice = document.getElementById('modal-notice');
    if (!notice) return;
    notice.textContent = message;
    notice.className = `modal-notice ${type}`;
    notice.style.display = 'block';
  }

  clearNotice() {
    const notice = document.getElementById('modal-notice');
    if (!notice) return;
    notice.textContent = '';
    notice.className = 'modal-notice';
    notice.style.display = 'none';
  }

  openModal() {
    this.openCreateModal();
  }

  openCreateModal() {
    this.currentMode = 'create';
    this.currentCardName = null;
    this.tags = {
      responsabilidades: [],
      colaboradores: []
    };
    this.clearNotice();

    const modalArea = document.getElementById('modal-area');
    if (!modalArea) return;

    modalArea.innerHTML = `
      <div class="overlay-wrap">
        <div class="modal panel">
          <div class="panel-bar">
            <span class="panel-title">Nueva tarjeta CRC</span>
            <span class="panel-badge badge-edit">Crear</span>
          </div>
          <div class="modal-body panel-body">
            <div id="modal-notice" class="modal-notice" style="display:none"></div>
            <div class="form-group">
              <label class="form-label">Nombre de la clase</label>
              <input class="form-input" type="text" placeholder="ej. UserService, CartController…" id="f-nombre"/>
            </div>

            <div class="form-group">
              <label class="form-label">Responsabilidades</label>
              <div class="tag-area" id="tag-area-resp" onclick="document.getElementById('tag-in-resp').focus()">
                <input class="tag-input" id="tag-in-resp" placeholder="Escribe y presiona Enter…" onkeydown="crcModal.addTag('tag-area-resp','tag-in-resp',event)"/>
              </div>
              <div class="tag-hint">↵ Enter para agregar · × para quitar</div>
            </div>

            <div class="form-group">
              <label class="form-label">Colaboradores</label>
              <div class="tag-area" id="tag-area-col" onclick="document.getElementById('tag-in-col').focus()">
                <input class="tag-input" id="tag-in-col" placeholder="Escribe y presiona Enter…" onkeydown="crcModal.addTag('tag-area-col','tag-in-col',event)"/>
              </div>
              <div class="tag-hint">↵ Enter para agregar · × para quitar</div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-cancel" onclick="crcModal.closeModal()">Cancelar</button>
            <button class="btn-save" onclick="crcModal.saveCard()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
              </svg>
              Guardar
            </button>
          </div>
        </div>
      </div>`;
  }

  
  openViewModal(tarjeta) {
    this.currentMode = 'view';
    this.currentCardName = tarjeta.nombre;

    const responsables = Array.isArray(tarjeta.responsabilidades)
      ? tarjeta.responsabilidades.map(r => r.descripcion || r)
      : [];

    const colaboradores = Array.isArray(tarjeta.colaboradores)
      ? tarjeta.colaboradores
      : [];

    const modalArea = document.getElementById('modal-area');
    if (!modalArea) return;

    modalArea.innerHTML = `
      <div class="overlay-wrap">
        <div class="modal panel">
          <div class="panel-bar">
            <span class="panel-title">Detalles de la tarjeta</span>
            <span class="panel-badge badge-view">Vista</span>
          </div>
          <div class="modal-body panel-body">
            <div class="class-hero">
              <div class="class-avatar">${tarjeta.nombre.slice(0, 2).toUpperCase()}</div>
              <div class="class-info">
                <h2>${tarjeta.nombre}</h2>
                <p>Tarjeta CRC · ${responsables.length} responsabilidades · ${colaboradores.length} colaboradores</p>
              </div>
            </div>

            <div class="section-lbl">Responsabilidades</div>
            <div class="resp-list">
              ${responsables.map(r => `<div class="resp-item"><span class="resp-dot"></span>${r}</div>`).join('')}
            </div>

            <div class="section-lbl">Colaboradores</div>
            <div class="collab-list">
              ${colaboradores.map(c => `<span class="collab-chip"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>${c}</span>`).join('')}
            </div>

            <div class="view-actions">
              <button class="btn-action btn-secondary" onclick="crcModal.closeModal()">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                Cerrar
              </button>
              <button class="btn-action btn-danger" onclick="crcModal.confirmDelete()">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }

  openEditModal(tarjeta) {
    this.currentMode = 'edit';
    this.currentCardName = tarjeta.nombre;
    this.tags = {
      responsabilidades: Array.isArray(tarjeta.responsabilidades)
        ? tarjeta.responsabilidades.map(r => r.descripcion || r)
        : [],
      colaboradores: Array.isArray(tarjeta.colaboradores)
        ? tarjeta.colaboradores
        : []
    };
    this.clearNotice();

    const modalArea = document.getElementById('modal-area');
    if (!modalArea) return;

    modalArea.innerHTML = `
      <div class="overlay-wrap">
        <div class="modal panel">
          <div class="panel-bar">
            <span class="panel-title">Editar tarjeta</span>
            <span class="panel-badge badge-edit">Edición</span>
          </div>
          <div class="modal-body panel-body">
            <div id="modal-notice" class="modal-notice" style="display:none"></div>
            <div class="form-group">
              <label class="form-label">Nombre de la clase</label>
              <input class="form-input" type="text" id="f-nombre" value="${tarjeta.nombre}" placeholder="ej. UserService…" />
            </div>

            <div class="form-group">
              <label class="form-label">Responsabilidades</label>
              <div class="tag-area" id="tag-area-resp" onclick="document.getElementById('tag-in-resp').focus()">
                <input class="tag-input" id="tag-in-resp" placeholder="+ agregar…" onkeydown="crcModal.addTag('tag-area-resp','tag-in-resp',event)"/>
              </div>
              <div class="tag-hint">↵ Enter para agregar · × para quitar</div>
            </div>

            <div class="form-group">
              <label class="form-label">Colaboradores</label>
              <div class="tag-area" id="tag-area-col" onclick="document.getElementById('tag-in-col').focus()">
                <input class="tag-input" id="tag-in-col" placeholder="+ agregar colaborador…" onkeydown="crcModal.addTag('tag-area-col','tag-in-col',event)"/>
              </div>
              <div class="tag-hint">↵ Enter para agregar · × para quitar</div>
            </div>

            <div class="edit-actions">
              <button class="btn-action btn-secondary" onclick="crcModal.closeModal()" style="flex:0 0 auto;padding:9px 16px">
                Cancelar
              </button>
              <button class="btn-action btn-primary" onclick="crcModal.saveCard()" style="flex:1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>`;

    this.tags.responsabilidades.forEach(value => this.appendTag('tag-area-resp', value, 'resp'));
    this.tags.colaboradores.forEach(value => this.appendTag('tag-area-col', value, 'col'));
  }

  appendTag(areaId, value, type) {
    const area = document.getElementById(areaId);
    if (!area) return;

    const listKey = type === 'col' ? 'colaboradores' : 'responsabilidades';
    const duplicate = this.tags[listKey].some(existing => existing.toLowerCase() === value.toLowerCase());
    if (duplicate) {
      this.showNotice(type === 'col'
        ? 'Colaborador ya agregado'
        : 'Responsabilidad ya agregada');
      return;
    }

    this.tags[listKey].push(value);
    const tag = document.createElement('span');
    tag.className = `tag${type === 'col' ? ' collab' : ''}`;
    const text = document.createTextNode(value + ' ');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tag-x';
    button.textContent = '×';
    button.addEventListener('click', () => this.removeTag(areaId, value, tag));
    tag.appendChild(text);
    tag.appendChild(button);
    area.insertBefore(tag, area.querySelector('.tag-input'));
  }

  addTag(areaId, inputId, event) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const input = event.target;
    const value = input.value.trim();
    if (!value) {
      this.showNotice('Escribe una responsabilidad o colaborador válido');
      return;
    }
    const type = areaId === 'tag-area-col' ? 'col' : 'resp';
    this.clearNotice();
    this.appendTag(areaId, value, type);
    input.value = '';
  }


  removeTag(areaId, value, element) {
    if (areaId === 'tag-area-resp') {
      this.tags.responsabilidades = this.tags.responsabilidades.filter(t => t !== value);
    } else if (areaId === 'tag-area-col') {
      this.tags.colaboradores = this.tags.colaboradores.filter(t => t !== value);
    }
    element.remove();
  }


  closeModal() {
    const modalArea = document.getElementById('modal-area');
    if (modalArea) {
      modalArea.innerHTML = '';
    }
    this.tags = {
      responsabilidades: [],
      colaboradores: []
    };
    this.currentMode = 'create';
    this.currentCardName = null;
  }


  async saveCard() {
    const rawNombre = document.getElementById('f-nombre').value.trim();
    const nombre = rawNombre.toLowerCase();
    this.clearNotice();

    if (!rawNombre) {
      this.showNotice('Por favor ingresa el nombre de la clase');
      return;
    }

    if (!/^[\p{L}\p{N}\s_-]+$/u.test(rawNombre)) {
      this.showNotice('Nombre inválido: solo letras, números, espacios, guiones y guiones bajos');
      return;
    }

    if (this.tags.responsabilidades.length === 0) {
      this.showNotice('Por favor agrega al menos una responsabilidad');
      return;
    }

    const payload = {
      nombre,
      responsabilidades: this.tags.responsabilidades.map(r => ({ descripcion: r })),
      colaboradores: this.tags.colaboradores
    };

    try {
      const btn = document.querySelector('.btn-save, .btn-action.btn-primary');
      const originalText = btn ? btn.innerHTML : null;
      if (btn) {
        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></polyline></svg> Guardando...';
        btn.disabled = true;
      }

      if (this.currentMode === 'edit' && this.currentCardName) {
        await TarjetaCRCService.actualizar(this.currentCardName, payload);
      } else {
        await TarjetaCRCService.crear(payload);
      }

      if (typeof crcStudio !== 'undefined' && crcStudio.loadCards) {
        await crcStudio.loadCards();
      }

      this.showNotice('Guardado exitosamente', 'success');
      if (btn) {
        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Guardado';
      }
      setTimeout(() => this.closeModal(), 800);
    } catch (error) {
      this.showNotice(error.message || 'Error al guardar la tarjeta');
      console.error(error);
      const btn = document.querySelector('.btn-save, .btn-action.btn-primary');
      if (btn && originalText !== null) {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }
  }

  confirmDelete() {
    const modalArea = document.getElementById('modal-area');
    if (!modalArea || !this.currentCardName) return;

    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-dialog">
        <div class="confirm-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </div>
        <h3>¿Estás seguro?</h3>
        <p>Se eliminará la tarjeta <strong>${this.currentCardName}</strong> junto con todas sus responsabilidades y colaboradores.</p>
        <p style="font-size: 11px; color: var(--t3); margin-top: 8px;">Esta acción no se puede deshacer.</p>
        <div class="confirm-actions">
          <button class="btn-action btn-secondary" onclick="document.querySelector('.confirm-overlay').remove()">
            Cancelar
          </button>
          <button class="btn-action btn-danger" onclick="crcModal.deleteCard()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            Sí, eliminar
          </button>
        </div>
      </div>
    `;
    modalArea.appendChild(overlay);
  }

  async deleteCard() {
    if (!this.currentCardName) return;

    try {
      const btn = document.querySelector('.confirm-actions .btn-danger');
      const originalText = btn ? btn.innerHTML : null;
      if (btn) {
        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Eliminando...';
        btn.disabled = true;
      }

      await TarjetaCRCService.eliminar(this.currentCardName);

      if (typeof crcStudio !== 'undefined' && crcStudio.loadCards) {
        await crcStudio.loadCards();
      }

      this.closeModal();
    } catch (error) {
      this.showNotice(error.message || 'Error al eliminar la tarjeta');
      console.error(error);
      const btn = document.querySelector('.confirm-actions .btn-danger');
      if (btn && originalText !== null) {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }
  }
}

const crcModal = new CRCModal();
